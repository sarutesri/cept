/**
 * CEPT Database
 * Stores all content data for the website.
 * Update this file to add/edit content.
 */

export const DB = {
    projects: [
        {
            id: 1, title: "Digital Twin at Gawert Square",
            category: "Simulation",
            type: "PDF", size: "2.4 MB",
            desc: "Technical report on real-time digital replica optimization.", date: "2025-12-10", tags: ["RE100", "Smart Grid"], status: "Published", fileUrl: "#"
        },
        { id: 2, title: "EV Load Forecasting System", category: "Research", type: "PDF", size: "1.8 MB", desc: "AI models methodology for predicting EV charging demand.", date: "2025-11-25", tags: ["AI/ML", "EV"], status: "Published", fileUrl: "#" },
        { id: 3, title: "Solar Rooftop Impact Analysis", category: "Archive", type: "Report", size: "5.1 MB", desc: "Full analysis of solar penetration on distribution transformers.", date: "2024-08-15", tags: ["Solar", "Completed"], status: "Archived", fileUrl: "#" },
        { id: 4, title: "Insulation Coordination Study", category: "Consultancy", type: "Paper", size: "800 KB", desc: "High voltage transmission line upgrade project findings.", date: "2023-05-20", tags: ["High Voltage"], status: "Archived", fileUrl: "#" },
        { id: 5, title: "Microgrid Logic Controller Manual", category: "Manual", type: "PDF", size: "3.2 MB", desc: "Operational manual for BESS logic controller.", date: "2024-01-10", tags: ["BESS", "Microgrid"], status: "Published", fileUrl: "#" }
    ],
    courses: [
        { id: 101, title: "AI for Power Utilities (Gen 5)", date: "15-17 Feb 2026", price: "5,500 THB", status: "Open", type: "upcoming", link: "#", img: "assets/images/courses/course-101.jpg", images: ["assets/images/courses/gis-2026.png", "assets/images/courses/course-102.jpg", "assets/images/courses/course-101.jpg"], contentFile: "content/training/101-ai.md", desc: "Learn how to apply Artificial Intelligence and Machine Learning techniques specifically for power system applications." },
        { id: 102, title: "Microgrid Design & Simulation", date: "10-12 Mar 2026", price: "7,500 THB", status: "Filling Fast", type: "upcoming", link: "#", img: "assets/images/courses/course-102.jpg", contentFile: "content/training/102-microgrid.md", desc: "Comprehensive workshop on designing and simulating microgrids using industry-standard tools." },
        { id: 103, title: "Basic High Voltage Testing", date: "Dec 2025", price: "-", status: "Closed", type: "past", link: "#", img: "assets/images/courses/course-103.jpg", desc: "Fundamental principles and safety procedures for high voltage testing in laboratory environments." },
        { id: 104, title: "Smart Grid Protocols (DNP3)", date: "Oct 2025", price: "-", status: "Closed", type: "past", link: "#", img: "assets/images/courses/course-104.jpg", desc: "Deep dive into DNP3 and other essential communication protocols for modern smart grids." }
    ],
    news: [
        { id: 201, title: "Collaboration with PEA on Smart Grid", date: "20 Jan 2026", category: "Announcement", img: "assets/images/news/news-201.jpg", contentFile: "content/news/201-pea.md" },
        { id: 202, title: "CEPT Welcomes International Researchers", date: "15 Jan 2026", category: "Activity", img: "assets/images/news/news-202.jpg", contentFile: "content/news/202-intl.md" }
    ],
    team: [
        { name: "รองศาสตราจารย์ ดร.วิจารณ์ หวังดี", role: "ผู้อำนวยการศูนย์เชี่ยวชาญฯ", area: "Wijarn.W@chula.ac.th", img: "assets/images/team/Wijarn Wangdee.png" },
        { name: "ผู้ช่วยศาสตราจารย์ ดร. สมบูรณ์ แสงวงศ์วาณิชย์", role: "นักวิจัยอาวุโส", area: "somboon.sa@chula.ac.th", img: "" },
        { name: "นายวิทวัส งามประดิษฐ์", role: "นักวิจัย", area: "vitthawat.n@chula.ac.th", img: "" },
        { name: "ดร. ศรุต ศรีสันติสุข", role: "นักวิจัย", area: "Sarute.S@chula.ac.th", img: "" },
        { name: "นายสุพัฒน์ เฮงยศมาก", role: "นักวิจัย", area: "Supatana.H@chula.ac.th", img: "" },
        { name: "นางสาวปรีณาพรรณ ปัญญา", role: "นักวิจัย", area: "Preenapan.P@chula.ac.th", img: "" },
        { name: "นายณฐนนท โตงามรักษ์", role: "นักวิจัย", area: "natanon.t@chula.ac.th", img: "" },
        { name: "นายธนภณ จ้องจรัสแสง", role: "นักวิจัย", area: "Thanapon.J@chula.ac.th", img: "" }
    ],
    partners: [
        { name: "Electricity Generating Authority of Thailand (EGAT)", logo: "assets/images/logos/EGAT.png" },
        { name: "Metropolitan Electricity Authority (MEA)", logo: "assets/images/logos/MEA.png" },
        { name: "Provincial Electricity Authority (PEA)", logo: "assets/images/logos/PEA.png" }
    ],
    research: [],
    supportTeam: [
        { name: "นางสาวอาภัสรา จิวตระกูล", role: "งานธุรการและงานพัสดุ", area: "apassara.d@chula.ac.th<br>Tel: 0 2218 6544 / 86544", img: "" },
        { name: "นางสาวรัตนา ธนะเพิ่มพูล", role: "ส่วนงานการเงินและงานบัญชี", area: "rattana.th@chula.ac.th<br>Tel: 0 2218 6483 / 86483", img: "" },
        { name: "นางสาวสุภาภรณ์ ทองวิทยกุล", role: "ส่วนงานการเงินและงานบัญชี", area: "suphaporn.t@chula.ac.th<br>Tel: 0 2218 6483 / 86483", img: "" },
        { name: "นางสาวดวงใจ ขันสังข์", role: "งานบริการวิชาการ", area: "duangjai.kh@chula.ac.th<br>Tel: 0 2218 6542 / 86542", img: "" },
        { name: "นางสาวอธิษฐาน รอดรักษ์", role: "งานบริการวิชาการ", area: "atithan.r@chula.ac.th<br>Tel: 0 2218 6542 / 86542", img: "" }
    ],
    advisoryBoard: [
        { name: "Prof. Supot Teachavorasinskun, Ph.D.", role: "Chairman", area: "Expert, Faculty of Engineering Chulalongkorn University", img: "assets/images/team/Supot Teachavorasinskun.jpg" },
        { name: "Assoc. Prof. Witaya Wannasuphoprasit, Ph.D.", role: "Vice Chairman", area: "Dean, Faculty of Engineering Chulalongkorn University", img: "assets/images/team/Witaya Wannasuphoprasit.jpg" },
        { name: "Mr. Sanay Treekhan", role: "Committee", area: "Deputy Governor, EGAT Transmission System Operations", img: "assets/images/team/Sanay Treekhan.jpg" },
        { name: "Mr. Tawatchai Sumranwanich", role: "Committee", area: "President, EGCO", img: "assets/images/team/Tawatchai Sumranwanich.jpg" },
        { name: "Mr. Pongsakorn Yuthagovit", role: "Committee", area: "Deputy Governor Planning and Engineering, PEA", img: "assets/images/team/Pongsakorn Yuthagovit.png" },
        { name: "Mr. Ditchawat Chanei", role: "Committee", area: "Deputy Governor Digital Technology and Communication Systems, MEA", img: "assets/images/team/Ditchawat Chanei.png" },
        { name: "Assoc. Prof. Chaodit Aswakul, Ph.D.", role: "Committee", area: "Head of Department of Electrical Engineering, Faculty of Engineering, Chulalongkorn University", img: "assets/images/team/Chaodit Aswakul.png" },
        { name: "Assoc. Prof. Wijarn Wangdee, Ph.D.", role: "Committee and Secretary", area: "Executive Director, CEPT Faculty of Engineering, Chulalongkorn University", img: "assets/images/team/Wijarn Wangdee.png" }
    ],
    executiveBoard: [
        { name: "Assoc. Prof. Witaya Wannasuphoprasit, Ph.D.", role: "Chairman", area: "Dean, Faculty of Engineering, Chulalongkorn University", img: "assets/images/team/Witaya Wannasuphoprasit.jpg" },
        { name: "Assoc. Prof. Chaodit Aswakul, Ph.D.", role: "Vice Chairman", area: "Head of Department of Electrical Engineering, Faculty of Engineering, Chulalongkorn University", img: "assets/images/team/Chaodit Aswakul.png" },
        { name: "Mr. Warit Rattanachuen", role: "Vice Chairman", area: "Deputy Governor - Strategy, EGAT", img: "assets/images/team/Warit Rattanachuen.png" },
        { name: "Mr. Visit Pathomchareonroj", role: "Committee", area: "Assistant Governor Transmission System Operations and Asset Management, EGAT", img: "assets/images/team/Visit Pathomchareonroj.png" },
        { name: "Mr. Direk Boonpiyathud", role: "Committee", area: "Deputy Governor Electrical System Planning and Innovation, MEA", img: "assets/images/team/Direk Boonpiyathud.jpg" },
        { name: "Pradit Fuangfoo, Ph.D.", role: "Committee", area: "Deputy Governor - Corporate Strategy, PEA", img: "assets/images/team/Pradit Fuangfoo.png" },
        { name: "Sumittra Charojrochkul, Ph.D.", role: "Committee", area: "Executive Director, the National Energy Technology Center (ENTEC)", img: "assets/images/team/Sumitra Jarasarojkul.jpg" },
        { name: "Assoc. Prof. Naebboon Hoonchareon, Ph.D.", role: "Committee", area: "Faculty representatives from Department of Electrical Engineering, Faculty of Engineering, Chulalongkorn University", img: "assets/images/team/Naebboon\u00A0 Hoonchareon.png" },
        { name: "Assoc. Prof. Wijarn Wangdee, Ph.D.", role: "Committee and Secretary", area: "Executive Director, CEPT Faculty of Engineering, Chulalongkorn University", img: "assets/images/team/Wijarn Wangdee.png" }
    ]
};
