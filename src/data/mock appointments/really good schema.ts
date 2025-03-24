export interface Admin {
    id: string;
    email: string;
    hashedPassword: string;
}

export interface Appointment {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    patientId: string;
    condition?: string;
    description?: string;
    emergency: boolean;
    status?: 'new' | 'doctor assigned' | 'completed' | 'cancelled';
    doctorId?: string;
    ambulanceId?: string;
    prescriptions?: { 
        name: string; 
        dosage: string;
    }[];
    tests?: { 
        name: string; 
        result?: string; 
        dateOrdered?: string 
    }[];
    comments?: string;
    linkedAppointments?: string[]; // array of related appointment IDs (follow ups, etc.)
}

export interface Patient {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
    dob: Date;
    age: number;
    sex: 'Male' | 'Female' | 'Other';
    contactInfo: {
        phone?: string;
        address?: string;
    };
    appointments?: string[]; // array of appointment IDs
}

export interface Doctor {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
    specialization: string;
    yearsOfExperience: number;
    licenseNumber: string;
    contactInfo: {
        phone?: string;
        officeAddress?: string;
    };
    hours?: { 
        day: string;
        workingHours: string;
    }[];
    appointments?: string[]; // array of appointment IDs
    schedule?: string[]; // array of schedule IDs
}

export interface Schedule {
    id: string;
    doctorId: string;
    date: string;
    isHoliday: boolean;
    slots: string[]; // array of slot IDs
}

export interface Slot {
    id: string;
    scheduleId: string;
    startTime: string; // e.g., '09:00'
    endTime: string; // e.g., '09:15', 15 min slots
    isBooked: boolean;
}

export interface Ambulance {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
    licenseNumber: string;
    contactInfo: {
        phone: string;
        alternatePhone?: string;
    };
    location?: {
        latitude: number;
        longitude: number;
    };
    appointments: string[]; // array of appointment IDs
}
