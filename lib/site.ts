export const site = {
    name: 'Công ty TNHH TM - DV Tân Vĩnh Đạt',
    legalName: 'CÔNG TY TNHH THƯƠNG MẠI - DỊCH VỤ TÂN VĨNH ĐẠT',
    shortName: 'Tân Vĩnh Đạt',
    taxCode: '3703409514',
    tagline: 'Giải pháp xử lý chất thải công nghiệp toàn diện',
    description:
        'Tân Vĩnh Đạt chuyên thu gom, vận chuyển và xử lý chất thải công nghiệp theo tiêu chuẩn môi trường Việt Nam. Đối tác tin cậy của các nhà máy và khu công nghiệp.',
    url: 'https://tanvinhdat.deploy.io.vn',
    email: 'tanvinhdat1983@gmail.com',
    phone: '0898 522 939',
    hotline: '0898 522 939',
    address: 'Thửa đất số 504, Tờ bản đồ số 9, Tổ 1, Khu phố Tân Lập 3, Phường Tân Uyên, TP. Hồ Chí Minh, Việt Nam',
    workingHours: 'Thứ 2 - Thứ 7: 7:30 - 17:30',
    established: '2025',
    mapEmbed:
        'https://www.google.com/maps?q=Khu+ph%E1%BB%91+T%C3%A2n+L%E1%BA%ADp+3,+Ph%C6%B0%E1%BB%9Dng+T%C3%A2n+Uy%C3%AAn,+Th%C3%A0nh+ph%E1%BB%91+T%C3%A2n+Uy%C3%AAn,+B%C3%ACnh+D%C6%B0%C6%A1ng,+Vi%E1%BB%87t+Nam&output=embed',
    social: {
        facebook: 'https://facebook.com/tanvinhdat',
        youtube: 'https://youtube.com/@tanvinhdat',
        linkedin: 'https://linkedin.com/company/tanvinhdat',
        zalo: 'https://zalo.me/tanvinhdat',
    },
    nav: [
        { href: '/', label: 'Trang chủ' },
        { href: '/about', label: 'Giới thiệu' },
        { href: '/services', label: 'Dịch vụ' },
        { href: '/projects', label: 'Dự án' },
        { href: '/certifications', label: 'Chứng nhận' },
        { href: '/process', label: 'Quy trình' },
        { href: '/faq', label: 'Tuyển dụng/FAQ' },
    ],
    services: [
        {
            slug: 'collection',
            title: 'Thu gom chất thải',
            short: 'Thu gom',
            icon: 'truck' as const,
            summary:
                'Dịch vụ thu gom chất thải công nghiệp tận nơi với đội xe chuyên dụng và nhân sự được đào tạo bài bản theo QCVN.',
            bullets: [
                'Thu gom chất thải rắn công nghiệp thông thường',
                'Thu gom chất thải nguy hại (rác thải độc hại)',
                'Phân loại tại nguồn theo quy chuẩn Bộ TNMT',
                'Xe chuyên dụng đạt chuẩn Euro 4 trở lên',
            ],
        },
        {
            slug: 'transport',
            title: 'Vận chuyển chất thải',
            short: 'Vận chuyển',
            icon: 'route' as const,
            summary:
                'Vận chuyển chất thải an toàn, có giám sát hành trình GPS, đảm bảo tuân thủ Nghị định 08/2022/NĐ-CP.',
            bullets: [
                'GPS theo dõi hành trình 24/7',
                'Phiếu chuyển giao chất thải điện tử',
                'Đội ngũ tài xế có chứng chỉ hành nghề',
                'Bảo hiểm trách nhiệm dân sự đầy đủ',
            ],
        },
        {
            slug: 'treatment',
            title: 'Xử lý chất thải',
            short: 'Xử lý',
            icon: 'recycle' as const,
            summary:
                'Nhà máy xử lý đạt chuẩn ISO 14001:2015, ứng dụng công nghệ tiên tiến theo quy trình khép kín.',
            bullets: [
                'Xử lý sinh học, hóa lý, nhiệt',
                'Công nghệ đốt có thu hồi năng lượng',
                'Chứng nhận ISO 9001, ISO 14001, ISO 45001',
                'Báo cáo quan trắc định kỳ hàng quý',
            ],
        },
    ],
    stats: [
        { value: '2025', label: 'Năm thành lập' },
        { value: '50+', label: 'Khách hàng doanh nghiệp' },
        { value: '10K+', label: 'Tấn chất thải/năm' },
        { value: '100%', label: 'Tỷ lệ xử lý an toàn' },
    ],
    projects: [
        {
            title: 'Khu công nghiệp Tân Bình',
            client: 'Ban Quản lý KCN Tân Bình',
            year: '2024',
            scope: 'Thu gom & xử lý 1.200 tấn/năm',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Nhà máy Sản xuất ABC',
            client: 'Công ty CP Sản xuất ABC',
            year: '2023',
            scope: 'Xử lý chất thải nguy hại dạng lỏng',
            image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Tập đoàn Dệt may XYZ',
            client: 'Tập đoàn Dệt may XYZ',
            year: '2023',
            scope: 'Vận chuyển nước thải công nghiệp',
            image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Nhà máy Xi măng Miền Nam',
            client: 'Công ty Xi măng Miền Nam',
            year: '2022',
            scope: 'Xử lý bụi & chất thải rắn',
            image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Khu chế xuất Tân Thuận',
            client: 'Khu chế xuất Tân Thuận',
            year: '2022',
            scope: 'Tổng thầu quản lý chất thải',
            image: 'https://images.unsplash.com/photo-1610028658537-b7d8c3d54d3b?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Nhà máy Thép Đông Nam Á',
            client: 'Công ty Thép Đông Nam Á',
            year: '2021',
            scope: 'Xử lý xỉ & kim loại nặng',
            image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
        },
    ],
    certifications: [
        { name: 'ISO 9001:2015', org: 'TÜV NORD', desc: 'Hệ thống Quản lý Chất lượng' },
        { name: 'ISO 14001:2015', org: 'TÜV NORD', desc: 'Hệ thống Quản lý Môi trường' },
        { name: 'ISO 45001:2018', org: 'TÜV NORD', desc: 'An toàn & Sức khỏe lao động' },
        { name: 'QCVN 07:2009', org: 'Bộ Tài nguyên & Môi trường', desc: 'Chất thải nguy hại' },
        { name: 'Nghị định 08/2022', org: 'Chính phủ VN', desc: 'Quản lý chất thải & phế liệu' },
        { name: 'Thông tư 02/2022', org: 'Bộ TNMT', desc: 'Quy chuẩn kỹ thuật QG về CTNH' },
    ],
    legalCompliance: [
        {
            name: 'Luật Bảo vệ Môi trường 2020',
            org: 'Quốc hội Việt Nam',
            desc: 'Khung pháp lý tối cao về bảo vệ môi trường, quy định nghĩa vụ của doanh nghiệp xử lý chất thải.',
        },
        {
            name: 'Thông tư 20/2021/TT-BTNMT',
            org: 'Bộ Tài nguyên & Môi trường',
            desc: 'Quy định về cấp phép, điều kiện và hồ sơ hoạt động xử lý chất thải nguy hại.',
        },
        {
            name: 'Nghị định 38/2015/NĐ-CP',
            org: 'Chính phủ VN',
            desc: 'Quản lý chất thải rắn, bao gồm thu gom, vận chuyển và xử lý tại cơ sở.',
        },
        {
            name: 'Nghị định 08/2022/NĐ-CP',
            org: 'Chính phủ VN',
            desc: 'Quản lý chất thải và phế liệu, cập nhật yêu cầu vận hành cho doanh nghiệp ngành môi trường.',
        },
        {
            name: 'Quyết định cấp phép UBND',
            org: 'UBND cấp tỉnh/thành phố',
            desc: 'Giấy phép vận chuyển chất thải nguy hại theo tuyến đường được cấp bởi cơ quan chức năng địa phương.',
        },
    ],
    faqs: [
        {
            q: 'Các loại chất thải nào được Tân Vĩnh Đạt tiếp nhận?',
            a: 'Chúng tôi tiếp nhận hầu hết các loại chất thải rắn công nghiệp thông thường, chất thải nguy hại (CTNH), nước thải công nghiệp, chất thải y tế không lây nhiễm và chất thải xây dựng. Mỗi mã CTNH sẽ có quy trình xử lý riêng theo quy chuẩn Bộ TNMT.',
        },
        {
            q: 'Quy trình đăng ký dịch vụ gồm những bước nào?',
            a: 'Bước 1: Khảo sát & tư vấn miễn phí tại nhà máy. Bước 2: Ký hợp đồng dịch vụ. Bước 3: Lập hồ sơ chất thải theo Nghị định 08/2022. Bước 4: Triển khai thu gom định kỳ hoặc theo yêu cầu. Bước 5: Báo cáo xử lý hàng quý.',
        },
        {
            q: 'Chi phí dịch vụ được tính như thế nào?',
            a: 'Chi phí phụ thuộc vào: mã chất thải, khối lượng, tần suất thu gom, khoảng cách vận chuyển và công nghệ xử lý yêu cầu. Vui lòng liên hệ hotline 1900 6868 để nhận báo giá chi tiết.',
        },
        {
            q: 'Tân Vĩnh Đạt có giấy phép đầy đủ không?',
            a: 'Có. Chúng tôi sở hữu đầy đủ: Giấy phép xử lý CTNH do Bộ TNMT cấp, Giấy phép vận chuyển CTNH, Chứng nhận ISO 9001/14001/45001, Bảo hiểm trách nhiệm dân sự cho hoạt động vận chuyển và xử lý chất thải.',
        },
        {
            q: 'Thời gian phản hồi khi có yêu cầu khẩn cấp?',
            a: 'Đội ngũ hotline 24/7 của chúng tôi phản hồi trong vòng 30 phút. Với sự cố tràn đổ, đội ứng cứu khẩn cấp có mặt tại hiện trường trong vòng 2-4 giờ tùy khu vực.',
        },
        {
            q: 'Có phục vụ khách hàng ngoài TP.HCM không?',
            a: 'Có. Chúng tôi phục vụ tất cả các tỉnh thành phía Nam và một số tỉnh miền Trung. Với khách hàng khu vực xa, vui lòng liên hệ trước để được tư vấn phương án vận chuyển tối ưu.',
        },
    ],
    pricing: [
        {
            category: 'Chất thải rắn công nghiệp thông thường',
            unit: 'kg',
            tiers: [
                { range: '< 1.000 kg/tháng', price: '3.500 - 5.000đ' },
                { range: '1.000 - 10.000 kg/tháng', price: '2.500 - 3.500đ' },
                { range: '> 10.000 kg/tháng', price: 'Liên hệ báo giá' },
            ],
        },
        {
            category: 'Chất thải nguy hại (CTNH)',
            unit: 'kg',
            tiers: [
                { range: 'Mã CTNH thông thường', price: '8.000 - 25.000đ' },
                { range: 'Mã CTNH đặc biệt (Y, H, T+)', price: '30.000 - 80.000đ' },
                { range: 'Nước thải công nghiệp', price: 'Liên hệ báo giá' },
            ],
        },
        {
            category: 'Dịch vụ đặc biệt',
            unit: 'lần',
            tiers: [
                { range: 'Ứng cứu sự cố tràn đổ', price: 'Liên hệ báo giá' },
                { range: 'Tư vấn hồ sơ môi trường', price: 'Từ 15.000.000đ' },
                { range: 'Khảo sát & đánh giá tác động', price: 'Từ 25.000.000đ' },
            ],
        },
    ],
    process: [
        { step: '01', title: 'Tiếp nhận yêu cầu', desc: 'Khách hàng liên hệ qua hotline, email hoặc form. Đội ngũ tư vấn phản hồi trong 24 giờ.' },
        { step: '02', title: 'Khảo sát & tư vấn', desc: 'Kỹ sư đến hiện trường khảo sát, phân loại chất thải và đề xuất phương án xử lý tối ưu.' },
        { step: '03', title: 'Báo giá & hợp đồng', desc: 'Gửi báo giá chi tiết, thương thảo và ký kết hợp đồng dịch vụ dài hạn hoặc theo đợt.' },
        { step: '04', title: 'Triển khai thu gom', desc: 'Đội xe chuyên dụng thu gom đúng lịch trình, cập nhật phiếu chuyển giao điện tử.' },
        { step: '05', title: 'Vận chuyển an toàn', desc: 'Theo dõi GPS, đảm bảo đúng tuyến đường và thời gian quy định.' },
        { step: '06', title: 'Xử lý tại nhà máy', desc: 'Áp dụng công nghệ phù hợp, ghi nhận khối lượng đầu vào - đầu ra.' },
        { step: '07', title: 'Báo cáo & chứng từ', desc: 'Cấp giấy chứng nhận xử lý, báo cáo quan trắc định kỳ theo quy định.' },
    ],
    jobs: [
        { title: 'Kỹ sư Môi trường', dept: 'Phòng Kỹ thuật', type: 'Toàn thời gian', location: 'TP.HCM' },
        { title: 'Nhân viên Vận hành Nhà máy XLCT', dept: 'Nhà máy xử lý', type: 'Toàn thời gian', location: 'Bình Dương' },
        { title: 'Tài xế xe chuyên dụng', dept: 'Đội vận chuyển', type: 'Toàn thời gian', location: 'TP.HCM' },
        { title: 'Chuyên viên Tư vấn Môi trường', dept: 'Phòng Kinh doanh', type: 'Toàn thời gian', location: 'TP.HCM' },
        { title: 'Kế toán Tổng hợp', dept: 'Phòng Kế toán', type: 'Toàn thời gian', location: 'TP.HCM' },
    ],
};

export type SiteConfig = typeof site;
