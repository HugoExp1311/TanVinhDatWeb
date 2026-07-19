'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_LOGIN_PATH, ADMIN_ME_API_PATH, type AdminRole } from '@/lib/adminAuth';

type AdminSession = {
    authenticated: true;
    role: AdminRole;
    expiresAt: number;
    googleSheetUrl: string | null;
};

type AdminGuardProps = {
    children: React.ReactNode;
};

const AdminSessionContext = createContext<AdminSession | null>(null);

export function useAdminSession() {
    const session = useContext(AdminSessionContext);

    if (!session) {
        throw new Error('useAdminSession must be used inside AdminGuard.');
    }

    return session;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [session, setSession] = useState<AdminSession | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function verifySession() {
            try {
                const response = await fetch(ADMIN_ME_API_PATH, {
                    credentials: 'include',
                    cache: 'no-store',
                });

                if (!isMounted) return;

                if (!response.ok) {
                    router.replace(ADMIN_LOGIN_PATH);
                    return;
                }

                const sessionData = (await response.json()) as AdminSession;

                if (!isMounted) return;

                setSession(sessionData);
            } catch {
                if (isMounted) {
                    router.replace(ADMIN_LOGIN_PATH);
                }
            } finally {
                if (isMounted) {
                    setIsChecking(false);
                }
            }
        }

        verifySession();

        return () => {
            isMounted = false;
        };
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

    if (!session) return null;

    return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}