use std::ops::{Add, Mul};

use nannou::prelude::*;

#[derive(Clone)]
pub struct Particle {
    pub pos: Vec2,
    pub dir: Vec2,
    pub speed: Vec2,
    pub trail_list: Vec<Vec2>,
}

impl Particle {
    pub fn new(pos: Vec2, dir: Vec2, speed: Vec2) -> Self {
        Self {
            pos,
            dir,
            speed,
            trail_list: Vec::new(),
        }
    }

    pub fn move_particle(&mut self, angle: f32) {
        self.dir.x = angle.cos();
        self.dir.y = angle.sin();
        let mut vel = self.dir.clone();
        vel = vel.mul(self.speed);
        let new_pos = self.pos.add(vel);
        if self.pos.distance(new_pos) > self.speed.x - 0.01 {
            self.trail_list.push(self.pos.clone());
            self.pos = new_pos;
        }
    }
}
