use nannou::image;
use rand::rngs::SmallRng;
use rand::seq::SliceRandom;
use rand::Rng;

#[derive(Clone, Copy)]
pub struct Palette {
    pub colors: [image::Rgb<u8>; 5],
}

pub fn random_palette(rng: &mut SmallRng) -> Palette {
    let mut palette = PALETTES[rng.gen_range(0..PALETTES.len())];
    palette.colors.shuffle(rng);
    palette
}

const fn hex_to_color(c: usize) -> image::Rgb<u8> {
    let r = (c >> 16) & 0xff;
    let g = (c >> 8) & 0xff;
    let b = (c >> 0) & 0xff;
    image::Rgb::<u8>([r as u8, g as u8, b as u8])
}

pub const PALETTES: [Palette; 10] = [
    Palette {
        colors: [
            hex_to_color(0xFA2B31),
            hex_to_color(0xFFBF1F),
            hex_to_color(0xFFF146),
            hex_to_color(0xABE319),
            hex_to_color(0x00C481),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0x8fb2f7),
            hex_to_color(0x1F8A70),
            hex_to_color(0xBEDB39),
            hex_to_color(0xFFE11A),
            hex_to_color(0xFD7400),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0xfac287),
            hex_to_color(0x9d1df2),
            hex_to_color(0xBEDB39),
            hex_to_color(0xFFE11A),
            hex_to_color(0xFD7400),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0x4dc6eb),
            hex_to_color(0x3be36b),
            hex_to_color(0xBEDB39),
            hex_to_color(0xFFE11A),
            hex_to_color(0xFD7400),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0x334D5C),
            hex_to_color(0x45B29D),
            hex_to_color(0xEFC94C),
            hex_to_color(0xE27A3F),
            hex_to_color(0xDF5A49),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0xFF8000),
            hex_to_color(0xFFD933),
            hex_to_color(0xCCCC52),
            hex_to_color(0x8FB359),
            hex_to_color(0x192B33),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0x730046),
            hex_to_color(0xBFBB11),
            hex_to_color(0xFFC200),
            hex_to_color(0xE88801),
            hex_to_color(0xC93C00),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0xE6DD00),
            hex_to_color(0x8CB302),
            hex_to_color(0x008C74),
            hex_to_color(0x004C66),
            hex_to_color(0x332B40),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0xF15A5A),
            hex_to_color(0xF0C419),
            hex_to_color(0x4EBA6F),
            hex_to_color(0x2D95BF),
            hex_to_color(0x955BA5),
        ],
    },
    Palette {
        colors: [
            hex_to_color(0xF41C54),
            hex_to_color(0xFF9F00),
            hex_to_color(0xFBD506),
            hex_to_color(0xA8BF12),
            hex_to_color(0x00AAB5),
        ],
    },
];
