import React, { useState } from "react";
import { hospitals, doctors } from "./data";
import HospitalList from "./components/HospitalList";
import HospitalDetail from "./components/HospitalDetail";
import DoctorDetail from "./components/DoctorDetail";

export default function App() {
  const [currentView, setCurrentView] = useState("hospitals");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospitalForDoctor, setSelectedHospitalForDoctor] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setCurrentView("hospital-detail");
  };

  const handleDoctorClick = (doctor, hospitalId = null) => {
    setSelectedDoctor(doctor);
    setSelectedHospitalForDoctor(hospitalId);
    setCurrentView("doctor-detail");
  };

  const handleBooking = (bookingData) => {
    const booking = {
      id: Math.random().toString(36).slice(2, 9),
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: "booked"
    };
    setUserBookings(prev => [booking, ...prev]);
  };

  const handleBackToHospitals = () => {
    setCurrentView("hospitals");
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedHospitalForDoctor(null);
  };

  const handleBackToHospitalDetail = () => {
    setCurrentView("hospital-detail");
    setSelectedDoctor(null);
    setSelectedHospitalForDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {currentView === "hospitals" && (
        <HospitalList 
          hospitals={hospitals}
          doctors={doctors}
          onHospitalClick={handleHospitalClick}
          onDoctorClick={handleDoctorClick}
          userBookings={userBookings}
        />
      )}

      {currentView === "hospital-detail" && selectedHospital && (
        <HospitalDetail
          hospital={selectedHospital}
          doctors={doctors}
          onDoctorClick={handleDoctorClick}
          onBack={handleBackToHospitals}
        />
      )}

      {currentView === "doctor-detail" && selectedDoctor && (
        <DoctorDetail
          doctor={selectedDoctor}
          hospitalId={selectedHospitalForDoctor}
          onBooking={handleBooking}
          onBack={selectedHospitalForDoctor ? handleBackToHospitalDetail : handleBackToHospitals}
        />
      )}
    </div>
  );
}