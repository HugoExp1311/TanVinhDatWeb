import Link from 'next/link';

export default function NotFound() {
    return (
        <section className="min-h-[60vh] flex items-center justify-center section">
            <div className="container-x text-center">
                <div className="text-8xl font-bold bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 bg-clip-text text-transparent">404</div>
                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-brand-primary-900">Trang không tồn tại</h1>
                <p className="mt-3 text-slate-600 max-w-md mx-auto">
                    Trang bạn đang tìm kiếm có thể đã được di chuyển hoặc không tồn tại.
                </p>
                <Link href="/" className="mt-8 inline-flex btn-primary">
                    ← Về trang chủ
                </Link>
            </div>
        </section>
    );
}
