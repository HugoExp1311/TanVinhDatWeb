'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';
import { ADMIN_LOGIN_PATH, ADMIN_LOGOUT_API_PATH, ADMIN_PANEL_PATH } from '@/lib/adminAuth';

type Job = { title: string; dept: string; type: string; location: string };
type FAQ = { q: string; a: string };

function useLocalStorage<T>(key: string, fallback: T[]) {
    const [items, setItems] = useState<T[]>(fallback);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored) setItems(JSON.parse(stored));
        } catch {
            /* ignore */
        }
        setLoaded(true);
    }, [key]);

    useEffect(() => {
        if (loaded) {
            try {
                localStorage.setItem(key, JSON.stringify(items));
            } catch {
                /* ignore */
            }
        }
    }, [key, items, loaded]);

    return {
        items,
        addItem: (item: T) => setItems((prev) => [...prev, item]),
        updateItem: (index: number, item: T) =>
            setItems((prev) => prev.map((prevItem, i) => (i === index ? item : prevItem))),
        deleteItem: (index: number) => setItems((prev) => prev.filter((_, i) => i !== index)),
        resetItems: () => setItems(fallback),
    };
}

function extractPriceNumeric(price: string): number {
    const match = price.match(/(\d[\d.]*)/);
    if (!match) return 0;
    const num = Number.parseFloat(match[1]);
    return Number.isFinite(num) ? num : 0;
}

function buildPricingBars() {
    const maxValues = site.pricing.map((cat) => Math.max(...cat.tiers.map((t) => extractPriceNumeric(t.price)), 1));
    const overallMax = Math.max(...maxValues, 1);
    const colors = ['bg-brand-primary-700', 'bg-brand-secondary-600', 'bg-amber-500'];

    return site.pricing.map((category, index) => {
        const maxNum = Math.max(...category.tiers.map((t) => extractPriceNumeric(t.price)), 0);
        const percent = overallMax > 0 ? Math.round((maxNum / overallMax) * 100) : 0;
        const formatted = maxNum > 0 ? `${maxNum.toLocaleString('vi-VN')}đ` : 'Liên hệ';

        return {
            label: category.category.length > 30 ? category.category.slice(0, 30) + '…' : category.category,
            value: percent,
            display: formatted,
            colorClass: colors[index % colors.length],
        };
    });
}

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: string }) {
    return (
        <div className="card p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-50 text-2xl">
                {icon}
            </div>
            <p className="text-3xl font-extrabold text-brand-primary-900">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
        </div>
    );
}

function EditableJobs() {
    const store = useLocalStorage<Job>('tvd_admin_jobs', site.jobs);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<Job>({ title: '', dept: '', type: 'Toàn thời gian', location: 'TP.HCM' });

    function startAdd() {
        setForm({ title: '', dept: '', type: 'Toàn thời gian', location: 'TP.HCM' });
        setIsAdding(true);
        setEditingIndex(null);
    }

    function startEdit(index: number) {
        setForm(store.items[index]);
        setEditingIndex(index);
        setIsAdding(false);
    }

    function saveAdd() {
        if (!form.title.trim()) {
            window.alert('Vui lòng nhập tên vị trí.');
            return;
        }
        store.addItem(form);
        setIsAdding(false);
    }

    function saveEdit() {
        if (editingIndex === null) return;
        if (!form.title.trim()) {
            window.alert('Vui lòng nhập tên vị trí.');
            return;
        }
        store.updateItem(editingIndex, form);
        setEditingIndex(null);
    }

    function confirmDelete(index: number) {
        if (window.confirm(`Xóa vị trí "${store.items[index].title}"?`)) {
            store.deleteItem(index);
        }
    }

    return (
        <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-primary-900">
                    Vị trí tuyển dụng ({store.items.length})
                </h2>
                <div className="flex gap-2">
                    <button type="button" onClick={startAdd} className="btn-primary w-fit rounded-xl px-4 py-2 text-xs">
                        + Thêm
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Khôi phục danh sách tuyển dụng mặc định?')) store.resetItems();
                        }}
                        className="btn-outline w-fit bg-white px-4 py-2 text-xs"
                    >
                        ↺ Khôi phục
                    </button>
                </div>
            </div>

            {(isAdding || editingIndex !== null) && (
                <div className="mt-4 rounded-xl border-2 border-brand-primary-200 bg-brand-primary-50 p-4">
                    <p className="mb-3 font-bold text-brand-primary-900">
                        {isAdding ? 'Thêm vị trí mới' : 'Chỉnh sửa vị trí'}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <input
                            placeholder="Tên vị trí *"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-primary-700"
                        />
                        <input
                            placeholder="Phòng ban"
                            value={form.dept}
                            onChange={(e) => setForm({ ...form, dept: e.target.value })}
                            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-primary-700"
                        />
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-primary-700"
                        >
                            <option value="Toàn thời gian">Toàn thời gian</option>
                            <option value="Bán thời gian">Bán thời gian</option>
                            <option value="Thực tập">Thực tập</option>
                            <option value="Hợp đồng">Hợp đồng</option>
                        </select>
                        <input
                            placeholder="Địa điểm"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-primary-700"
                        />
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button type="button" onClick={isAdding ? saveAdd : saveEdit} className="btn-primary w-fit rounded-xl px-4 py-2 text-xs">
                            💾 Lưu
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdding(false);
                                setEditingIndex(null);
                            }}
                            className="btn-outline w-fit bg-white px-4 py-2 text-xs"
                        >
                            ✕ Hủy
                        </button>
                    </div>
                </div>
            )}

            <ul className="mt-5 space-y-3">
                {store.items.map((job, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                    >
                        <div>
                            <p className="font-bold text-brand-primary-900">{job.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                                {job.dept} • {job.location}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {job.type}
                            </span>
                            <button
                                type="button"
                                onClick={() => startEdit(index)}
                                className="rounded-lg bg-brand-primary-100 px-2 py-1 text-xs font-bold text-brand-primary-800 hover:bg-brand-primary-200"
                            >
                                ✎ Sửa
                            </button>
                            <button
                                type="button"
                                onClick={() => confirmDelete(index)}
                                className="rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-100"
                            >
                                🗑 Xóa
                            </button>
                        </div>
                    </li>
                ))}
                {store.items.length === 0 && (
                    <p className="text-center text-sm text-slate-500 italic py-4">
                        Chưa có vị trí tuyển dụng. Bấm "+ Thêm" để tạo mới.
                    </p>
                )}
            </ul>
        </div>
    );
}

