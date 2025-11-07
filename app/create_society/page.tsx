'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import { useRouter } from 'next/navigation';

export default function CreateSocietyPage() {
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (!user) {
                router.push('/signin');
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [auth, router]);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Create Society Page</h1>
        </div>
    );
}
