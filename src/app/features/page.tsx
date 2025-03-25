import React from 'react';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function FeaturesPage() {
  const patientFeatures = [
    "AI-Powered Doctor Matching",
    "24/7 Emergency Services",
    "Easy Online Booking",
    "Digital Prescription Tracking",
    "Test Result Management",
    "Comprehensive Medical History"
  ];

  const doctorFeatures = [
    "Centralized Appointment Management",
    "Digital Patient Records",
    "Reduced Paperwork",
    "Real-Time Patient Insights",
    "Seamless Communication Tools"
  ];

  const adminFeatures = [
    "Comprehensive Dashboard",
    "Staff and Patient Management",
    "Appointment Tracking",
    "Resource Allocation Insights",
    "Performance Analytics"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-12">Platform Features</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {patientFeatures.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              {doctorFeatures.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Check className="mr-2 text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              {adminFeatures.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Check className="mr-2 text-purple-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}