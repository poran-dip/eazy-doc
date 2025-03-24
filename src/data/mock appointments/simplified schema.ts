// Core User type that others extend
export interface User {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
    phone?: string;
}
  
// Patient
export interface Patient extends User {
    dateOfBirth: Date;
    gender: string;
    address?: string;
}
  
// Doctor
export interface Doctor extends User {
    specialization: string;
    yearsOfExperience: number;
    licenseNumber: string;
    workingDays: string[]; // E.g. ["Monday", "Wednesday", "Friday"]
    workingHours: string; // E.g. "9:00-17:00"
}
  
// Admin - for dev testing
export interface Admin extends User {
    role: "super admin";
}
  
// Ambulance
export interface Ambulance extends User {
    vehicleId: string;
    licenseNumber: string;
    isAvailable: boolean;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
}
  
// Appointment
export interface Appointment {
    id: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    patientId: string;
    doctorId: string;
    ambulanceId?: string; // Optional - only for emergency appointments
    status: string; // "new", "completed", "cancelled"
    isEmergency: boolean;
    notes?: string;
}
