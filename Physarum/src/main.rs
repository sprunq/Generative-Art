#![allow(dead_code)]
pub mod physarum;

use chrono::{Datelike, Timelike};
use nannou::{image::DynamicImage, prelude::*, wgpu::Texture};
use nannou_egui::{self, egui, Egui};
use physarum::physarum_model::PhysarumModel;
use rand::prelude::*;

// None for random seed every run
const SEED: Option<u64> = None;

fn main() {
    nannou::app(model).update(update).run();
}

struct PhysarumSettings {
    model: PhysarumModel,
    width: usize,
    height: usize,
    n_particles: usize,
    n_populations: usize,
    diffusivity: usize,
    palette_idx: usize,
}

struct Model {
    physarum_settings: PhysarumSettings,
    seed: u64,
    egui_visible: bool,
    egui: Egui,
    main_window_id: WindowId,
    rng: SmallRng,
    changed: bool,
    render: bool,
    image: DynamicImage,
}

impl Model {
    fn new(
        physarum_settings: PhysarumSettings,
        seed: u64,
        rng: SmallRng,
        egui: Egui,
        image_window: WindowId,
        image: DynamicImage,
    ) -> Self {
        Model {
            physarum_settings,
            seed,
            egui_visible: false,
            egui,
            main_window_id: image_window,
            rng,
            changed: true,
            render: false,
            image,
        }
    }

    fn reset_rng(&mut self) {
        self.rng = SmallRng::seed_from_u64(self.seed);
    }

    fn reset(&mut self) {
        self.reset_rng();
        let physarum_model = PhysarumModel::new(
            self.physarum_settings.width,
            self.physarum_settings.height,
            self.physarum_settings.n_particles,
            self.physarum_settings.n_populations,
            self.physarum_settings.diffusivity,
            self.physarum_settings.palette_idx,
            &mut self.rng,
        );
        self.physarum_settings.model = physarum_model;
    }
}

fn model(app: &App) -> Model {
    let image_window = app
        .new_window()
        .size(512, 512)
        .view(view)
        .key_pressed(key_pressed)
        .mouse_pressed(mouse_pressed)
        .raw_event(raw_window_event)
        .title("Physarum")
        .build()
        .unwrap();
    let window = app.window(image_window).unwrap();
    let seed = SEED.unwrap_or(thread_rng().next_u64());
    let mut rng = SmallRng::seed_from_u64(seed);
    println!("{}", seed);

    // Physarum
    let (width, height) = (window.rect().w() as usize, window.rect().h() as usize);
    let n_particles = 2000000;
    let n_populations = 4;
    let diffusivity = 1;
    let palette_idx = 0;
    let physarum_model = PhysarumModel::new(
        width,
        height,
        n_particles,
        n_populations,
        diffusivity,
        palette_idx,
        &mut rng,
    );

    let physarum = PhysarumSettings {
        width,
        height,
        n_particles,
        n_populations,
        diffusivity,
        model: physarum_model,
        palette_idx,
    };

    Model::new(
        physarum,
        seed,
        rng,
        Egui::from_window(&window),
        image_window,
        DynamicImage::new_rgb8(width as u32, height as u32),
    )
}

fn update(_app: &App, model: &mut Model, update: Update) {
    model.changed = false;
    if model.egui_visible {
        update_gui(model, update);
    }
    for _ in 0..1 {
        model.physarum_settings.model.step();
    }
    model
        .physarum_settings
        .model
        .save_to_image(&mut model.image);
}

fn view(app: &App, model: &Model, frame: Frame) {
    let draw = app.draw();
    let texture = Texture::from_image(app, &model.image);
    draw.texture(&texture);

    draw.to_frame(app, &frame).unwrap();
    if model.egui_visible {
        model.egui.draw_to_frame(&frame).unwrap();
    }
    if model.render {
        save_frame(app);
    }
}

fn update_gui(model: &mut Model, update: Update) {
    model.egui.set_elapsed_time(update.since_start);
    let ctx = model.egui.begin_frame();
    egui::Window::new("Settings").show(&ctx, |ui| {
        ui.add(egui::Label::new("General"));
        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.seed, 0..=u64::MAX - 1)
                    .text("Seed")
                    .smart_aim(false),
            )
            .changed();

        ui.add(egui::Separator::default());
        ui.add(egui::Label::new("Physarum"));
        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.physarum_settings.n_particles, 0..=6_000_000)
                    .text("Particles")
                    .smart_aim(false),
            )
            .changed();

        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.physarum_settings.n_populations, 1..=5)
                    .text("Populations")
                    .smart_aim(false),
            )
            .changed();

        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.physarum_settings.diffusivity, 1..=5)
                    .text("Diffusivity")
                    .smart_aim(false),
            )
            .changed();

        let palettes_len = physarum::palette::PALETTE_ARRAY.len() - 1;
        model.changed |= ui
            .add(
                egui::Slider::new(&mut model.physarum_settings.palette_idx, 0..=palettes_len)
                    .text("Palette")
                    .smart_aim(false),
            )
            .changed();

        model.changed |= ui.button("Redraw").clicked();
        ui.checkbox(&mut model.render, "Render");
    });
    drop(ctx);
    if model.changed {
        model.reset();
    }
}

fn raw_window_event(_app: &App, model: &mut Model, event: &nannou::winit::event::WindowEvent) {
    model.egui.handle_raw_event(event);
}

fn key_pressed(app: &App, model: &mut Model, key: Key) {
    if key == Key::S {
        save_frame(app);
    } else if key == Key::F {
        model.egui_visible = !model.egui_visible;
    }
}

fn mouse_pressed(_app: &App, _model: &mut Model, button: MouseButton) {
    if button == MouseButton::Left {}
}

fn save_frame(app: &App) {
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
    let path = format!(
        "{}/{}_{}{}",
        "renders",
        app.exe_name().unwrap(),
        time,
        ".png"
    );
    app.main_window().capture_frame(path);
}