function EditableFAQs() {
    const store = useLocalStorage<FAQ>('tvd_admin_faqs', site.faqs);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<FAQ>({ q: '', a: '' });

    function startAdd() {
        setForm({ q: '', a: '' });
        setIsAdding(true);
        setEditingIndex(null);
    }

    function startEdit(index: number) {
        setForm(store.items[index]);
        setEditingIndex(index);
        setIsAdding(false);
    }

    function saveAdd() {
        if (!form.q.trim() || !form.a.trim()) {
            window.alert('Vui lòng nhập câu hỏi và câu trả lời.');
            return;
        }
        store.addItem(form);
        setIsAdding(false);
    }

    function saveEdit() {
        if (editingIndex === null) return;
        if (!form.q.trim() || !form.a.trim()) {
            window.alert('Vui lòng nhập câu hỏi và câu trả lời.');
            return;
        }
        store.updateItem(editingIndex, form);
        setEditingIndex(null);
    }

    function confirmDelete(index: number) {
        if (window.confirm('Xóa câu hỏi này?')) store.deleteItem(index);
    }

    return (
        <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-primary-900">
                    Câu hỏi thường gặp ({store.items.length})
                </h2>
                <div className="flex gap-2">
                    <button type="button" onClick={startAdd} className="btn-primary w-fit rounded-xl px-4 py-2 text-xs">
                        + Thêm
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Khôi phục danh sách FAQ mặc định?')) store.resetItems();
                        }}
                        className="btn-outline w-fit bg-white px-4 py-2 text-xs"
                    >
                        ↺ Khôi phục
                    </button>
                </div>
            </div>

            {(isAdding || editingIndex !== null) && (
                <div className="mt-4 rounded-xl border-2 border-brand-primary-200 bg-brand-primary-50 p-4">
                    <p className="mb-3 font-bold text-brand-primary-900">
                        {isAdding ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
                    </p>
                    <input
                        placeholder="Câu hỏi *"
                        value={form.q}
                        onChange={(e) => setForm({ ...form, q: e.target.value })}
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-primary-700"
                    />
                    <textarea
                        placeholder="Câu trả lời *"
                        value={form.a}
                        onChange={(e) => setForm({ ...form, a: e.target.value })}
                        rows={4}
                        className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-primary-700"
                    />
                    <div className="mt-3 flex gap-2">
                        <button type="button" onClick={isAdding ? saveAdd : saveEdit} className="btn-primary w-fit rounded-xl px-4 py-2 text-xs">
                            💾 Lưu
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdding(false);
                                setEditingIndex(null);
                            }}
                            className="btn-outline w-fit bg-white px-4 py-2 text-xs"
                        >
                            ✕ Hủy
                        </button>
                    </div>
                </div>
            )}

            <ul className="mt-5 space-y-3">
                {store.items.map((faq, index) => (
                    <li key={index} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <p className="font-semibold text-brand-primary-900">Q: {faq.q}</p>
                                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{faq.a}</p>
                            </div>
                            <div className="flex flex-shrink-0 gap-1">
                                <button
                                    type="button"
                                    onClick={() => startEdit(index)}
                                    className="rounded-lg bg-brand-primary-100 px-2 py-1 text-xs font-bold text-brand-primary-800 hover:bg-brand-primary-200"
                                >
                                    ✎
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmDelete(index)}
                                    className="rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-100"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
                {store.items.length === 0 && (
                    <p className="text-center text-sm text-slate-500 italic py-4">
                        Chưa có câu hỏi. Bấm "+ Thêm" để tạo mới.
                    </p>
                )}
            </ul>
        </div>
    );
}

