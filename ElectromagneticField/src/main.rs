use std::ops::{Add, Mul};

use nannou::prelude::*;

pub mod charge;

fn main() {
    nannou::app(model).update(update).run();
}

struct Model {
    _window: window::Id,
    charges: Vec<charge::Charge>,
    col: usize,
    row: usize,
    sz: usize,
}

fn model(app: &App) -> Model {
    let _window = app.new_window().size(800, 800).view(view).build().unwrap();
    let sz = 10;
    let col = (app.main_window().rect().w() as f32 / sz as f32) as usize;
    let row = (app.main_window().rect().h() as f32 / sz as f32) as usize;
    let mut charges = vec![];
    charges.push(charge::Charge::new(Vec2::new(0.0, 0.0), 1.0));
    charges.push(charge::Charge::new(Vec2::new(-400.0, 30.0), 1.0));
    charges.push(charge::Charge::new(Vec2::new(-200.0, 200.0), 4.0));
    Model {
        _window,
        charges: charges,
        col,
        row,
        sz: sz,
    }
}

fn update(_app: &App, _model: &mut Model, _update: Update) {}

fn view(app: &App, _model: &Model, frame: Frame) {
    let mut draw = app.draw();
    draw.background().color(WHITE);

    for j in 0.._model.row {
        for i in 0.._model.col {
            let x = i * _model.sz + _model.sz / 2;
            let y = j * _model.sz + _model.sz / 2;
            let offset_x = x as f32 - app.main_window().rect().w() / 2.0;
            let offset_y = y as f32 - app.main_window().rect().h() / 2.0;
            let mut sum = Vec2::new(0.0, 0.0);
            for charge in _model.charges.clone() {
                let line = charge.field_line(Vec2::new(offset_x, offset_y));
                sum = sum.add(line);
            }
            sum = sum.mul(100.0);
            sum = sum.clamp_length(-1.0 * _model.sz as f32, _model.sz as f32);
            draw.line()
                .start(Vec2::new(offset_x, offset_y))
                .weight(2.0)
                .end(Vec2::new(offset_x + sum.x, offset_y + sum.y))
                .color(BLACK);
        }
    }

    for charge in _model.charges.clone() {
        charge.render(&mut draw);
    }

    draw.to_frame(app, &frame).unwrap();

    if app.elapsed_frames() % 10 == 0 {
        let fps = app.fps().round();
        if fps < 10_000_000.0 {
            app.main_window().set_title(&fps.to_string());
        }
    }
}
