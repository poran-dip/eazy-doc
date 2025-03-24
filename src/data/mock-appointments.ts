// src/data/mock-appointments.ts
export interface Patient {
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
    appointmentHistory?: {
      date: string;
      notes: string;
    }[];
    day?: string;
  }
  
  export interface Schedule {
    workingHours: string;
    listOfPatients: Patient[];
  }
  
  export interface WeeklySchedule {
    [day: string]: Schedule;
  }
  
  export const allPatients: WeeklySchedule = {
    Monday: {
      workingHours: "2:00 PM - 4:00 PM",
      listOfPatients: [
        { 
          appointmentTime: '3:15 PM', 
          patientName: 'Alice Johnson', 
          condition: 'Arthritis', 
          description: 'Severe knee pain for 2 weeks',
          age: 58,
          sex: 'Female',
          prescriptions: [],
          tests: [],
          comments: '',
          appointmentHistory: [
            { date: '2025-02-10', notes: 'Initial consultation for knee pain' }
          ]
        },
        { 
          appointmentTime: '3:30 PM', 
          patientName: 'Bob Smith', 
          condition: 'Back Pain', 
          description: 'Sharp pain during movement',
          age: 45,
          sex: 'Male',
          prescriptions: [],
          tests: [],
          comments: '',
          appointmentHistory: [
            { date: '2025-01-15', notes: 'First reported back pain' },
            { date: '2025-02-22', notes: 'Followed up, pain persisting' }
          ]
        }
      ]
    },
    Tuesday: {
      workingHours: "2:00 PM - 4:00 PM",
      listOfPatients: [
        { 
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
          appointmentTime: '2:45 PM', 
          patientName: 'Dana Lee', 
          condition: 'Anxiety', 
          description: 'Generalized anxiety disorder',
          age: 29,
          sex: 'Female',
          prescriptions: [],
          tests: [],
          comments: '',
          appointmentHistory: [
            { date: '2024-12-05', notes: 'Initial diagnosis of GAD' }
          ]
        }
      ]
    },
    Wednesday: {
      workingHours: "2:00 PM - 4:00 PM",
      listOfPatients: [
        { 
          appointmentTime: '3:30 PM', 
          patientName: 'Eve Parker', 
          condition: 'Asthma', 
          description: 'Breathing difficulties',
          age: 26,
          sex: 'Female',
          prescriptions: [],
          tests: [],
          comments: '',
          appointmentHistory: [
            { date: '2025-01-20', notes: 'Routine check-up for asthma management' }
          ]
        },
        { 
          appointmentTime: '3:45 PM', 
          patientName: 'Frank Roberts', 
          condition: 'Hypertension', 
          description: 'Elevated blood pressure',
          age: 62,
          sex: 'Male',
          prescriptions: [],
          tests: [],
          comments: '',
          appointmentHistory: [
            { date: '2024-11-15', notes: 'BP: 145/95, prescribed medication' },
            { date: '2025-01-10', notes: 'BP: 135/85, continuing medication' }
          ]
        }
      ]
    },
    Thursday: {
      workingHours: "7:00 PM - 9:00 PM",
      listOfPatients: [
        { 
          appointmentTime: '7:00 PM', 
          patientName: 'Grace Chen', 
          condition: 'Diabetes', 
          description: 'Managing glucose levels',
          age: 54,
          sex: 'Female',
          prescriptions: [],
          tests: [],
          comments: '',
          appointmentHistory: [
            { date: '2024-12-12', notes: 'HbA1c: 7.2, diet control advised' }
          ]
        },
        { 
          appointmentTime: '7:15 PM', 
          patientName: 'Hank Wilson', 
          condition: 'Joint Pain', 
          description: 'Ongoing discomfort in knees', 
          isNew: true,
          age: 68,
          sex: 'Male',
          prescriptions: [],
          tests: [],
          comments: ''
        }
      ]
    },
    Friday: {
      workingHours: "7:00 PM - 9:00 PM",
      listOfPatients: [
        { 
          appointmentTime: '7:15 PM', 
          patientName: 'Ivy Zhang', 
          condition: 'Allergy', 
          description: 'Seasonal allergy management', 
          isNew: true,
          age: 35,
          sex: 'Female',
          prescriptions: [],
          tests: [],
          comments: ''
        },
        { 
          appointmentTime: '8:15 PM', 
          patientName: 'Jack Brown', 
          condition: 'Fatigue', 
          description: 'Chronic tiredness and exhaustion', 
          isNew: true,
          age: 41,
          sex: 'Male',
          prescriptions: [],
          tests: [],
          comments: ''
        }
      ]
    },
    Saturday: {
      workingHours: "Day off",
      listOfPatients: []
    },
    Sunday: {
      workingHours: "Day off",
      listOfPatients: []
    }
  };