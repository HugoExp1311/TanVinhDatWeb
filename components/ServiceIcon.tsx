type IconName = 'truck' | 'route' | 'recycle';

export function ServiceIcon({ name, className = 'w-6 h-6' }: { name: IconName; className?: string }) {
    switch (name) {
        case 'truck':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM3 7h11v10H3V7zm11 4h4l3 3v3h-7v-6z" />
                </svg>
            );
        case 'route':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 19a3 3 0 100-6h12a3 3 0 100-6M6 5l-3 3 3 3M18 19l3-3-3-3" />
                </svg>
            );
        case 'recycle':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 19a2 2 0 01-1.7-3l3-5 2 1.2M17 5a2 2 0 011.7 3l-3 5-2-1.2M12 22l-2-2 2-2M12 2l2 2-2 2M5 12l2 2-2 2M19 12l-2 2 2 2" />
                </svg>
            );
    }
}
