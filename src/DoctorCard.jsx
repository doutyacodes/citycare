import React from "react";

export default function DoctorCard({doctor, onBookNext, onBookTime, onBookToken, onView}) {
  const waitMinutes = Math.round((doctor.max_tokens - doctor.current_token) * (doctor.avg_seconds/60) / 10) * 5;
  // simple display values
  return (
    <div className="card">
      <div className="card-header">
        <div className="avatar">{doctor.name.split(' ').slice(-1)[0][0]}</div>
        <div className="info">
          <div className="name">{doctor.name}</div>
          <div className="spec">{doctor.specialty}</div>
        </div>
      </div>
      <div className="card-body">
        <div>Now Serving: <strong>#{doctor.current_token}</strong></div>
        <div>Avg per patient: <strong>{Math.round(doctor.avg_seconds/60)} min</strong></div>
        <div>Max tokens/day: <strong>{doctor.max_tokens}</strong></div>
        <div>Status: <strong className={"status-"+doctor.status}>{doctor.status}</strong></div>
      </div>
      <div className="card-actions">
        <button className="btn" onClick={onBookNext}>Next</button>
        <button className="btn outline" onClick={onBookTime}>By Time</button>
        <button className="btn outline" onClick={onBookToken}>Pick #</button>
        <button className="btn ghost" onClick={onView}>View</button>
      </div>
    </div>
  );
}
