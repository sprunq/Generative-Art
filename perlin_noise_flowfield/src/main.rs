use nannou::prelude::*;
pub mod flowfield;
pub mod particle;
use flowfield::PerlinField;
use particle::Particle;

fn main() {
    nannou::app(model).update(update).run();
}

struct Model {
    _window: window::Id,
    flowfield: PerlinField,
}

fn model(app: &App) -> Model {
    let _window = app
        .new_window()
        .size(1000, 1000)
        .view(view)
        .build()
        .unwrap();

    let mut particles = Vec::new();
    let w = app.window_rect().w() as f64;
    let h = app.window_rect().h() as f64;
    for _ in 0..20_000 {
        particles.push(Particle::new(
            DVec2::new(random_f64() * w - w / 2.0, random_f64() * h - h / 2.0),
            DVec2::new(0.0, 0.0),
            DVec2::new(5.0, 5.0),
            random_range(5, 20),
        ));
    }
    let flowfield = PerlinField::new(particles, 500.0, 1.0);

    Model { _window, flowfield }
}

fn update(_app: &App, _model: &mut Model, _update: Update) {
    let w = _app.window_rect().w() as f64;
    let h = _app.window_rect().h() as f64;
    _model
        .flowfield
        .next_step(_app.elapsed_frames() as f64 * 0.002);
    _model.flowfield.edge_check(w, h);
    _model.flowfield.random_respawn(0.07, w, h)
}

fn view(app: &App, _model: &Model, frame: Frame) {
    set_fps(app);

    let draw = app.draw();
    let w = app.window_rect().w();
    let h = app.window_rect().h();
    draw.rect().x_y(0.0, 0.0).w_h(w, h).rgba(0.0, 0.0, 0.0, 1.0);

    for particle in _model.flowfield.particles.iter() {
        draw.polyline()
            .rgba(0.6, 0.0, 1.0, 0.1)
            .points(particle.trail_list.clone());
    }

    draw.to_frame(app, &frame).unwrap();
}

fn set_fps(app: &App) {
    if app.elapsed_frames() % 2 == 0 {
        let fps = app.fps().round();
        let s_fps = format!("{} fps \t{}", fps, app.elapsed_frames());
        if fps < 999.0 {
            app.main_window().set_title(&s_fps);
        }
    }
}
