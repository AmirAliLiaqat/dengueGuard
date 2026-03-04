from typing import List, Dict, Any, Tuple

class KnowledgeRule:
    def __init__(self, id: str, description: str, conditions: Dict[str, Any], results: Dict[str, Any], priority: int = 1):
        self.id = id
        self.description = description
        self.conditions = conditions
        self.results = results
        self.priority = priority

    def evaluate(self, facts: Dict[str, Any]) -> bool:
        """Checks if all conditions of the rule are met by current facts."""
        for key, expected_val in self.conditions.items():
            if key not in facts:
                return False
            
            fact_val = facts[key]
            
            if isinstance(expected_val, str):
                if expected_val.startswith(">="):
                    try:
                        if not float(fact_val) >= float(expected_val[2:]):
                            return False
                    except (ValueError, TypeError):
                        return False
                elif expected_val.startswith("<="):
                    try:
                        if not float(fact_val) <= float(expected_val[2:]):
                            return False
                    except (ValueError, TypeError):
                        return False
                elif expected_val.startswith(">"):
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
                    if str(fact_val).lower() != str(expected_val).lower():
                        return False
            elif isinstance(expected_val, list):
                if fact_val not in expected_val:
                    return False
            else:
                if fact_val != expected_val:
                    return False
        return True

