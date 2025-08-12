import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, Hash, CheckCircle, AlertCircle, X } from "lucide-react";

export default function BookingModal({mode, doctor, onClose, onConfirm}) {
  const [input, setInput] = useState("");
  const [pred, setPred] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 30
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  function calcNext() {
    setIsCalculating(true);
    setTimeout(() => {
      const token = Math.max(doctor.last_assigned || doctor.current_token, doctor.current_token) + 1;
      const etaSeconds = (token - doctor.current_token) * doctor.avg_seconds;
      const eta = new Date(Date.now() + etaSeconds*1000).toLocaleTimeString();
      setPred({token, eta});
      setIsCalculating(false);
    }, 800);
  }

  function calcTime(timeStr) {
    if (!timeStr.trim()) return;
    
    setIsCalculating(true);
    setTimeout(() => {
      // parse hh:mm (simple)
      const parts = timeStr.split(":");
      if (parts.length < 2) {
        setPred(null);
        setIsCalculating(false);
        return;
      }
      
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
      setIsCalculating(false);
    }, 800);
  }

  function calcSpecific(num) {
    if (!num.trim()) return;
    
    setIsCalculating(true);
    setTimeout(() => {
      const token = parseInt(num,10);
      if (isNaN(token)) {
        setPred(null);
        setIsCalculating(false);
        return;
      }
      
      const etaSeconds = (token - doctor.current_token) * doctor.avg_seconds;
      const eta = new Date(Date.now() + etaSeconds*1000).toLocaleTimeString();
      setPred({token, eta});
      setIsCalculating(false);
    }, 800);
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

  const getModeIcon = () => {
    switch(mode) {
      case 'next': return <Calendar size={24} />;
      case 'time': return <Clock size={24} />;
      case 'token': return <Hash size={24} />;
      default: return <Calendar size={24} />;
    }
  };

  const getModeTitle = () => {
    switch(mode) {
      case 'next': return 'Next Available Token';
      case 'time': return 'Book by Preferred Time';
      case 'token': return 'Pick Specific Token Number';
      default: return 'Booking';
    }
  };

  const getModeDescription = () => {
    switch(mode) {
      case 'next': return 'Get the next available token in the queue.';
      case 'time': return 'Enter your preferred time and we\'ll predict the closest available token.';
      case 'token': return 'Choose a specific token number and see the estimated wait time.';
      default: return 'Book an appointment.';
    }
  };

  return (
    <motion.div 
      className="modal-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div 
        className="modal"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <motion.div 
            className="modal-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {getModeIcon()}
          </motion.div>
          <div className="modal-title">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {getModeTitle()}
            </motion.h3>
            <motion.p 
              className="doctor-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {doctor.name} • {doctor.specialty}
            </motion.p>
          </div>
          <motion.button 
            className="modal-close"
            onClick={onClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 90,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="modal-content">
          <motion.p 
            className="mode-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {getModeDescription()}
          </motion.p>
          
          {mode === 'next' && (
            <motion.div 
              className="mode-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.button 
                className="btn primary large"
                onClick={calcNext}
                disabled={isCalculating}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isCalculating ? (
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Calendar size={18} />
                    </motion.div>
                    Calculate Next Token
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
          
          {mode === 'time' && (
            <motion.div 
              className="mode-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.div 
                className="input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <Clock size={18} />
                <motion.input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder="Enter time (e.g., 17:30)" 
                  type="text"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </motion.div>
              <motion.button 
                className="btn primary"
                onClick={() => calcTime(input)}
                disabled={isCalculating || !input.trim()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isCalculating ? (
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Clock size={18} />
                    </motion.div>
                    Predict Token
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
          
          {mode === 'token' && (
            <div className="mode-section">
              <div className="input-group">
                <Hash size={18} />
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder="Enter token number (e.g., 28)" 
                  type="number"
                />
              </div>
              <motion.button 
                className="btn primary"
                onClick={() => calcSpecific(input)}
                disabled={isCalculating || !input.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCalculating ? (
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Hash size={18} />
                    Estimate Time
                  </>
                )}
              </motion.button>
            </div>
          )}
          
          <AnimatePresence>
            {pred && (
              <motion.div 
                className="prediction-result"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prediction-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="prediction-details">
                  <div className="prediction-token">
                    Token: <span className="token-number">#{pred.token}</span>
                  </div>
                  <div className="prediction-eta">
                    Estimated Time: <span className="eta-time">{pred.eta}</span>
                  </div>
                  {pred.token > doctor.max_tokens && (
                    <div className="prediction-warning">
                      <AlertCircle size={16} />
                      <span>This token exceeds daily limit</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="modal-actions">
          <motion.button 
            className="btn primary large"
            onClick={handleConfirm}
            disabled={!pred}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle size={18} />
            Confirm Booking
          </motion.button>
          <motion.button 
            className="btn outline"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
