use super::agent::Agent;
use super::grid;
use super::grid::Grid;
use super::palette;
use super::palette::Palette;
use super::population_config::PopulationConfig;
use itertools::multizip;
use nannou::image::{DynamicImage, GenericImage, Rgba};
use rand::{rngs::SmallRng, seq::SliceRandom, SeedableRng};
use rand_distr::{Distribution, Normal};
use rayon::prelude::{IntoParallelRefMutIterator, ParallelIterator};

pub struct PhysarumModel {
    agents: Vec<Agent>,
    grids: Vec<Grid>,
    attraction_table: Vec<Vec<f32>>,
    diffusity: usize,
    iteration: i32,
    palette: Palette,
}

impl PhysarumModel {
    const ATTRACTION_FACTOR_MEAN: f32 = 1.0;
    const ATTRACTION_FACTOR_STD: f32 = 0.1;
    const REPULSION_FACTOR_MEAN: f32 = -1.0;
    const REPULSION_FACTOR_STD: f32 = 0.1;

    pub fn new(
        width: usize,
        height: usize,
        n_particles: usize,
        n_populations: usize,
        diffusity: usize,
        palette_index: usize,
        rng: &mut SmallRng,
    ) -> Self {
        let particles_per_grid = (n_particles as f64 / n_populations as f64).ceil() as usize;
        let n_particles = particles_per_grid * n_populations;

        let attraction_distr =
            Normal::new(Self::ATTRACTION_FACTOR_MEAN, Self::ATTRACTION_FACTOR_STD).unwrap();
        let repulstion_distr =
            Normal::new(Self::REPULSION_FACTOR_MEAN, Self::REPULSION_FACTOR_STD).unwrap();

        let mut attraction_table = Vec::with_capacity(n_populations);
        for i in 0..n_populations {
            attraction_table.push(Vec::with_capacity(n_populations));
            for j in 0..n_populations {
                attraction_table[i].push(if i == j {
                    attraction_distr.sample(rng)
                } else {
                    repulstion_distr.sample(rng)
                });
            }
        }

        PhysarumModel {
            agents: (0..n_particles)
                .map(|i| Agent::new(width, height, i / particles_per_grid, rng))
                .collect(),
            grids: (0..n_populations)
                .map(|_| Grid::new(width, height, rng))
                .collect(),
            attraction_table,
            diffusity,
            iteration: 0,
            palette: palette::PALETTES[palette_index],
        }
    }

    fn pick_direction(center: f32, left: f32, right: f32, rng: &mut SmallRng) -> f32 {
        if (center > left) && (center > right) {
            0.0
        } else if (center < left) && (center < right) {
            *[-1.0, 1.0].choose(rng).unwrap()
        } else if left < right {
            1.0
        } else if right < left {
            -1.0
        } else {
            0.0
        }
    }

    /// Perform a single simulation step.
    pub fn step(&mut self) {
        // Combine grids
        let grids = &mut self.grids;
        grid::combine(grids, &self.attraction_table);

        self.agents.par_iter_mut().for_each(|agent| {
            {
                let grid = &grids[agent.id];
                let PopulationConfig {
                    sensor_distance,
                    sensor_angle,
                    rotation_angle,
                    step_distance,
                    ..
                } = grid.config;
                let (width, height) = (grid.width, grid.height);

                let xc = agent.x + agent.angle.cos() * sensor_distance;
                let yc = agent.y + agent.angle.sin() * sensor_distance;
                let xl = agent.x + (agent.angle - sensor_angle).cos() * sensor_distance;
                let yl = agent.y + (agent.angle - sensor_angle).sin() * sensor_distance;
                let xr = agent.x + (agent.angle + sensor_angle).cos() * sensor_distance;
                let yr = agent.y + (agent.angle + sensor_angle).sin() * sensor_distance;

                // Sense. We sense from the buffer because this is where we previously combined data
                // from all the grid.
                let trail_c = grid.get_buf(xc, yc);
                let trail_l = grid.get_buf(xl, yl);
                let trail_r = grid.get_buf(xr, yr);

                let mut rng = SmallRng::seed_from_u64(agent.id as u64);
                // Rotate and move
                let direction = PhysarumModel::pick_direction(trail_c, trail_l, trail_r, &mut rng);
                agent.rotate_and_move(direction, rotation_angle, step_distance, width, height);
            }
        });

        // Deposit
        for agent in self.agents.iter() {
            self.grids[agent.id].deposit(agent.x, agent.y);
        }

        // Diffuse + Decay
        let diffusivity = self.diffusity;
        self.grids.iter_mut().for_each(|grid| {
            grid.diffuse(diffusivity);
        });
        self.iteration += 1;
    }

    pub fn print_configurations(&self) {
        for (i, grid) in self.grids.iter().enumerate() {
            println!("Grid {}: {}", i, grid.config);
        }
        println!("Attraction table: {:#?}", self.attraction_table);
    }

    pub fn save_to_image(&self, image: &mut DynamicImage) {
        let (width, height) = (self.grids[0].width, self.grids[0].height);
        let max_values: Vec<_> = self
            .grids
            .iter()
            .map(|grid| grid.quantile(0.999) * 1.5)
            .collect();

        for y in 0..height {
            for x in 0..width {
                let i = y * width + x;
                let (mut r, mut g, mut b) = (0.0_f32, 0.0_f32, 0.0_f32);
                for (grid, max_value, color) in
                    multizip((&self.grids, &max_values, &self.palette.colors))
                {
                    let mut t = (grid.data()[i] / max_value).clamp(0.0, 1.0);
                    t = t.powf(1.0 / 2.2); // gamma correction
                    r += color.0[0] as f32 * t;
                    g += color.0[1] as f32 * t;
                    b += color.0[2] as f32 * t;
                }
                r = r.clamp(0.0, 255.0);
                g = g.clamp(0.0, 255.0);
                b = b.clamp(0.0, 255.0);
                image.put_pixel(x as u32, y as u32, Rgba([r as u8, g as u8, b as u8, 255]));
            }
        }
    }
}
