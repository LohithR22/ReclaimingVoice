# File: agents/exercise_generator.py
import os
from dotenv import load_dotenv
from openai import OpenAI  # Changed from Groq to OpenAI
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import chromadb
from sentence_transformers import SentenceTransformer

load_dotenv()

class DisorderAgent:
    def __init__(self, collection_name):
        # Initialize OpenAI client instead of Groq
        self.client = OpenAI(
            api_key="AIzaSyCs6BZTPH7x8sY9HmejW-RO_kSW1Luul70",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        
        self.collection_name = collection_name
        
        # Initialize ChromaDB vector store
        self.vector_store = ChromaVectorStore(
            chroma_collection=chromadb.PersistentClient(path="chroma_db").get_collection(collection_name)
        )
        
        # Embedding model configuration
        self.embed_model = HuggingFaceEmbedding(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            embed_batch_size=32
        )
        
        # Create vector store index
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store,
            embed_model=self.embed_model
        )

    def _build_articulation_prompt(self, context, patient_profile):
        return f"""
        **Patient Profile**:
        - Age: {patient_profile.get('age', "[Patient's age]")}
        - Disorder: {patient_profile.get('disorder', "[Specific articulation challenge]")}
        - Severity: {patient_profile.get('severity', "[Mild/Moderate/Severe]")}
        - Co-occurring conditions: {patient_profile.get('co_occurring_conditions', "[e.g., phonological disorder]")}
        - Patient preferences: {patient_profile.get('preferences', "[e.g., prefers gamified activities]")}

        **Relevant Context**:
        {context}

        **4-Week Articulation Therapy Plan**:

        1. **Weekly Goals & Focus Areas**
        - **Week 1:**
          - Target sounds: /r/ in isolation
          - Therapy focus: Improve tongue placement for /r/ using tactile cues
          - Home practice: 
            - Use engaging articulation apps to practice /r/ sounds.
            - Interactive storytelling sessions focusing on /r/ sound.
            - Daily mirror drills to visualize tongue placement.
        - **Week 2:**
          - Target sounds: /r/ in syllables
          - Therapy focus: Enhance /r/ accuracy in syllables
          - Home practice:
            - Gamified articulation apps focusing on syllable practice.
            - Word repetition exercises with visual aids.
            - Use of recording devices to self-monitor progress.
        - **Week 3:**
          - Target sounds: /r/ in words
          - Therapy focus: Achieve clarity in word-level pronunciation
          - Home practice:
            - Role-play scenarios using words with /r/.
            - Articulation games that reward correct pronunciation.
            - Flashcard drills to reinforce word-level accuracy.
            - Conversational exercises in natural settings.
            - Use of RTM tools for remote feedback and correction.
        - **References**:
          - print the references in the format of [1] [2] [3] etc.which is being taken from the context of the vector database.

        **Instructions for AI**:
        - Focus on generating detailed and engaging exercises for each week.
        - Ensure exercises are tailored to the patient's age, disorder, and preferences.
        - Include specific activities, tools, and techniques for each session.
        - Provide clear progress metrics and expected outcomes.
        """

    def _build_fluency_prompt(self, context, patient_profile):
        return f"""
        **Patient Profile**:
        - Age: {patient_profile.get('age', "[Patient's age]")}
        - Disorder: {patient_profile.get('disorder', "[Specific fluency challenge]")}
        - Severity: {patient_profile.get('severity', "[Mild/Moderate/Severe]")}
        - Co-occurring conditions: {patient_profile.get('co_occurring_conditions', "[e.g., anxiety]")}
        - Patient preferences: {patient_profile.get('preferences', "[e.g., prefers rhythmic activities]")}

        **Relevant Context**:
        {context}

        **4-Week Fluency Therapy Plan**:

        1. **Weekly Goals & Focus Areas**
        - **Week 1:**
          - Focus on breath control and smooth speech initiation
          - Home practice: 
            - Breathing exercises to support fluency.
            - Use of metronome for rhythmic speech practice.
            - Daily reading aloud with focus on smooth transitions.
        - **Week 2:**
          - Focus on reducing speech rate and increasing pauses
          - Home practice:
            - Slow speech exercises with visual pacing aids.
            - Pausing techniques during conversation.
            - Use of speech apps for real-time feedback.
        - **Week 3:**
          - Focus on managing stuttering moments
          - Home practice:
            - Voluntary stuttering exercises to reduce fear.
            - Role-play scenarios to practice fluency strategies.
            - Use of video feedback to self-monitor progress.
        - **Week 4:**
          - Focus on generalizing fluency strategies to daily life
          - Home practice:
            - Conversational practice in various settings.
            - Use of fluency-enhancing devices.
            - Participation in group activities to build confidence.

        **Instructions for AI**:
        - Focus on generating detailed and engaging exercises for each week.
        - Ensure exercises are tailored to the patient's age, disorder, and preferences.
        - Include specific activities, tools, and techniques for each session.
        - Provide clear progress metrics and expected outcomes.
        """

    def _build_voice_prompt(self, context, patient_profile):
        return f"""
        **Patient Profile**:
        - Age: {patient_profile.get('age', "[Patient's age]")}
        - Disorder: {patient_profile.get('disorder', "[Specific voice challenge]")}
        - Severity: {patient_profile.get('severity', "[Mild/Moderate/Severe]")}
        - Co-occurring conditions: {patient_profile.get('co_occurring_conditions', "[e.g., vocal strain]")}
        - Patient preferences: {patient_profile.get('preferences', "[e.g., prefers singing exercises]")}

        **Relevant Context**:
        {context}

        **4-Week Voice Therapy Plan**:

        1. **Weekly Goals & Focus Areas**
        - **Week 1:**
          - Focus on vocal hygiene and healthy voice use
          - Home practice: 
            - Hydration and vocal rest strategies.
            - Gentle humming exercises to warm up the voice.
            - Daily vocal hygiene checklist.
        - **Week 2:**
          - Focus on breath support and resonance
          - Home practice:
            - Diaphragmatic breathing exercises.
            - Resonance exercises using nasal sounds.
            - Use of voice apps for feedback on resonance.
        - **Week 3:**
          - Focus on pitch and volume control
          - Home practice:
            - Pitch glides and volume modulation exercises.
            - Singing exercises to explore pitch range.
            - Use of recording devices to monitor changes.
        - **Week 4:**
          - Focus on integrating voice techniques into speech
          - Home practice:
            - Conversational practice with focus on voice quality.
            - Use of RTM tools for remote feedback.
            - Participation in voice workshops or groups.

        **Instructions for AI**:
        - Focus on generating detailed and engaging exercises for each week.
        - Ensure exercises are tailored to the patient's age, disorder, and preferences.
        - Include specific activities, tools, and techniques for each session.
        - Provide clear progress metrics and expected outcomes.
        """

    def _build_language_prompt(self, context, patient_profile):
        return f"""
        **Patient Profile**:
        - Age: {patient_profile.get('age', "[Patient's age]")}
        - Disorder: {patient_profile.get('disorder', "[Specific language challenge]")}
        - Severity: {patient_profile.get('severity', "[Mild/Moderate/Severe]")}
        - Co-occurring conditions: {patient_profile.get('co_occurring_conditions', "[e.g., learning disability]")}
        - Patient preferences: {patient_profile.get('preferences', "[e.g., prefers visual aids]")}

        **Relevant Context**:
        {context}

        **4-Week Language Therapy Plan**:

        1. **Weekly Goals & Focus Areas**
        - **Week 1:**
          - Focus on vocabulary expansion and comprehension
          - Home practice: 
            - Interactive storytelling to introduce new words.
            - Vocabulary games using flashcards.
            - Daily reading sessions with comprehension questions.
        - **Week 2:**
          - Focus on sentence structure and grammar
          - Home practice:
            - Sentence building exercises with visual aids.
            - Grammar games to reinforce rules.
            - Use of language apps for interactive practice.
        - **Week 3:**
          - Focus on narrative skills and conversation
          - Home practice:
            - Role-playing to practice storytelling.
            - Conversation starters to encourage dialogue.
            - Use of video feedback to improve narrative skills.
        - **Week 4:**
          - Focus on reading comprehension and expression
          - Home practice:
            - Reading exercises with focus on expression.
            - Expressive storytelling sessions.
            - Participation in reading groups or clubs.

        **Instructions for AI**:
        - Focus on generating detailed and engaging exercises for each week.
        - Ensure exercises are tailored to the patient's age, disorder, and preferences.
        - Include specific activities, tools, and techniques for each session.
        - Provide clear progress metrics and expected outcomes.
        """

    def _build_motor_speech_prompt(self, context, patient_profile):
        return f"""
        **Patient Profile**:
        - Age: {patient_profile.get('age', "[Patient's age]")}
        - Disorder: {patient_profile.get('disorder', "[Specific motor speech challenge]")}
        - Severity: {patient_profile.get('severity', "[Mild/Moderate/Severe]")}
        - Co-occurring conditions: {patient_profile.get('co_occurring_conditions', "[e.g., neurological disorder]")}
        - Patient preferences: {patient_profile.get('preferences', "[e.g., prefers tactile feedback]")}

        **Relevant Context**:
        {context}

        **4-Week Motor Speech Therapy Plan**:

        1. **Weekly Goals & Focus Areas**
        - **Week 1:**
          - Focus on breath control and phonation
          - Home practice: 
            - Breathing exercises to support speech.
            - Phonation drills with tactile feedback.
            - Use of apps for real-time phonation feedback.
        - **Week 2:**
          - Focus on articulation and precision
          - Home practice:
            - Articulation drills with visual aids.
            - Precision exercises using speech apps.
            - Use of recording devices to monitor articulation.
        - **Week 3:**
          - Focus on speech rate and fluency
          - Home practice:
            - Pacing exercises to control speech rate.
            - Fluency drills with rhythmic support.
            - Use of video feedback to improve fluency.
        - **Week 4:**
          - Focus on prosody and intonation
          - Home practice:
            - Intonation practice with musical support.
            - Prosody exercises using speech apps.
            - Participation in group activities to enhance prosody.

        **Instructions for AI**:
        - Focus on generating detailed and engaging exercises for each week.
        - Ensure exercises are tailored to the patient's age, disorder, and preferences.
        - Include specific activities, tools, and techniques for each session.
        - Provide clear progress metrics and expected outcomes.
        """

    def generate_exercises(self, patient_profile):
        # Process goals input
        goals = patient_profile["goals"]
        if isinstance(goals, list):
            goals = " ".join(goals)
        
        # Retrieve relevant context
        retriever = self.index.as_retriever(similarity_top_k=1)
        context_nodes = retriever.retrieve(goals)
        context_text = "\n\n".join([n.text for n in context_nodes])
        
        # Determine which prompt to use based on disorder type
        disorder_type = patient_profile.get('disorder_type', 'articulation').lower()
        if disorder_type == 'articulation':
            prompt = self._build_articulation_prompt(context_text, patient_profile)
        elif disorder_type == 'fluency':
            prompt = self._build_fluency_prompt(context_text, patient_profile)
        elif disorder_type == 'voice':
            prompt = self._build_voice_prompt(context_text, patient_profile)
        elif disorder_type == 'language':
            prompt = self._build_language_prompt(context_text, patient_profile)
        elif disorder_type == 'motor_speech':
            prompt = self._build_motor_speech_prompt(context_text, patient_profile)
        else:
            raise ValueError(f"Unknown disorder type: {disorder_type}")
        
        # Generate response using OpenAI GPT-3.5 Turbo
        response = self.client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[
                {"role": "system", "content": "You are a speech therapy expert assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=2048,
            top_p=0.95
        )
        
        return response.choices[0].message.content
