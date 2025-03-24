import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Pencil, Trash2, Plus, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Define types based on Prisma schema
interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  appointmentCount?: number; // Just count instead of full appointments array
  appointments?: Array<Appointment>;
}

interface Appointment {
  id: string;
  dateTime: Date | string | null;
  condition: string | null;
  status: 'NEW' | 'PENDING' | 'COMPLETED' | 'CANCELED';
  patient: Patient;
}

interface Patient {
  id: string;
  name: string;
}

interface AppointmentViewProps {
  doctorId: string;
  doctorName: string;
}

// Appointment view component that fetches its own data
const AppointmentView: React.FC<AppointmentViewProps> = ({ doctorId, doctorName }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/doctors/${doctorId}/appointments`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-center text-red-600">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Appointments for {doctorName}</h2>
      
      {appointments.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p>No appointments scheduled for this doctor.</p>
        </div>
      ) : (
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.dateTime ? new Date(appointment.dateTime).toLocaleString() : 'Not scheduled'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.condition || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${appointment.status === 'NEW' ? 'bg-blue-100 text-blue-800' : ''}
                      ${appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                      ${appointment.status === 'CANCELED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Doctor form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('');

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      const doctorsWithCount = data.map((doctor: Doctor) => ({
        ...doctor,
        appointmentCount: doctor.appointments?.length || 0
      }));
      
      setDoctors(doctorsWithCount);
      setFilteredDoctors(doctorsWithCount);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error("Error", {
        description: "Failed to fetch doctors. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(term) || 
        doctor.email.toLowerCase().includes(term) ||
        doctor.specialization.toLowerCase().includes(term)
      );
      setFilteredDoctors(filtered);
    }
  };

  // Add doctor
  const handleAddDoctor = () => {
    // Reset form
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormSpecialization('');
    setIsAddDialogOpen(true);
  };

  // Submit new doctor
  const submitNewDoctor = async () => {
    if (!formName || !formEmail || !formPassword || !formSpecialization) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          specialization: formSpecialization,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add doctor');
      }

      await fetchDoctors();
      setIsAddDialogOpen(false);
      toast.success("Success", {
        description: "Doctor added successfully",
      });
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to add doctor",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit doctor
  const handleEditDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setFormName(doctor.name);
    setFormEmail(doctor.email);
    setFormPassword(''); // Don't populate password for security
    setFormSpecialization(doctor.specialization);
    setIsEditDialogOpen(true);
  };

  // Submit edited doctor
  const submitEditedDoctor = async () => {
    if (!currentDoctor || !formName || !formEmail || !formSpecialization) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const requestBody: any = {
        name: formName,
        email: formEmail,
        specialization: formSpecialization,
      };
      
      // Only include password if it was changed
      if (formPassword) {
        requestBody.password = formPassword;
      }

      const response = await fetch(`/api/doctors/${currentDoctor.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update doctor');
      }

      await fetchDoctors();
      setIsEditDialogOpen(false);
      toast.success("Success", {
        description: "Doctor updated successfully",
      });
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update doctor",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete doctor
  const handleDeleteClick = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentDoctor) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/doctors/${currentDoctor.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete doctor');
      }

      await fetchDoctors();
      setIsDeleteDialogOpen(false);
      toast.success("Success", {
        description: "Doctor deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to delete doctor",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // View appointments
  const handleViewAppointments = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setIsAppointmentDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Doctors Dashboard Button */}
      <Link href="/docs">
        <Button className="fixed top-20 right-4 bg-blue-600 text-white text-lg hover:bg-blue-700">
          Doctor Dashboard
        </Button>
      </Link>

      {/* Header and controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center flex-1">
          <Search className="mr-2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow"
          />
        </div>
        
        <Button onClick={handleAddDoctor} className="flex items-center bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Doctor
        </Button>
      </div>

      {/* Doctors Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of all registered doctors</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Appointments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.appointmentCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAppointments(doctor)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDoctor(doctor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(doctor)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Doctor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Enter the doctor's details below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Specialization
              </Label>
              <Input
                id="specialization"
                value={formSpecialization}
                onChange={(e) => setFormSpecialization(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={submitNewDoctor}
              disabled={isSubmitting || !formName || !formEmail || !formPassword || !formSpecialization}
            >
              {isSubmitting ? "Adding..." : "Add Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>
              Update the doctor's details below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">
                Password
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-specialization" className="text-right">
                Specialization
              </Label>
              <Input
                id="edit-specialization"
                value={formSpecialization}
                onChange={(e) => setFormSpecialization(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={submitEditedDoctor}
              disabled={isSubmitting || !formName || !formEmail || !formSpecialization}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentDoctor?.name}'s record and might affect appointments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Appointments Dialog */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Doctor's Appointments</DialogTitle>
            <DialogDescription>
              Viewing all appointments for {currentDoctor?.name}
            </DialogDescription>
          </DialogHeader>
          
          {currentDoctor && (
            <div className="py-2">
              <AppointmentView 
                doctorId={currentDoctor.id}
                doctorName={currentDoctor.name}
              />
            </div>
          )}
          
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctors;