import { DB } from './db.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Data
    await DBLoader.loadAll();

    const container = document.getElementById('schedule-container');
    if (!container) return;

    // 2. Filter & Sort Courses (All courses for this year view)
    // Assuming DB has 2025 courses loaded.
    // We want to sort chronologically. 
    // DBLoader parses dates for exclusion, but we might need to re-parse for sorting properly if DB.courses is sorted by ID.

    const targetYear = 2026;
    let courses = DB.courses.filter(c => {
        // Check if date string contains "2026"
        // Format: "10-12 Mar 2026"
        return c.date && c.date.includes(targetYear.toString());
    });

    // Helper to parse date for sorting
    const getMonthIndex = (dateStr) => {
        // format "10-12 Mar 2025" or "15 Feb 2025"
        if (!dateStr) return 99;
        const parts = dateStr.split(' ');
        const monthShort = parts[parts.length - 2];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(monthShort);
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
    // Determine Action
    let action = '';

    // Status Logic
    // Open -> Register Button
    // Filling Fast -> Register Button (Warning color?)
    // Closed -> Closed Text
    // Upcoming (but not open) -> 'Coming Soon'

    // Action Logic
    if (c.format === 'Online' && c.video) {
        action = `
            <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                <a href="${c.video}" target="_blank" class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.9rem;">Watch Now</a>
                <a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:0.5rem 1rem; font-size:0.9rem;">Details</a>
            </div>`;
    } else if (c.status === 'Closed') {
        action = `<a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:0.5rem 1.5rem; font-size:0.9rem;">View Details</a>`;
    } else if (c.status === 'Open' || c.status === 'Filling Fast') {
        action = `<a href="training-detail.html?id=${c.id}" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.9rem;">Details & Register</a>`;
    } else {
        // Planned / Announced
        // Use a subtle button or text
        action = `<span style="color:var(--text-gray); font-size:0.9rem; background:#f1f5f9; padding:0.5rem 1.5rem; border-radius:4px; display:inline-block;">Coming Soon</span>`;
    }

    // Format Badge
    let formatBadge = `<span style="background:#eff6ff; color:#1e40af; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">On-site</span>`;
    if (c.format === 'Online') {
        formatBadge = `<span style="background:#f0fdf4; color:#15803d; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">Online</span>`;
    }


    return `
    <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:1.5rem; display:flex; flex-wrap:wrap; align-items:center; gap:1.5rem; margin-bottom:0.5rem; transition: all 0.2s;" onmouseover="this.style.borderColor='#94a3b8'" onmouseout="this.style.borderColor='#e2e8f0'">
        
        <!-- Date Circle -->
        <div style="text-align:center; min-width:60px;">
            <div style="font-size:1.5rem; font-weight:700; color:var(--accent-maroon); line-height:1;">
                ${c.date.split(' ')[0].split('-')[0]}
            </div>
            <div style="font-size:0.85rem; color:var(--text-gray); text-transform:uppercase;">
                ${c.date.split(' ')[1] || ''}
            </div>
        </div>

        <!-- Info -->
        <div style="flex:1; min-width:140px;">
            <div style="margin-bottom:0.25rem;">
                <span style="font-weight:700; font-size:1.1rem; color:var(--text-dark); margin-right:0.5rem;">
                    ${c.title}
                </span>
                ${formatBadge}
            </div>
            <div style="font-size:0.9rem; color:var(--text-gray);">
                ${c.status === 'Filling Fast' ? '🔥 <strong>Filling Fast</strong> • ' : ''} 
                Price: ${c.price || '-'}
            </div>
        </div>

        <!-- Action -->
        <div style="text-align:right;">
            ${action}
        </div>
    </div>
    `;
}
