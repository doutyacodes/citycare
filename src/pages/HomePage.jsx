import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage({ hospitals, doctors, userBookings }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return { hospitals, doctors: [] };
    }

    const filteredHospitals = hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(query) ||
      hospital.specialties.some(spec => spec.toLowerCase().includes(query)) ||
      hospital.address.toLowerCase().includes(query)
    );

    const filteredDoctors = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.qualification.toLowerCase().includes(query)
    );

    return {
      hospitals: searchType === "doctors" ? [] : filteredHospitals,
      doctors: searchType === "hospitals" ? [] : filteredDoctors
    };
  }, [searchQuery, searchType, hospitals, doctors]);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthCare</h1>
                <p className="text-sm text-gray-500">Find the best care near you</p>
              </div>
            </div>
            
            {userBookings.length > 0 && (
              <button
                onClick={() => navigate('/bookings')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-700 font-medium">{userBookings.length} Active Bookings</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Hospitals & Doctors</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search hospitals, doctors, or specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                  />
                </div>
              </div>
              
              <div className="flex bg-gray-100 rounded-xl p-1">
                {[
                  { key: "all", label: "All" },
                  { key: "hospitals", label: "Hospitals" },
                  { key: "doctors", label: "Doctors" }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSearchType(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      searchType === key
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results or Default Content */}
        {searchQuery && (searchResults.hospitals.length > 0 || searchResults.doctors.length > 0) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Results for "{searchQuery}"
            </h3>
            
            {/* Doctor Results */}
            {searchResults.doctors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Doctors ({searchResults.doctors.length})</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.doctors.map(doctor => (
                    <div
                      key={doctor.id}
                      onClick={() => navigate(`/doctor/${doctor.id}`)}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {doctor.name}
                          </h5>
                          <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                          <div className="mt-2">
                            <StarRating rating={doctor.rating} />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">₹{doctor.consultationFee} consultation</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Available at {doctor.hospitalSchedule.length} location{doctor.hospitalSchedule.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hospital Results */}
            {searchResults.hospitals.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Hospitals ({searchResults.hospitals.length})</h4>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.hospitals.map(hospital => (
                    <div
                      key={hospital.id}
                      onClick={() => navigate(`/hospital/${hospital.id}`)}
                      className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-200/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={hospital.image}
                          alt={hospital.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h5 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {hospital.name}
                        </h5>
                        <p className="text-gray-600 text-sm mt-1">{hospital.address}</p>
                        <div className="flex items-center justify-between mt-3">
                          <StarRating rating={hospital.rating} />
                          <span className="text-xs text-gray-500">
                            {hospital.totalReviews} reviews
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {hospital.specialties.slice(0, 3).map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                          {hospital.specialties.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{hospital.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Default Hospital Grid */}
        {!searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Featured Hospitals</h3>
              <p className="text-sm text-gray-500">{hospitals.length} hospitals available</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  onClick={() => navigate(`/hospital/${hospital.id}`)}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                        {hospital.name}
                      </h4>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-700">Open</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hospital.address}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={hospital.rating} />
                      <span className="text-sm text-gray-500">
                        {hospital.totalReviews.toLocaleString()} reviews
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {hospital.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          {specialty}
                        </span>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                          +{hospital.specialties.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {hospital.amenities.slice(0, 2).map(amenity => (
                          <span key={amenity} className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results message */}
        {searchQuery && searchResults.hospitals.length === 0 && searchResults.doctors.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.681-6.283-1.849" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}