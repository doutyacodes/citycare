export const hospitals = [
  {
    id: "hosp-1001",
    name: "CityCare Medical Center",
    address: "123 Health Street, Medical District",
    phone: "+91-9876543210",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=300&fit=crop",
    rating: 4.8,
    totalReviews: 1250,
    specialties: ["Cardiology", "Neurology", "Orthopedics", "General Medicine"],
    amenities: ["24/7 Emergency", "Pharmacy", "Lab Services", "Parking"],
    description: "Leading healthcare provider with state-of-the-art facilities and experienced medical professionals."
  },
  {
    id: "hosp-1002", 
    name: "MedPlus Hospital",
    address: "456 Wellness Avenue, Healthcare Zone",
    phone: "+91-9876543211",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
    rating: 4.6,
    totalReviews: 890,
    specialties: ["Pediatrics", "Dermatology", "ENT", "Gastroenterology"],
    amenities: ["Digital X-Ray", "ICU", "Blood Bank", "Cafeteria"],
    description: "Comprehensive healthcare services with focus on patient comfort and advanced medical technology."
  },
  {
    id: "hosp-1003",
    name: "Apollo Healthcare",
    address: "789 Medical Plaza, City Center", 
    phone: "+91-9876543212",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
    rating: 4.9,
    totalReviews: 2150,
    specialties: ["Cardiology", "Urology", "Endocrinology", "General Medicine"],
    amenities: ["MRI/CT Scan", "Cardiac Unit", "Dialysis", "Ambulance"],
    description: "Premier multi-specialty hospital known for excellence in cardiac care and advanced diagnostics."
  }
];

