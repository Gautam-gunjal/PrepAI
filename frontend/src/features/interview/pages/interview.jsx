import React, { useState } from "react";
import "../styles/interview.css";
import { useInterview } from "../hooks/useInterview";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCode = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconChat = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconMap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconChevron = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Match Score Ring ──────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <div className="iv-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#2a2a2d" strokeWidth="10" />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="#3ddc84"
          strokeWidth="10"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
      </svg>
      <div className="iv-ring-label">
        <span className="iv-ring-number">{score}</span>
        <span className="iv-ring-unit">%</span>
      </div>
    </div>
  );
}

// ── Question Accordion Card ───────────────────────────────────────────────────
function QuestionCard({ index, q, prefix = "Q" }) {
  const [open, setOpen] = useState(false);
  const label = `${prefix}${index + 1}`;
  return (
    <div className={`iv-qcard${open ? " iv-qcard-open" : ""}`}>
      <button className="iv-qcard-header" onClick={() => setOpen((v) => !v)}>
        <span className="iv-qlabel">{label}</span>
        <span className="iv-qtext">{q.question}</span>
        <span className="iv-qchev">
          <IconChevron open={open} />
        </span>
      </button>
      {open && (
        <div className="iv-qcard-body">
          <div className="iv-qblock">
            <p className="iv-qblock-title">🎯 Intention</p>
            <p className="iv-qblock-text">{q.intention}</p>
          </div>
          <div className="iv-qblock">
            <p className="iv-qblock-title">💡 Suggested Answer</p>
            <p className="iv-qblock-text">{q.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skill Gap Tag ─────────────────────────────────────────────────────────────
function SkillTag({ skill }) {
  return (
    <div className={`iv-skill-tag iv-skill-${skill.severity}`}>
      {skill.skills}
    </div>
  );
}

// ── Prep Plan Day ─────────────────────────────────────────────────────────────
function PrepDay({ day }) {
  return (
    <div className="iv-prep-day">
      <div className="iv-prep-day-header">
        <span className="iv-prep-day-num">Day {day.day}</span>
        <span className="iv-prep-day-focus">{day.focus}</span>
      </div>
      <ul className="iv-prep-tasks">
        {day.tasks.map((t, i) => (
          <li key={i} className="iv-prep-task">
            <span className="iv-prep-dot" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Section content renderer ──────────────────────────────────────────────────
function MainContent({ active, report }) {
  if (active === "technical") {
    return (
      <>
        <div className="iv-main-header">
          <h2 className="iv-main-title">Technical Questions</h2>
          <span className="iv-main-badge">{report.technicalQuestions.length} questions</span>
        </div>
        <div className="iv-qlist">
          {report.technicalQuestions.map((q, i) => (
            <QuestionCard key={i} index={i} q={q} prefix="Q" />
          ))}
        </div>
      </>
    );
  }
  if (active === "behavioural") {
    return (
      <>
        <div className="iv-main-header">
          <h2 className="iv-main-title">Behavioral Questions</h2>
          <span className="iv-main-badge">{report.behaviouralQuestions.length} questions</span>
        </div>
        <div className="iv-qlist">
          {report.behaviouralQuestions.map((q, i) => (
            <QuestionCard key={i} index={i} q={q} prefix="B" />
          ))}
        </div>
      </>
    );
  }
  if (active === "roadmap") {
    return (
      <>
        <div className="iv-main-header">
          <h2 className="iv-main-title">Road Map</h2>
          <span className="iv-main-badge">{report.preparationPlan.length} days</span>
        </div>
        <div className="iv-prep-list">
          {report.preparationPlan.map((d, i) => (
            <PrepDay key={i} day={d} />
          ))}
        </div>
      </>
    );
  }
  return null;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Interview() {
  const [active, setActive] = useState("technical");
  const { report, loading, getResumePdf } = useInterview()

  const navItems = [
    { id: "technical", label: "Technical Questions", icon: <IconCode /> },
    { id: "behavioural", label: "Behavioral Questions", icon: <IconChat /> },
    { id: "roadmap", label: "Road Map", icon: <IconMap /> },
  ];


  if (!report) {
    return <Loader />;
  }

  const scoreLabel =
    report.matchScore >= 85
      ? "Strong match for this role"
      : report.matchScore >= 65
        ? "Good match for this role"
        : "Moderate match for this role";



  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className="iv-root">
        <div className="iv-core">
          {/* ── Left Sidebar ── */}
          <aside className="iv-sidebar-left">
            <p className="iv-sidebar-label">SECTIONS</p>
            <nav className="iv-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`iv-nav-item${active === item.id ? " iv-nav-active" : ""}`}
                  onClick={() => setActive(item.id)}
                >
                  <span className="iv-nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="iv-main">
            <div className="iv-main-card">
              <MainContent active={active} report={report} />
            </div>
          </main>

          {/* ── Right Sidebar ── */}
          <aside className="iv-sidebar-right">
            <p className="iv-sidebar-label">MATCH SCORE</p>
            <div className="iv-score-section">
              <ScoreRing score={report.matchScore} />
              <p className="iv-score-label">{scoreLabel}</p>
            </div>

            <p className="iv-sidebar-label iv-gaps-label">SKILL GAPS</p>
            <div className="iv-skill-list">
              {report.skillGaps.map((s, i) => (
                <SkillTag key={i} skill={s} />
              ))}
            </div>

            <button className="iv-resume-btn" onClick={() => getResumePdf(report._id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
                <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" opacity="0.7" />
                <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" opacity="0.5" />
              </svg>
              Generate Resume PDF
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}
