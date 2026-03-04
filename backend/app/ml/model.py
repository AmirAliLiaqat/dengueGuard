import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

# --- SYNTHETIC DATA GENERATOR ---
# In a real-world scenario, we'd load this from Kaggle or a hospital database
def generate_synthetic_dengue_data(n_samples=1000):
    np.random.seed(42)
    
    # Feature generation
    data = {
        'fever_duration': np.random.randint(1, 10, n_samples),
        'platelet_count': np.random.randint(20000, 250000, n_samples),
        'wbc_count': np.random.randint(2000, 10000, n_samples),
        'hematocrit_level': np.random.normal(40, 5, n_samples),
        'headache': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
        'vomiting': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'muscle_pain': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
        'rash': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
        'bleeding': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
    }
    
    df = pd.DataFrame(data)
    
    # Heuristic target: Likelihood of dengue (simplified classification)
    # 0: No Dengue, 1: Mild, 2: Warning, 3: Severe
    def calculate_target(row):
        score = 0
        if row['platelet_count'] < 50000: score += 10
        elif row['platelet_count'] < 100000: score += 5
        
        if row['fever_duration'] > 3: score += 5
        if row['bleeding'] == 1: score += 10
        if row['wbc_count'] < 4000: score += 5
        if row['hematocrit_level'] > 45: score += 5
        
        if score > 20: return 3  # Severe
        if score > 12: return 2  # Warning
        if score > 5: return 1   # Mild
        return 0                # No Dengue
    
    df['target'] = df.apply(calculate_target, axis=1)
    return df

# --- TRAINING PIPELINE ---
def train_dengue_model():
    print("Generating synthetic dataset...")
    df = generate_synthetic_dengue_data(2000)
    
    X = df.drop('target', axis=1)
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    os.makedirs('data', exist_ok=True)
    import joblib
    joblib.dump(model, 'data/dengue_model.pkl')
    print("Model saved to 'data/dengue_model.pkl'")
    return model

class DenguePredictor:
    """Utility class to load and use the trained model."""
    def __init__(self, model_path='data/dengue_model.pkl'):
        try:
            import joblib
            self.model = joblib.load(model_path)
        except FileNotFoundError:
            self.model = None

    def predict(self, features: dict):
        if self.model is None:
            return {"error": "Model not loaded. Please train first."}
        
        # Map frontend payload keys to model feature columns
        model_input = {
            'fever_duration': 5 if features.get('fever') else 0, # Approx if fever is present
            'platelet_count': features.get('platelet_count') or 150000.0, # Normal average baseline
            'wbc_count': features.get('white_blood_cell_count') or 6000.0,
            'hematocrit_level': features.get('hematocrit_level') or 42.0,
            'headache': 1 if features.get('headache') else 0,
            'vomiting': 1 if features.get('vomiting') or features.get('persistent_vomiting') else 0,
            'muscle_pain': 1 if features.get('muscle_pain') else 0,
            'rash': 1 if features.get('skin_rash') else 0,
            'bleeding': 1 if features.get('mucosal_bleeding') or features.get('severe_bleeding') else 0,
        }
        
        input_df = pd.DataFrame([model_input])
        prediction = self.model.predict(input_df)[0]
        probabilities = self.model.predict_proba(input_df)[0]
        
        stages = ["No Dengue", "Mild Dengue", "Dengue Warning Stage", "Severe Dengue"]
        return {
            "prediction_class": int(prediction),
            "stage_name": stages[prediction],
            "probability": float(np.max(probabilities)),
            "all_probabilities": dict(zip(stages, probabilities.tolist()))
        }

if __name__ == "__main__":
    train_dengue_model()
