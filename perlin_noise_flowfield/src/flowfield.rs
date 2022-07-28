use crate::particle::Particle;
use nannou::noise::{NoiseFn, Perlin, Seedable};
use nannou::prelude::*;
use rayon::iter::{IntoParallelRefMutIterator, ParallelIterator};

#[derive(Clone)]
pub struct PerlinField {
    pub particles: Vec<Particle>,
    noise_scale: f64,
    noise_strength: f64,
    perlin: Perlin,
}

impl PerlinField {
    pub fn new(particles: Vec<Particle>, noise_scale: f64, noise_strength: f64) -> Self {
        let mut perlin = Perlin::new();
        perlin = perlin.set_seed(20);
        Self {
            particles,
            noise_scale,
            noise_strength,
            perlin,
        }
    }

    pub fn next_step(&mut self, t: f64) {
        self.particles.par_iter_mut().for_each(|particle| {
            let angle = self.perlin.get([
                particle.pos.x / self.noise_scale,
                particle.pos.y / self.noise_scale,
                t,
            ]) * PI_F64
                * 2.0
                * self.noise_strength;
            particle.move_particle(angle)
        })
    }

    pub fn edge_check(&mut self, width: f64, height: f64) {
        let m_w = width / 2.0;
        let m_h = height / 2.0;
        self.particles.par_iter_mut().for_each(|particle| {
            if particle.pos.x < -1.0 * m_w - 20.0
                || particle.pos.x > m_w + 20.0
                || particle.pos.y < -1.0 * m_h - 20.0
                || particle.pos.y > m_h + 20.0
            {
                particle.pos.x = random_f64() * width - width / 2.0;
                particle.pos.y = random_f64() * height - height / 2.0;
                particle.trail_list.clear();
            }
        })
    }

    pub fn random_respawn(&mut self, chance: f64, width: f64, height: f64) {
        self.particles.par_iter_mut().for_each(|particle| {
            if random_f64() < chance {
                particle.pos.x = random_f64() * width - width / 2.0;
                particle.pos.y = random_f64() * height - height / 2.0;
                particle.trail_list.clear();
            }
        })
    }
}
