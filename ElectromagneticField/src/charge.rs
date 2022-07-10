use std::ops::{Add, Mul, Sub};

use nannou::prelude::*;

#[derive(Copy, Clone)]
pub struct Charge {
    pub pos: Vec2,
    vel: Vec2,
    acc: Vec2,
    charge: f32,
}

impl Charge {
    pub fn new(pos: Vec2, charge: f32) -> Self {
        Self {
            pos,
            vel: Vec2::new(0.0, 0.0),
            acc: Vec2::new(0.0, 0.0),
            charge,
        }
    }

    pub fn add_force(&mut self, force: Vec2) {
        self.acc = self.acc.add(force);
    }

    pub fn field_force(&self, pos: Vec2) -> Vec2 {
        let mut disp = pos.sub(self.pos);
        let dist_sq = (pow(disp.x, 2) + pow(disp.y, 2)).sqrt();
        let new_mag = self.charge / dist_sq;
        disp.x = disp.x * new_mag / dist_sq;
        disp.y = disp.y * new_mag / dist_sq;
        return disp;
    }

    pub fn update(&mut self) {
        self.vel = self.vel.add(self.acc);
        self.pos = self.pos.add(self.vel);
        self.acc = self.acc.mul(0.0);
    }

    pub fn render(&self, draw: &Draw) {
        draw.ellipse()
            .xy(self.pos)
            .width(self.charge / 35.0)
            .height(self.charge / 35.0)
            .rgba(0.0, 0.0, 0.0, 1.0);
    }
}
