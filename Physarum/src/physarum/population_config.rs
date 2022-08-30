use rand::Rng;
use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub struct PopulationConfig {
    pub sensor_distance: f32,
    pub step_distance: f32,
    pub sensor_angle: f32,
    pub rotation_angle: f32,

    pub decay_factor: f32,
    pub deposition_amount: f32,
}

impl Display for PopulationConfig {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{{\n  Sensor Distance: {},\n  Step Distance: {},\n  Sensor Angle: {},\n  Rotation Angle: {},\n  Decay Factor: {},\n  Deposition Amount: {},\n}}",
            self.sensor_distance,
            self.step_distance,
            self.sensor_angle,
            self.rotation_angle,
            self.decay_factor,
            self.deposition_amount
        )
    }
}

impl PopulationConfig {
    const SENSOR_ANGLE_MIN: f32 = 0.0;
    const SENSOR_ANGLE_MAX: f32 = 120.0;
    const SENSOR_DISTANCE_MIN: f32 = 0.0;
    const SENSOR_DISTANCE_MAX: f32 = 64.0;
    const ROTATION_ANGLE_MIN: f32 = 0.0;
    const ROTATION_ANGLE_MAX: f32 = 120.0;
    const STEP_DISTANCE_MIN: f32 = 0.2;
    const STEP_DISTANCE_MAX: f32 = 2.0;
    const DEPOSITION_AMOUNT_MIN: f32 = 5.0;
    const DEPOSITION_AMOUNT_MAX: f32 = 5.0;
    const DECAY_FACTOR_MIN: f32 = 0.1;
    const DECAY_FACTOR_MAX: f32 = 0.1;

    /// Construct a random configuration.
    pub fn new<R: Rng + ?Sized>(rng: &mut R) -> Self {
        PopulationConfig {
            sensor_distance: rng.gen_range(Self::SENSOR_DISTANCE_MIN..=Self::SENSOR_DISTANCE_MAX),
            step_distance: rng.gen_range(Self::STEP_DISTANCE_MIN..=Self::STEP_DISTANCE_MAX),
            decay_factor: rng.gen_range(Self::DECAY_FACTOR_MIN..=Self::DECAY_FACTOR_MAX),
            sensor_angle: rng
                .gen_range(Self::SENSOR_ANGLE_MIN..=Self::SENSOR_ANGLE_MAX)
                .to_radians(),
            rotation_angle: rng
                .gen_range(Self::ROTATION_ANGLE_MIN..=Self::ROTATION_ANGLE_MAX)
                .to_radians(),
            deposition_amount: rng
                .gen_range(Self::DEPOSITION_AMOUNT_MIN..=Self::DEPOSITION_AMOUNT_MAX),
        }
    }
}
