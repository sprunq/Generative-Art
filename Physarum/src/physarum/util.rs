use nannou::image;

#[inline(always)]
pub fn wrap(x: f32, max: f32) -> f32 {
    x - max * ((x > max) as i32 as f32 - (x < 0.0_f32) as i32 as f32)
}

pub const fn hex_color(c: usize) -> image::Rgb<u8> {
    let r = (c >> 16) & 0xff;
    let g = (c >> 8) & 0xff;
    let b = (c >> 0) & 0xff;
    image::Rgb::<u8>([r as u8, g as u8, b as u8])
}