export function AdminStats() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const pricingBars = buildPricingBars();

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            await fetch(ADMIN_LOGOUT_API_PATH, {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            router.replace(ADMIN_LOGIN_PATH);
            router.refresh();
        }
    }

    return (
        <section className="section bg-slate-50 min-h-[80vh]">
            <div className="container-x">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="eyebrow">Admin Panel</p>
                        <h1 className="section-title">Thống kê doanh nghiệp</h1>
                        <p className="mt-4 max-w-2xl text-slate-600">
                            Tổng quan dữ liệu dịch vụ, dự án, chứng nhận và định giá từ cấu hình site Tân Vĩnh Đạt.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.push(ADMIN_PANEL_PATH)}
                            className="btn-outline w-fit bg-white"
                        >
                            ← Về công cụ OCR
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="btn-primary w-fit rounded-2xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                        </button>
                    </div>
                </div>

                {/* Storage Notice */}
                <div className="mb-6 flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
                    <span className="flex-shrink-0 text-sm">ℹ️</span>
                    <span>
                        Thay đổi tuyển dụng & FAQ được lưu trong trình duyệt (localStorage). Để cập nhật vĩnh viễn trên site, sửa <code className="rounded bg-slate-100 px-1 py-0.5 text-brand-primary-700">lib/site.ts</code> và deploy lại.
                    </span>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    <StatCard icon="🔧" value={site.services.length} label="Dịch vụ" />
                    <StatCard icon="🏗️" value={site.projects.length} label="Dự án tiêu biểu" />
                    <StatCard icon="📜" value={site.certifications.length} label="Chứng nhận" />
                    <StatCard icon="💼" value={site.jobs.length} label="Tuyển dụng (mặc định)" />
                </div>

                {/* Pricing Chart */}
                <div className="mt-10 card p-6 md:p-8">
                    <h2 className="text-xl font-bold text-brand-primary-900">So sánh giá dịch vụ</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Mức giá cao nhất (VNĐ) theo từng nhóm dịch vụ. Biểu đồ minh họa tầm giá tương đối.
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {pricingBars.map((bar) => (
                            <div key={bar.label} className="flex flex-col items-center">
                                <div className="flex h-48 w-full items-end justify-center">
                                    <div
                                        className={`w-full max-w-[120px] rounded-t-xl ${bar.colorClass} transition-all duration-700`}
                                        style={{ height: `${Math.max(bar.value, 5)}%` }}
                                    />
                                </div>
                                <p className="mt-3 text-center text-sm font-bold text-brand-primary-900">{bar.display}</p>
                                <p className="mt-1 text-center text-xs text-slate-500">{bar.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services & Process (read-only) */}
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <div className="card p-6 md:p-8">
                        <h2 className="text-xl font-bold text-brand-primary-900">Danh sách dịch vụ</h2>
                        <ul className="mt-5 space-y-4">
                            {site.services.map((service) => (
                                <li key={service.slug} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-brand-primary-900">{service.title}</p>
                                        <span className="rounded-full bg-brand-secondary-50 px-3 py-1 text-xs font-bold text-brand-secondary-700">
                                            {service.bullets.length} điểm
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">{service.summary}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card p-6 md:p-8">
                        <h2 className="text-xl font-bold text-brand-primary-900">Quy trình xử lý</h2>
                        <ol className="mt-5 space-y-3">
                            {site.process.map((step) => (
                                <li key={step.step} className="flex gap-4">
                                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary-800 text-xs font-bold text-white">
                                        {step.step}
                                    </span>
                                    <div>
                                        <p className="font-bold text-brand-primary-900">{step.title}</p>
                                        <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* Editable: Jobs & FAQs */}
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <EditableJobs />
                    <EditableFAQs />
                </div>

                {/* Certifications (read-only) */}
                <div className="mt-10 card p-6 md:p-8">
                    <h2 className="text-xl font-bold text-brand-primary-900">
                        Chứng nhận & tiêu chuẩn ({site.certifications.length})
                    </h2>
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {site.certifications.map((cert) => (
                            <div key={cert.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="font-bold text-brand-primary-900">{cert.name}</p>
                                <p className="mt-1 text-xs text-slate-500">{cert.org}</p>
                                <p className="mt-2 text-sm text-slate-600">{cert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legal Compliance (read-only) */}
                <div className="mt-10 card p-6 md:p-8">
                    <h2 className="text-xl font-bold text-brand-primary-900">
                        Tuân thủ pháp lý ({site.legalCompliance.length})
                    </h2>
                    <ul className="mt-5 space-y-3">
                        {site.legalCompliance.map((item) => (
                            <li key={item.name} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                <p className="font-bold text-brand-primary-900">{item.name}</p>
                                <p className="mt-1 text-xs text-slate-500">{item.org}</p>
                                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}