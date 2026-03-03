import sys
import os

# Add the app directory to sys.path to allow imports
sys.path.append(os.path.join(os.getcwd(), 'app'))

from app.ml.model import train_dengue_model

if __name__ == "__main__":
    print("--- Dengue AI Model Training Tool ---")
    try:
        train_dengue_model()
        print("Success: Model trained and saved in data/dengue_model.pkl")
    except Exception as e:
        print(f"Error during training: {e}")
