#[inline(always)]
fn abs(x: f32) -> f32 {
    f32::from_bits(x.to_bits() & 0x7FFF_FFFF)
}

#[inline(always)]
fn floor(x: f32) -> f32 {
    let mut x_trunc = (x as i32) as f32;
    x_trunc -= (x < x_trunc) as i32 as f32;
    x_trunc
}

pub fn cos(mut x: f32) -> f32 {
    const ALPHA: f32 = 0.5 * std::f32::consts::FRAC_1_PI;
    x *= ALPHA;
    x -= 0.25_f32 + floor(x + 0.25_f32);
    x *= 16.0_f32 * (abs(x) - 0.5_f32);
    x += 0.225_f32 * x * (abs(x) - 1.0_f32);
    x
}

pub fn sin(x: f32) -> f32 {
    cos(x - std::f32::consts::FRAC_PI_2)
}
