import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Chính sách & Điều khoản',
    description: 'Điều khoản sử dụng và chính sách bảo mật của website Tân Vĩnh Đạt.',
};

const sections = [
    {
        title: 'Điều khoản sử dụng',
        items: [
            { h: '1. Chấp nhận điều khoản', p: 'Bằng việc truy cập và sử dụng website tanvinhdat.vn, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website.' },
            { h: '2. Sử dụng nội dung', p: 'Mọi nội dung trên website (văn bản, hình ảnh, logo, biểu tượng) thuộc quyền sở hữu của Công ty TNHH Tân Vĩnh Đạt. Nghiêm cấm sao chép, phân phối hoặc sử dụng cho mục đích thương mại khi chưa được sự đồng ý bằng văn bản.' },
            { h: '3. Giới hạn trách nhiệm', p: 'Thông tin trên website được cung cấp với mục đích tham khảo. Tân Vĩnh Đạt không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng thông tin trên website.' },
        ],
    },
    {
        title: 'Chính sách bảo mật',
        items: [
            { h: '1. Thu thập thông tin', p: 'Chúng tôi chỉ thu thập thông tin cá nhân khi bạn tự nguyện cung cấp (qua email, điện thoại, hoặc các kênh liên hệ khác). Các thông tin có thể bao gồm: họ tên, số điện thoại, email, địa chỉ và nội dung yêu cầu.' },
            { h: '2. Mục đích sử dụng', p: 'Thông tin được sử dụng để: (a) phản hồi yêu cầu tư vấn, (b) cung cấp báo giá dịch vụ, (c) gửi thông tin kỹ thuật và chính sách mới khi được yêu cầu, (d) tuân thủ nghĩa vụ pháp lý.' },
            { h: '3. Bảo mật & lưu trữ', p: 'Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân khỏi truy cập trái phép, thay đổi hoặc tiêu hủy. Thông tin chỉ được lưu trữ trong thời gian cần thiết cho mục đích đã nêu.' },
            { h: '4. Quyền của bạn', p: 'Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ ' + site.email + ' để thực hiện các quyền này.' },
        ],
    },
];

export default function PoliciesPage() {
    return (
        <>
            <PageHero
                eyebrow="Pháp lý"
                title="Chính sách & Điều khoản"
                description="Cam kết của Tân Vĩnh Đạt về bảo mật thông tin và quyền lợi người dùng."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/policies', label: 'Chính sách' },
                ]}
            />

            <section className="section">
                <div className="container-x max-w-4xl space-y-10">
                    {sections.map((sec) => (
                        <article key={sec.title} className="card p-8 md:p-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-brand-primary-900 mb-6">{sec.title}</h2>
                            <div className="space-y-6">
                                {sec.items.map((item) => (
                                    <div key={item.h}>
                                        <h3 className="text-lg font-bold text-brand-primary-900">{item.h}</h3>
                                        <p className="mt-2 text-slate-600 leading-relaxed">{item.p}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}

                    <div className="text-center text-sm text-slate-500">
                        Cập nhật lần cuối: Tháng 1, 2025
                    </div>
                </div>
            </section>

            <CTASection title="Có thắc mắc về chính sách?" />
        </>
    );
}
