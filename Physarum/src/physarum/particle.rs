use super::util;
use rand::{rngs::SmallRng, Rng};
use std::f32::consts::TAU;

pub struct Particle {
    pub x: f32,
    pub y: f32,
    pub angle: f32,
    pub id: usize,
}

impl Particle {
    pub fn new(width: usize, height: usize, id: usize, rng: &mut SmallRng) -> Self {
        let (x, y, angle) = rng.gen::<(f32, f32, f32)>();
        Particle {
            x: x * width as f32,
            y: y * height as f32,
            angle: angle * TAU,
            id,
        }
    }

    pub fn rotate_and_move(
        &mut self,
        direction: f32,
        rotation_angle: f32,
        step_distance: f32,
        width: usize,
        height: usize,
    ) {
        let delta_angle = rotation_angle * direction;
        self.angle = util::wrap(self.angle + delta_angle, TAU);
        self.x = util::wrap(self.x + step_distance * self.angle.cos(), width as f32);
        self.y = util::wrap(self.y + step_distance * self.angle.sin(), height as f32);
    }
}
