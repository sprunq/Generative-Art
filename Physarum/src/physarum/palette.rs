use super::util::hex_color;
use nannou::image;
use rand::rngs::SmallRng;
use rand::seq::SliceRandom;
use rand::Rng;

#[derive(Clone, Copy)]
pub struct Palette {
    pub colors: [image::Rgb<u8>; 5],
}

pub fn random_palette(rng: &mut SmallRng) -> Palette {
    let mut palette = PALETTE_ARRAY[rng.gen_range(0..PALETTE_ARRAY.len())];
    palette.colors.shuffle(rng);
    palette
}

pub const PALETTE_ARRAY: [Palette; 10] = [
    Palette {
        colors: [
            hex_color(0xFA2B31),
            hex_color(0xFFBF1F),
            hex_color(0xFFF146),
            hex_color(0xABE319),
            hex_color(0x00C481),
        ],
    },
    Palette {
        colors: [
            hex_color(0x8fb2f7),
            hex_color(0x1F8A70),
            hex_color(0xBEDB39),
            hex_color(0xFFE11A),
            hex_color(0xFD7400),
        ],
    },
    Palette {
        colors: [
            hex_color(0xfac287),
            hex_color(0x9d1df2),
            hex_color(0xBEDB39),
            hex_color(0xFFE11A),
            hex_color(0xFD7400),
        ],
    },
    Palette {
        colors: [
            hex_color(0x4dc6eb),
            hex_color(0x3be36b),
            hex_color(0xBEDB39),
            hex_color(0xFFE11A),
            hex_color(0xFD7400),
        ],
    },
    Palette {
        colors: [
            hex_color(0x334D5C),
            hex_color(0x45B29D),
            hex_color(0xEFC94C),
            hex_color(0xE27A3F),
            hex_color(0xDF5A49),
        ],
    },
    Palette {
        colors: [
            hex_color(0xFF8000),
            hex_color(0xFFD933),
            hex_color(0xCCCC52),
            hex_color(0x8FB359),
            hex_color(0x192B33),
        ],
    },
    Palette {
        colors: [
            hex_color(0x730046),
            hex_color(0xBFBB11),
            hex_color(0xFFC200),
            hex_color(0xE88801),
            hex_color(0xC93C00),
        ],
    },
    Palette {
        colors: [
            hex_color(0xE6DD00),
            hex_color(0x8CB302),
            hex_color(0x008C74),
            hex_color(0x004C66),
            hex_color(0x332B40),
        ],
    },
    Palette {
        colors: [
            hex_color(0xF15A5A),
            hex_color(0xF0C419),
            hex_color(0x4EBA6F),
            hex_color(0x2D95BF),
            hex_color(0x955BA5),
        ],
    },
    Palette {
        colors: [
            hex_color(0xF41C54),
            hex_color(0xFF9F00),
            hex_color(0xFBD506),
            hex_color(0xA8BF12),
            hex_color(0x00AAB5),
        ],
    },
];
