// src/app/admin/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Truck, Menu } from 'lucide-react';

// Custom components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Admin components
import AdminPatients from '@/components/admin/patients';
import AdminDoctors from '@/components/admin/doctors';
import AdminAppointments from '@/components/admin/appointments';
import AdminAmbulances from '@/components/admin/ambulances';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile on initial load and when resizing
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard md breakpoint
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    { id: 'patients', label: 'Patients', icon: <Users size={20} />, component: AdminPatients },
    { id: 'doctors', label: 'Doctors', icon: <UserPlus size={20} />, component: AdminDoctors },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, component: AdminAppointments },
    { id: 'ambulances', label: 'Ambulances', icon: <Truck size={20} />, component: AdminAmbulances }
  ];

  // Function to handle menu item click
  const handleMenuItemClick = (id: string) => {
    setActiveTab(id);
    if (isMobile) {
      setIsSheetOpen(false); // Close the sheet after selecting a menu item on mobile
    }
  };

  // The Sidebar component for desktop view
  const DesktopSidebar = () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-800 text-white">
      <div className="p-4 border-b border-slate-700">
        <Badge className="mb-2" variant="outline">Eazydoc Admin</Badge>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto pt-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                onClick={() => handleMenuItemClick(item.id)}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="flex items-center justify-start w-full px-4 py-3 text-left"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  // Mobile sidebar/sheet content
  const mobileSidebarContent = (
    <>
      <SheetHeader className="sr-only">
        <SheetTitle className="sr-only">Dashboard Items</SheetTitle>
      </SheetHeader>
      <div className="p-4 border-b border-slate-700">
        <Badge className="mb-2" variant="outline">Eazydoc Admin</Badge>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto pt-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                onClick={() => handleMenuItemClick(item.id)}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="flex items-center justify-start w-full px-4 py-3 text-left"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar - always visible on md+ screens */}
      <DesktopSidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Top navigation bar - visible on all screens */}
        <header className="bg-slate-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-slate-800 text-white">
                {mobileSidebarContent}
              </SheetContent>
            </Sheet>
            <Badge className="ml-2" variant="outline">Eazydoc Admin</Badge>
          </div>
          
          <div className="hidden md:flex md:items-center">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </div>
        </header>

        {/* Main content area with tabs */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="w-full">
            <Tabs value={activeTab} className="w-full">
              {menuItems.map((item) => (
                <TabsContent key={item.id} value={item.id} className="p-0">
                  <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h2 className="text-2xl font-bold mb-4">{item.label}</h2>
                    <div className="border-b border-gray-200 mb-4" />
                    {/* Render the appropriate component based on the active tab */}
                    {React.createElement(item.component)}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;