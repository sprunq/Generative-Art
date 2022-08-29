use std::collections::HashMap;

#[derive(Clone, Debug)]
pub struct LSystemRules {
    rules: HashMap<char, Vec<char>>,
}

impl LSystemRules {
    pub fn new() -> LSystemRules {
        LSystemRules {
            rules: HashMap::new(),
        }
    }

    pub fn add_rule(&mut self, original: char, transformation: Vec<char>) {
        self.rules.insert(original, transformation);
    }

    pub fn get_rule_mutation(&self, symbol: char) -> Vec<char> {
        let next_gen = self.rules.get(&symbol);
        match next_gen {
            Some(value) => value.clone(),
            None => vec![symbol],
        }
    }
}
