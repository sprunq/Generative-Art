use chrono::{Datelike, Timelike};
use nannou::prelude::*;
use nannou_egui::{self, egui, Egui};
use rand::prelude::*;

// None for random seed every run
const SEED: Option<u64> = Some(1234);

fn main() {
    nannou::app(model).update(update).run();
}

struct Settings {
    slider_value: f64,
    seed: String,
}

struct Model {
    settings: Settings,
    egui: Egui,
    egui_visible: bool,
    main_window_id: WindowId,
    rng: SmallRng,
    seed: u64,
}

impl Model {
    fn new(
        rng: SmallRng,
        seed: u64,
        egui: Egui,
        egui_visible: bool,
        image_window: WindowId,
    ) -> Self {
        Model {
            settings: Settings {
                slider_value: 50.,
                seed: seed.to_string(),
            },
            egui,
            egui_visible,
            main_window_id: image_window,
            rng,
            seed,
        }
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
        .build()
        .unwrap();

    let window = app.window(image_window).unwrap();

    let egui = Egui::from_window(&window);
    let seed;
    match SEED {
        Some(val) => seed = val,
        None => seed = thread_rng().next_u64(),
    }
    let rng = SmallRng::seed_from_u64(seed);
    let _ = &app
        .window(image_window)
        .unwrap()
        .set_title(&format!("{}{}", "Seed: ", &seed.to_string()).to_string());

    Model::new(rng, seed, egui, true, image_window)
}

fn update(app: &App, model: &mut Model, update: Update) {
    if model.egui_visible {
        update_gui(model, update, app);
    }
}

fn view(app: &App, _model: &Model, frame: Frame) {
    let background = rgb(0.5, 0.0, 0.8);

    let draw = app.draw();
    draw.background().color(background);

    draw.to_frame(app, &frame).unwrap();
    if _model.egui_visible {
        _model.egui.draw_to_frame(&frame).unwrap();
    }
}

fn update_gui(model: &mut Model, update: Update, app: &App) {
    let egui = &mut model.egui;
    egui.set_elapsed_time(update.since_start);
    let ctx = egui.begin_frame();
    let settings = &mut model.settings;
    egui::Window::new("Settings").show(&ctx, |ui| {
        let slider = egui::Slider::new(&mut settings.slider_value, 0.0..=100.0);
        let seed = egui::TextEdit::singleline(&mut settings.seed);
        ui.label("Value:");
        if ui.add(slider).changed() {}
        if ui.add(seed).changed() {
            let val = settings.seed.parse::<u64>();
            let string_to_set;
            match val {
                Ok(value) => {
                    model.seed = value;
                    model.rng = SmallRng::seed_from_u64(model.seed);
                    string_to_set = format!("{}{}", "Seed: ", settings.seed);
                }
                Err(_) => {
                    string_to_set = format!("{}", "Invalid Seed");
                }
            }
            app.window(model.main_window_id)
                .unwrap()
                .set_title(&string_to_set);
        }
        if ui.button("Click me!").changed() {};
    });
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
