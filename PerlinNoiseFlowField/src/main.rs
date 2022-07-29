use nannou::{
    color::{Gradient, IntoLinSrgba, Pixel},
    prelude::*,
};
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
            DVec2::new(10.0, 10.0),
            10,
        ));
    }
    let flowfield = PerlinField::new(particles, 800.0, 1.0);

    Model { _window, flowfield }
}

fn update(_app: &App, _model: &mut Model, _update: Update) {
    let w = _app.window_rect().w() as f64;
    let h = _app.window_rect().h() as f64;
    _model
        .flowfield
        .next_step(_app.elapsed_frames() as f64 * 0.002);
    _model.flowfield.edge_check(w, h);
    _model.flowfield.random_respawn(0.01, w, h)
}

fn view(app: &App, _model: &Model, frame: Frame) {
    set_fps(app);

    let draw = app.draw();
    let w = app.window_rect().w();
    let h = app.window_rect().h();
    draw.rect().x_y(0.0, 0.0).w_h(w, h).rgba(0.0, 0.0, 0.0, 0.1);

    let lb = YELLOW.into_lin_srgba();
    let db = ORANGE.into_lin_srgba();
    let c1 = Vec4::new(lb.red, lb.green, lb.blue, 0.2);
    let c2 = Vec4::new(db.red, db.green, db.blue, 0.01);

    for particle in _model.flowfield.particles.iter() {
        let mut colored_points = Vec::new();
        let len = particle.trail_list.len();
        for i in 0..len {
            let point = particle.trail_list[i];
            let s = map_range(i, 0, len, 0.0, 1.0);
            let c = c2.lerp(c1, s);
            let color = Rgba::new(c.x, c.y, c.z, c.w);
            colored_points.push((point.clone(), color));
        }
        draw.polyline()
            .rgba(0.4, 0.7, 1.0, 0.02)
            .weight(1.0)
            .points_colored(colored_points);
    }

    draw.to_frame(app, &frame).unwrap();

    //let file_path = captured_frame_path(app, &frame);
    //app.main_window().capture_frame(file_path);
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

fn captured_frame_path(app: &App, frame: &Frame) -> std::path::PathBuf {
    app.project_path()
        .expect("failed to locate `project_path`")
        .join(app.exe_name().unwrap())
        .join(format!("{:03}", frame.nth()))
        .with_extension("png")
}
