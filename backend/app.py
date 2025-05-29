import sys
import os
import traceback
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import sqlite3
from sqlite3 import Error
import shutil

# Add root directory to sys.path so 'agents' can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from agents.coordinator import MultiDisorderCoordinator

# ─────────────────────────────────────────
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
os.makedirs(os.path.join(BASE_DIR, "instance"), exist_ok=True)

db_path = os.path.join(BASE_DIR, "instance", "patients.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ─────────────────────────────────────────
# Models
# ─────────────────────────────────────────
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.String(10))
    severity = db.Column(db.String(20))
    goals = db.Column(db.Text)
    history = db.Column(db.Text)
    disorder_type = db.Column(db.String(50))  


class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

with app.app_context():
    db.create_all()

# ─────────────────────────────────────────
# In-memory stores
# ─────────────────────────────────────────
reports, feedbacks, meetings = [], [], []

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# ─────────────────────────────────────────
# Routes
# ─────────────────────────────────────────

@app.route("/upload-report", methods=["POST"])
def upload_report():
    file = request.files["file"]
    email = request.form["email"]
    os.makedirs("reports", exist_ok=True)
    path = f"reports/{email}_{file.filename}"
    file.save(path)
    reports.append({"email": email, "path": path})
    return jsonify({"message": "Report uploaded"})

@app.route("/get-feedbacks", methods=["GET"])
def get_old_feedbacks():
    return jsonify(feedbacks)

@app.route("/submit-feedback", methods=["POST"])
def submit_old_feedback():
    data = request.json
    feedbacks.append({"email": data["email"], "message": data["message"]})
    return jsonify({"message": "Feedback received"})

@app.route("/schedule-meeting", methods=["POST"])
def schedule_meeting():
    data = request.json
    link = "https://bookings.orufy.com/"
    meetings.append({"email": data["email"], "datetime": data["datetime"], "link": link})
    return jsonify({"link": link})

@app.route("/register-patient", methods=["POST"])
def register_patient():
    data = request.json
    username = data["username"].strip()
    email = data["email"].strip()
    password = data["password"].strip()
    age = data.get("age", "").strip()
    severity = data.get("severity", "").strip()
    goals = ",".join(data.get("goals", []))
    history = data.get("history", "").strip()

    if Patient.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    if Patient.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_patient = Patient(
        username=username,
        password=password,
        email=email,
        age=age,
        severity=severity,
        goals=goals,
        history=history
    )
    db.session.add(new_patient)
    db.session.commit()
    return jsonify({"message": "Patient created successfully"})

@app.route("/login-patient", methods=["POST"])
def login_patient():
    data = request.json
    username = data["username"].strip()
    password = data["password"].strip()
    patient = Patient.query.filter_by(username=username).first()
    if patient and patient.password == password:
        return jsonify({
    "message": "Login successful",
    "username": patient.username,   # ✅ Add this line
    "email": patient.email,
    "age": patient.age,
    "severity": patient.severity,
    "goals": patient.goals,
    "history": patient.history
})

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/register-doctor", methods=["POST"])
def register_doctor():
    data = request.json
    username = data["username"].strip()
    password = data["password"].strip()
    if Doctor.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    new_doctor = Doctor(username=username, password=password)
    db.session.add(new_doctor)
    db.session.commit()
    return jsonify({"message": "Doctor registered successfully"})

@app.route("/login-doctor", methods=["POST"])
def login_doctor():
    data = request.json
    username = data["username"].strip()
    password = data["password"].strip()
    doctor = Doctor.query.filter_by(username=username).first()
    if doctor and doctor.password == password:
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

def clear_recordings_folder():
    recordings_dir = os.path.join(BASE_DIR, 'recordings')
    if os.path.exists(recordings_dir):
        shutil.rmtree(recordings_dir)
    os.makedirs(recordings_dir, exist_ok=True)

