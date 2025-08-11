import React, { useState } from "react";

export default function BookingModal({mode, doctor, onClose, onConfirm}) {
  const [input, setInput] = useState("");
  const [pred, setPred] = useState(null);

  function calcNext() {
    const token = Math.max(doctor.last_assigned || doctor.current_token, doctor.current_token) + 1;
    const etaSeconds = (token - doctor.current_token) * doctor.avg_seconds;
    const eta = new Date(Date.now() + etaSeconds*1000).toLocaleTimeString();
    setPred({token, eta});
  }

  function calcTime(timeStr) {
    // parse hh:mm (simple)
    const parts = timeStr.split(":");
    if (parts.length<2) return null;
    const now = new Date();
    const target = new Date();
    target.setHours(parseInt(parts[0],10), parseInt(parts[1],10),0,0);
    if (target < now) target.setDate(target.getDate()+1);
    // estimate tokens until then
    const secsUntil = Math.round((target.getTime() - now.getTime())/1000);
    const estTokens = Math.ceil(secsUntil / doctor.avg_seconds);
    const predictedToken = doctor.current_token + estTokens;
    const eta = target.toLocaleTimeString();
    setPred({token: predictedToken, eta});
  }

  function calcSpecific(num) {
    const token = parseInt(num,10);
    if (isNaN(token)) return;
    const etaSeconds = (token - doctor.current_token) * doctor.avg_seconds;
    const eta = new Date(Date.now() + etaSeconds*1000).toLocaleTimeString();
    setPred({token, eta});
  }

  function handleConfirm() {
    if (!pred) return alert("Calculate prediction first.");
    if (pred.token > doctor.max_tokens) {
      if (!confirm("Selected token/time likely exceeds today's max tokens. Proceed and place on overflow?")) {
        return;
      }
    }
    onConfirm({doctorId: doctor.id, tokenNumber: pred.token, predictedTime: pred.eta, mode});
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Booking — {doctor.name} ({mode})</h3>
        {mode === 'next' && (
          <div>
            <p>Assign next available token.</p>
            <button className="btn" onClick={calcNext}>Calculate Next Token</button>
            {pred && <div className="pred">Token: #{pred.token} • ETA: {pred.eta}</div>}
          </div>
        )}
        {mode === 'time' && (
          <div>
            <p>Enter preferred time (HH:MM) — system will predict token nearest to this time.</p>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g., 17:30" />
            <button className="btn" onClick={()=>calcTime(input)}>Predict Token</button>
            {pred && <div className="pred">Predicted Token: #{pred.token} • ETA: {pred.eta}</div>}
          </div>
        )}
        {mode === 'token' && (
          <div>
            <p>Enter specific token number you want to book.</p>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g., 28" />
            <button className="btn" onClick={()=>calcSpecific(input)}>Estimate Time</button>
            {pred && <div className="pred">Token: #{pred.token} • ETA: {pred.eta}</div>}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn" onClick={handleConfirm}>Confirm Booking</button>
          <button className="btn outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
