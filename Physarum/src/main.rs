#![allow(dead_code)]
pub mod physarum;
pub mod ui;

use chrono::{Datelike, Timelike};
use nannou::{image::DynamicImage, prelude::*, wgpu::Texture};
use nannou_egui::{self, Egui};
use physarum::physarum_model::PhysarumModel;
use physarum::population_config::PopulationConfig;
use rand::prelude::*;

// None for random seed every run
const SEED: Option<u64> = None;

fn main() {
    nannou::app(model).update(update).run();
}

struct PhysarumSettings {
    model: PhysarumModel,
    configs: Vec<PopulationConfig>,
    config_changed: bool,
    width: usize,
    height: usize,
    n_particles: usize,
    n_populations: usize,
    diffusivity: usize,
    palette_idx: usize,
}

pub struct Model {
    physarum_settings: PhysarumSettings,
    seed: u64,
    egui_visible: bool,
    steps_per_frame: usize,
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
            steps_per_frame: 1,
        }
    }

    fn reset_rng(&mut self) {
        self.rng = SmallRng::seed_from_u64(self.seed);
    }

    fn reset(&mut self) {
        self.reset_rng();
        let sc = &self.physarum_settings;
        let physarum_model = PhysarumModel::new(
            sc.width,
            sc.height,
            sc.n_particles,
            sc.n_populations,
            sc.diffusivity,
            sc.palette_idx,
            &mut self.rng,
        );
        self.physarum_settings.model = physarum_model;
        self.physarum_settings
            .model
            .set_population_configs(self.physarum_settings.configs.clone());
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
    let n_particles = 200000;
    let n_populations = 2;
    let diffusivity = 1;
    let palette_idx = 0;
    let configs = vec![PopulationConfig::new(&mut rng); 5];
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
        configs,
        config_changed: true,
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
        ui::update_gui(model, update);
    }
    for _ in 0..model.steps_per_frame {
        model.physarum_settings.model.step();
    }
    model
        .physarum_settings
        .model
        .save_to_image(&mut model.image);
}

fn view(app: &App, model: &Model, frame: Frame) {
    let draw = app.draw();
    draw.background().color(BLACK);
    let texture = Texture::from_image(app, &model.image);
    draw.texture(&texture);

    draw.to_frame(app, &frame).unwrap();
    if model.egui_visible {
        model.egui.draw_to_frame(&frame).unwrap();
    }
    if model.render {
        let _ = &model
            .image
            .save_with_format(get_path(app), nannou::image::ImageFormat::Png);
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
    } else if key == Key::D {
        model.physarum_settings.model.print_configurations();
    }
}

fn mouse_pressed(_app: &App, _model: &mut Model, button: MouseButton) {
    if button == MouseButton::Left {}
}

fn save_frame(app: &App) {
    let path = get_path(app);
    app.main_window().capture_frame(path);
}

fn get_path(app: &App) -> String {
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
    path
}
