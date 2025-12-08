"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createEvent } from "@/lib/events";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { app, firestore } from "../../firebase";
import { useRouter } from "next/navigation";

// Theme and layout styles
const styles = {
  bgGradient: {
    minHeight: "100vh",
    width: "100vw",
    background: "radial-gradient(circle at 50% 0, #123075 70%, #2d0353 100%)",
    boxSizing: "border-box" as const
  },
  card: {
    maxWidth: 600,
    margin: "45px auto",
    borderRadius: 18,
    background: "rgba(23, 32, 54, 0.67)",
    boxShadow: "0 8px 40px rgba(36,0,65,0.45)",
    padding: "0 0 28px 0",
    border: "1px solid #2b3285",
    fontFamily: "inherit"
  },
  cardHeader: {
    padding: "29px 40px 0 40px",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  },
  logoBlock: {
    width: 48, height: 48, borderRadius: 13,
    background: "linear-gradient(135deg,#6a98ff 40%,#7049f7 100%)",
    color: "#fff", fontWeight: 700, fontSize: "2rem",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  nav: { display: "flex", gap: 28, alignItems: "center" },
  navLink: {
    color: "#6a98ff", fontWeight: 600, fontSize: "1rem", cursor: "pointer", textDecoration: "none"
  },
  section: {
    background: "rgba(31,49,114,0.43)",
    borderRadius: 14, padding: "22px 40px", margin: "32px 0"
  },
  sectionLabel: {
    fontWeight: 700, color: "#6a98ff", fontSize: "1.1rem", marginBottom: 16, fontFamily: "inherit"
  },
  input: {
    width: "100%", borderRadius: 9, border: "1.5px solid #383ba7",
    padding: "13px", marginTop: 4, background: "rgba(16,24,50,0.64)",
    color: "#fff", fontSize: 17, fontFamily: "inherit"
  },
  textarea: { 
    width: "100%", borderRadius: 9, border: "1.5px solid #383ba7", 
    padding: "13px", marginTop: 4, minHeight: 63, 
    background: "rgba(16,24,50,0.64)", color: "#fff", 
    fontSize: 17, fontFamily: "inherit" 
  },
  select: { 
    width: "100%", borderRadius: 9, border: "1.5px solid #383ba7", 
    padding: "13px", marginTop: 4, background: "rgba(16,24,50,0.64)", 
    color: "#fff", fontSize: 17, fontFamily: "inherit" 
  },
  btn: {
    background: "linear-gradient(90deg,#2870F0 0,#6D2B9A 100%)", 
    color: "#fff", borderRadius: 8, padding: "12px 32px",
    border: "none", fontWeight: "bold", fontSize: 18, 
    boxShadow: "0 4px 16px #6d2b9a72", cursor: "pointer", 
    fontFamily: "inherit", marginLeft: 10, transition: "background 0.16s"
  },
  btnSecondary: {
    background: "rgba(18,48,117,0.6)", color: "#cbd9f6", 
    borderRadius: 8, padding: "12px 32px",
    border: "2px solid #2870f0", fontWeight: "bold", 
    fontSize: 18, cursor: "pointer", fontFamily: "inherit", 
    marginRight: 10, transition: "background 0.16s"
  },
  dashed: {
    border: "2px dashed #7049f7", borderRadius: 8, 
    textAlign: "center" as const, margin: "20px 8px", padding: "18px 8px",
    cursor: "pointer", background: "rgba(34,25,72,0.76)", 
    color: "#c16ff7", fontWeight: 500
  },
  error: { color: "#fd5a8f", fontSize: 16, fontWeight: 600, marginLeft: 4 },
  success: { color: "#5affc6", fontSize: 16, fontWeight: 600, marginLeft: 4 }
};

// Toggle switch style
const toggleOuter: React.CSSProperties = {
  width: 42,
  height: 24,
  borderRadius: 18,
  background: "rgba(106,152,255,0.16)",
  border: "2px solid #6a98ff",
  position: "relative",
  cursor: "pointer",
  display: "inline-block",
  verticalAlign: "middle",
  transition: "background 0.21s"
};

const toggleKnob = (on: boolean): React.CSSProperties => ({
  width: 20,
  height: 20,
  borderRadius: 10,
  position: "absolute",
  top: 1.5,
  left: on ? 19 : 3,
  background: on
    ? "linear-gradient(90deg,#2870F0 0,#6D2B9A 100%)"
    : "#6a98ff",
  boxShadow: on
    ? "0 0 12px 0 #7049f7"
    : "0 0 6px 0 #6a98ffad",
  border: "1.5px solid #6a98ff",
  transition: "left 0.18s, background 0.18s",
});

export default function CreateEventPage() {
  const router = useRouter();
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [subEventToggle, setSubEventToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);
  const [successMsg, setSuccess] = useState<string | null>(null);

  // User and society states
  const [userId, setUserId] = useState<string | null>(null);
  const [societyName, setSocietyName] = useState<string | null>(null);

  // Fetch userID and societyName on mount
  useEffect(() => {
    const auth = getAuth(app);
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const userSnap = await getDoc(doc(firestore, "users", user.uid));
        const userData = userSnap.exists() ? userSnap.data() : {};
        if (userData.societyId) {
          const societySnap = await getDoc(doc(firestore, "societies", userData.societyId));
          const societyData = societySnap.exists() ? societySnap.data() : {};
          setSocietyName((societyData.name || userData.societyId).toLowerCase());
        }
      }
    });
    return () => unsub();
  }, []);

  function validateMainForm() {
    if (!eventTitle.trim()) return "Event Title is required";
    if (!eventDescription.trim()) return "Event Description is required";
    if (!eventType) return "Event Type is required";
    if (!startDate || !startTime) return "Start date and time are required";
    if (!endDate || !endTime) return "End date and time are required";
    if (!venue.trim()) return "Venue is required";
    return null;
  }

  function handleManageSubEvents() {
    const err = validateMainForm();
    if (err) {
      setError(err);
      return;
    }
    
    const mainEventData = {
      title: eventTitle,
      description: eventDescription,
      eventType,
      startDate,
      startTime,
      endDate,
      endTime,
      venue,
      registrationLink,
      registrationDeadline,
      tags: [],
    };
    console.log("Saving to localStorage:", mainEventData);
    window.localStorage.setItem("pendingEvent", JSON.stringify(mainEventData));
    router.push("/create-event/sub-events");
  }

  function resetAll() {
    setEventTitle(""); 
    setEventDescription(""); 
    setEventType("");
    setStartDate(""); 
    setStartTime(""); 
    setEndDate(""); 
    setEndTime("");
    setVenue(""); 
    setRegistrationLink(""); 
    setRegistrationDeadline("");
    setSubEventToggle(false); 
    setLoading(false); 
    setError(null); 
    setSuccess(null);
  }

  async function handleSaveDraft() {
    setError(null); 
    setSuccess(null);
    const err = validateMainForm();
    if (err) return setError(err);
    setLoading(true);
    try {
      await createEvent({
        title: eventTitle,
        description: eventDescription,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        venue,
        registrationLink,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        tags: [],
        societyId: societyName ?? "IEMS",
        societyName: societyName ?? "IEMS",
        coverImage: "",
        galleryImages: [],
        venueDetails: {},
        createdBy: userId ?? "unknown",
        status: "draft",
        isPublished: false
      });
      setSuccess("Draft saved!");
      resetAll();
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Error saving draft. Please try again.");
    } finally { 
      setLoading(false); 
    }
  }

  async function handlePublish() {
    setError(null); 
    setSuccess(null);
    const err = validateMainForm();
    if (err) return setError(err);
    
    if (subEventToggle) {
      setError("Please use 'Manage Sub-events' to add sub-events before publishing.");
      return;
    }
    
    setLoading(true);
    try {
      await createEvent({
        title: eventTitle,
        description: eventDescription,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        venue,
        registrationLink,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        tags: [],
        societyId: societyName ?? "IEMS",
        societyName: societyName ?? "IEMS",
        coverImage: "",
        galleryImages: [],
        venueDetails: {},
        createdBy: userId ?? "unknown",
        status: "active",
        isPublished: true
      });
      setSuccess("Event published!");
      resetAll();
    } catch (error) {
      console.error("Error publishing event:", error);
      setError("Error publishing event. Please try again.");
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div style={styles.bgGradient}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 17 }}>
            <div style={styles.logoBlock}>IE</div>
            <span style={{ fontWeight: "bold", color: "#6a98ff", fontSize: 22 }}>IEMS</span>
          </div>
          <div style={styles.nav}>
            <Link href={societyName ? `/societies/${societyName}` : "#"} style={styles.navLink}>Dashboard</Link>
            <Link href={userId ? `/profiles/${userId}` : "#"} style={styles.navLink}>My Profile</Link>
            <span style={{ fontSize: "1.8rem", color: "#c16ff7", filter: "blur(0.2px)" }}>🔔</span>
            <span style={{ fontSize: "1.47rem", color: "#f6faff", opacity: 0.72 }}>↩️</span>
          </div>
        </div>
        <div style={{ padding: "0 40px" }}>
          <div style={{ fontWeight: 700, fontSize: 26, color: "#6a98ff", marginBottom: 8, marginTop: 3 }}>Create New Event</div>
          <div style={{ color: "#c16ff7", marginBottom: 26, fontSize: 15 }}>Design and manage your own intuitive workspace</div>
        </div>

        {/* FORM */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Core Event Details</div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: "#bdbfff", fontWeight: 500 }}>Event Title:</label>
            <input value={eventTitle} onChange={e => setEventTitle(e.target.value)} style={styles.input} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: "#bdbfff", fontWeight: 500 }}>Event Description:</label>
            <textarea value={eventDescription} onChange={e => setEventDescription(e.target.value)} style={styles.textarea} />
          </div>
          <div>
            <label style={{ color: "#bdbfff", fontWeight: 500 }}>Event Type:</label>
            <select value={eventType} onChange={e => setEventType(e.target.value)} style={styles.select}>
              <option value="">Select Type</option>
              <option value="Seminar">Seminar</option>
              <option value="Competition">Competition</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Logistics and Registration</div>
          <div style={{ display: "flex", gap: "23px", marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#bdbfff", fontWeight: 500 }}>Start Date:</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#bdbfff", fontWeight: 500 }}>Start Time:</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={styles.input} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "23px", marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#bdbfff", fontWeight: 500 }}>End Date:</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#bdbfff", fontWeight: 500 }}>End Time:</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={styles.input} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "23px", marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#bdbfff", fontWeight: 500 }}>Venue/Location:</label>
              <input value={venue} onChange={e => setVenue(e.target.value)} style={styles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#bdbfff", fontWeight: 500 }}>Registration Link (URL):</label>
              <input value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} style={styles.input} />
            </div>
          </div>
          <div>
            <label style={{ color: "#bdbfff", fontWeight: 500 }}>Registration Deadline:</label>
            <input type="date" value={registrationDeadline} onChange={e => setRegistrationDeadline(e.target.value)} style={styles.input} />
          </div>
        </div>

        {/* Sub-event & Competition Management */}
        <div style={{ ...styles.section, marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={styles.sectionLabel}>Sub-event & Competition Management</span>
            <div style={toggleOuter} onClick={() => setSubEventToggle(t => !t)} tabIndex={0} role="button" aria-pressed={subEventToggle}>
              <span style={toggleKnob(subEventToggle)} />
            </div>
            <span style={{ color: "#bdbfff", marginLeft: 14 }}>{subEventToggle ? "Enabled" : "Disabled"}</span>
          </div>
          {subEventToggle ? (
            <button
              type="button"
              style={{
                ...styles.dashed,
                background: "#6a98ff21",
                color: "#6a98ff",
                fontWeight: "bold",
                marginTop: 24,
                cursor: "pointer",
                fontSize: 17,
                border: "none"
              }}
              onClick={handleManageSubEvents}
            >
              Manage Sub-events
            </button>
          ) : (
            <div style={{ marginTop: 27, textAlign: "center", color: "#c16ff7", fontWeight: 500, fontSize: 16 }}>
              Enable multi-part events to add sub-events and competitions
            </div>
          )}
        </div>

        {/* Error/Success/Loading UI */}
        {errorMsg && <div style={styles.error} role="alert">{errorMsg}</div>}
        {successMsg && <div style={styles.success} role="status">{successMsg}</div>}
        {loading && <div style={{ color: "#bdbfff", fontSize: 18, marginBottom: 14 }}>Processing...</div>}

        {/* Save/Publish buttons */}
        <div style={{ display: "flex", gap: 18, justifyContent: "flex-end", marginTop: 12 }}>
          <button type="button" onClick={handleSaveDraft} style={styles.btnSecondary} disabled={loading}>Save as Draft</button>
          <button type="button" onClick={handlePublish} style={styles.btn} disabled={loading}>Publish Event</button>
        </div>
      </div>
    </div>
  );
}