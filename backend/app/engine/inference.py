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
        set_by_priority = {} # Track priority of rules that set each key
        
        while changed:
            changed = False
            for rule in self.ruleset:
                if rule.id not in applied_rules_ids and rule.evaluate(derived_facts):
                    for key, val in rule.results.items():
                        # Only set if key hasn't been set by a higher priority rule
                        if key not in set_by_priority or rule.priority >= set_by_priority[key]:
                            if derived_facts.get(key) != val:
                                derived_facts[key] = val
                                set_by_priority[key] = rule.priority
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
    # ---- 1. CLINICAL EMERGENCY RULES (TOP PRIORITY) ----
    # Clinical evidence always outweighs AI if life-threatening signs are present
    KnowledgeRule(
        "R_SEVERE_DENGUE_CLINICAL", "WHO Severe Dengue signs (Leakage, Bleeding, Organs).",
        {"severe_dengue_signs": True},
        {
            "disease_detection": "Severe Dengue", 
            "risk_classification": "Critical", 
            "clinical_recommendations": "EMERGENCY: Immediate ICU admission required. Intravenous resuscitation.", 
            "alert_system": "RED ALERT - Clinical Emergency"
        },
        priority=100
    ),
    
    # ---- 2. AI HIGH CONFIDENCE RULES (VERY HIGH PRIORITY: 75-100%) ----
    KnowledgeRule(
        "R_AI_SEVERE_VHIGH", "AI Prediction: Severe Dengue (85-100% confidence).",
        {"ml_prediction": "Severe Dengue", "ml_probability": ">=0.85"},
        {
            "disease_detection": "Severe Dengue (AI High Confidence)", 
            "risk_classification": "Critical", 
            "clinical_recommendations": "Urgent hospitalization and IV fluid management advised based on high-risk prediction.", 
            "alert_system": "RED ALERT - High Confidence Prediction"
        },
        priority=90
    ),

    KnowledgeRule(
        "R_AI_WARNING_VHIGH", "AI Prediction: Warning Stage (75-100% confidence).",
        {"ml_prediction": "Dengue Warning Stage", "ml_probability": ">=0.75"},
        {
            "disease_detection": "Dengue Warning Stage (AI High Confidence)", 
            "risk_classification": "High", 
            "clinical_recommendations": "In-patient monitoring advised. Monitor for signs of plasma leakage.", 
            "alert_system": "AMBER ALERT - High Confidence Prediction"
        },
        priority=80
    ),

    # ---- 3. CLINICAL WARNING RULES (HIGH PRIORITY) ----
    KnowledgeRule(
        "R_WARNING_SIGNS_CLINICAL", "WHO Warning Signs (Abdominal pain, fluid, lethargy).",
        {"has_warning_signs": True},
        {
            "disease_detection": "Dengue with Warning Signs", 
            "risk_classification": "High", 
            "clinical_recommendations": "Admit to hospital. Start IV fluids. Monitor vital signs closely.", 
            "alert_system": "AMBER ALERT - Clinical Warning"
        },
        priority=70
    ),

    KnowledgeRule(
        "R_CRITICAL_PHASE_CLINICAL", "Entering Critical Phase (Fever drops, Hct increases).",
        {"entering_critical_phase": True},
        {
            "disease_detection": "Critical Phase Initiated", 
            "risk_classification": "High", 
            "clinical_recommendations": "Stay alert! Sudden drop in fever with rising blood pressure/Hct is a high-risk transition.", 
            "alert_system": "AMBER ALERT - Phase Transition"
        },
        priority=60
    ),

    # ---- 4. AI MEDIUM CONFIDENCE RULES (MODERATE-HIGH PRIORITY: 40-75%) ----
    KnowledgeRule(
        "R_AI_SEVERE_MED", "AI Prediction: Severe Dengue (50-84% confidence).",
        {"ml_prediction": "Severe Dengue", "ml_probability": ">=0.50"},
        {
            "disease_detection": "Risk of Severe Dengue (AI Predicted)", 
            "risk_classification": "High", 
            "clinical_recommendations": "Consult physician immediately for CBC and clinical assessment. High risk predicted.", 
            "alert_system": "AMBER ALERT - AI Risk Prediction"
        },
        priority=55
    ),

    KnowledgeRule(
        "R_AI_WARNING_MED", "AI Prediction: Warning Stage (40-74% confidence).",
        {"ml_prediction": "Dengue Warning Stage", "ml_probability": ">=0.40"},
        {
            "disease_detection": "Potential Warning Stage (AI Predicted)", 
            "risk_classification": "Moderate", 
            "clinical_recommendations": "Monitor patient closely for any new warning signs (vomiting, pain). Follow-up in 24 hours.", 
            "alert_system": "Standard Evaluation - AI Alert"
        },
        priority=45
    ),

    # ---- 5. STANDARD CLINICAL RULES (MODERATE PRIORITY) ----
    KnowledgeRule(
        "R_PROBABLE_DENGUE_CLINICAL", "Classic clinical Dengue symptoms met.",
        {"endemic_or_travel": True, "has_fever": True, "rule1_symptoms_met": True},
        {
            "disease_detection": "Probable Dengue Infection", 
            "risk_classification": "Moderate", 
            "clinical_recommendations": "Rest and hydration. Daily blood tests (CBC) are recommended.", 
            "alert_system": "Standard Evaluation"
        },
        priority=30
    ),

    KnowledgeRule(
        "R_HOME_MANAGEMENT_CLINICAL", "Probable dengue, safe for home care.",
        {"eligible_home_care": True, "disease_detection": "Probable Dengue Infection"},
        {
            "disease_detection": "Probable Dengue (Home Management)", 
            "risk_classification": "Low", 
            "clinical_recommendations": "Tolerates fluids and urinating regularly. Safe for home hydration. Use Paracetamol only.", 
            "alert_system": "Routine - Home Care Advised"
        },
        priority=35 # Priority between probable and AI alerts to refine recommendation
    ),

    # ---- 6. AI LOW CONFIDENCE / MILD RULES (LOW PRIORITY: 1-40%) ----
    KnowledgeRule(
        "R_AI_SEVERE_LOW", "AI Prediction: Severe Dengue (1-49% confidence).",
        {"ml_prediction": "Severe Dengue", "ml_probability": ">0.0"},
        {
            "disease_detection": "Possible Severe Risk (Low Confidence AI)", 
            "risk_classification": "Moderate", 
            "clinical_recommendations": "AI suggests potential risk despite low confidence. Clinical review recommended.", 
            "alert_system": "Standard Monitoring"
        },
        priority=25
    ),

    KnowledgeRule(
        "R_AI_MILD_ANY", "AI Predicted: Mild Dengue (any percentage).",
        {"ml_prediction": "Mild Dengue", "ml_probability": ">0.0"},
        {
            "disease_detection": "Mild Dengue (AI Predicted)", 
            "risk_classification": "Low", 
            "clinical_recommendations": "Maintain hydration. Rest. Monitor for any worsening symptoms.", 
            "alert_system": "Routine Evaluation"
        },
        priority=20
    ),

    KnowledgeRule(
        "R_AI_NO_DENGUE", "AI Predicted: No Dengue (any percentage).",
        {"ml_prediction": "No Dengue", "ml_probability": ">0.0"},
        {
            "disease_detection": "Dengue Unlikely (AI Predicted)", 
            "risk_classification": "Low", 
            "clinical_recommendations": "Symptoms may be due to other viral infections. Rest and re-evaluate if fever persists.", 
            "alert_system": "Routine Evaluation"
        },
        priority=10
    ),

    # ---- 7. DEFAULT NO RISK RULE ----
    KnowledgeRule(
        "R_NO_RISK_FALLBACK", "No major criteria met (Default).",
        {"has_fever": False, "rule1_symptoms_met": False, "has_warning_signs": False},
        {
            "disease_detection": "Inconclusive / Other Viral Fever", 
            "risk_classification": "Low", 
            "clinical_recommendations": "Observe for next 24-48 hours. Use mosquito nets. Seek care if warning signs appear.", 
            "alert_system": "Routine"
        },
        priority=0
    )
]
