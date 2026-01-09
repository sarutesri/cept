import { DB } from './db.js';

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('team-content-container');
    const tabs = document.querySelectorAll('.filter-btn');

    // --- RENDER HELPERS ---

    const createMemberCard = (t) => {
        const imgHtml = t.img ? `
            <div style="width:120px; height:120px; border-radius:50%; overflow:hidden; margin:0 auto 1rem; border:1px solid #eee;">
                <img src="${t.img}" style="width:100%; height:100%; object-fit:cover" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            </div>` : '';

        return `
        <div class="card" style="border:1px solid #e2e8f0; transition: var(--transition); height: 100%;">
            <div style="background:var(--white); padding:2rem; border-radius:8px; text-align:center; height:100%; display:flex; flex-direction:column; justify-content:center;">
                ${imgHtml}
                <h4 style="font-size:1.1rem; margin-bottom:0.5rem; color: var(--text-dark); display: flex; align-items: center; justify-content: center;">${t.name}</h4>
                <p style="color:var(--accent-maroon); font-weight:600; font-size:0.9rem; margin-bottom:0.5rem;">${t.role}</p>
                <p style="font-size:0.85rem; color:var(--text-gray)">${t.area}</p>
            </div>
        </div>
        `;
    };

    const renderGrid = (data) => {
        if (!data || data.length === 0) return '<p class="text-center" style="color:var(--text-gray);">No members found.</p>';
        return `
            <div class="grid grid-3" style="animation: fadeIn 0.5s ease;">
                ${data.map(t => createMemberCard(t)).join('')}
            </div>
        `;
    };

    const renderCEPT = () => {
        if (!DB.team || DB.team.length === 0) return '';

        const director = DB.team[0]; // Assuming first is Director
        const researchers = DB.team.slice(1);

        let html = `
            <div style="animation: fadeIn 0.5s ease;">
                <!-- Director Section -->
                <div style="text-align:center; margin-bottom:3rem; padding: 2rem; background: var(--bg-light); border-radius: 12px; max-width: 800px; margin-left: auto; margin-right: auto; box-shadow: var(--shadow-md);">
                    <div style="width:160px; height:160px; border-radius:50%; overflow:hidden; border:4px solid var(--white); margin:0 auto 1.5rem; box-shadow: var(--shadow-sm);">
                        <img src="${director.img}" style="width:100%; height:100%; object-fit:cover" onerror="this.src='https://via.placeholder.com/150?text=Director'">
                    </div>
                    <h3 style="font-size:1.75rem; margin-bottom:0.5rem; color: var(--identity-blue);">${director.name}</h3>
                    <p style="color:var(--accent-maroon); font-weight:700; font-size:1.2rem; margin-bottom: 0.5rem;">${director.role}</p>
                    <p style="font-size:1rem; color:var(--text-gray)">${director.area}</p>
                </div>

                <!-- Researchers Grid -->
                <h3 style="text-align:center; margin-bottom:2rem; font-size:1.5rem; color:var(--text-dark);">Researchers & Engineers</h3>
                ${renderGrid(researchers)}
            </div>
        `;
        return html;
    };

    const renderSupport = () => {
        const sections = [
            {
                name: "Academic Services",
                bgColor: "#eff6ff", // Blue-50
                textColor: "var(--identity-blue)",
                borderColor: "#bfdbfe" // Blue-200
            },
            {
                name: "Project Management, Administrative & Procurement",
                bgColor: "#fff1f2", // Rose-50
                textColor: "var(--accent-maroon)",
                borderColor: "#fecdd3" // Rose-200
            },
            {
                name: "Finance, Accounting, Planning & Budgeting",
                bgColor: "#f8fafc", // Slate-50
                textColor: "#475569", // Slate-600
                borderColor: "#e2e8f0" // Slate-200
            }
        ];

        let html = `<h3 style="text-align:center; margin-bottom:2rem; font-size:1.5rem; color:var(--text-dark);">Support Team</h3>`;

        sections.forEach(section => {
            // Filter members matching this specific role name exactly
            const members = DB.supportTeam.filter(m => m.role === section.name);

            if (members.length > 0) {
                html += `
                    <div style="margin-bottom: 3rem; animation: fadeIn 0.5s ease;">
                        <div style="background-color: ${section.bgColor}; color: ${section.textColor}; padding: 1rem; border-radius: 8px; text-align: center; margin-bottom: 1.5rem; font-weight: 700; font-size: 1.25rem; border: 1px solid ${section.borderColor}; box-shadow: var(--shadow-sm);">
                            ${section.name}
                        </div>
                        ${renderGrid(members)}
                    </div>
                `;
            }
        });

        // Catch any leftovers (if roles don't match exactly)
        const accountedFor = sections.flatMap(s => s.name);
        const leftovers = DB.supportTeam.filter(m => !accountedFor.includes(m.role));
        if (leftovers.length > 0) {
            html += `
                <div style="margin-bottom: 3rem; animation: fadeIn 0.5s ease;">
                    <div style="background-color: #f1f5f9; color: #64748b; padding: 1rem; border-radius: 8px; text-align: center; margin-bottom: 1.5rem; font-weight: 600; font-size: 1.1rem; border: 1px solid #cbd5e1;">
                        Other Support Staff
                    </div>
                    ${renderGrid(leftovers)}
                </div>
            `;
        }

        return html;
    };

    // --- TAB LOGIC ---

    const updateContent = (tabId) => {
        container.innerHTML = ''; // Clear

        // Remove active class
        tabs.forEach(btn => btn.classList.remove('active'));
        // Add active class to current
        const activeBtn = document.querySelector(`.filter-btn[data-tab="${tabId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        switch (tabId) {
            case 'cept':
                container.innerHTML = renderCEPT();
                break;
            case 'support':
                container.innerHTML = renderSupport();
                break;
            case 'structure':
                container.innerHTML = `
                    <div style="text-align:center; animation: fadeIn 0.5s ease;">
                        <h3 style="text-align:center; margin-bottom:2rem; font-size:1.5rem; color:var(--text-dark);">Organization Structure</h3>
                        <img src="assets/images/team/CEPT_org_structure.png" alt="CEPT Organization Structure"
                        style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: var(--shadow-md);">
                    </div>
                `;
                break;
            case 'executive':
                container.innerHTML = `<h3 style="text-align:center; margin-bottom:2rem; font-size:1.5rem; color:var(--text-dark);">Board of Executive Committee</h3>` + renderGrid(DB.executiveBoard);
                break;
            case 'advisory':
                container.innerHTML = `<h3 style="text-align:center; margin-bottom:2rem; font-size:1.5rem; color:var(--text-dark);">Board of Advisory Committee</h3>` + renderGrid(DB.advisoryBoard);
                break;
            default:
                container.innerHTML = renderCEPT();
        }
    };

    // Event Listeners
    tabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.getAttribute('data-tab');
            updateContent(tab);
        });
    });

    // Init
    updateContent('cept');

});
