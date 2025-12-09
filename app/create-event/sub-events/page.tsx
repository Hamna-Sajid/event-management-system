"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { app, firestore } from "../../../firebase"; 
import { createEvent, createSubEvent } from "@/lib/events";

const styles = {
  bgGradient: {
    minHeight: "100vh",
    width: "100vw",
    background: "radial-gradient(circle at 50% 0, #123075 70%, #2d0353 100%)",
    boxSizing: "border-box" as const
  },
  card: {
    maxWidth: 550,
    margin: "45px auto",
    borderRadius: 18,
    background: "rgba(23, 32, 54, 0.60)",
    boxShadow: "0 8px 40px rgba(36,0,65,0.42)",
    paddingBottom: "28px",
    border: "1px solid #2b3285",
    fontFamily: "inherit"
  },
  cardHeader: {
    padding: "22px 37px 0 37px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoBlock: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "linear-gradient(135deg,#6a98ff 40%,#7049f7 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.6rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  nav: { display: "flex", gap: 22, alignItems: "center" },
  navLink: {
    color: "#6a98ff", fontWeight: 600, fontSize: "1rem", cursor: "pointer", textDecoration: "none"
  },
  section: {
    background: "rgba(31,49,114,0.43)",
    borderRadius: 13,
    padding: "0 37px 14px 37px",
    margin: "32px 0"
  },
  sectionLabel: {
    fontWeight: 700, color: "#6a98ff", fontSize: "1.08rem", marginBottom: 17, marginTop: 20, fontFamily: "inherit"
  },
  subEventCard: {
    background: "rgba(39,32,86,0.85)",
    borderRadius: 11,
    padding: "23px 18px 17px 18px",
    marginBottom: 17,
    position: "relative" as const,
    boxShadow: "0 2px 16px #3119592b"
  },
  subEventTitle: { fontWeight: 700, fontSize: "1.1em", marginBottom: 7, color: "#2146a0" },
  deleteBtn: {
    position: "absolute" as const,
    top: 19,
    right: 15,
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    cursor: "pointer",
    color: "#fd5a8f",
    zIndex: 2
  },
  label: { color: "#bdbfff", fontWeight: 500, fontSize: "1rem", display: "block", marginBottom: 4 },
  input: {
    width: "100%", borderRadius: 8, border: "1.5px solid #383ba7",
    padding: "11px", marginBottom: 9, background: "rgba(23,27,50,0.95)",
    color: "#fff", fontSize: "1rem", fontFamily: "inherit", fontWeight: 500
  },
  row: { display: "flex", gap: "15px", marginBottom: 7 },
  dashed: {
    border: "2px dashed #7049f7",
    borderRadius: 8,
    textAlign: "center" as const,
    margin: "13px 6px 2px 6px",
    padding: "16px 8px",
    cursor: "pointer",
    background: "#312b6145",
    color: "#6a98ff",
    fontWeight: 500,
    fontSize: "1.07em"
  },
  controlsRow: {
    display: "flex",
    gap: 18,
    justifyContent: "flex-end",
    marginTop: 27
  },
  btn: {
    background: "linear-gradient(90deg,#2870F0 0,#6D2B9A 100%)",
    color: "#fff", borderRadius: 8, padding: "12px 30px",
    border: "none", fontWeight: "bold",
    fontSize: 17,
    boxShadow: "0 3px 12px #6d2b9a62",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  btnSecondary: {
    background: "rgba(18,48,117,0.6)", color: "#cbd9f6", borderRadius: 8, padding: "12px 30px",
    border: "2px solid #2870f0", fontWeight: "bold", fontSize: 17, cursor: "pointer", fontFamily: "inherit"
  }
};

const emptySubEvent = { title: "", date: "", time: "", registrationLink: "" };

export default function SubEventsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [societyName, setSocietyName] = useState<string | null>(null);
  const [subEvents, setSubEvents] = useState([{ title: "", date: "", time: "", registrationLink: "" }]);
  const [mainEventData, setMainEventData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    // Load main event data from localStorage
    const raw = window.localStorage.getItem("pendingEvent");
    console.log("Raw localStorage data:", raw);
    
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        console.log("Loaded main event data:", parsed);
        setMainEventData(parsed);
        
        // Validate that required fields exist
        if (!parsed.title || !parsed.startDate || !parsed.endDate) {
          console.error("Main event data is incomplete:", parsed);
          setErrorMsg("Main event data is incomplete. Please go back and fill all required fields.");
        }
      } catch (err) {
        console.error("Error parsing pendingEvent:", err);
        setErrorMsg("Error loading main event data. Please go back and try again.");
      }
    } else {
      console.warn("No pending event found in localStorage");
      setErrorMsg("No main event data found. Please go back and fill the main event form first.");
    }

    // Auth listener
    const auth = getAuth(app);
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userSnap = await getDoc(doc(firestore, "users", user.uid));
          const userData = userSnap.exists() ? userSnap.data() : {};
          if (userData.societyId) {
            const societySnap = await getDoc(doc(firestore, "societies", userData.societyId));
            const societyData = societySnap.exists() ? societySnap.data() : {};
            setSocietyName((societyData.name || userData.societyId).toLowerCase());
          }
        } catch (err) {
          console.error("Error loading user/society data:", err);
        }
      }
    });
    return () => unsub();
  }, []);

  function validateSubEvents() {
    if (subEvents.length === 0) return "Please add at least one sub-event.";
    for (const [i, sub] of subEvents.entries()) {
      if (!sub.title.trim()) return `Sub-event ${i + 1}: Title is required`;
      if (!sub.date || !sub.time) return `Sub-event ${i + 1}: Date & Time required`;
    }
    return null;
  }

  async function handleSaveDraft() {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Re-check localStorage in case it wasn't loaded properly
    const raw = window.localStorage.getItem("pendingEvent");
    const eventData = mainEventData || (raw ? JSON.parse(raw) : null);
    
    console.log("Saving draft with event data:", eventData);
    
    if (!eventData) {
      setErrorMsg("Main event info missing! Please go back and fill the main event form first.");
      return;
    }
    
    const err = validateSubEvents();
    if (err) return setErrorMsg(err);
    setLoading(true);
    try {
      console.log("Creating main event as draft...");
      const eventId = await createEvent({
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        venue: eventData.venue,
        registrationLink: eventData.registrationLink,
        registrationDeadline: eventData.registrationDeadline
          ? new Date(eventData.registrationDeadline)
          : undefined,
        tags: eventData.tags || [],
        societyId: societyName ?? "IEMS",
        societyName: societyName ?? "IEMS",
        coverImage: "",
        galleryImages: [],
        venueDetails: {},
        createdBy: userId ?? "unknown",
        status: "draft",
        isPublished: false,
      });
      console.log("Main event created with ID:", eventId);
      
      console.log("Creating sub-events...");
      for (const [index, sub] of subEvents.entries()) {
        console.log(`Creating sub-event ${index + 1}:`, sub);
        await createSubEvent({
          parentEventId: eventId,
          title: sub.title,
          description: "",
          date: new Date(sub.date),
          time: sub.time,
          registrationLink: sub.registrationLink,
          order: index,
          societyId: societyName ?? "IEMS",
          createdBy: userId ?? "unknown"
        });
      }
      console.log("All sub-events created successfully");
      
      // Clear localStorage after successful save
      window.localStorage.removeItem("pendingEvent");
      
      setSuccessMsg("Draft saved successfully!");
      setSubEvents([{ title: "", date: "", time: "", registrationLink: "" }]);
    } catch (e) {
      const error = e as Error;
      console.error("Error saving draft:", error);
      setErrorMsg(`Error saving draft: ${error?.message || "Unknown error. Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Re-check localStorage in case it wasn't loaded properly
    const raw = window.localStorage.getItem("pendingEvent");
    const eventData = mainEventData || (raw ? JSON.parse(raw) : null);
    
    console.log("Publishing with event data:", eventData);
    console.log("Sub-events:", subEvents);
    console.log("User ID:", userId);
    console.log("Society Name:", societyName);
    
    if (!eventData) {
      setErrorMsg("Main event info missing! Please go back and fill the main event form first.");
      return;
    }
    
    const err = validateSubEvents();
    if (err) return setErrorMsg(err);
    setLoading(true);
    try {
      console.log("Creating main event...");
      const eventId = await createEvent({
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        venue: eventData.venue,
        registrationLink: eventData.registrationLink,
        registrationDeadline: eventData.registrationDeadline
          ? new Date(eventData.registrationDeadline)
          : undefined,
        tags: eventData.tags || [],
        societyId: societyName ?? "IEMS",
        societyName: societyName ?? "IEMS",
        coverImage: "",
        galleryImages: [],
        venueDetails: {},
        createdBy: userId ?? "unknown",
        status: "active",
        isPublished: true,
      });
      console.log("Main event created with ID:", eventId);
      
      console.log("Creating sub-events...");
      for (const [index, sub] of subEvents.entries()) {
        console.log(`Creating sub-event ${index + 1}:`, sub);
        await createSubEvent({
          parentEventId: eventId,
          title: sub.title,
          description: "",
          date: new Date(sub.date),
          time: sub.time,
          registrationLink: sub.registrationLink,
          order: index,
          societyId: societyName ?? "IEMS",
          createdBy: userId ?? "unknown"
        });
      }
      console.log("All sub-events created successfully");
      
      // Clear localStorage after successful publish
      window.localStorage.removeItem("pendingEvent");
      
      setSuccessMsg("Event published successfully!");
      setSubEvents([{ title: "", date: "", time: "", registrationLink: "" }]);
    } catch (e) {
      const error = e as Error;
      console.error("Error publishing event:", error);
      setErrorMsg(`Error publishing event: ${error?.message || "Unknown error. Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  const handleAddSubEvent = () => setSubEvents([...subEvents, { ...emptySubEvent }]);
  const handleRemoveSubEvent = (i: number) => setSubEvents(subEvents.filter((_, idx) => idx !== i));
  const handleSubEventChange = (i: number, field: keyof typeof emptySubEvent, value: string) => {
    subEvents[i][field] = value;
    setSubEvents([...subEvents]);
  };

  return (
    <div style={styles.bgGradient}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 17 }}>
            <div style={styles.logoBlock}>IE</div>
            <span style={{ fontWeight: "bold", color: "#6a98ff", fontSize: 22, fontFamily: "inherit" }}>IEMS</span>
          </div>
          <div style={styles.nav}>
            <Link href={societyName ? `/societies/${societyName}` : "#"} style={styles.navLink}>Dashboard</Link>
            <Link href={userId ? `/profiles/${userId}` : "#"} style={styles.navLink}>My Profile</Link>
            <span style={{ fontSize: "1.35rem", color: "#c16ff7", filter: "blur(0.2px)" }}>🔔</span>
            <span style={{ fontSize: "1.2rem", color: "#f6faff", opacity: 0.74 }}>↩️</span>
          </div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Sub-event & Competition Management</div>
          
          {/* Debug info */}
          {!mainEventData && (
            <div style={{ background: "rgba(253,90,143,0.1)", border: "1px solid #fd5a8f", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: "0.9rem", color: "#ffc6d9" }}>
              <strong>Debug Info:</strong> No main event data loaded. 
              <br />Please go back to the main form and click &quot;Manage Sub-events&quot; button.
            </div>
          )}
          
          {mainEventData && (
            <div style={{ background: "rgba(90,255,198,0.1)", border: "1px solid #5affc6", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: "0.85rem", color: "#5affc6" }}>
              <strong>Main Event:</strong> {mainEventData.title || "Untitled"}
            </div>
          )}

          {errorMsg && <div style={{ color: "#fd5a8f", marginBottom: 9, fontSize: "0.95rem" }}>{errorMsg}</div>}
          {successMsg && <div style={{ color: "#5affc6", marginBottom: 9 }}>{successMsg}</div>}
          {loading && <div style={{ color: "#bdbfff", marginBottom: 9 }}>Processing...</div>}

          {subEvents.map((sub, idx) => (
            <div key={idx} style={styles.subEventCard}>
              <div style={styles.subEventTitle}>Sub-event {idx + 1}</div>
              {subEvents.length > 1 && (
                <button style={styles.deleteBtn} onClick={() => handleRemoveSubEvent(idx)} aria-label="Delete sub-event">🗑️</button>
              )}
              <div>
                <label style={styles.label}>Title:</label>
                <input value={sub.title} onChange={e => handleSubEventChange(idx, "title", e.target.value)} style={styles.input} />
              </div>
              <div style={styles.row}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Date:</label>
                  <input type="date" value={sub.date} onChange={e => handleSubEventChange(idx, "date", e.target.value)} style={styles.input} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Time:</label>
                  <input type="time" value={sub.time} onChange={e => handleSubEventChange(idx, "time", e.target.value)} style={styles.input} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Registration Link (URL):</label>
                <input value={sub.registrationLink} onChange={e => handleSubEventChange(idx, "registrationLink", e.target.value)} style={styles.input} />
              </div>
            </div>
          ))}

          <div style={styles.dashed} tabIndex={0} role="button" onClick={handleAddSubEvent}>
            + Add New Sub-event
          </div>

          <div style={styles.controlsRow}>
            <Link href="/create-event" style={{ ...styles.btnSecondary, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Back
            </Link>
            <button type="button" style={styles.btnSecondary} disabled={loading} onClick={handleSaveDraft}>Save as Draft</button>
            <button type="button" style={styles.btn} disabled={loading} onClick={handlePublish}>Publish Event</button>
          </div>
        </div>
      </div>
    </div>
  );
}