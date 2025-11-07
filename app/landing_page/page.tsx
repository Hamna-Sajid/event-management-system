'use client';
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [name, setName] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const router = useRouter();

    const fetchNames = async () => {
        const q = query(collection(firestore, 'names'), limit(10));
        const snapshot = await getDocs(q);
        setNames(snapshot.docs.map(doc => doc.data().name));
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;
        await addDoc(collection(firestore, 'names'), { name });
        setName('');
        fetchNames();
    };

    useEffect(() => {
        fetchNames();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Landing Page</h1>
            <h2>This is the landing page</h2>

            <div style={{ marginBottom: 20 }}>
                <button onClick={() => router.push('/signin')}>Sign In</button>
                <button onClick={() => router.push('/signup')} style={{ marginLeft: 10 }}>
                    Sign Up
                </button>
            </div>

            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button onClick={handleSubmit} style={{ marginLeft: 10 }}>
                Add
            </button>

            <ul style={{ marginTop: 20 }}>
                {names.map((n, i) => (
                    <li key={i}>{n}</li>
                ))}
            </ul>
        </div>
    );
}
