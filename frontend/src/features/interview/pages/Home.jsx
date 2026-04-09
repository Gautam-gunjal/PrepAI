import React, { useState, useRef } from "react";
import "../styles/Home.css";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router-dom'
import Navbar from "../components/Navbar";
import Loader from '../components/Loader'

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate()

  const { generateReport, loading, reports, error } = useInterview()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setResumeFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);


  const handleGenerateReport = async (e) => {
    e.preventDefault();
    const data = await generateReport({ resumeFile, selfDescription, jobDescription })
    if (data) {
      navigate(`/interview/${data._id}`)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className="home-root">
        <div className="home-hero">
          <h1 className="home-title">
            Create Your Custom <span className="home-title-accent">Interview Plan</span>
          </h1>
          <p className="home-subtitle">
            Let our AI analyze the job requirements and your unique profile to build a winning strategy.
          </p>
        </div>

        <div className="home-card">
          {/* Left Panel */}
          <div className="home-panel home-panel-left">
            <div className="home-panel-header">
              <span className="home-panel-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </span>
              <h2 className="home-panel-title">Target Job Description</h2>
              <span className="home-badge home-badge-required">REQUIRED</span>
            </div>
            <textarea
              className="home-textarea"
              placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={5000}
            />
            <div className="home-char-count">{jobDescription.length} / 5000 chars</div>
          </div>

          {/* Divider */}
          <div className="home-divider-v" />

          {/* Right Panel */}
          <div className="home-panel home-panel-right">
            <div className="home-panel-header">
              <span className="home-panel-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2 className="home-panel-title">Your Profile</h2>
            </div>

            <div className="home-upload-label">
              UPLOAD RESUME
              <span className="home-badge home-badge-best">BEST RESULTS</span>
            </div>

            <div
              className={`home-dropzone${dragOver ? " home-dropzone-active" : ""}${resumeFile ? " home-dropzone-filled" : ""}`}
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <span className="home-dropzone-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </span>
              {resumeFile ? (
                <>
                  <p className="home-dropzone-filename">{resumeFile.name}</p>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    Remove
                  </button>
                </>

              ) : (
                <>
                  <p className="home-dropzone-text">Click to upload or drag &amp; drop</p>
                  <p className="home-dropzone-hint">PDF (MAX 3MB)</p>
                </>
              )}
            </div>

            <div className="home-or-divider">
              <span className="home-or-line" />
              <span className="home-or-text">OR</span>
              <span className="home-or-line" />
            </div>

            <label className="home-self-label">Self-Description</label>
            <textarea
              className="home-textarea home-textarea-sm"
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />

            <div className="home-info-box">
              <span className="home-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <p className="home-info-text">
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="home-footer-bar">
          <div className="home-footer-status">
            <span className="home-status-dot" />
            <span className="home-status-text">AI-Powered Strategy Generation • Approx 15s</span>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button onClick={handleGenerateReport} className="home-cta-btn">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>

        {/* Recent Reports List */}
        {reports.length > 0 && (
          <section className='recent-reports'>
            <h2>My Recent Interview Plans</h2>
            <ul className='reports-list'>
              {reports.map(report => (
                <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                  <h3>{report.title || 'Untitled Position'}</h3>
                  <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                  <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}