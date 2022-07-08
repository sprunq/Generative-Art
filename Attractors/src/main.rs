use nannou::math::*;
use nannou::prelude::*;

const D_MAP_RES: usize = 1500;

enum Attractor {
    Clifford,
    PeterDeJong,
}

fn main() {
    nannou::app(model)
        .update(update)
        .loop_mode(LoopMode::NTimes {
            number_of_updates: (1),
        })
        .simple_window(view)
        .size(D_MAP_RES as u32, D_MAP_RES as u32)
        .run();
}

struct Model {
    attractor: Attractor,
    a: f32,
    b: f32,
    c: f32,
    d: f32,
    loops: i32,
    point: Vec2,
    density_map: Vec<Vec<i32>>,
}

fn model(_app: &App) -> Model {
    Model {
        attractor: Attractor::PeterDeJong,
        a: -2.0,
        b: -2.0,
        c: -1.2,
        d: 2.0,
        loops: 400_000_000,
        point: Vec2::new(0.0, 0.0),
        density_map: vec![vec![0; D_MAP_RES]; D_MAP_RES],
    }
}

fn update(_app: &App, _model: &mut Model, _update: Update) {
    for _ in 0.._model.loops {
        let (new_x, new_y) = next_attractor_step(
            &_model.attractor,
            _model.point,
            _model.a,
            _model.b,
            _model.c,
            _model.d,
        );

        let x_a = map_range(new_x, -3.0, 3.0, 0, D_MAP_RES);
        let y_a = map_range(new_y, -3.0, 3.0, 0, D_MAP_RES);
        _model.density_map[x_a][y_a] += 1;
        _model.point.x = new_x;
        _model.point.y = new_y;
    }
}

fn next_attractor_step(
    attractor: &Attractor,
    point: Vec2,
    a: f32,
    b: f32,
    c: f32,
    d: f32,
) -> (f32, f32) {
    let new_x;
    let new_y;
    match attractor {
        Attractor::Clifford => {
            new_x = (a * point.y).sin() + c * (a * point.x).cos();
            new_y = (b * point.x).sin() + d * (b * point.y).cos();
        }
        Attractor::PeterDeJong => {
            new_x = (a * point.y).sin() - (b * point.x).cos();
            new_y = (c * point.x).sin() - (d * point.y).cos();
        }
    }

    (new_x, new_y)
}

fn view(_app: &App, _model: &Model, frame: Frame) {
    let draw = _app.draw();
    if _app.elapsed_frames() == 1 {
        draw.background().color(BLACK);
    }
    if _app.elapsed_frames() == 2 {
        print!("Printing");
        let file_path = captured_frame_path(_app, &frame);
        _app.main_window().capture_frame(file_path);
        print!("Print done");
    }

    if _app.elapsed_frames() % 10 == 0 {
        let fps = _app.fps().round();
        _app.main_window().set_title(&fps.to_string());
    }

    let offset_x = _app.window_rect().w() / 2.0;
    let offset_y = _app.window_rect().h() / 2.0;
    let mut i = 0;
    for x in 0..D_MAP_RES {
        for y in 0..D_MAP_RES {
            let element = _model.density_map[x][y];
            let p = Vec2::new(x as f32 - offset_x, y as f32 - offset_y);
            let mut c = map_range(element, 0, 4000, 0.0, 1.0);
            if c > 0.0 {
                i += 1;
                c += 0.1;
                draw.rect().width(1.0).height(1.0).xy(p).rgba(
                    map_range(p.distance(Vec2::new(-200.0, 50.0)), 0.0, 1000.0, 0.8, 0.0) * c,
                    0.0,
                    map_range(p.distance(Vec2::new(200.0, -50.0)), 0.0, 900.0, 1.0, 0.5) * c,
                    1.0,
                );
            }
        }
    }
    println!("{}", i);

    draw.to_frame(_app, &frame).unwrap();
}

fn captured_frame_path(app: &App, frame: &Frame) -> std::path::PathBuf {
    // Create a path that we want to save this frame to.
    app.project_path()
        .expect("failed to locate `project_path`")
        // Capture all frames to a directory called `/<path_to_nannou>/nannou/simple_capture`.
        .join(app.exe_name().unwrap())
        // Name each file after the number of the frame.
        .join(format!("{}", (random_f32() * 1000000.0).to_string()))
        // The extension will be PNG. We also support tiff, bmp, gif, jpeg, webp and some others.
        .with_extension("tiff")
}
