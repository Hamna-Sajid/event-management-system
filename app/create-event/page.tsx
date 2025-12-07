"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, firestore } from "../../firebase";
import { LogOut, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventForm from "@/components/ui/event-form";
import { ToastContainer, showToast } from "@/components/ui/toast";
import { UserPrivilege, canCreateEvents } from "@/lib/privileges";
import { createEvent, createSubEvent } from "@/lib/events";

interface Society {
  id: string;
  name: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserSocietyId, setCurrentUserSocietyId] = useState("");
  const [userSociety, setUserSociety] = useState<Society | null>(null);

  // Function to check if user is a society head and fetch their society details
  useEffect(() => {
    const auth = getAuth(app);

    const checkAuthorization = async (user: any) => {
      try {
        // Get user privilege and society info first
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          // User document doesn't exist
          router.push("/signin");
          return;
        }

        const userData = userDoc.data();
        const privilege = userData.privilege || 0;
        const societyId = userData.societyId || null;

        if (privilege < UserPrivilege.SOCIETY_HEAD) {
          // Not a society head or admin - redirect to waitlist
          router.push("/waitlist");
          return;
        }

        // Check if user has permission to create events for their society
        if (societyId) {
          const hasPermission = await canCreateEvents(user.uid, societyId);

          if (!hasPermission) {
            // Not authorized for this society - redirect to waitlist
            router.push("/waitlist");
            return;
          }

          setCurrentUserSocietyId(societyId);

          // Get society details
          const societyDoc = await getDoc(doc(firestore, "societies", societyId));
          if (societyDoc.exists()) {
            const societyData = societyDoc.data();
            setUserSociety({
              id: societyId,
              name: societyData.name || "Unknown Society"
            });
          } else {
            // Society doesn't exist - shouldn't happen for a valid society head
            router.push("/waitlist");
            return;
          }
        } else {
          // User doesn't have a societyId assigned but has society head privilege
          router.push("/waitlist");
          return;
        }

        setCurrentUserEmail(user.email || "");
        setCurrentUserId(user.uid);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking authorization:", error);
        router.push("/signin");
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

      await checkAuthorization(user);
    });

    return () => unsubscribe();
  }, [router]);

  const handleCreateEvent = async (eventData: any) => {
    try {
      // Convert date strings to Date objects and extract time
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      // Extract time parts
      const startTime = startDate.toTimeString().substring(0, 5); // HH:MM
      const endTime = endDate.toTimeString().substring(0, 5); // HH:MM

      // Validate date range
      if (startDate >= endDate) {
        showToast("End date must be after start date", "error");
        return;
      }

      // Process tags - split by comma and trim whitespace
      const tags = eventData.tags ? eventData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];

      // Create the main event using the new schema
      const eventId = await createEvent({
        title: eventData.name,
        description: eventData.description,
        eventType: eventData.eventType,
        startDate,
        endDate,
        startTime,
        endTime,
        venue: eventData.location,
        registrationLink: eventData.registrationLink || "",
        tags: tags,
        societyId: currentUserSocietyId,
        societyName: userSociety?.name || "",
        createdBy: currentUserId,
        status: "published",
        isPublished: true
      });

      // If there are sub-events, create them too
      if (eventData.subEvents && eventData.subEvents.length > 0) {
        for (let i = 0; i < eventData.subEvents.length; i++) {
          const subEvent = eventData.subEvents[i];

          // For sub-events, we only have date and time as strings in the form
          // We need to convert them properly to Date objects
          const subEventDate = new Date(subEvent.startDate);

          // Extract time
          const subEventTime = subEventDate.toTimeString().substring(0, 5); // HH:MM

          await createSubEvent({
            parentEventId: eventId,
            title: subEvent.name,
            description: subEvent.description,
            date: subEventDate,
            time: subEventTime,
            venue: subEvent.location,
            registrationLink: subEvent.registrationLink || "",
            societyId: currentUserSocietyId,
            createdBy: currentUserId,
            order: i // Use index as the order
          });
        }
      }

      showToast("Event created successfully!", "success");

      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        router.push(`/society/${currentUserSocietyId}`); // Redirect to society page
      }, 1500);
    } catch (error) {
      console.error("Error creating event:", error);
      showToast("Failed to create event. Please try again.", "error");
    }
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
            <CalendarPlus size={24} className="text-[#d02243] mr-3" />
            <h1 className="text-xl font-bold text-white">Create Event - {userSociety?.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[rgba(255,255,255,0.8)]">
              {currentUserEmail} ({userSociety?.name})
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
        <div className="glass rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
          <EventForm onSubmit={handleCreateEvent} />
        </div>
      </main>
    </div>
  );
}