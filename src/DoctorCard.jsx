import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Clock, Calendar, Activity, Eye, Heart, MapPin, Phone, Star } from "lucide-react";

export default function DoctorCard({doctor, onBookNext, onBookTime, onBookToken, onView}) {
  const [isLoading, setIsLoading] = useState(false);
  const waitMinutes = Math.round((doctor.max_tokens - doctor.current_token) * (doctor.avg_seconds/60) / 10) * 5;
  const progressPercentage = (doctor.current_token / doctor.max_tokens) * 100;
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'on_leave': return '#ef4444';
      case 'break': return '#f59e0b';
      case 'emergency': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '🟢';
      case 'on_leave': return '🔴';
      case 'break': return '🟡';
      case 'emergency': return '🚨';
      default: return '⚪';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Available Now';
      case 'on_leave': return 'On Leave';
      case 'break': return 'On Break';
      case 'emergency': return 'Emergency';
      default: return 'Offline';
    }
  };

  const handleBookingClick = async (bookingFunction) => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    bookingFunction();
    setIsLoading(false);
  };

  return (
    <motion.div 
      className="card"
      whileHover={{ 
        y: -8, 
        scale: 1.01,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 25 
        }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        type: "spring",
        stiffness: 200,
        damping: 20,
        ease: [0.25, 0.25, 0, 1]
      }}
    >
      <div className="card-header">
        <motion.div 
          className="avatar"
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.1,
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
        >
          {doctor.name.split(' ').slice(-1)[0][0]}
        </motion.div>
        <div className="info">
          <div className="name">{doctor.name}</div>
          <div className="spec">{doctor.specialty}</div>
          <motion.div 
            className="status-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            <span style={{ color: getStatusColor(doctor.status) }}>
              {getStatusText(doctor.status)}
            </span>
          </motion.div>
        </div>
        <motion.div 
          className="status-indicator" 
          style={{ color: getStatusColor(doctor.status) }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: doctor.status === 'active' ? [1, 1.1, 1] : 1,
            rotate: doctor.status === 'emergency' ? [0, -3, 3, -3, 0] : 0
          }}
          transition={{ 
            opacity: { delay: 0.4, duration: 0.3 },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 0.4, repeat: Infinity, repeatDelay: 4 }
          }}
        >
          {getStatusIcon(doctor.status)}
        </motion.div>
      </div>

      {/* Progress Bar for Tokens */}
      <motion.div 
        className="progress-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <motion.div 
          className="progress-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span>Today's Progress</span>
          <motion.span
            key={`${doctor.current_token}-${doctor.max_tokens}`}
            initial={{ scale: 1.2, color: "#0ea5e9" }}
            animate={{ scale: 1, color: "inherit" }}
            transition={{ duration: 0.3 }}
          >
            {doctor.current_token}/{doctor.max_tokens}
          </motion.span>
        </motion.div>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 1.2, 
              delay: 0.7,
              ease: [0.25, 0.25, 0, 1]
            }}
          />
        </div>
      </motion.div>
      
      <div className="card-body">
        <motion.div 
          className="stat-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileHover={{ 
            x: 4,
            transition: { type: "spring", stiffness: 300, damping: 25 }
          }}
        >
          <Clock size={16} />
          <span>Now Serving: <strong>#{doctor.current_token}</strong></span>
        </motion.div>
        <motion.div 
          className="stat-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          whileHover={{ 
            x: 4,
            transition: { type: "spring", stiffness: 300, damping: 25 }
          }}
        >
          <Activity size={16} />
          <span>Avg per patient: <strong>{Math.round(doctor.avg_seconds/60)} min</strong></span>
        </motion.div>
        <motion.div 
          className="stat-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          whileHover={{ 
            x: 4,
            transition: { type: "spring", stiffness: 300, damping: 25 }
          }}
        >
          <Calendar size={16} />
          <span>Available slots: <strong>{doctor.max_tokens - doctor.current_token}</strong></span>
        </motion.div>
        <motion.div 
          className="stat-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          whileHover={{ 
            x: 4,
            transition: { type: "spring", stiffness: 300, damping: 25 }
          }}
        >
          <Heart size={16} />
          <span>Patient Rating: <strong>4.{Math.floor(Math.random() * 9) + 1}⭐</strong></span>
        </motion.div>
        
        {waitMinutes > 0 && (
          <motion.div 
            className="wait-time"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: 1.2, 
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock size={14} />
            </motion.div>
            <span className="wait-label">Estimated wait: ~{waitMinutes} minutes</span>
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="card-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <motion.button 
          className="btn primary"
          onClick={() => handleBookingClick(onBookNext)}
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.3 }}
          whileHover={{ 
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap={{ scale: 0.97 }}
        >
          Next Token
        </motion.button>
        <motion.button 
          className="btn outline"
          onClick={() => handleBookingClick(onBookTime)}
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.3 }}
          whileHover={{ 
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap={{ scale: 0.97 }}
        >
          By Time
        </motion.button>
        <motion.button 
          className="btn outline"
          onClick={() => handleBookingClick(onBookToken)}
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.3 }}
          whileHover={{ 
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap={{ scale: 0.97 }}
        >
          Pick #
        </motion.button>
        <motion.button 
          className="btn ghost"
          onClick={onView}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, duration: 0.3 }}
          whileHover={{ 
            scale: 1.08,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Eye size={16} />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
