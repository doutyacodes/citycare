import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingDetailsPage({ userBookings }) {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const calculateTimeLeft = (booking) => {
    const now = new Date();
    const createdAt = new Date(booking.createdAt);
    const estimatedMinutes = parseInt(booking.estimatedTime) || 0;
    const appointmentTime = new Date(createdAt.getTime() + estimatedMinutes * 60000);
    
    const timeDiff = appointmentTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return "Appointment time passed";
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-sm text-gray-500">{userBookings.length} booking{userBookings.length !== 1 ? 's' : ''} found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m-6-8h6m-6 8h6" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-2 text-sm text-gray-500">You haven't made any appointments yet</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {userBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Booking Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Token #{booking.tokenNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Time Left Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Time Remaining</div>
                        <div className="text-xl font-bold text-blue-600">
                          {calculateTimeLeft(booking)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Doctor Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Doctor Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{booking.doctorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialty:</span>
                          <span className="font-medium text-blue-600">{booking.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fee:</span>
                          <span className="font-medium text-green-600">₹{booking.consultationFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Hospital Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hospital:</span>
                          <span className="font-medium text-gray-900">{booking.hospitalName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Slot:</span>
                          <span className="font-medium text-gray-900">{booking.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mode:</span>
                          <span className="font-medium text-purple-600 capitalize">{booking.mode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Booking Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Booked On:</span>
                          <div className="font-medium text-gray-900 mt-1">
                            {formatDate(booking.createdAt)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Token Number:</span>
                          <div className="font-bold text-blue-600 text-lg mt-1">
                            #{booking.tokenNumber}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Wait:</span>
                          <div className="font-medium text-gray-900 mt-1">
                            {booking.estimatedTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      View Details
                    </button>
                    {booking.status === 'booked' && (
                      <button className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Booking Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Booking Details - Token #{selectedBooking.tokenNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Status and Time */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                      <div className="text-lg font-bold text-blue-600">
                        {calculateTimeLeft(selectedBooking)}
                      </div>
                    </div>
                  </div>

                  {/* Complete Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Info (if available) */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-600">User Name:</span>
                          <span className="font-medium text-gray-900">Current User</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">+91-XXXXXXXXXX</span>
                        </div>
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Doctor Information</h3>
                      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Doctor Name:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.doctorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialty:</span>
                          <span className="font-medium text-blue-600">{selectedBooking.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consultation Fee:</span>
                          <span className="font-medium text-green-600">₹{selectedBooking.consultationFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hospital Details */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Hospital Information</h3>
                      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hospital Name:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.hospitalName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-gray-900">Medical District</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
                      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token Number:</span>
                          <span className="font-bold text-blue-600 text-lg">#{selectedBooking.tokenNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Slot:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Mode:</span>
                          <span className="font-medium text-purple-600 capitalize">{selectedBooking.mode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Time:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Timeline */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Booking Timeline</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">
                          Booked on {formatDate(selectedBooking.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-900">
                          Waiting for appointment - {calculateTimeLeft(selectedBooking)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                  {selectedBooking.status === 'booked' && (
                    <button className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200">
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}