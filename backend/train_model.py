import sys
import os
import time

# Add the app directory to sys.path to allow imports
sys.path.append(os.path.join(os.getcwd(), 'app'))

# Ensure we're in the backend directory if running from project root
if not os.path.exists('data'):
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(backend_dir)

from app.ml.model import train_dengue_model

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  DENGUE AI MODEL -- TRAINING TOOL v2.0")
    print("=" * 60)
    print("  Working directory: " + os.getcwd())
    print("  Data directory:    " + os.path.join(os.getcwd(), 'data'))
    print()

    start = time.time()
    try:
        model = train_dengue_model()
        elapsed = time.time() - start
        print("  Total training time: {:.1f} seconds".format(elapsed))
        print("  [OK] Model trained and saved in data/dengue_model.pkl")
        print("  [OK] Metadata saved in data/model_meta.json")
    except Exception as e:
        elapsed = time.time() - start
        print("\n  [ERROR] Error during training ({:.1f}s): {}".format(elapsed, e))
        import traceback
        traceback.print_exc()
