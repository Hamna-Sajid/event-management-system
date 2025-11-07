'use client';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '../../firebase';

export default function SignUpPage() {
    const auth = getAuth(app);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/create_society');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sign Up Page</h1>
            <h2>This is the signup page</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
