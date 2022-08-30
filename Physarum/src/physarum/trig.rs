/// From https://bits.stephan-brumme.com/absFloat.html
#[inline(always)]
fn abs(x: f32) -> f32 {
    f32::from_bits(x.to_bits() & 0x7FFF_FFFF)
}

/// Branchless floor implementation
#[inline(always)]
fn floor(x: f32) -> f32 {
    let mut x_trunc = (x as i32) as f32;
    x_trunc -= (x < x_trunc) as i32 as f32;
    x_trunc
}

/// Approximates `cos(x)` in radians with the maximum error of `0.002`
/// https://stackoverflow.com/posts/28050328/revisions
pub fn cos(mut x: f32) -> f32 {
    const ALPHA: f32 = 0.5 * std::f32::consts::FRAC_1_PI;
    x *= ALPHA;
    x -= 0.25_f32 + floor(x + 0.25_f32);
    x *= 16.0_f32 * (abs(x) - 0.5_f32);
    x += 0.225_f32 * x * (abs(x) - 1.0_f32);
    x
}

/// Approximates `sin(x)` in radians with the maximum error of `0.002`
pub fn sin(x: f32) -> f32 {
    cos(x - std::f32::consts::FRAC_PI_2)
}

#[cfg(test)]
mod tests {
    use super::*;
    use itertools::repeat_n;

    #[test]
    fn test_cos() {
        let n_points = 1000;
        let x: Vec<f32> = repeat_n(std::f32::consts::TAU / (n_points - 1) as f32, n_points)
            .enumerate()
            .map(|(i, delta)| i as f32 * delta)
            .collect();

        let exact: Vec<f32> = x.iter().map(|v| v.cos()).collect();
        let appr: Vec<f32> = x.iter().map(|v| cos(*v)).collect();

        let mut max_error = 0.0_f32;
        for (y_exact, y_appr) in exact.iter().zip(&appr) {
            max_error = (y_exact - y_appr).abs().max(max_error);
        }

        // The error bound is even better!
        assert!(max_error <= 0.0011);
    }
}