class ForwardChainingEngine:
    """Forward chaining inference engine for Dengue classification."""
    def __init__(self, ruleset: List[KnowledgeRule]):
        self.ruleset = sorted(ruleset, key=lambda x: x.priority, reverse=True)

    def infer(self, initial_facts: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
        """Iteratively apply rules until no more facts can be derived."""
        derived_facts = initial_facts.copy()
        applied_rules_log = []
        applied_rules_ids = set()
        
        self._preprocess_facts(derived_facts)

        changed = True
        while changed:
            changed = False
            for rule in self.ruleset:
                if rule.id not in applied_rules_ids and rule.evaluate(derived_facts):
                    for key, val in rule.results.items():
                        if derived_facts.get(key) != val:
                            derived_facts[key] = val
                            changed = True
                    applied_rules_ids.add(rule.id)
                    applied_rules_log.append(f"Rule {rule.id}: {rule.description}")
        
        return derived_facts, applied_rules_log
        
    def _preprocess_facts(self, facts: Dict[str, Any]):
        def is_true(key):
            return facts.get(key) in [True, "true", "True", 1, "yes", "Yes"]

        # Rule 1 Prerequisites: Probable Dengue
        facts["endemic_or_travel"] = any([is_true("recent_travel"), is_true("local_dengue_outbreak"), is_true("mosquito_exposure")])
        facts["has_fever"] = is_true("fever") or (facts.get("body_temperature") and float(facts.get("body_temperature", 0)) >= 38.0)
        
        # At least 2 of: Nausea/Vomiting, Rash, Aches/Pains, Positive tourniquet test, Leukopenia
        rule1_symptoms = 0
        if is_true("nausea") or is_true("vomiting"): rule1_symptoms += 1
        if is_true("skin_rash"): rule1_symptoms += 1
        if is_true("muscle_pain") or is_true("joint_pain") or is_true("headache"): rule1_symptoms += 1
        if is_true("positive_tourniquet_test"): rule1_symptoms += 1
        
        wbc = facts.get("white_blood_cell_count")
        if wbc is not None and str(wbc).strip() != "":
            if float(wbc) < 4000:
                facts["leukopenia"] = True
                rule1_symptoms += 1
        
        if rule1_symptoms >= 2:
            facts["rule1_symptoms_met"] = True
        else:
            facts["rule1_symptoms_met"] = False

        # Rule 2 Prerequisites: Warning Signs
        warning_signs = [
            is_true("abdominal_pain"),
            is_true("persistent_vomiting"),
            is_true("clinical_fluid_accumulation"),
            is_true("bleeding_signs") or is_true("mucosal_bleeding"),
            is_true("lethargy_or_restlessness"),
            is_true("liver_enlargement")
        ]
        
        # Rising hematocrit with rapid platelet decrease
        if is_true("hematocrit_increases") and is_true("platelet_decreases"):
            warning_signs.append(True)
            
        if any(warning_signs):
            facts["has_warning_signs"] = True
            facts["rule1_symptoms_met"] = True # Any warning sign counts towards Rule 1

        # Rule 3 Prerequisites: Severe Dengue
        severe_signs = [
            is_true("severe_plasma_leakage"),
            is_true("shock_dss"),
            is_true("respiratory_distress"),
            is_true("severe_bleeding"),
            is_true("ast_alt_1000"),
            is_true("impaired_consciousness"),
            is_true("heart_involvement")
        ]
        if any(severe_signs):
            facts["severe_dengue_signs"] = True

        # Rule 4: Critical Phase
        if is_true("fever_drops") and is_true("hematocrit_increases") and is_true("platelet_decreases"):
            facts["entering_critical_phase"] = True

        # Rule 5: Group A Home Management
        if not facts.get("has_warning_signs", False) and is_true("tolerates_oral_fluids") and is_true("urinating_regularly"):
            facts["eligible_home_care"] = True

DENGUE_RULES = [
    # ---- 1. PROBABLE DENGUE RULE ----
    KnowledgeRule(
        "R_PROBABLE_DENGUE", "Patient lives in/travelled to endemic area, has fever, and at least 2 classic symptoms/signs.",
        {"endemic_or_travel": True, "has_fever": True, "rule1_symptoms_met": True},
        {
            "disease_detection": "Probable Dengue Infection", 
            "risk_classification": "Moderate", 
            "clinical_recommendations": "Rest, adequate oral hydration. Check daily CBC.", 
            "alert_system": "Standard Evaluation - Probable Dengue"
        },
        priority=1
    ),
    
    # ---- 5. HOME CARE RULE ----
    KnowledgeRule(
        "R_HOME_MANAGEMENT", "No warning signs, tolerates fluids, regular urination.",
        {"eligible_home_care": True, "disease_detection": "Probable Dengue Infection"},
        {
            "disease_detection": "Group A: Probable Dengue for Home Management", 
            "risk_classification": "Low - Moderate", 
            "clinical_recommendations": "Safe for home care. Hydrate, rest, take paracetamol (no NSAIDs). Return immediately if warning signs develop.", 
            "alert_system": "Routine - Home Care Advised"
        },
        priority=2
    ),

    # ---- 2. WARNING SIGNS RULE ----
    KnowledgeRule(
        "R_WARNING_SIGNS", "Patient exhibits confirmed WHO Warning Signs.",
        {"has_warning_signs": True},
        {
            "disease_detection": "Dengue with Warning Signs", 
            "risk_classification": "High", 
            "clinical_recommendations": "Strict observation needed. Admit to hospital. Intravenous (IV) fluid replacement and hemodynamics monitoring required.", 
            "alert_system": "Amber Alert - Urgent Hospitalization!"
        },
        priority=3
    ),
    
    # ---- 4. CRITICAL PHASE RULE ----
    KnowledgeRule(
        "R_CRITICAL_PHASE", "Defervescence phase with rising hematocrit and dropping platelets.",
        {"entering_critical_phase": True},
        {
            "disease_detection": "Dengue Critical Phase (Risk of Plasma Leakage)", 
            "risk_classification": "High", 
            "clinical_recommendations": "Close monitoring required. Patient is entering the critical phase; high risk for plasma leakage. Monitor hematocrit and IV fluids carefully.", 
            "alert_system": "Amber/Red Alert - Critical Phase Initiated!"
        },
        priority=4
    ),

    # ---- 3. SEVERE DENGUE RULE ----
    KnowledgeRule(
        "R_SEVERE_DENGUE", "Severe plasma leakage, bleeding, or organ involvement.",
        {"severe_dengue_signs": True},
        {
            "disease_detection": "Severe Dengue", 
            "risk_classification": "Critical", 
            "clinical_recommendations": "EMERGENCY: Immediate admission to Intensive Care Unit (ICU). Resuscitation with IV fluids/colloids or blood products. Organ support may be needed.", 
            "alert_system": "RED ALERT - Medical Emergency / ICU Admission Required!"
        },
        priority=5
    ),
    
    # ---- NO RISK RULE ----
    KnowledgeRule(
        "R_NO_RISK", "No major dengue criteria met",
        {"has_fever": False, "rule1_symptoms_met": False, "has_warning_signs": False, "severe_dengue_signs": False},
        {
            "disease_detection": "Unlikely Dengue / Normal", 
            "risk_classification": "Low", 
            "clinical_recommendations": "Monitor patient. If symptoms persist or fever develops, re-evaluate.", 
            "alert_system": "Routine Evaluation"
        },
        priority=0
    )
]
