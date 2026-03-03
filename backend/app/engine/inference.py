from typing import List, Dict, Any, Optional

class KnowledgeRule:
    def __init__(self, id: str, conditions: Dict[str, Any], results: Dict[str, Any], priority: int = 1):
        self.id = id
        self.conditions = conditions  # e.g., {"fever": ">3", "platelets": "<150000"}
        self.results = results        # e.g., {"probability": "high", "stage": "warning"}
        self.priority = priority

    def evaluate(self, facts: Dict[str, Any]) -> bool:
        """Checks if all conditions of the rule are met by current facts."""
        for key, expected_val in self.conditions.items():
            if key not in facts:
                return False
            
            fact_val = facts[key]
            
            # Simple numeric comparisons (supporting strings like >3, <150000)
            if isinstance(expected_val, str):
                if expected_val.startswith(">"):
                    try:
                        if not float(fact_val) > float(expected_val[1:]):
                            return False
                    except (ValueError, TypeError):
                        return False
                elif expected_val.startswith("<"):
                    try:
                        if not float(fact_val) < float(expected_val[1:]):
                            return False
                    except (ValueError, TypeError):
                        return False
                else:
                    if fact_val != expected_val:
                        return False
            else:
                if fact_val != expected_val:
                    return False
        return True

class ForwardChainingEngine:
    """Forward chaining inference engine to derive dengue status."""
    def __init__(self, ruleset: List[KnowledgeRule]):
        self.ruleset = sorted(ruleset, key=lambda x: x.priority, reverse=True)

    def infer(self, initial_facts: Dict[str, Any]) -> Dict[str, Any]:
        """Iteratively apply rules until no more facts can be derived."""
        derived_facts = initial_facts.copy()
        applied_rules = set()
        
        changed = True
        while changed:
            changed = False
            for rule in self.ruleset:
                if rule.id not in applied_rules and rule.evaluate(derived_facts):
                    # Apply results to derived_facts
                    for key, val in rule.results.items():
                        if derived_facts.get(key) != val:
                            derived_facts[key] = val
                            changed = True
                    applied_rules.add(rule.id)
        
        return derived_facts

# Example predefined rules for Dengue KBS
DENGUE_RULES = [
    KnowledgeRule("R1", {"fever_duration": ">3", "platelet_count": "<150000", "headache": True}, {"dengue_probability": "High"}),
    KnowledgeRule("R2", {"platelet_count": "<50000", "bleeding": True}, {"dengue_stage": "Severe"}),
    KnowledgeRule("R3", {"fever_duration": "<3", "platelet_count": ">150000"}, {"dengue_probability": "Low"}),
    KnowledgeRule("R4", {"fever_duration": ">5", "abdominal_pain": True, "vomiting": True}, {"dengue_stage": "Warning"}),
    KnowledgeRule("R5", {"dengue_stage": "Severe"}, {"recommendation": "Emergency hospitalization required."}),
    KnowledgeRule("R6", {"dengue_stage": "Warning"}, {"recommendation": "Close monitoring and hydration. Consult doctor immediately."}),
    KnowledgeRule("R7", {"dengue_probability": "High", "dengue_stage": "Mild"}, {"recommendation": "Rest, fluids, and blood monitoring every 24h."})
]