export const doctors = [
  {
    id: "doc-1000",
    name: "Dr. Anita Sharma",
    specialty: "Cardiology",
    bio: "Senior Cardiologist with 15+ years experience in interventional cardiology and heart surgeries.",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: "15 years",
    rating: 4.9,
    totalReviews: 340,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    consultationFee: 800,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1001",
        hospitalName: "CityCare Medical Center",
        workDays: ["Monday", "Wednesday", "Friday"],
        workStart: "9:00",
        workEnd: "17:00",
        maxTokens: 25,
        currentToken: 3,
        lastAssigned: 12,
        avgSeconds: 1200,
        status: "active"
      },
      {
        hospitalId: "hosp-1003", 
        hospitalName: "Apollo Healthcare",
        workDays: ["Tuesday", "Thursday", "Saturday"],
        workStart: "10:00",
        workEnd: "16:00", 
        maxTokens: 20,
        currentToken: 2,
        lastAssigned: 8,
        avgSeconds: 1200,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1001",
    name: "Dr. Rajesh Iyer",
    specialty: "General Physician",
    bio: "Experienced family physician specializing in preventive care and chronic disease management.",
    qualification: "MBBS, MD (General Medicine)",
    experience: "12 years",
    rating: 4.7,
    totalReviews: 520,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face",
    consultationFee: 500,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1001",
        hospitalName: "CityCare Medical Center",
        workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        workStart: "8:00",
        workEnd: "18:00",
        maxTokens: 40,
        currentToken: 5,
        lastAssigned: 18,
        avgSeconds: 600,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1002", 
    name: "Dr. Kiran Menon",
    specialty: "Orthopedics",
    bio: "Orthopedic surgeon specializing in joint replacement and sports injury treatment.",
    qualification: "MBBS, MS (Orthopedics)",
    experience: "18 years",
    rating: 4.8,
    totalReviews: 280,
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=200&h=200&fit=crop&crop=face",
    consultationFee: 750,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1001",
        hospitalName: "CityCare Medical Center",
        workDays: ["Monday", "Wednesday", "Friday"],
        workStart: "9:00",
        workEnd: "15:00",
        maxTokens: 20,
        currentToken: 3,
        lastAssigned: 15,
        avgSeconds: 900,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1003",
    name: "Dr. Priya Nair", 
    specialty: "Dermatology",
    bio: "Dermatologist with expertise in cosmetic procedures and skin cancer treatment.",
    qualification: "MBBS, MD (Dermatology)",
    experience: "10 years",
    rating: 4.6,
    totalReviews: 195,
    image: "https://images.unsplash.com/photo-1594824388853-28bf0d6a4e5c?w=200&h=200&fit=crop&crop=face",
    consultationFee: 650,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1002",
        hospitalName: "MedPlus Hospital", 
        workDays: ["Tuesday", "Thursday", "Saturday"],
        workStart: "10:00",
        workEnd: "18:00",
        maxTokens: 25,
        currentToken: 4,
        lastAssigned: 20,
        avgSeconds: 1200,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1004",
    name: "Dr. Suresh Kumar",
    specialty: "Pediatrics", 
    bio: "Pediatrician with special focus on child development and vaccination programs.",
    qualification: "MBBS, MD (Pediatrics)",
    experience: "14 years",
    rating: 4.9,
    totalReviews: 450,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    consultationFee: 600,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1002",
        hospitalName: "MedPlus Hospital",
        workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        workStart: "9:00",
        workEnd: "17:00",
        maxTokens: 35,
        currentToken: 6,
        lastAssigned: 22,
        avgSeconds: 600,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1005",
    name: "Dr. Meera Das",
    specialty: "ENT",
    bio: "ENT specialist with expertise in hearing disorders and sinus treatments.",
    qualification: "MBBS, MS (ENT)",
    experience: "11 years", 
    rating: 4.5,
    totalReviews: 180,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    consultationFee: 700,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1002",
        hospitalName: "MedPlus Hospital",
        workDays: ["Monday", "Wednesday", "Friday"],
        workStart: "11:00",
        workEnd: "19:00",
        maxTokens: 20,
        currentToken: 2,
        lastAssigned: 12,
        avgSeconds: 1500,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1006",
    name: "Dr. Arjun Varma",
    specialty: "Neurology",
    bio: "Neurologist specializing in stroke treatment and neurological disorders.",
    qualification: "MBBS, MD, DM (Neurology)",
    experience: "16 years",
    rating: 4.8,
    totalReviews: 220,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face",
    consultationFee: 900,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1001",
        hospitalName: "CityCare Medical Center",
        workDays: ["Tuesday", "Thursday"],
        workStart: "14:00",
        workEnd: "20:00",
        maxTokens: 15,
        currentToken: 1,
        lastAssigned: 8,
        avgSeconds: 1800,
        status: "active"
      },
      {
        hospitalId: "hosp-1003",
        hospitalName: "Apollo Healthcare",
        workDays: ["Monday", "Wednesday", "Friday"],
        workStart: "10:00",
        workEnd: "16:00",
        maxTokens: 18,
        currentToken: 3,
        lastAssigned: 10,
        avgSeconds: 1800,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1007",
    name: "Dr. Leena George",
    specialty: "Gastroenterology",
    bio: "Gastroenterologist with expertise in digestive disorders and endoscopic procedures.",
    qualification: "MBBS, MD, DM (Gastroenterology)",
    experience: "13 years",
    rating: 4.7,
    totalReviews: 165,
    image: "https://images.unsplash.com/photo-1594824388853-28bf0d6a4e5c?w=200&h=200&fit=crop&crop=face",
    consultationFee: 850,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1002",
        hospitalName: "MedPlus Hospital",
        workDays: ["Tuesday", "Thursday", "Saturday"],
        workStart: "9:00",
        workEnd: "15:00",
        maxTokens: 20,
        currentToken: 4,
        lastAssigned: 16,
        avgSeconds: 1200,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1008",
    name: "Dr. Thomas Mathew",
    specialty: "Urology",
    bio: "Urologist specializing in kidney stone treatment and minimally invasive procedures.",
    qualification: "MBBS, MS (Urology)",
    experience: "12 years",
    rating: 4.6,
    totalReviews: 140,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    consultationFee: 800,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1003",
        hospitalName: "Apollo Healthcare",
        workDays: ["Monday", "Wednesday", "Friday"],
        workStart: "11:00",
        workEnd: "17:00",
        maxTokens: 18,
        currentToken: 2,
        lastAssigned: 14,
        avgSeconds: 1500,
        status: "active"
      }
    ],
    reserved: []
  },
  {
    id: "doc-1009",
    name: "Dr. Radhika Pillai",
    specialty: "Endocrinology",
    bio: "Endocrinologist specializing in diabetes management and hormonal disorders.",
    qualification: "MBBS, MD, DM (Endocrinology)",
    experience: "9 years",
    rating: 4.8,
    totalReviews: 210,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    consultationFee: 750,
    hospitalSchedule: [
      {
        hospitalId: "hosp-1003",
        hospitalName: "Apollo Healthcare",
        workDays: ["Tuesday", "Thursday", "Saturday"],
        workStart: "10:00",
        workEnd: "16:00",
        maxTokens: 22,
        currentToken: 3,
        lastAssigned: 18,
        avgSeconds: 900,
        status: "active"
      }
    ],
    reserved: []
  }
];