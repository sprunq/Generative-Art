use nannou::prelude::*;
use nannou_egui::{self, egui};
use rand::{rngs::SmallRng, thread_rng, RngCore, SeedableRng};

use crate::{
    physarum::{self, population_config::PopulationConfig},
    Model,
};

pub fn update_gui(model: &mut Model, update: Update) {
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

        ui.add(
            egui::Slider::new(&mut model.steps_per_frame, 0..=10)
                .text("Steps per frame")
                .smart_aim(false),
        );

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

        for i in 0..model.physarum_settings.n_populations {
            ui.add(egui::Separator::default());
            ui.add(egui::Label::new(format!("{}{}", "Grid ", i)));
            model.physarum_settings.config_changed = ui
                .add(
                    egui::Slider::new(
                        &mut model.physarum_settings.configs[i].decay_factor,
                        0.01..=3.0,
                    )
                    .text(format!("{}", "Decay"))
                    .smart_aim(false),
                )
                .changed();
            model.physarum_settings.config_changed = ui
                .add(
                    egui::Slider::new(
                        &mut model.physarum_settings.configs[i].deposition_amount,
                        0.1..=10.0,
                    )
                    .text(format!("{}", "Deposition"))
                    .smart_aim(false),
                )
                .changed();
            model.physarum_settings.config_changed = ui
                .add(
                    egui::Slider::new(
                        &mut model.physarum_settings.configs[i].rotation_angle,
                        0.01..=2.1,
                    )
                    .text(format!("{}", "Rotation Angle"))
                    .smart_aim(false),
                )
                .changed();
            model.physarum_settings.config_changed = ui
                .add(
                    egui::Slider::new(
                        &mut model.physarum_settings.configs[i].sensor_angle,
                        0.01..=2.1,
                    )
                    .text(format!("{}", "Sensor Angle"))
                    .smart_aim(false),
                )
                .changed();
            model.physarum_settings.config_changed = ui
                .add(
                    egui::Slider::new(
                        &mut model.physarum_settings.configs[i].sensor_distance,
                        0.0..=64.0,
                    )
                    .text(format!("{}", "Sensor Distance"))
                    .smart_aim(false),
                )
                .changed();
            model.physarum_settings.config_changed = ui
                .add(
                    egui::Slider::new(
                        &mut model.physarum_settings.configs[i].step_distance,
                        0.2..=2.0,
                    )
                    .text(format!("{}", "Step Distance"))
                    .smart_aim(false),
                )
                .changed();
        }

        if ui.button("Shuffle Configs").clicked() {
            let mut rng_local = SmallRng::seed_from_u64(thread_rng().next_u64());
            (0..5).for_each(|i| {
                model.physarum_settings.configs[i] = PopulationConfig::new(&mut rng_local);
            });
            model.physarum_settings.configs = vec![PopulationConfig::new(&mut rng_local); 5];
            model.physarum_settings.config_changed = true;
            model.changed = true;
        }
        model.changed |= ui.button("Redraw").clicked();
        ui.checkbox(&mut model.render, "Render");
    });
    drop(ctx);
    if model.changed {
        model.reset();
    }
    if model.physarum_settings.config_changed {
        model.physarum_settings.config_changed = false;
        model
            .physarum_settings
            .model
            .set_population_configs(model.physarum_settings.configs.clone());
    }
}
