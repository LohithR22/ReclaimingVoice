# File: agents/coordinator.py
from agents.exercise_generator import DisorderAgent
import chromadb
from chromadb.config import Settings

class MultiDisorderCoordinator:
    def __init__(self):
        self.chroma_client = chromadb.PersistentClient(
            path="chroma_db",
            settings=Settings(allow_reset=False)
        )
        self.agents = {
            "articulation": self._create_agent("Articulation"),
            "fluency": self._create_agent("Fluency_disorders"),
            "voice": self._create_agent("Voice_disorders"),
            "language": self._create_agent("Language_disorders"),
            "motor_speech": self._create_agent("Motor_speech_disorder"),
        }

    def _create_agent(self, collection_name):
        return DisorderAgent(collection_name)

    def get_weekly_plan(self, disorder_type, patient_data):
        return self.agents[disorder_type].generate_exercises(patient_data)
