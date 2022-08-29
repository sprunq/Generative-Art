use super::pen_state::PenState;
use nannou::color::Rgba;
use nannou::prelude::Vec2;
use rand::rngs::SmallRng;
use rand::Rng;

pub struct Turtle {
    pen: PenState,
    stack: Vec<PenState>,
}

impl Turtle {
    pub fn new(pen: PenState) -> Turtle {
        Turtle {
            pen,
            stack: Vec::new(),
        }
    }

    pub fn get_strokes(
        &mut self,
        symbols: Vec<char>,
        rng: &mut SmallRng,
    ) -> Vec<(Vec2, Vec2, Rgba)> {
        let mut strokes = Vec::new();
        for s in symbols {
            if let Some(value) = self.get_stroke_for_char(s, rng) {
                strokes.push(value)
            }
        }
        return strokes;
    }

    pub fn get_stroke_for_char(
        &mut self,
        symbol: char,
        rng: &mut SmallRng,
    ) -> Option<(Vec2, Vec2, Rgba)> {
        match symbol {
            'F' => {
                let n_pos = self.pen.position + self.pen.get_direction();
                let p = (self.pen.position, n_pos, self.pen.color);
                self.pen.position = n_pos;
                return Some(p);
            }
            '+' => {
                self.pen.set_rotation(
                    self.pen.rotation + self.pen.turning_angle * rng.gen_range(-2.0..2.0),
                );
                return None;
            }
            '-' => {
                self.pen.set_rotation(
                    self.pen.rotation - self.pen.turning_angle * rng.gen_range(-2.0..2.0),
                );
                return None;
            }
            'g' => {
                self.pen
                    .set_rotation(self.pen.rotation + 4.5 * rng.gen_range(0.0..1.0));
                return None;
            }
            'h' => {
                self.pen
                    .set_rotation(self.pen.rotation - 3.0 * rng.gen_range(0.0..1.0));
                return None;
            }

            '[' => {
                self.stack.push(self.pen.clone());
                return None;
            }
            ']' => {
                self.pen = self
                    .stack
                    .pop()
                    .expect("A stack pop was invoked but there are no states on the stack");
                return None;
            }
            '0' => {
                self.pen.color = Rgba::new(0.1, 0.5, 0.0, 1.0);
                return None;
            }
            '1' => {
                self.pen.color = Rgba::new(0.6, 0.95, 0.5, 1.0);
                return None;
            }
            '2' => {
                self.pen.color = Rgba::new(0.4, 0.9, 0.3, 1.0);
                return None;
            }
            _ => {
                return None;
            }
        };
    }
}
