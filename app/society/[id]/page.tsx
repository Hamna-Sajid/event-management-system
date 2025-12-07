"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { app, firestore } from "../../../firebase";
import { LogOut, CalendarPlus, Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastContainer, showToast } from "@/components/ui/toast";
import { UserPrivilege, canCreateEvents } from "@/lib/privileges";

interface User {
  uid: string;
  email: string;
  privilege: number;
  societyId?: string;
}

interface Society {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
  location: string;
  registrationLink: string;
  societyId: string;
  createdBy: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SocietyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [society, setSociety] = useState<Society | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);

    const loadSocietyData = async (user: any) => {
      try {
        // Get user data
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          router.push("/signin");
          return;
        }

        const userData = userDoc.data() as User;
        setCurrentUser(userData);

        // Fetch society details
        const societyDoc = await getDoc(doc(firestore, "societies", params.id));
        if (!societyDoc.exists()) {
          router.push("/waitlist"); // Society doesn't exist
          return;
        }

        const societyData = societyDoc.data();
        setSociety({
          id: params.id,
          name: societyData.name || "Unknown Society"
        });

        // Check if user can create events for this society
        const hasPermission = await canCreateEvents(user.uid, params.id);
        setCanCreate(hasPermission);
        setIsAuthorized(true);

        // Fetch events for this society
        const eventsQuery = query(
          collection(firestore, "events"),
          where("societyId", "==", params.id)
        );
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList: Event[] = [];
        
        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          eventsList.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            eventType: data.eventType,
            startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate),
            endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate),
            location: data.location,
            registrationLink: data.registrationLink,
            societyId: data.societyId,
            createdBy: data.createdBy,
            status: data.status,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          });
        });

        setEvents(eventsList);
      } catch (error) {
        console.error("Error loading society data:", error);
        router.push("/waitlist");
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        setIsLoading(false);
        return;
      }

      await loadSocietyData(user);
    });

    return () => unsubscribe();
  }, [params.id, router]);

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  const handleLogout = async () => {
    const auth = getAuth(app);
    await auth.signOut();
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center">
        <div className="glass rounded-lg p-8">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#110205]">
      <ToastContainer />
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.95)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">{society?.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[rgba(255,255,255,0.8)]">
              {currentUser?.email}
            </span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Events</h2>
          
          {canCreate && (
            <Button 
              onClick={handleCreateEvent}
              className="bg-[#d02243] hover:bg-[#b01c39] text-white"
            >
              <CalendarPlus size={18} className="mr-2" />
              Create Event
            </Button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[rgba(255,255,255,0.7)]">No events found for this society.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="glass rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">{event.name}</h3>
                  <span className="text-xs bg-[#d02243] text-white px-2 py-1 rounded">
                    {event.eventType}
                  </span>
                </div>
                
                <p className="text-[rgba(255,255,255,0.7)] text-sm mb-4">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-[rgba(255,255,255,0.7)]">
                    <Clock size={14} className="mr-2" />
                    <span>
                      {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-[rgba(255,255,255,0.7)]">
                      <MapPin size={14} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                {event.registrationLink && (
                  <div className="mt-4">
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-[#d02243] hover:bg-[#b01c39] text-white text-sm px-3 py-1 rounded"
                    >
                      Register
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}