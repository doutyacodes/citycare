import React, { useEffect, useState } from "react";
import doctorsData from "./data";
import DoctorCard from "./DoctorCard";
import BookingModal from "./BookingModal";

export default function App() {
  const [doctors, setDoctors] = useState(doctorsData);
  const [query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [userTokens, setUserTokens] = useState([]);

  // Simulate real-time progression: advance tokens based on each doctor's avg_time_seconds
  useEffect(() => {
    const timers = [];
    doctors.forEach((doc, idx) => {
      // tick interval per doctor is avg_time_seconds * 1000
      const interval = Math.max(3000, doc.avg_seconds * 1000);
      const t = setInterval(() => {
        setDoctors(prev => {
          const copy = [...prev];
          const d = {...copy[idx]};
          if (d.status === 'active' && d.current_token < d.max_tokens) {
            d.current_token = d.current_token + 1;
            copy[idx] = d;
          }
          return copy;
        });
      }, interval);
      timers.push(t);
    });
    return () => timers.forEach(t => clearInterval(t));
  }, []);

  function openBooking(doc, mode) {
    setSelectedDoctor(doc);
    setModalMode(mode);
  }

  function confirmBooking({doctorId, tokenNumber, predictedTime, mode}) {
    // store token in userTokens
    const id = Math.random().toString(36).slice(2,9);
    const token = {
      id,
      doctorId,
      tokenNumber,
      predictedTime,
      mode,
      createdAt: new Date().toISOString(),
      status: "booked"
    };
    setUserTokens(prev => [token, ...prev]);
    // mark token reserved in doctors state (simple reservation)
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        const copy = {...d};
        copy.reserved = [...(copy.reserved||[]), tokenNumber];
        copy.last_assigned = Math.max(copy.last_assigned || copy.current_token, tokenNumber);
        return copy;
      }
      return d;
    }));
    setModalMode(null);
    setSelectedDoctor(null);
  }

  function cancelBooking(tokenId) {
    setUserTokens(prev => prev.map(t => t.id===tokenId ? {...t, status:'cancelled'} : t));
  }

  const filtered = doctors.filter(d => {
    const q = query.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
  });

  return (
    <div className="app">
      <header className="topbar">
        <h1>CityCare Medical Center — Demo</h1>
        <div className="search">
          <input placeholder="Search doctors or specialties..." value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
      </header>
      <main className="container">
        <section className="left">
          <h2>Doctors</h2>
          <div className="cards">
            {filtered.map(doc => (
              <DoctorCard key={doc.id} doctor={doc}
                onBookNext={()=>openBooking(doc,'next')}
                onBookTime={()=>openBooking(doc,'time')}
                onBookToken={()=>openBooking(doc,'token')}
                onView={()=>{ setSelectedDoctor(doc); setModalMode(null); }}
              />
            ))}
          </div>
        </section>
        <section className="right">
          <h2>Your Bookings</h2>
          <div className="tokens">
            {userTokens.length===0 && <div className="muted">No bookings yet. Book a token from the left panel.</div>}
            {userTokens.map(t => {
              const doc = doctors.find(d=>d.id===t.doctorId);
              return (
                <div key={t.id} className="token-card">
                  <div><strong>{doc.name}</strong> ({doc.specialty})</div>
                  <div>Token: <span className="token-label">#{t.tokenNumber}</span></div>
                  <div>ETA: {t.predictedTime}</div>
                  <div>Status: {t.status}</div>
                  {t.status === 'booked' && <button className="btn small" onClick={()=>cancelBooking(t.id)}>Cancel</button>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {selectedDoctor && modalMode && (
        <BookingModal mode={modalMode} doctor={selectedDoctor} onClose={()=>{setModalMode(null); setSelectedDoctor(null)}} onConfirm={confirmBooking} />
      )}

      {selectedDoctor && !modalMode && (
        <div className="detail-pane">
          <h3>{selectedDoctor.name} — {selectedDoctor.specialty}</h3>
          <p>{selectedDoctor.bio}</p>
          <p><strong>Working:</strong> {selectedDoctor.work_start} – {selectedDoctor.work_end}</p>
          <p><strong>Now Serving:</strong> #{selectedDoctor.current_token}</p>
          <p><strong>Avg time / patient:</strong> {selectedDoctor.avg_seconds} sec</p>
          <div className="detail-actions">
            <button className="btn" onClick={()=>openBooking(selectedDoctor,'next')}>Get Next Token</button>
            <button className="btn outline" onClick={()=>openBooking(selectedDoctor,'time')}>Book by Time</button>
            <button className="btn outline" onClick={()=>openBooking(selectedDoctor,'token')}>Pick Token #</button>
          </div>
          <button className="close" onClick={()=>setSelectedDoctor(null)}>Close</button>
        </div>
      )}

      <footer className="footer">Demo — simulated data. All buttons work in frontend-only demo.</footer>
    </div>
  );
}
