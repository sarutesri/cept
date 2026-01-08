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
        { id: 101, title: "AI for Power Utilities (Gen 5)", date: "15-17 Feb 2026", price: "5,500 THB", status: "Open", type: "upcoming", link: "#", img: "assets/images/courses/course-101.jpg", contentFile: "content/training/101-ai.md", desc: "Learn how to apply Artificial Intelligence and Machine Learning techniques specifically for power system applications." },
        { id: 102, title: "Microgrid Design & Simulation", date: "10-12 Mar 2026", price: "7,500 THB", status: "Filling Fast", type: "upcoming", link: "#", img: "assets/images/courses/course-102.jpg", contentFile: "content/training/102-microgrid.md", desc: "Comprehensive workshop on designing and simulating microgrids using industry-standard tools." },
        { id: 103, title: "Basic High Voltage Testing", date: "Dec 2025", price: "-", status: "Closed", type: "past", link: "#", img: "assets/images/courses/course-103.jpg", desc: "Fundamental principles and safety procedures for high voltage testing in laboratory environments." },
        { id: 104, title: "Smart Grid Protocols (DNP3)", date: "Oct 2025", price: "-", status: "Closed", type: "past", link: "#", img: "assets/images/courses/course-104.jpg", desc: "Deep dive into DNP3 and other essential communication protocols for modern smart grids." }
    ],
    news: [
        { id: 201, title: "Collaboration with PEA on Smart Grid", date: "20 Jan 2026", category: "Announcement", img: "assets/images/news/news-201.jpg", contentFile: "content/news/201-pea.md" },
        { id: 202, title: "CEPT Welcomes International Researchers", date: "15 Jan 2026", category: "Activity", img: "assets/images/news/news-202.jpg", contentFile: "content/news/202-intl.md" }
    ],
    team: [
        { name: "Assoc. Prof. Dr. Wijarn Wangdee", role: "Director", area: "Power Systems", img: "assets/images/team/member-1.jpg" },
        { name: "Dr. Somchai Researcher", role: "Senior Researcher", area: "Smart Grid", img: "https://via.placeholder.com/400x400?text=Somchai" },
        { name: "Mr. Somkiat Engineer", role: "Research Engineer", area: "High Voltage", img: "https://via.placeholder.com/400x400?text=Somkiat" }
    ],
    partners: [
        { name: "Provincial Electricity Authority (PEA)", logo: "assets/images/partners/pea.png" },
        { name: "Electricity Generating Authority of Thailand (EGAT)", logo: "assets/images/partners/egat.png" },
        { name: "Metropolitan Electricity Authority (MEA)", logo: "assets/images/partners/mea.png" },
        { name: "Energy Policy and Planning Office (EPPO)", logo: "assets/images/partners/eppo.png" }
    ]
};
