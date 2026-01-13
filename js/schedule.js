import { DB } from './db.js';
import { DBLoader } from './db-loader.js';
import { Components } from './components.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Data
    await DBLoader.loadAll();

    const container = document.getElementById('schedule-container');
    if (!container) return;

    // 2. Filter & Sort Courses (All courses for this year view)
    // Assuming DB has 2025 courses loaded.
    // We want to sort chronologically. 
    // DBLoader parses dates for exclusion, but we might need to re-parse for sorting properly if DB.courses is sorted by ID.

    const targetYear = new Date().getFullYear(); // 2026
    const targetYearShort = targetYear.toString().slice(-2); // "26"

    let courses = DB.courses.filter(c => {
        if (!c.date) return false;
        // Check for 4-digit year or 2-digit year suffix
        // e.g. "2026", "-26", "/26"
        return c.date.includes(targetYear.toString()) ||
            c.date.includes(`-${targetYearShort}`) ||
            c.date.includes(`/${targetYearShort}`);
    });

    // Helper to parse date for sorting
    // Helper to parse date for sorting
    const getMonthIndex = (dateStr) => {
        // format "10-12 Mar 2025" or "15 Feb 2025" or "21-Jan-26"
        if (!dateStr) return 99;
        // Split by space OR dash
        const parts = dateStr.split(/[\s-]+/);

        let monthShort = '';
        // Heuristic: Month is usually the 2nd part (Day-Month-Year) or 2nd to last part
        // Example: ["10", "12", "Mar", "2026"] -> Mar is parts[2]
        // Example: ["21", "Jan", "26"] -> Jan is parts[1]

        // Find which part is a month name
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        for (const p of parts) {
            const lower = p.toLowerCase();
            const idx = months.findIndex(m => lower.startsWith(m));
            if (idx !== -1) return idx;
        }
        return 99; // Not found
    };

    // Sort: Month -> Day
    courses.sort((a, b) => {
        const m1 = getMonthIndex(a.date);
        const m2 = getMonthIndex(b.date);
        if (m1 !== m2) return m1 - m2;
        // Simple day parse
        const d1 = parseInt(a.date) || 0;
        const d2 = parseInt(b.date) || 0;
        return d1 - d2;
    });

    // 3. Group by Month
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const grouped = {};

    courses.forEach(c => {
        const mIndex = getMonthIndex(c.date);
        if (mIndex === -1) return; // Invalid date
        if (!grouped[mIndex]) grouped[mIndex] = [];
        grouped[mIndex].push(c);
    });

    // 4. Render Layout
    let html = '';

    Object.keys(grouped).sort((a, b) => a - b).forEach(monthIdx => {
        const monthName = months[monthIdx];
        const monthCourses = grouped[monthIdx];

        html += `
        <div style="margin-bottom:3rem;">
            <h3 style="padding-bottom:0.5rem; border-bottom:2px solid var(--accent-maroon); display:inline-block; margin-bottom:1.5rem; color:var(--text-dark);">
                ${monthName}
            </h3>
            
            <div style="display:grid; gap:1rem;">
                ${monthCourses.map(c => renderRow(c)).join('')}
            </div>
        </div>
        `;
    });

    if (!html) html = '<p>No courses scheduled yet.</p>';

    container.innerHTML = html;
});

// Row Renderer
function renderRow(c) {
    return Components.listRow(c);
}
