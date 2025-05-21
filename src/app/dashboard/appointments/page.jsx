"use client";
import DashboardLayout from '@/components/dashboard/dash-layout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, MapPin, User,Info } from "lucide-react";
import AppointmentListSkeleton from './loading';
import { formatTime,formatDate } from '@/utils/constants';

export default function AppointmentPage() {
  const router = useRouter();
  const {user,isLoaded,isSignedIn} = useUser();

  const [appointments,setAppointments] = useState([]); 

  const fetchAppointments = async () => {
    const response = await fetch('../../api/get-appointments');
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    const data = await response.json();
    console.log("d",data);
    setAppointments(data.appointmentData);
  }
  useEffect(() => {
    if(!isLoaded || !isSignedIn) {
      return;
    }
    fetchAppointments();
  }, [isLoaded, isSignedIn]);

  const deleteAppointment = async (id) => {
    const response = await fetch(`../../api/delete-appointment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete appointment');
    }
    const data = await response.json();
    console.log("d",data);
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== id)
    );
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(id);
    }
  }

  if((appointments.length === 0 && isLoaded && isSignedIn)|| !isLoaded || !isSignedIn) {
    return <DashboardLayout><AppointmentListSkeleton/></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className='flex flex-col  p-6 space-y-6' >
      <Button variant="outline" className=" max-w-xl mx-auto mt-4 hover:cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => router.push("/dashboard/appointments/schedule-appointment")}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule New Appointment
        </Button>
      <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled doctor visits</CardDescription>
      </CardHeader>
      <CardContent>
        
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold">{appointment.doctorName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {appointment.status}
                  </p>
                </div>
              </div>
                <div className="flex items-center gap-3 text-md mb-2 ">
                  <CalendarClock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{formatDate(appointment.date)}</span>
                  <span>{formatTime(appointment.time)}</span>
                </div>
                
              

              <div className="flex items-center gap-3 text-md mb-3">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span>{appointment.location}</span>
              </div>
              <div className="flex items-center gap-3 text-md mb-2 ">
                  <Info className="h-3.5 w-3.5 text-gray-500" />
                  <span className='text-blue-700'>{appointment.details}</span>
                </div>

              <div className="flex gap-2 items-center justify-center">
                <Button variant="outline" size="sm" className="w-auto hover:cursor-pointer">
                  Reschedule
                </Button>
                <Button size="sm" className="w-auto hover:cursor-pointer"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        
      </CardContent>
    </Card>
    </div>
        

       
    </DashboardLayout>
      
  )
}
