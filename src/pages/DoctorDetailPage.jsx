import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DoctorDetailPage({ doctors, hospitals, onBooking }) {
  const { doctorId, hospitalId } = useParams();
  const navigate = useNavigate();
  
  const doctor = doctors.find(d => d.id === doctorId);
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const [selectedHospitalSchedule, setSelectedHospitalSchedule] = useState(
    hospitalId 
      ? doctor.hospitalSchedule.find(s => s.hospitalId === hospitalId) || doctor.hospitalSchedule[0]
      : doctor.hospitalSchedule[0]
  );
  const [bookingMode, setBookingMode] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedTokenNumber, setSelectedTokenNumber] = useState("");

  const generateTimeSlots = (schedule) => {
    const slots = [];
    const startTime = new Date(`2024-01-01 ${schedule.workStart}:00`);
    const endTime = new Date(`2024-01-01 ${schedule.workEnd}:00`);
    const avgMinutes = Math.ceil(schedule.avgSeconds / 60);
    
    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + avgMinutes);
    }
    
    return slots;
  };

  const timeSlots = useMemo(() => 
    generateTimeSlots(selectedHospitalSchedule), 
    [selectedHospitalSchedule]
  );

  const availableTokens = useMemo(() => {
    const tokens = [];
    const current = selectedHospitalSchedule.currentToken;
    const max = selectedHospitalSchedule.maxTokens;
    
    for (let i = current + 1; i <= Math.min(current + 10, max); i++) {
      tokens.push(i);
    }
    
    return tokens;
  }, [selectedHospitalSchedule]);

  const handleBooking = (mode) => {
    let bookingData = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalId: selectedHospitalSchedule.hospitalId,
      hospitalName: selectedHospitalSchedule.hospitalName,
      specialty: doctor.specialty,
      consultationFee: doctor.consultationFee,
      mode
    };

    switch (mode) {
      case 'next':
        const nextToken = selectedHospitalSchedule.currentToken + 1;
        const waitTime = Math.ceil((nextToken - selectedHospitalSchedule.currentToken) * (selectedHospitalSchedule.avgSeconds / 60));
        bookingData = {
          ...bookingData,
          tokenNumber: nextToken,
          estimatedTime: `${waitTime} minutes`,
          timeSlot: "Next Available"
        };
        break;
      
      case 'time':
        if (!selectedTimeSlot) {
          alert('Please select a time slot');
          return;
        }
        const slotIndex = timeSlots.indexOf(selectedTimeSlot);
        const timeSlotToken = selectedHospitalSchedule.currentToken + slotIndex + 1;
        bookingData = {
          ...bookingData,
          tokenNumber: timeSlotToken,
          timeSlot: selectedTimeSlot,
          estimatedTime: selectedTimeSlot
        };
        break;
      
      case 'token':
        if (!selectedTokenNumber) {
          alert('Please select a token number');
          return;
        }
        const tokenWaitTime = Math.ceil((selectedTokenNumber - selectedHospitalSchedule.currentToken) * (selectedHospitalSchedule.avgSeconds / 60));
        bookingData = {
          ...bookingData,
          tokenNumber: parseInt(selectedTokenNumber),
          estimatedTime: `${tokenWaitTime} minutes`,
          timeSlot: "Token Based"
        };
        break;
    }

    onBooking(bookingData);
    setBookingMode(null);
    setSelectedTimeSlot("");
    setSelectedTokenNumber("");
  };

  const StarRating = ({ rating, size = "sm" }) => {
    const starSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    const textSize = size === "lg" ? "text-lg" : "text-sm";
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`${starSize} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className={`${textSize} text-gray-600 ml-1`}>{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <button
              onClick={() => hospitalId ? navigate(`/hospital/${hospitalId}`) : navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-sm text-blue-600">{doctor.specialty}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Doctor Profile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col gap-6">
            {/* Mobile Layout - Doctor Info + Image */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-blue-200 shadow-lg"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
                <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-2">{doctor.specialty}</p>
                <p className="text-gray-600 mb-3 text-sm sm:text-base">{doctor.qualification}</p>
                
                {/* Rating and Reviews - Mobile Friendly */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-4">
                  <StarRating rating={doctor.rating} size="lg" />
                  <div className="text-sm text-gray-500">
                    {doctor.totalReviews} reviews
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-600 font-medium text-sm sm:text-base">{doctor.experience} experience</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fee Section - Separated for mobile */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">₹{doctor.consultationFee}</div>
              <div className="text-sm text-gray-500">consultation fee</div>
            </div>
            
            {/* Bio Section */}
            <div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{doctor.bio}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Hospital Selection & Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg p-4 sm:p-6 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Available Locations</h3>
              
              <div className="space-y-4">
                {doctor.hospitalSchedule.map((schedule) => (
                  <div
                    key={schedule.hospitalId}
                    onClick={() => setSelectedHospitalSchedule(schedule)}
                    className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                      selectedHospitalSchedule.hospitalId === schedule.hospitalId
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white/50 hover:border-blue-300 hover:bg-blue-25"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{schedule.hospitalName}</h4>
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${
                          schedule.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                        <span className={`text-xs sm:text-sm font-medium ${
                          schedule.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {schedule.status === 'active' ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Working Days</div>
                        <div className="font-medium text-gray-900">
                          {schedule.workDays.slice(0, 1).join(", ")}
                          {schedule.workDays.length > 1 && ` +${schedule.workDays.length - 1}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Timing</div>
                        <div className="font-medium text-gray-900">
                          {schedule.workStart} - {schedule.workEnd}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Current Token</div>
                        <div className="font-bold text-blue-600 text-base sm:text-lg">
                          #{schedule.currentToken}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Max Tokens</div>
                        <div className="font-medium text-gray-900">
                          {schedule.maxTokens}/day
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Book Appointment</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => setBookingMode('next')}
                  className="p-4 sm:p-6 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Next Token</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Get next available slot</p>
                    <div className="mt-2 text-base sm:text-lg font-bold text-blue-600">
                      #{selectedHospitalSchedule.currentToken + 1}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setBookingMode('time')}
                  className="p-4 sm:p-6 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">By Time</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Choose specific time</p>
                  </div>
                </button>

                <button
                  onClick={() => setBookingMode('token')}
                  className="p-4 sm:p-6 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Pick Token</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Choose token number</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Booking Modal/Panel - Mobile First */}
          <div className="lg:col-span-1">
            {bookingMode && (
              <>
                {/* Mobile Full Screen Modal */}
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                  <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-gray-900">
                          {bookingMode === 'next' && 'Next Available Token'}
                          {bookingMode === 'time' && 'Book by Time Slot'}
                          {bookingMode === 'token' && 'Choose Token Number'}
                        </h4>
                        <button
                          onClick={() => setBookingMode(null)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {/* Drag Handle */}
                      <div className="flex justify-center mt-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-600 mb-1">Selected Hospital</div>
                        <div className="font-medium text-gray-900 text-sm">{selectedHospitalSchedule.hospitalName}</div>
                      </div>

                      {bookingMode === 'next' && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Next Token</div>
                          <div className="text-2xl font-bold text-blue-600">
                            #{selectedHospitalSchedule.currentToken + 1}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Estimated wait: {Math.ceil(selectedHospitalSchedule.avgSeconds / 60)} minutes
                          </div>
                        </div>
                      )}

                      {bookingMode === 'time' && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Select Time Slot</label>
                          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                            {timeSlots.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`p-3 text-xs rounded-lg border transition-all duration-200 ${
                                  selectedTimeSlot === slot
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {bookingMode === 'token' && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Choose Token Number</label>
                          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                            {availableTokens.map(token => (
                              <button
                                key={token}
                                onClick={() => setSelectedTokenNumber(token.toString())}
                                className={`p-3 text-xs font-medium rounded-lg border transition-all duration-200 ${
                                  selectedTokenNumber === token.toString()
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-purple-400"
                                }`}
                              >
                                #{token}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-600 mb-1">Consultation Fee</div>
                        <div className="text-xl font-bold text-gray-900">₹{doctor.consultationFee}</div>
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        <button
                          onClick={() => handleBooking(bookingMode)}
                          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md text-base"
                        >
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => setBookingMode(null)}
                          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-gray-900">
                      {bookingMode === 'next' && 'Next Available Token'}
                      {bookingMode === 'time' && 'Book by Time Slot'}
                      {bookingMode === 'token' && 'Choose Token Number'}
                    </h4>
                    <button
                      onClick={() => setBookingMode(null)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Selected Hospital</div>
                      <div className="font-medium text-gray-900">{selectedHospitalSchedule.hospitalName}</div>
                    </div>

                    {bookingMode === 'next' && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Next Token</div>
                        <div className="text-2xl font-bold text-blue-600">
                          #{selectedHospitalSchedule.currentToken + 1}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Estimated wait: {Math.ceil(selectedHospitalSchedule.avgSeconds / 60)} minutes
                        </div>
                      </div>
                    )}

                    {bookingMode === 'time' && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Select Time Slot</label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {timeSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                                selectedTimeSlot === slot
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {bookingMode === 'token' && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Choose Token Number</label>
                        <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                          {availableTokens.map(token => (
                            <button
                              key={token}
                              onClick={() => setSelectedTokenNumber(token.toString())}
                              className={`p-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                selectedTokenNumber === token.toString()
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:border-purple-400"
                              }`}
                            >
                              #{token}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Consultation Fee</div>
                      <div className="text-xl font-bold text-gray-900">₹{doctor.consultationFee}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleBooking(bookingMode)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => setBookingMode(null)}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Doctor Stats - Mobile Friendly */}
            {!bookingMode && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Stats</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 text-sm sm:text-base">Current Token</span>
                    <span className="font-bold text-blue-600 text-sm sm:text-base">#{selectedHospitalSchedule.currentToken}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 text-sm sm:text-base">Avg. Time/Patient</span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{Math.ceil(selectedHospitalSchedule.avgSeconds / 60)} min</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 text-sm sm:text-base">Total Reviews</span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{doctor.totalReviews}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm sm:text-base">Experience</span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{doctor.experience}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}