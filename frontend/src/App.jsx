import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// Pages
import HomePage from "./components/HomePage";
import DoctorAuth from "./components/doctor/DoctorAuth";
import PatientAuth from "./components/patient/PatientAuth";

// Doctor pages
import UploadReport from "./components/doctor/UploadReport";
import ScheduleMeeting from "./components/doctor/ScheduleMeeting";
import RegisterPatient from "./components/doctor/RegisterPatient";
import ViewFeedbacks from "./components/doctor/ViewFeedbacks";
import PatientRecordings from "./components/doctor/PatientRecordings";

// Patient pages
import PatientDashboard from "./components/patient/PatientDashboard";
import SelfAssessment from "./components/patient/SelfAssessment";
import ViewPlan from "./components/patient/ViewPLan";
import PatientScheduleMeeting from "./components/patient/PatientScheduleMeeting";
import GiveFeedback from "./components/patient/GiveFeedback";

// Doctor Dashboard
function DoctorDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("doctor");
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      margin: 0,
      padding: 0,
      background: "linear-gradient(135deg, #f0f4ff 0%, #e6eeff 50%, #f0f4ff 100%)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "auto"
    }}>
      {/* Navigation Bar */}
      <nav style={{
        padding: "0.75rem 1.5rem",
        background: "white",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem"
        }}>
          <h1 style={{
            fontSize: "20px",
            color: "#1e40af",
            margin: 0,
            fontWeight: "700"
          }}>Doctor Dashboard</h1>
          <div style={{
            display: "flex",
            gap: "1rem"
          }}>
            <Link
              to="/doctor/upload"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                transition: "all 0.2s ease"
              }}
            >
              Upload Report
            </Link>
            <Link
              to="/doctor/schedule"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                transition: "all 0.2s ease"
              }}
            >
              Schedule Meeting
            </Link>
            <Link
              to="/doctor/register"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                transition: "all 0.2s ease"
              }}
            >
              Register Patient
            </Link>
            <Link
              to="/doctor/feedbacks"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                transition: "all 0.2s ease"
              }}
            >
              View Feedbacks
            </Link>
            <Link
              to="/doctor/recordings"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                transition: "all 0.2s ease"
              }}
            >
              Patient Recordings
            </Link>
          </div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <button
            onClick={handleLogout}
            style={{
              color: "#dc2626",
              background: "#fee2e2",
              border: "none",
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "2rem auto",
        padding: "0 1.5rem"
      }}>
        <Routes>
          <Route path="upload" element={<UploadReport />} />
          <Route path="schedule" element={<ScheduleMeeting />} />
          <Route path="register" element={<RegisterPatient />} />
          <Route path="feedbacks" element={<ViewFeedbacks />} />
          <Route path="recordings" element={<PatientRecordings />} />
        </Routes>
      </div>
    </div>
  );
}

// Main App Router
function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Doctor Auth and Dashboard */}
        <Route path="/doctor" element={<DoctorAuth />} />
        <Route path="/doctor/*" element={<DoctorDashboard />} />

        {/* Patient Auth and Dashboard */}
        <Route path="/patient/login" element={<PatientAuth />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/self-assessment" element={<SelfAssessment />} />
        <Route path="/patient/view-plan" element={<ViewPlan />} />
        <Route path="/patient/schedule-meeting" element={<PatientScheduleMeeting />} />
        <Route path="/patient/give-feedback" element={<GiveFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;
