import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { hospitals, doctors } from "./data";
import HomePage from "./pages/HomePage";
import HospitalDetailPage from "./pages/HospitalDetailPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";

export default function App() {
  const [userBookings, setUserBookings] = useState([]);

  const handleBooking = (bookingData) => {
    const booking = {
      id: Math.random().toString(36).slice(2, 9),
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: "booked"
    };
    setUserBookings(prev => [booking, ...prev]);
    alert(`Booking confirmed! Your token number is #${bookingData.tokenNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                hospitals={hospitals}
                doctors={doctors}
                userBookings={userBookings}
              />
            } 
          />
          <Route 
            path="/hospital/:hospitalId" 
            element={
              <HospitalDetailPage
                hospitals={hospitals}
                doctors={doctors}
              />
            } 
          />
          <Route 
            path="/doctor/:doctorId" 
            element={
              <DoctorDetailPage
                doctors={doctors}
                hospitals={hospitals}
                onBooking={handleBooking}
              />
            } 
          />
          <Route 
            path="/doctor/:doctorId/hospital/:hospitalId" 
            element={
              <DoctorDetailPage
                doctors={doctors}
                hospitals={hospitals}
                onBooking={handleBooking}
              />
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <BookingDetailsPage
                userBookings={userBookings}
              />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}