export interface Patient {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    patientName: string;
    condition?: string;
    description?: string;
    isNew?: boolean;
    age?: number;
    sex?: string;
    prescriptions?: string[];
    tests?: string[];
    comments?: string;
    appointmentHistory?: string[]; // Array of appointment IDs
  }
  
  export const allPatients: Patient[] = [
    {
      id: 'apt-001',
      appointmentDate: '2025-03-17',
      appointmentTime: '3:15 PM',
      patientName: 'Alice Johnson',
      condition: 'Arthritis',
      description: 'Severe knee pain for 2 weeks',
      age: 58,
      sex: 'Female',
      prescriptions: [],
      tests: [],
      comments: '',
      appointmentHistory: ['apt-101']
    },
    {
      id: 'apt-002',
      appointmentDate: '2025-03-17',
      appointmentTime: '3:30 PM',
      patientName: 'Bob Smith',
      condition: 'Back Pain',
      description: 'Sharp pain during movement',
      age: 45,
      sex: 'Male',
      prescriptions: [],
      tests: [],
      comments: '',
      appointmentHistory: ['apt-201', 'apt-202']
    },
    {
      id: 'apt-003',
      appointmentDate: '2025-03-18',
      appointmentTime: '2:30 PM',
      patientName: 'Charlie Wu',
      condition: 'Migraine',
      description: 'Frequent headaches with nausea',
      isNew: true,
      age: 32,
      sex: 'Male',
      prescriptions: [],
      tests: [],
      comments: ''
    },
    {
      id: 'apt-004',
      appointmentDate: '2025-03-18',
      appointmentTime: '2:45 PM',
      patientName: 'Dana Lee',
      condition: 'Anxiety',
      description: 'Generalized anxiety disorder',
      age: 29,
      sex: 'Female',
      prescriptions: [],
      tests: [],
      comments: '',
      appointmentHistory: ['apt-301']
    },
    {
      id: 'apt-005',
      appointmentDate: '2025-03-19',
      appointmentTime: '3:30 PM',
      patientName: 'Eve Parker',
      condition: 'Asthma',
      description: 'Breathing difficulties',
      age: 26,
      sex: 'Female',
      prescriptions: [],
      tests: [],
      comments: '',
      appointmentHistory: ['apt-401']
    },
    {
      id: 'apt-006',
      appointmentDate: '2025-03-19',
      appointmentTime: '3:45 PM',
      patientName: 'Frank Roberts',
      condition: 'Hypertension',
      description: 'Elevated blood pressure',
      age: 62,
      sex: 'Male',
      prescriptions: [],
      tests: [],
      comments: '',
      appointmentHistory: ['apt-501', 'apt-502']
    }
  ];
  