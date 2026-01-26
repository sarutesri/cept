/**
 * Components.js
 * Reusable HTML components for the application.
 */

export const Components = {
    // Shared Dropdown Rendering Logic
    dropdownAction: (links, label, btnClass = 'btn-outline') => {
        if (!links || links.length === 0) return '';

        if (links.length === 1) {
            // Check if link object or string
            const url = typeof links[0] === 'string' ? links[0] : links[0].link;
            const text = typeof links[0] === 'string' ? label : (links[0].name || label);
            return `<a href="${url}" target="_blank" class="btn ${btnClass}" style="font-size:0.9rem">${text}</a>`;
        }

        // Multiple Items -> Dropdown
        const items = links.map((item, i) => {
            const url = typeof item === 'string' ? item : item.link;
            const text = typeof item === 'string' ? `${label} ${i + 1}` : item.name;
            return `<a href="${url}" target="_blank" class="dropdown-item" style="display:block; padding:8px 16px; text-decoration:none; color:var(--text-dark); font-size:0.9rem; border-radius:4px; transition:background 0.2s;">
                        ${text}
                    </a>`;
        }).join('');

        return `
        <div style="position:relative; display:inline-block;" class="dropdown">
            <button class="btn ${btnClass}" style="min-width:120px; justify-content:center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'" onblur="setTimeout(() => this.nextElementSibling.style.display = 'none', 200)">
                ${label} (${links.length}) ▾
            </button>
            <div class="dropdown-menu">
                ${items}
            </div>
        </div>`;
    },

    fileCard: (item) => {
        // Prepare Links
        let links = [];
        if (item.pdfs && Array.isArray(item.pdfs)) {
            links = item.pdfs;
        } else if (item.link) {
            links = [item.link];
        }

        // Render Action
        const actionHtml = Components.dropdownAction(links, 'Download', 'btn-outline');
        // Fallback for no links
        const finalAction = actionHtml || `<button class="btn btn-outline" disabled style="opacity:0.5; font-size:0.85rem">Download</button>`;

        return `
        <div class="doc-card">
            <div class="doc-icon">
                ${item.type === 'PDF' ? '📄' : item.type === 'Report' ? '📊' : '📝'}
            </div>
            <div class="doc-content">
                <div class="doc-meta">
                    <span style="font-weight:600; color:var(--identity-blue)">${item.category}</span> • ${item.date}
                </div>
                <h4 class="doc-title">${item.title}</h4>
                <p style="font-size:0.9rem; color:var(--text-gray); margin-bottom:0.5rem">${item.desc}</p>
                <div style="font-size:0.75rem; color:#94a3b8">
                    File Size: ${item.size} • Format: ${item.type}
                </div>
            </div>
            <div class="doc-action">
                ${finalAction}
            </div>
        </div>
    `;
    },

    // Helper to format date range
    formatDateRange: (start, end) => {
        if (!start) return '';

        // Helper to normalize date string to object
        const parse = (d) => {
            if (!d) return null;
            // Match "12-Mar-20", "12 Mar 2020", "21-Jan-26", "21 Jan 2026"
            // Allow 1-2 digit day, alpha month (hyphen or space), 2 or 4 digit year
            const match = d.match(/^(\d{1,2})[-/ ]+([A-Za-z]+)[-/ ]+(\d{2,4})$/);
            if (!match) {
                // Return as-is if parsing fails
                return { original: d };
            }

            let day = parseInt(match[1], 10);
            let month = match[2]; // Keep as string (Jan, Feb, etc.)
            let year = parseInt(match[3], 10);

            // Normalize Year (YY -> 20YY)
            if (year < 100) {
                year += 2000;
            }

            return { day, month, year, full: `${day} ${month} ${year}` };
        };

        const s = parse(start);

        // If single date (no end or same start/end)
        if (!end || start === end) {
            return s && s.full ? s.full : start;
        }

        const e = parse(end);

        // If both parsed successfully
        if (s && s.year && e && e.year) {
            // Same Month & Year?
            if (s.month === e.month && s.year === e.year) {
                return `${s.day}-${e.day} ${s.month} ${s.year}`;
            }
            // Same Year? -> "30 Jan - 02 Feb 2024"
            if (s.year === e.year) {
                return `${s.day} ${s.month} - ${e.day} ${e.month} ${s.year}`;
            }
            // Diff Year -> "31 Dec 2023 - 02 Jan 2024"
            return `${s.full} - ${e.full}`;
        }

        // Fallback
        return `${start} - ${end}`;
    },

    // Helper to extract Day/Month for circle
    getDateParts: (dateStr) => {
        if (!dateStr) return { day: '', month: '' };
        // Try robust match
        const match = dateStr.match(/^(\d{1,2})[-/ ]+([A-Za-z]+)/);
        if (match) {
            return { day: match[1], month: match[2] };
        }
        return { day: '', month: '' };
    },

    card: (item, type, options = {}) => {
        let badgeClass = item.status === 'Ongoing' || item.status === 'Open' ? 'badge-green' : 'badge-gray';

        let meta = item.category;
        if (type === 'course') {
            meta = Components.formatDateRange(item.startdate, item.enddate);
        }

        let btnDisabled = type === 'course' && item.status === 'Closed';

        let link = type === 'course' ? `training-detail.html?id=${item.id}` : '#';

        let actionBtn = '';
        if (type === 'course') {
            let buttons = [];

            // Video Dropdown/Button
            if (item.vdoUrl && Array.isArray(item.vdoUrl) && item.vdoUrl.length > 0) {
                buttons.push(Components.dropdownAction(item.vdoUrl, 'Watch', 'btn-primary'));
            }

            // PDF Dropdown/Button
            if (item.pdfUrl && Array.isArray(item.pdfUrl) && item.pdfUrl.length > 0) {
                buttons.push(Components.dropdownAction(item.pdfUrl, 'PDF', 'btn-outline'));
            }

            const isRegister = item.status === 'Open' || item.status === 'Filling Fast';
            const mainText = isRegister ? 'Register' : 'Details';
            const mainClass = isRegister ? 'btn-primary' : 'btn-outline';

            buttons.push(`<a href="${link}" class="btn ${mainClass}" style="flex:1; justify-content:center; font-size:0.85rem;">${mainText}</a>`);

            actionBtn = `<div style="display:flex; gap:0.5rem; margin-top:1rem;">${buttons.join('')}</div>`;
        } else {
            actionBtn = `<a href="${link}" class="btn-text" style="margin-top:auto">Read More →</a>`;
        }

        // Badge Logic
        let badgesHtml = '';
        if (!options.hideBadge) {
            let badgeText = item.status || Components.formatDateRange(item.startdate, item.enddate);
            badgesHtml = `
            <span class="card-badge ${badgeClass}">${badgeText}</span>
            ${item.pdu ? `<span class="card-badge" style="right:auto; left:10px; background:#fef3c7; color:#b45309;">PDU: ${item.pdu}</span>` : ''}
            `;
        }

        return `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${item.img}" class="card-img" alt="${item.title}">
                ${badgesHtml}
            </div>
            <div class="card-body">
                <div class="card-meta">
                    <span class="meta-blue">${meta}</span>
                    <span style="font-size:0.85rem; font-weight:600; color:var(--text-gray); margin-left:0.5rem; background:#f1f5f9; padding:2px 8px; border-radius:4px;">${item.format || 'On-site'}</span>
                    <span>${item.price || ''}</span>
                </div>
                <h4 class="card-title">${item.title}</h4>
                <p class="card-desc">${item.desc || item.titleTH || ''}</p>
                ${actionBtn}
            </div>
        </div>`;
    },

    newsCard: (item) => `
        <a href="news-detail.html?id=${item.id}" class="card" style="text-decoration:none; color:inherit">
            <div class="card-img-wrapper" style="height:240px">
                <img src="${item.img}" class="card-img" alt="${item.title}">
            </div>
            <div class="card-body">
                <div class="card-meta">
                    <span class="text-maroon">${item.category}</span>
                    <span style="color:var(--text-gray)">${Components.formatDateRange(item.startdate, item.enddate)}</span>
                </div>
                <h4 class="card-title">${item.title}</h4>
            </div>
        </a>
    `,

    listRow: (c) => {
        // Determine Action
        let buttons = [];
        // Fix: use vdoUrl from CSV, fallback to video if legacy
        let vdo = c.vdoUrl || c.video;

        if (vdo) {
            // Ensure array
            if (!Array.isArray(vdo)) vdo = [vdo];
            buttons.push(Components.dropdownAction(vdo, 'Watch', 'btn-primary'));
        }

        if (c.pdfUrl && Array.isArray(c.pdfUrl)) {
            buttons.push(Components.dropdownAction(c.pdfUrl, 'PDF', 'btn-outline'));
        }

        // Registration / Details Logic
        if (c.status === 'Open' || c.status === 'Filling Fast') {
            buttons.push(`<a href="training-detail.html?id=${c.id}" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.9rem;">Register</a>`);
        } else {
            // Check if we have other content (Watch/PDF) -> Show 'Details'
            // If nothing else and not open -> Show 'Coming Soon' or 'Details' depending on preference
            // Preserving "Coming Soon" logic for non-open upcoming courses
            if (c.status === 'Closed') {
                buttons.push(`<a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:0.5rem 1.5rem; font-size:0.9rem;">Details</a>`);
            } else {
                if (buttons.length > 0) {
                    buttons.push(`<a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:0.5rem 1.5rem; font-size:0.9rem;">Details</a>`);
                } else {
                    buttons.push(`<button class="btn btn-outline" style="padding:0.5rem 1.5rem; font-size:0.9rem; opacity:0.6; cursor:not-allowed;" disabled>Coming Soon</button>`);
                }
            }
        }

        let action = `<div style="display:flex; gap:0.5rem; justify-content:flex-end;">${buttons.join('')}</div>`;

        // Format Badge
        let formatBadge = `<span style="background:#eff6ff; color:#1e40af; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">On-site</span>`;

        if (c.format === 'Online') {
            formatBadge = `<span style="background:#f0fdf4; color:#15803d; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">Online</span>`;
        } else if (c.format === 'On-site & Online') {
            formatBadge = `<span style="background:#f5f3ff; color:#7c3aed; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">On-site & Online</span>`;
        }

        const dateParts = Components.getDateParts(c.startdate);

        return `
        <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:1.5rem; display:flex; flex-wrap:wrap; align-items:center; gap:1.5rem; margin-bottom:0.5rem; transition: all 0.2s; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);" onmouseover="this.style.borderColor='#94a3b8'" onmouseout="this.style.borderColor='#e2e8f0'">
            
            <!-- Date Circle -->
            <div style="text-align:center; min-width:60px;">
                <div style="font-size:1.5rem; font-weight:700; color:var(--accent-maroon); line-height:1;">
                    ${dateParts.day}
                </div>
                <div style="font-size:0.85rem; color:var(--text-gray); text-transform:uppercase;">
                    ${dateParts.month}
                </div>
            </div>

            <!-- Info -->
            <div style="flex:1; min-width:140px;">
                <div style="margin-bottom:0.25rem;">
                    <span style="font-weight:700; font-size:1.1rem; color:var(--text-dark); margin-right:0.5rem;">
                        ${c.title}
                    </span>
                    ${formatBadge}
                    ${c.pdu ? `<span style="background:#fef3c7; color:#b45309; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">PDU: ${c.pdu}</span>` : ''}
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
};
