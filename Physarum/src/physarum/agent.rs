use super::util;
use rand::Rng;
use std::f32::consts::TAU;

pub struct Agent {
    pub x: f32,
    pub y: f32,
    pub angle: f32,
    pub id: usize,
}

impl Agent {
    pub fn new<R: Rng + ?Sized>(width: usize, height: usize, id: usize, rng: &mut R) -> Self {
        let (x, y, angle) = rng.gen::<(f32, f32, f32)>();
        Agent {
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
