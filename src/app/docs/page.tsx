"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import DoctorDashboardLayout from "@/components/dashboard/doctor-dashboard"
import DocHome from "@/components/doc/home"

function DoctorHomepage() {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("doctorId");
    if (!id) {
      router.push("/doc/login");
    } else {
      setDoctorId(id);
    }
  }, [router]);

  if (!doctorId) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <DoctorDashboardLayout>
      <DocHome doctorId={doctorId} />
    </DoctorDashboardLayout>
  )
}

export default DoctorHomepage