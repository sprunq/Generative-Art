use nannou::color::Rgba;
use nannou::prelude::Vec2;

#[derive(Clone, Debug, PartialEq)]
pub struct PenState {
    pub position: Vec2,
    pub color: Rgba,
    pub rotation: f32,
    pub step: f32,
    pub turning_angle: f32,
}

impl PenState {
    pub fn new() -> PenState {
        PenState {
            position: Vec2::new(0.0, -300.0),
            color: Rgba::new(0.0, 0.0, 0.0, 1.0),
            rotation: 60.0,
            step: 5.0,
            turning_angle: 21.0,
        }
    }

    pub fn set_rotation(&mut self, new_rotation: f32) {
        self.rotation = (new_rotation + 360.0) % 360.0;
    }

    pub fn get_direction(&self) -> Vec2 {
        let x = self.rotation.to_radians().cos();
        let y = self.rotation.to_radians().sin();
        Vec2::new(x * self.step, y * self.step)
    }
}
