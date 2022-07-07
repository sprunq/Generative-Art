use nannou::math::*;
use nannou::prelude::*;

fn main() {
    nannou::app(model)
        .update(update)
        .simple_window(view)
        .size(1000, 1000)
        .run();
}

struct Model {
    a: f32,
    b: f32,
    c: f32,
    d: f32,
    loops: i32,
    points: Vec<Vec2>,
}

fn model(_app: &App) -> Model {
    Model {
        a: -1.42,
        b: 1.49,
        c: 1.3,
        d: 0.43,
        loops: 10000,
        points: vec![Vec2::new(0.0, 0.0)],
    }
}

fn update(_app: &App, _model: &mut Model, _update: Update) {
    let mut current_point = _model.points.last().unwrap().clone();
    _model.points.clear();
    for _ in 0.._model.loops {
        let new_x =
            (_model.a * current_point.y).sin() + _model.c * (_model.a * current_point.x).cos();
        let new_y =
            (_model.b * current_point.x).sin() + _model.d * (_model.b * current_point.y).cos();
        current_point = Vec2::new(new_x, new_y);
        _model.points.push(current_point);
    }
}

fn view(_app: &App, _model: &Model, frame: Frame) {
    let draw = _app.draw();
    if _app.elapsed_frames() == 1 {
        draw.background().color(BLACK);
    }
    draw.rect()
        .x_y(0.0, 0.0)
        .width(_app.window_rect().w())
        .height(_app.window_rect().h())
        .rgba(0.0, 0.0, 0.0, 0.0);

    for point in _model.points.clone() {
        let x_screen = map_range(
            point.x,
            -3.0,
            3.0,
            -_app.window_rect().w() / 2.0,
            _app.window_rect().w() / 2.0,
        );
        let y_screen = map_range(
            point.y,
            -3.0,
            3.0,
            -_app.window_rect().h() / 2.0,
            _app.window_rect().h() / 2.0,
        );
        draw.rect()
            .width(1.0)
            .height(1.0)
            .x_y(x_screen, y_screen)
            .rgba(
                map_range(point.x, -3.0, 3.0, 0.1, 1.0),
                0.0,
                map_range(point.y, -3.0, 3.0, 0.2, 1.0),
                0.1,
            );
    }

    draw.to_frame(_app, &frame).unwrap();
    // Capture the frame!
    let file_path = captured_frame_path(_app, &frame);
    _app.main_window().capture_frame(file_path);
}

fn captured_frame_path(app: &App, frame: &Frame) -> std::path::PathBuf {
    // Create a path that we want to save this frame to.
    app.project_path()
        .expect("failed to locate `project_path`")
        // Capture all frames to a directory called `/<path_to_nannou>/nannou/simple_capture`.
        .join(app.exe_name().unwrap())
        // Name each file after the number of the frame.
        .join(format!("{:03}", frame.nth()))
        // The extension will be PNG. We also support tiff, bmp, gif, jpeg, webp and some others.
        .with_extension("png")
}
