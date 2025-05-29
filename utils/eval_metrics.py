# File: utils/eval_metrics.py
def validate_plan(plan_text):
    required_elements = {
        "articulation": ["drill", "sound position", "repetitions"],
        "fluency": ["technique", "pace control", "monitoring"],
        "voice": ["hydration", "rest periods", "posture"]
    }
    return all(element in plan_text.lower() for element in required_elements)
