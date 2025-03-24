// src/data/mock-appointments.ts

export interface Appointment {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    patientId: string;
    condition?: string;
    description?: string;
    doctorId?: string;
    prescriptions?: string[];
    tests?: string[];
    comments?: string;
    appointmentHistory?: string[]; // array of appointment IDs
}

export const allAppointments: Appointment[] = [
    {
        id: '1',
        appointmentDate: '2025-03-10',
        appointmentTime: '3:15 PM',
        patientId: 'p001',
        condition: 'Arthritis',
        description: 'Severe knee pain for 2 weeks',
        prescriptions: [],
        tests: [],
        comments: '',
        appointmentHistory: ['a001']
    },
    {
        id: '2',
        appointmentDate: '2025-03-10',
        appointmentTime: '3:30 PM',
        patientId: 'p002',
        condition: 'Back Pain',
        description: 'Sharp pain during movement',
        prescriptions: [],
        tests: [],
        comments: '',
        appointmentHistory: ['a002', 'a003']
    },
    {
        id: '3',
        appointmentDate: '2025-03-11',
        appointmentTime: '2:30 PM',
        patientId: 'p003',
        condition: 'Migraine',
        description: 'Frequent headaches with nausea',
        prescriptions: [],
        tests: [],
        comments: ''
    },
    {
        id: '4',
        appointmentDate: '2025-03-11',
        appointmentTime: '2:45 PM',
        patientId: 'p004',
        condition: 'Anxiety',
        description: 'Generalized anxiety disorder',
        prescriptions: [],
        tests: [],
        comments: '',
        appointmentHistory: ['a004']
    },
    {
        id: '5',
        appointmentDate: '2025-03-12',
        appointmentTime: '3:30 PM',
        patientId: 'p005',
        condition: 'Asthma',
        description: 'Breathing difficulties',
        prescriptions: [],
        tests: [],
        comments: '',
        appointmentHistory: ['a005']
    },
    {
        id: '6',
        appointmentDate: '2025-03-12',
        appointmentTime: '3:45 PM',
        patientId: 'p006',
        condition: 'Hypertension',
        description: 'Elevated blood pressure',
        prescriptions: [],
        tests: [],
        comments: '',
        appointmentHistory: ['a006', 'a007']
    }
];
