import { DB } from './db.js';

document.addEventListener('DOMContentLoaded', () => {

    // Director
    const directorContainer = document.getElementById('director-section');
    if (directorContainer && DB.team.length > 0) {
        const d = DB.team[0]; // Assume first is director
        directorContainer.innerHTML = `
            <div style="width:140px; height:140px; border-radius:50%; overflow:hidden; border:4px solid var(--white); margin:0 auto 1.5rem; box-shadow: var(--shadow-md);">
                <img src="${d.img}" style="width:100%; height:100%; object-fit:cover">
            </div>
            <h3 style="font-size:1.75rem; margin-bottom:0.5rem; color: var(--identity-blue);">${d.name}</h3>
            <p style="color:var(--accent-maroon); font-weight:700; font-size:1.1rem; margin-bottom: 0.5rem;">${d.role}</p>
            <p style="font-size:0.95rem; color:var(--text-gray)">Expertise: ${d.area}</p>
        `;
    }

    // Team Grid
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid && DB.team.length > 1) {
        teamGrid.innerHTML = DB.team.slice(1).map(t => `
            <div style="background:var(--white); padding:2rem; border-radius:8px; text-align:center; border:1px solid #e2e8f0; transition: var(--transition);" onmouseover="this.style.borderColor='var(--accent-maroon)'" onmouseout="this.style.borderColor='#e2e8f0'">
                <div style="width:100px; height:100px; border-radius:50%; overflow:hidden; margin:0 auto 1rem; border:1px solid #eee;">
                    <img src="${t.img}" style="width:100%; height:100%; object-fit:cover">
                </div>
                <h4 style="font-size:1.2rem; margin-bottom:0.5rem; color: var(--text-dark);">${t.name}</h4>
                <p style="color:var(--accent-maroon); font-weight:600; font-size:0.9rem; margin-bottom:0.5rem;">${t.role}</p>
                <p style="font-size:0.85rem; color:var(--text-gray)">${t.area}</p>
            </div>
        `).join('');
    }
});
