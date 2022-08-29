use super::l_system_rules::LSystemRules;

#[derive(Clone, Debug)]
pub struct LSystem {
    pub rules: LSystemRules,
    pub axiom: Vec<char>,
    pub generations: usize,
    pub gen_chars: Vec<char>,
    indexes: Vec<usize>,
}

impl LSystem {
    pub fn new(axiom: Vec<char>, rules: LSystemRules, generations: usize) -> LSystem {
        LSystem {
            generations,
            indexes: vec![0; generations],
            axiom,
            gen_chars: vec![],
            rules,
        }
    }

    pub fn reset(&mut self) {
        self.indexes = vec![0; self.generations];
        self.gen_chars = vec![];
    }

    fn increment(&mut self, lengths: &[usize]) {
        self.indexes[self.generations - 1] += 1;

        for i in (0..self.generations).rev() {
            if i > 0 && self.indexes[i] >= lengths[i] {
                self.indexes[i] = 0;
                self.indexes[i - 1] += 1;
            }
        }
    }

    pub fn iterate_all_gens(&mut self) -> Vec<char> {
        self.reset();

        while let Some(symbols) = self.iterate_one_gen() {
            let mut s = symbols.clone();
            self.gen_chars.append(&mut s);
        }
        return self.gen_chars.clone();
    }

    pub fn iterate_one_gen(&mut self) -> Option<Vec<char>> {
        let mut sys = self.axiom.clone();
        if self.indexes[0] >= sys.len() {
            return None;
        }

        let mut lengths = vec![0; self.generations];
        for (n, len) in lengths.iter_mut().enumerate() {
            let index = self.indexes[n];
            let future = self.rules.get_rule_mutation(sys[index].clone());
            *len = sys.len();
            sys = future;
        }

        self.increment(&lengths);
        Some(sys)
    }
}
