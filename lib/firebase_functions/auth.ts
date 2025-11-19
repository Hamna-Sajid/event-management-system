import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app, firestore } from '../../firebase';

export async function signUpWithEmail(fullName: string, email: string, password: string) {
  const auth = getAuth(app);
  
  // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update auth profile with display name
  await updateProfile(userCredential.user, {
    displayName: fullName
  });
  
  // Store additional user data in Firestore
  await setDoc(doc(firestore, 'users', userCredential.user.uid), {
    fullName: fullName,
    email: email,
    privilege: 0, // 0: normal user, 1: society head, 2: admin
    createdAt: new Date().toISOString(),
    emailVerified: false,
  });
  
  // Send verification email
  await sendEmailVerification(userCredential.user);
  
  return userCredential;
}

export async function signInWithEmail(email: string, password: string) {
  const auth = getAuth(app);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Get user privilege from Firestore
  const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
  const userData = userDoc.data();
  const privilege = userData?.privilege ?? 0;
  
  return privilege;
}

export async function sendPasswordResetLink(email: string) {
  const auth = getAuth(app);
  await sendPasswordResetEmail(auth, email);
}

export async function resendVerificationEmail() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
  }
}

export async function checkEmailVerification(): Promise<number | null> {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    await user.reload();
    if (user.emailVerified) {
      // Update emailVerified status in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        emailVerified: true
      });
      
      // Get user privilege to determine redirect
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      return userData?.privilege ?? 0;
    }
  }
  return null;
}

export async function signOutUser() {
  const auth = getAuth(app);
  await signOut(auth);
}

export async function getUserData(uid: string) {
  const userDoc = await getDoc(doc(firestore, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}
