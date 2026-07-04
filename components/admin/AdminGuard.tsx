'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_KEY } from '@/lib/adminAuth';

type AdminGuardProps = {
    children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const loggedIn = window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';

        if (!loggedIn) {
            router.replace(ADMIN_LOGIN_PATH);
            return;
        }

        setIsAllowed(true);
        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <section className="section bg-slate-50 min-h-[60vh] flex items-center">
                <div className="container-x">
                    <div className="card p-8 text-center max-w-md mx-auto">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-primary-100 border-t-brand-primary-800" />
                        <p className="font-semibold text-brand-primary-900">Đang kiểm tra quyền admin...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!isAllowed) return null;

    return <>{children}</>;
}