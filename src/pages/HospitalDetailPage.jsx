import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HospitalDetailPage({ hospitals, doctors }) {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  
  const hospital = hospitals.find(h => h.id === hospitalId);
  
  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hospital Not Found</h2>
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

  const hospitalDoctors = doctors.filter(doctor => 
    doctor.hospitalSchedule.some(schedule => schedule.hospitalId === hospital.id)
  );

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
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{hospital.name}</h1>
              <p className="text-sm text-gray-500">{hospital.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden mb-8">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden">
            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{hospital.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hospital.address}
                    </p>
                    <div className="flex items-center gap-6 mb-4">
                      <StarRating rating={hospital.rating} size="lg" />
                      <div className="text-sm text-gray-500">
                        {hospital.totalReviews.toLocaleString()} reviews
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700">Open Now</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">{hospital.description}</p>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {hospital.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-2 text-gray-700">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-1">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{hospital.phone}</span>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{hospital.address}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Doctors</h3>
          
          {hospitalDoctors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hospitalDoctors.map(doctor => {
                const hospitalSchedule = doctor.hospitalSchedule.find(s => s.hospitalId === hospital.id);
                
                return (
                  <div
                    key={doctor.id}
                    onClick={() => navigate(`/doctor/${doctor.id}/hospital/${hospital.id}`)}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {doctor.name}
                        </h4>
                        <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                        <div className="mt-2">
                          <StarRating rating={doctor.rating} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium text-gray-900">{doctor.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation:</span>
                        <span className="font-medium text-green-600">₹{doctor.consultationFee}</span>
                      </div>
                      {hospitalSchedule && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Token:</span>
                            <span className="font-bold text-blue-600">#{hospitalSchedule.currentToken}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Available:</span>
                            <span className={`font-medium ${
                              hospitalSchedule.status === 'active' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {hospitalSchedule.status === 'active' ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for available doctors</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}