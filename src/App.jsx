import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="app">
      <motion.header 
        className="topbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          🏥 CityCare Medical Center
        </motion.h1>
        <motion.div 
          className="search"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Search className="search-icon" size={20} />
          <input 
            placeholder="Search doctors or specialties..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </motion.div>
      </motion.header>

      <main className="container">
        <motion.section 
          className="left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            variants={itemVariants}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Available Doctors
          </motion.h2>
          <motion.div 
            className="cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((doc, index) => (
              <motion.div
                key={doc.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: index * 0.1 }}
              >
                <DoctorCard 
                  doctor={doc}
                  onBookNext={() => openBooking(doc, 'next')}
                  onBookTime={() => openBooking(doc, 'time')}
                  onBookToken={() => openBooking(doc, 'token')}
                  onView={() => { setSelectedDoctor(doc); setModalMode(null); }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          className="right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.25, 0, 1] }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            📋 Your Bookings
          </motion.h2>
          <div className="tokens">
            {userTokens.length === 0 && (
              <motion.div 
                className="muted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.7, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Calendar size={48} className="muted-icon" />
                </motion.div>
                <p>No bookings yet. Book a token from the left panel.</p>
              </motion.div>
            )}
            <AnimatePresence mode="popLayout">
              {userTokens.map((t, index) => {
                const doc = doctors.find(d => d.id === t.doctorId);
                return (
                  <motion.div
                    key={t.id}
                    className="token-card"
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      scale: 1,
                      transition: { 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -100, 
                      scale: 0.8,
                      transition: { duration: 0.2 }
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    layout
                  >
                    <div className="token-header">
                      <strong>{doc.name}</strong> 
                      <span className="token-specialty">({doc.specialty})</span>
                    </div>
                    <div className="token-details">
                      <div className="token-info">
                        <span className="token-label">#{t.tokenNumber}</span>
                        <span className="token-eta">ETA: {t.predictedTime}</span>
                      </div>
                      <div className="token-status">
                        <span className={`status-badge status-${t.status}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    {t.status === 'booked' && (
                      <motion.button 
                        className="btn small danger"
                        onClick={() => cancelBooking(t.id)}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { type: "spring", stiffness: 400, damping: 25 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Cancel
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {selectedDoctor && modalMode && (
          <BookingModal 
            mode={modalMode} 
            doctor={selectedDoctor} 
            onClose={() => {setModalMode(null); setSelectedDoctor(null)}} 
            onConfirm={confirmBooking} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDoctor && !modalMode && (
          <motion.div 
            className="detail-pane"
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              x: 100,
              transition: { duration: 0.3 }
            }}
          >
            <div className="detail-header">
              <div className="doctor-avatar">
                {selectedDoctor.name.split(' ').slice(-1)[0][0]}
              </div>
              <div className="doctor-info">
                <h3>{selectedDoctor.name}</h3>
                <p className="doctor-specialty">{selectedDoctor.specialty}</p>
              </div>
            </div>
            
            <div className="detail-content">
              <p className="doctor-bio">{selectedDoctor.bio}</p>
              
              <div className="detail-stats">
                <div className="stat-item">
                  <Clock size={16} />
                  <span>Working: {selectedDoctor.work_start} – {selectedDoctor.work_end}</span>
                </div>
                <div className="stat-item">
                  <User size={16} />
                  <span>Now Serving: #{selectedDoctor.current_token}</span>
                </div>
                <div className="stat-item">
                  <Calendar size={16} />
                  <span>Avg time: {Math.round(selectedDoctor.avg_seconds/60)} min</span>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <motion.button 
                className="btn" 
                onClick={() => openBooking(selectedDoctor, 'next')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Get Next Token
              </motion.button>
              <motion.button 
                className="btn outline" 
                onClick={() => openBooking(selectedDoctor, 'time')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Book by Time
              </motion.button>
              <motion.button 
                className="btn outline" 
                onClick={() => openBooking(selectedDoctor, 'token')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Pick Token #
              </motion.button>
            </div>
            
            <motion.button 
              className="close" 
              onClick={() => setSelectedDoctor(null)}
              whileHover={{ 
                scale: 1.1,
                rotate: 90,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer 
        className="footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 1.2, 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Demo — simulated data. All buttons work in frontend-only demo.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Built with React & Framer Motion
        </motion.p>
      </motion.footer>
    </div>
  );
}
