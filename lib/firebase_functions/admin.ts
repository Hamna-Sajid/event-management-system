import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { Society, AdminStats } from "../../app/admin/page"; // Assuming interfaces are exported from here

export async function getDashboardData() {
    const societiesSnapshot = await getDocs(collection(firestore, "societies"));
    const societiesData: Society[] = [];
    societiesSnapshot.forEach((doc) => {
        const data = doc.data();
        societiesData.push({
            id: doc.id,
            name: data.name || "",
            dateCreated: data.dateCreated || "",
            heads: data.heads || { CEO: null, CFO: null, COO: null },
            maxHeads: data.maxHeads || 3,
            description: data.description || "",
            contactEmail: data.contactEmail || "",
            socialLinks: data.socialLinks || { facebook: "", instagram: "", linkedin: "" },
            events: data.events || [],
        });
    });

    const headDetails = await getHeadDetails(societiesData);

    const usersSnapshot = await getDocs(collection(firestore, "users"));
    const stats: AdminStats = {
        totalUsers: usersSnapshot.size,
        totalEvents: 0, // TODO: Implement when events collection exists
        totalSocieties: societiesData.length,
        weeklyTraffic: 0, // TODO: Implement analytics
    };

    return { societies: societiesData, stats, headDetails };
}

export async function getHeadDetails(societiesData: Society[]) {
    const allHeadIds = new Set<string>();
    societiesData.forEach((society) => {
        Object.values(society.heads).forEach((headId) => {
            if (headId) allHeadIds.add(headId);
        });
    });

    const headDetailsMap: { [userId: string]: { name: string; email: string } } = {};
    for (const headId of allHeadIds) {
        const userDoc = await getDoc(doc(firestore, "users", headId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            headDetailsMap[headId] = {
                name: userData.fullName || userData.email?.split("@")[0] || "Unknown",
                email: userData.email || "",
            };
        }
    }
    return headDetailsMap;
}

export async function addSociety(newSocietyName: string, currentUserEmail: string): Promise<Society> {
    const societyId = newSocietyName.toLowerCase().replace(/\s+/g, "-");

    const existingSociety = await getDoc(doc(firestore, "societies", societyId));
    if (existingSociety.exists()) {
        throw new Error(`A society with the name "${newSocietyName}" already exists. Please choose a different name.`);
    }

    const newSocietyData = {
        name: newSocietyName,
        dateCreated: new Date().toISOString(),
        heads: {
            CEO: null,
            CFO: null,
            COO: null,
        },
        maxHeads: 3,
        description: "",
        contactEmail: "",
        socialLinks: {
            facebook: "",
            instagram: "",
            linkedin: "",
        },
        events: [],
        createdBy: currentUserEmail,
    };

    await setDoc(doc(firestore, "societies", societyId), newSocietyData);
    
    const newSociety: Society = {
        id: societyId,
        name: newSocietyData.name,
        dateCreated: newSocietyData.dateCreated,
        heads: newSocietyData.heads,
        maxHeads: newSocietyData.maxHeads,
        description: newSocietyData.description,
        contactEmail: newSocietyData.contactEmail,
        socialLinks: newSocietyData.socialLinks,
        events: newSocietyData.events,
    };
    
    return newSociety;
}

export async function removeHead(societyId: string, role: "CEO" | "CFO" | "COO", societies: Society[]) {
    const society = societies.find((s) => s.id === societyId);
    if (!society) throw new Error("Society not found");

    const headUserId = society.heads[role];
    if (!headUserId) return;

    const updatedHeads = {
        ...society.heads,
        [role]: null,
    };

    await updateDoc(doc(firestore, "societies", societyId), {
        heads: updatedHeads,
    });

    await updateDoc(doc(firestore, "users", headUserId), {
        privilege: 0,
        societyRole: null,
        societyId: null,
    });
    
    return updatedHeads;
}

export async function inviteHead(selectedSociety: Society, newHeadEmail: string, newHeadRole: "CEO" | "CFO" | "COO", societies: Society[]) {
    if (!newHeadEmail.endsWith("@khi.iba.edu.pk")) {
        throw new Error("Only IBA Karachi email addresses (@khi.iba.edu.pk) are allowed.");
    }

    if (selectedSociety.heads[newHeadRole]) {
        throw new Error(`${newHeadRole} role is already assigned. Please choose a different role.`);
    }

    const usersSnapshot = await getDocs(collection(firestore, "users"));
    const userDoc = usersSnapshot.docs.find((doc) => doc.data().email === newHeadEmail);

    if (!userDoc) {
        throw new Error("User not found. They must sign up first with their @khi.iba.edu.pk email address.");
    }

    const userData = userDoc.data();

    if (!userData.emailVerified) {
        throw new Error("This user has not verified their email address yet. They must verify their email before being assigned as a society head.");
    }

    if (userData.privilege === 1 && userData.societyId) {
        const currentSociety = societies.find((s) => s.id === userData.societyId);
        const currentSocietyName = currentSociety?.name || "another society";
        throw new Error(`This user is already a ${userData.societyRole || "head"} of ${currentSocietyName}. A user can only be a head of one society at a time.`);
    }

    const isAlreadyHead = Object.values(selectedSociety.heads).includes(userDoc.id);
    if (isAlreadyHead) {
        throw new Error("This user is already a head in this society.");
    }

    await updateDoc(doc(firestore, "users", userDoc.id), {
        privilege: 1,
        societyRole: newHeadRole,
        societyId: selectedSociety.id,
    });

    const updatedHeads = {
        ...selectedSociety.heads,
        [newHeadRole]: userDoc.id,
    };

    await updateDoc(doc(firestore, "societies", selectedSociety.id), {
        heads: updatedHeads,
    });

    const headDetails = {
        name: userData.fullName || newHeadEmail.split("@")[0],
        email: newHeadEmail,
    };
    
    return { updatedHeads, headDetails, userId: userDoc.id };
}
