'use client';
import { usePathname } from 'next/navigation';
import LandingPage from './landing-page/page';
import SignInPage from './signin/page';
import SignUpPage from './signup/page';

export default function Page() {
    const pathname = usePathname();

    if (pathname === '/signin') return <SignInPage />;
    if (pathname === '/signup') return <SignUpPage />;
    return <LandingPage />;
}