@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    data = request.json
    username = data.get("username")
    disorder_type = data.get("disorder_type", "").strip().lower()

    if not username or not disorder_type:
        return jsonify({"error": "Username and disorder_type are required"}), 400

    patient = Patient.query.filter_by(username=username).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    profile = {
        "age": patient.age,
        "disorder_type": disorder_type,
        "severity": patient.severity,
        "goals": patient.goals.split(",") if patient.goals else [],
        "history": patient.history
    }

    try:
        # Clear recordings folder before generating new plan
        clear_recordings_folder()
        
        coordinator = MultiDisorderCoordinator()
        plan = coordinator.get_weekly_plan(disorder_type, profile)
        return jsonify({"plan": plan})
    except Exception as e:
        print("ERROR:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Create feedback table
def create_feedback_table():
    try:
        conn = sqlite3.connect('feedback.db')
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedbacks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patientUsername TEXT NOT NULL,
                feedback TEXT NOT NULL,
                date TEXT NOT NULL
            )
        ''')
        conn.commit()
    except Error as e:
        print(f"Error creating feedback table: {e}")
    finally:
        if conn:
            conn.close()

# Create feedback table on startup
create_feedback_table()

# New SQLite feedback endpoints with unique names
@app.route('/api/feedback', methods=['POST'])
def create_new_feedback():
    data = request.get_json()
    patientUsername = data.get('patientUsername')
    feedback = data.get('feedback')
    date = data.get('date')

    if not all([patientUsername, feedback, date]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = sqlite3.connect('feedback.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO feedbacks (patientUsername, feedback, date) VALUES (?, ?, ?)',
            (patientUsername, feedback, date)
        )
        conn.commit()
        feedback_id = cursor.lastrowid
        return jsonify({'success': True, 'id': feedback_id})
    except Error as e:
        return jsonify({'error': f'Failed to submit feedback: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/feedbacks', methods=['GET'])
def get_all_feedbacks():
    try:
        conn = sqlite3.connect('feedback.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM feedbacks ORDER BY date DESC')
        rows = cursor.fetchall()
        
        feedbacks = []
        for row in rows:
            feedbacks.append({
                'id': row[0],
                'patientUsername': row[1],
                'feedback': row[2],
                'date': row[3]
            })
        
        return jsonify({'feedbacks': feedbacks})
    except Error as e:
        return jsonify({'error': f'Failed to fetch feedbacks: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/feedback/<int:id>', methods=['DELETE'])
def delete_specific_feedback(id):
    try:
        conn = sqlite3.connect('feedback.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM feedbacks WHERE id = ?', (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Feedback not found'}), 404
            
        return jsonify({'success': True})
    except Error as e:
        return jsonify({'error': f'Failed to delete feedback: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route("/get-assessment-questions", methods=["POST"])
def get_assessment_questions():
    data = request.json
    disorder_type = data.get("disorder_type", "").lower()  # Convert to lowercase
    
    if not disorder_type:
        return jsonify({"error": "Disorder type is required"}), 400
        
    try:
        # Use the exact path provided
        db_path = r"C:\Users\Mokshith P\Desktop\VOICE\speech-therapy-app\backend\db\speech_disorders_assessment.db"
        print(f"Attempting to connect to database at: {db_path}")  # Debug log
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Map the disorder type to the correct table name
        table_names = {
            'articulation': 'Articulation_Disorders',
            'fluency': 'Fluency_Disorders',
            'language': 'Language_Disorders',
            'motor_speech': 'Motor_Speech_Disorders',
            'voice': 'Voice_Disorders'
        }
        
        if disorder_type not in table_names:
            return jsonify({"error": f"Invalid disorder type: {disorder_type}"}), 400
            
        table_name = table_names[disorder_type]
        print(f"Querying table: {table_name}")  # Debug log
        
        # Get 4 random questions using the correct column names
        cursor.execute(f"""
            SELECT Serial_No, Question 
            FROM {table_name}
            ORDER BY RANDOM() 
            LIMIT 4
        """)
        
        questions = cursor.fetchall()
        print(f"Found {len(questions)} questions")  # Debug log
        
        if not questions:
            return jsonify({"error": f"No questions found for {disorder_type} disorder"}), 404
        
        # Map using the correct column names
        formatted_questions = [{"id": q[0], "question": q[1]} for q in questions]
        return jsonify({"questions": formatted_questions})
        
    except Error as e:
        error_msg = f"Database error: {str(e)}"
        print(error_msg)  # Debug log
        return jsonify({"error": error_msg}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/save-recording', methods=['POST'])
def save_recording():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
            
        audio_file = request.files['audio']
        disorder_type = request.form.get('disorder_type')
        
        if audio_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        if not disorder_type:
            return jsonify({'error': 'No disorder type provided'}), 400
            
        # Create recordings directory if it doesn't exist
        os.makedirs('recordings', exist_ok=True)
        
        # Save the audio file
        filepath = os.path.join('recordings', audio_file.filename)
        audio_file.save(filepath)
        
        # Save the disorder type to disorder.txt
        disorder_txt_path = os.path.join('recordings', 'disorder.txt')
        with open(disorder_txt_path, 'w') as f:
            f.write(disorder_type)
        
        return jsonify({'message': 'Recording and disorder type saved successfully'})
        
    except Exception as e:
        print('Error saving recording:', str(e))
        return jsonify({'error': 'Failed to save recording'}), 500

@app.route("/list-recordings", methods=["GET"])
def list_recordings():
    recordings_dir = os.path.join(os.path.dirname(__file__), "recordings")
    if not os.path.exists(recordings_dir):
        return jsonify({"recordings": []})
    
    recordings = [f for f in os.listdir(recordings_dir) if f.endswith('.wav')]
    return jsonify({"recordings": recordings})

@app.route("/recordings/<filename>")
def serve_recording(filename):
    recordings_dir = os.path.join(os.path.dirname(__file__), "recordings")
    try:
        return send_file(
            os.path.join(recordings_dir, filename),
            mimetype="audio/wav",
            as_attachment=False
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# ─────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)
