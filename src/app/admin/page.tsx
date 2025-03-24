"use client"

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Truck, Settings, LogOut, AlertCircle, ArrowLeft, Menu, Lock, User } from 'lucide-react';
import Link from "next/link"
import bcrypt from 'bcryptjs';

// Custom components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Admin components
import AdminPatients from '@/components/admin/patients';
import AdminDoctors from '@/components/admin/doctors';
import AdminAppointments from '@/components/admin/appointments';
import AdminAmbulances from '@/components/admin/ambulances';

// Add environment variables access
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const AdminDashboard = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Function to handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      // For development/testing - match against environment variables
      if (username === ADMIN_USERNAME) {
        // Using bcrypt to compare the password
        const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD ?? "");
        
        if (isMatch) {
          setIsLoggedIn(true);
          setUsername('');
          setPassword('');
        } else {
          setLoginError('Invalid username or password');
        }
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('patients');
  };

  // Function to handle menu item click
  const handleMenuItemClick = (id: string) => {
    setActiveTab(id);
    if (isMobile) {
      setIsSheetOpen(false); // Close the sheet after selecting a menu item on mobile
    }
  };

  // If not logged in, display login form
  if (!isLoggedIn) {
    console.log("Username from env:", ADMIN_USERNAME);
    console.log("Password hash from env:", ADMIN_PASSWORD);
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <Lock size={48} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Admin Login</h1>
          <p className="text-slate-600 mb-6 text-center">Enter your credentials to access the dashboard</p>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {loginError}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              
              <Link href="/" className="w-full">
                <Button 
                  type="button" 
                  className="w-full bg-white hover:bg-blue-50 text-blue-600"
                  variant="outline"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Eazydoc
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    );
  }

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
            <Badge className="ml-2" variant="outline">Eazydoc Admin</Badge>
          </div>
          
          <div className="hidden md:flex md:items-center">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
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