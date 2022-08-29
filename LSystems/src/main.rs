#![allow(dead_code)]
pub mod lsystem;

use chrono::{Datelike, Timelike};
use lsystem::{
    l_system::LSystem, l_system_rules::LSystemRules, pen_state::PenState, turtle::Turtle,
};
use nannou::prelude::*;
use nannou_egui::{self, egui, Egui};
use rand::prelude::*;

// None for random seed every run
const SEED: Option<u64> = Some(0);

fn main() {
    nannou::app(model).update(update).run();
}

struct Model {
    seed: u64,
    egui_visible: bool,
    egui: Egui,
    main_window_id: WindowId,
    rng: SmallRng,
    l_system: LSystem,
    l_system_strokes: Vec<(Vec2, Vec2, Rgba)>,
    l_system_draw_index_id: usize,
    l_system_batch_draw_amount: usize,
    l_system_size: f32,
    changed: bool,
}

impl Model {
    fn new(seed: u64, egui: Egui, image_window: WindowId, l_system: LSystem) -> Self {
        Model {
            seed,
            egui_visible: true,
            egui,
            main_window_id: image_window,
            rng: SmallRng::seed_from_u64(seed),
            l_system,
            l_system_strokes: vec![],
            l_system_draw_index_id: 0,
            l_system_batch_draw_amount: 0,
            l_system_size: 1.0,
            changed: true,
        }
    }

    fn reset_rng(&mut self) {
        self.rng = SmallRng::seed_from_u64(self.seed);
    }
}

fn model(app: &App) -> Model {
    let image_window = app
        .new_window()
        .size(1200, 630)
        .view(view)
        .key_pressed(key_pressed)
        .mouse_pressed(mouse_pressed)
        .raw_event(raw_window_event)
        .title("LSystem Physarium Flowers")
        .build()
        .unwrap();
    let window = app.window(image_window).unwrap();

    // L-System Init
    let axiom = str_to_chars("A");
    let generations = 9;
    let mut l_system_rules = LSystemRules::new();
    l_system_rules.add_rule('A', str_to_chars("[FL]gAhg[FLA]"));
    l_system_rules.add_rule('F', str_to_chars("0SF"));
    l_system_rules.add_rule('S', str_to_chars("1FL"));
    l_system_rules.add_rule('L', str_to_chars("0[F+F+F]f2[F-F-F]"));

    Model::new(
        SEED.unwrap_or(thread_rng().next_u64()),
        Egui::from_window(&window),
        image_window,
        LSystem::new(axiom, l_system_rules, generations),
    )
}

fn update(_app: &App, model: &mut Model, update: Update) {
    model.changed = false;
    if model.egui_visible {
        update_gui(model, update);
    }
    model.l_system_draw_index_id += model.l_system_batch_draw_amount;

    if model.changed || model.l_system_strokes.len() == 0 {
        model.l_system.iterate_all_gens();
        let pen_state = PenState::new();
        let mut turtle = Turtle::new(pen_state);
        model.l_system_strokes =
            turtle.get_strokes(model.l_system.gen_chars.clone(), &mut model.rng);
    }
}

fn view(app: &App, model: &Model, frame: Frame) {
    let mut draw = app.draw();
    if model.changed {
        draw.background().color(rgb(0.0, 0.0, 0.0));
    }
    draw_l_system(&model, &mut draw, app, model.l_system_size);

    draw.to_frame(app, &frame).unwrap();
    if model.egui_visible {
        model.egui.draw_to_frame(&frame).unwrap();
    }
}

fn update_gui(model: &mut Model, update: Update) {
    model.egui.set_elapsed_time(update.since_start);
    let ctx = model.egui.begin_frame();
    egui::Window::new("Settings").show(&ctx, |ui| {
        ui.add(egui::Label::new("General"));
        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.seed, 0..=1_000_000_000)
                    .text("Seed")
                    .smart_aim(false),
            )
            .changed();

        ui.add(egui::Separator::default());
        ui.add(egui::Label::new("L-System"));

        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.l_system_size, 0.0..=6.0)
                    .text("Size")
                    .clamp_to_range(false),
            )
            .changed();

        ui.add(egui::Slider::new(&mut model.l_system.generations, 1..=15).text("Generations"));

        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.l_system_batch_draw_amount, 0..=100)
                    .text("Batch Draw Amount")
                    .smart_aim(false),
            )
            .changed();

        ui.add(egui::Separator::default());
        ui.add(egui::Label::new("Physarum"));
        model.changed |= ui.button("Redraw").clicked();
    });
    drop(ctx);
    if model.changed {
        model.reset_rng();
        model.l_system_draw_index_id = 0;
        model.l_system_strokes = vec![];
    }
}

fn raw_window_event(_app: &App, model: &mut Model, event: &nannou::winit::event::WindowEvent) {
    model.egui.handle_raw_event(event);
}

fn key_pressed(app: &App, model: &mut Model, key: Key) {
    if key == Key::S {
        let now = chrono::offset::Local::now();
        let time = format!(
            "{}_{}_{}_{}_{}_{}",
            now.year(),
            now.month(),
            now.day(),
            now.hour(),
            now.minute(),
            now.second()
        );
        let path = format!("{}_{}{}", app.exe_name().unwrap(), time, ".png");
        app.main_window().capture_frame(path);
    } else if key == Key::F {
        model.egui_visible = !model.egui_visible;
    }
}

fn mouse_pressed(_app: &App, _model: &mut Model, button: MouseButton) {
    if button == MouseButton::Left {}
}

fn draw_l_system(model: &Model, draw: &mut Draw, app: &App, size: f32) {
    let mut lowest_point = 0.0;
    for s in &model.l_system_strokes {
        lowest_point = f32::min(lowest_point, s.0.y * size);
        lowest_point = f32::min(lowest_point, s.1.y * size);
    }
    let offset = app.window(model.main_window_id).unwrap().rect().bottom() - lowest_point;
    let offset_vec = Vec2::new(0.0, offset);

    if model.l_system_batch_draw_amount == 0 {
        for stroke in &model.l_system_strokes {
            draw_l_system_branch(stroke, draw, size, offset_vec);
        }
    } else {
        for i in model.l_system_draw_index_id
            ..model.l_system_draw_index_id + model.l_system_batch_draw_amount
        {
            if let Some(stroke) = model.l_system_strokes.get(i) {
                draw_l_system_branch(stroke, draw, size, offset_vec);
            }
        }
    }
}

fn draw_l_system_branch(stroke: &(Vec2, Vec2, Rgba), draw: &mut Draw, size: f32, offset: Vec2) {
    draw.line()
        .color(stroke.2)
        .weight(2.0)
        .start(stroke.0 * size + offset)
        .end(stroke.1 * size + offset);
}

fn str_to_chars(input: &str) -> Vec<char> {
    let val = input.chars().collect();
    return val;
}
