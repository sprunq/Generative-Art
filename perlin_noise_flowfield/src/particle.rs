use std::ops::{Add, Mul};

use nannou::prelude::*;

#[derive(Clone)]
pub struct Particle {
    pub pos: DVec2,
    pub trail_list: Vec<Vec2>,
    dir: DVec2,
    speed: DVec2,
    trail_len: usize,
}

impl Particle {
    pub fn new(pos: DVec2, dir: DVec2, speed: DVec2, trail_len: usize) -> Self {
        Self {
            pos,
            dir,
            speed,
            trail_list: Vec::new(),
            trail_len,
        }
    }

    pub fn move_particle(&mut self, angle: f64) {
        self.trail_list.push(self.pos.clone().as_f32());
        if self.trail_list.len() > self.trail_len {
            self.trail_list.remove(0);
        }
        self.dir.x = angle.cos();
        self.dir.y = angle.sin();

        //self.dir.x = angle.cos() * angle.tan() * 0.1;
        //self.dir.y = self.dir.x.sin() * angle.cos();

        let mut vel = self.dir.clone();
        vel = vel.mul(self.speed);
        self.pos = self.pos.add(vel);
    }
}
