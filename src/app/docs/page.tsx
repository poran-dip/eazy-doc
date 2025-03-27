"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, Activity, Settings, LogOut, Menu } from 'lucide-react';

// Custom components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

// Doc components
import DocHome from '@/components/doc/home';
import DocAppointments from '@/components/doc/appointments';
import DocStatus from '@/components/doc/status';
import DocSettings from '@/components/doc/settings';

// API utility for type-safe fetching
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  console.log("Token: ", token);
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'An error occurred');
  }

  return response.json();
}

const IntegratedDashboard = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorDetails, setDoctorDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch doctor details
  const fetchDoctorDetails = async (doctorId: string) => {
    try {
      console.log("Fetching doctor with ID:", doctorId);
      const doctorData = await fetchWithAuth(`/api/doctors/${doctorId}`);
      setDoctorDetails(doctorData);
      setDoctorName(doctorData.user.name);
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      toast.error('Error', {
        description: 'Failed to load doctor details',
      });
    }
  };

  // Check if logged in from localStorage on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      const storedUserId = localStorage.getItem('userId');
      const storedUserRole = localStorage.getItem('userRole');
      const storedToken = localStorage.getItem('token');
      
      // Explicitly check for doctor role
      if (
        storedIsLoggedIn === 'true' && 
        storedUserId && 
        storedToken && 
        storedUserRole === 'DOCTOR'
      ) {
        setIsLoggedIn(true);
        setDoctorId(storedUserId);
        
        // Fetch doctor details
        fetchDoctorDetails(storedUserId);
      } else {
        // Redirect to login if not logged in or not a doctor
        router.push('/docs/login');
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

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
    { id: 'home', label: 'Home', icon: <Home size={20} />, component: DocHome },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, component: DocAppointments },
    { id: 'status', label: 'Status', icon: <Activity size={20} />, component: DocStatus },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, component: DocSettings }
  ];

  // Function to handle logout
  const handleLogout = () => {
    // Clear all localStorage items related to authentication
    ['doctorId', 'doctorName', 'doctorEmail', 'isLoggedIn', 'token'].forEach(key => 
      localStorage.removeItem(key)
    );
    
    setIsLoggedIn(false);
    router.push('/docs/login');
  };

  // Function to handle menu item click
  const handleMenuItemClick = (id: string) => {
    setActiveTab(id);
    if (isMobile) {
      setIsSheetOpen(false); // Close the sheet after selecting a menu item on mobile
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-600">Loading dashboard...</p>
        </Card>
      </div>
    );
  }

  // If not logged in, 401 error is handled by redirect in useEffect

  // The Sidebar component for desktop view
  const DesktopSidebar = () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-800 text-white">
      <div className="p-4 border-b border-slate-700">
        <Badge className="mb-2" variant="outline">Eazydoc for Docs</Badge>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-sm text-slate-300 mt-2">Welcome, {doctorName}</p>
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
      
      <div className="border-t border-slate-700 p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="flex items-center justify-start w-full px-4 py-2 text-left"
        >
          <span className="mr-3"><LogOut size={20} /></span>
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  // Mobile sidebar/sheet content
  const mobileSidebarContent = (
    <>
      <SheetHeader className="sr-only">
        <SheetTitle className="sr-only">Dashboard Items</SheetTitle>
      </SheetHeader>
      <div className="p-4 border-b border-slate-700">
        <Badge className="mb-2" variant="outline">Eazydoc for Docs</Badge>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-sm text-slate-300 mt-2">Welcome, {doctorName}</p>
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
      
      <div className="border-t border-slate-700 p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="flex items-center justify-start w-full px-4 py-2 text-left"
        >
          <span className="mr-3"><LogOut size={20} /></span>
          <span>Logout</span>
        </Button>
      </div>
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
            <Badge className="ml-2" variant="outline">Eazydoc</Badge>
            <h2 className="text-xl font-bold ml-2">Dashboard</h2>
          </div>
          
          <div className="hidden md:flex md:items-center">
            <h2 className="text-xl font-bold">Doctor Dashboard</h2>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
          >
            <LogOut size={20} />
          </Button>
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
                    {React.createElement(item.component, { 
                      doctorId, 
                      doctorDetails 
                    })}
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

export default IntegratedDashboard;