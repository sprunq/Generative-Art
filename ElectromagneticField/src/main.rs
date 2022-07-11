pub mod charge;
pub mod particle;
use charge::Charge;
use nannou::{
    draw::mesh::vertex::Color,
    prelude::*,
    rand::{prelude::StdRng, Rng},
};
use particle::Particle;
use rand_core::SeedableRng;
use rayon::{
    iter::{IntoParallelRefMutIterator, ParallelIterator},
    slice::ParallelSlice,
};
use std::ops::{Add, Mul};

fn main() {
    nannou::app(model).update(update).run();
}

struct Model {
    _window: window::Id,
    random_seed: u64,
    charges: Vec<Charge>,
    col: usize,
    row: usize,
    sz: usize,
    points: Vec<Particle>,
    render_vectors: bool,

    charge_count: usize,
    charge_spawn_diameter: f32,
    charge_range: std::ops::Range<f32>,

    particle_count: usize,
    particle_spawn_diameter: f32,
    particle_speed: Vec2,
}

fn model(app: &App) -> Model {
    let _window = app
        .new_window()
        .size(1900, 1900)
        .view(view)
        .build()
        .unwrap();

    let charge_count = 60;
    let charge_spawn_diameter = 1500.0;
    let charge_range = -0500000000.0..10000000000.0;

    let particle_count = 70_000;
    let particle_spawn_diameter = 3000.0;
    let particle_speed = Vec2::new(5.0, 5.0);

    let set_seed = 0;
    let random_seed = if set_seed == 0 {
        random_range(1, 200000000000000)
    } else {
        set_seed
    };
    let mut random = SeedableRng::seed_from_u64(random_seed);

    let screen_w = app.main_window().rect().w() as f32 * 1.0;
    let screen_h = app.main_window().rect().h() as f32 * 1.0;

    let sz = 30;
    let col = (screen_w / sz as f32) as usize;
    let row = (screen_h / sz as f32) as usize;

    let mut charges = vec![];
    for _ in 0..charge_count {
        let charge = Charge::new(
            random_point_in_circle(charge_spawn_diameter, screen_w, screen_h, &mut random),
            random.gen_range(charge_range.clone()),
        );
        charges.push(charge);
    }

    let mut points = Vec::<Particle>::new();
    for _ in 0..particle_count {
        let p = Particle::new(
            random_point_in_circle(particle_spawn_diameter, screen_w, screen_h, &mut random),
            Vec2::new(0.0, 0.0),
            particle_speed,
        );
        points.push(p);
    }
    Model {
        _window,
        charges,
        col,
        row,
        sz,
        points,
        render_vectors: false,
        charge_count,
        charge_spawn_diameter,
        charge_range,
        particle_count,
        particle_spawn_diameter,
        particle_speed,
        random_seed,
    }
}

fn update(_app: &App, _model: &mut Model, _update: Update) {
    // Parallelized Particle Charge computation
    // Charge check only gives an performance increase for big numbers.
    _model.points.par_iter_mut().for_each(|particle| {
        if particle.trail_list.len() < 100 {
            let force_sum = _model
                .charges
                .par_chunks(200)
                .map(|chunk| {
                    let mut force_sum = Vec2::new(0.0, 0.0);
                    chunk.iter().for_each(|charge| {
                        let force = charge.field_force(particle.pos);
                        force_sum = force_sum.add(force);
                    });
                    force_sum
                })
                .collect::<Vec<_>>()
                .into_iter()
                .reduce(|a, b| a.add(b));

            match force_sum {
                Some(mut force) => {
                    force = force.clamp_length(-10.0, 10.0);
                    particle.move_particle(force.angle());
                }
                None => {}
            }
        }
    });
}

fn view(app: &App, _model: &Model, frame: Frame) {
    if app.elapsed_frames() % 10 == 0 {
        let fps = app.fps().round();
        let s_fps = format!("{} fps \t{}", fps, app.elapsed_frames());
        if fps < 10_000_000.0 {
            app.main_window().set_title(&s_fps);
        }
    }

    if app.elapsed_frames() != 200 {
        return;
    } else {
        print!("Printing");
        let file_path = captured_frame_path(app, _model);
        app.main_window().capture_frame(file_path);
        print!("Print done");
    }
    let draw = app.draw();
    draw.background().color(WHITE);

    // Particles
    for particle in _model.points.clone() {
        let mut colored_points = Vec::new();
        for p in particle.trail_list.clone() {
            let color = Color::new(0.0, 0.0, 0.0, 0.2);
            colored_points.push((p, color));
        }
        draw.polyline().points_colored(colored_points);
    }

    // Vector field
    if _model.render_vectors {
        render_vectors(&draw, app, _model);
        for c in &_model.charges {
            c.render(&draw);
        }
    }

    draw.to_frame(app, &frame).unwrap();
}

fn render_vectors(draw: &Draw, app: &App, _model: &Model) {
    for j in 0.._model.row {
        for i in 0.._model.col {
            let x = i * _model.sz + _model.sz / 2;
            let y = j * _model.sz + _model.sz / 2;
            let offset_x = x as f32 - app.main_window().rect().w() / 2.0;
            let offset_y = y as f32 - app.main_window().rect().h() / 2.0;
            let mut sum = Vec2::new(0.0, 0.0);
            for charge in _model.charges.clone() {
                let line = charge.field_force(Vec2::new(offset_x, offset_y));
                sum = sum.add(line);
            }
            sum = sum.mul(100.0);
            sum = sum.clamp_length(-1.0 * _model.sz as f32, _model.sz as f32);
            draw.line()
                .start(Vec2::new(offset_x, offset_y))
                .weight(1.0)
                .end(Vec2::new(offset_x + sum.x, offset_y + sum.y))
                .rgba(0.0, 1.0, 0.0, 1.0);
        }
    }
}

pub fn random_point_in_circle(max_r: f32, w: f32, h: f32, random: &mut StdRng) -> Vec2 {
    let a = random.gen_range(0.0..1.0) * 2.0 * PI;
    let r = 20.0 * (random.gen_range(0.0..1.0) * max_r).sqrt();
    let x = w / 2.0 + r * a.cos();
    let y = h / 2.0 + r * a.sin();
    Vec2::new(x - w / 2.0, y - h / 2.0)
}

fn captured_frame_path(app: &App, model: &Model) -> std::path::PathBuf {
    let path = [
        "px",
        &app.window_rect().w().to_string(),
        &app.window_rect().h().to_string(),
        "pc",
        &model.particle_count.to_string(),
        "psd",
        &model.particle_spawn_diameter.to_string(),
        "ps",
        &model.particle_speed.to_string(),
        "cc",
        &model.charge_count.to_string(),
        "csd",
        &model.charge_spawn_diameter.to_string(),
        "crs",
        &model.charge_range.start.to_string(),
        "to",
        &model.charge_range.end.to_string(),
        "seed",
        &model.random_seed.to_string(),
    ]
    .join("_");
    app.project_path()
        .expect("failed to locate `project_path`")
        .join(app.exe_name().unwrap())
        .join(path)
        .with_extension("png")
}
