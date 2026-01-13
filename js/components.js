/**
 * Components.js
 * Reusable HTML components for the application.
 */

export const Components = {
    fileCard: (item) => `
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
                <button class="btn btn-outline" style="font-size:0.85rem">
                    ↓ Download
                </button>
            </div>
        </div>
    `,

    card: (item, type, options = {}) => {
        let badgeClass = item.status === 'Ongoing' || item.status === 'Open' ? 'badge-green' : 'badge-gray';
        let meta = type === 'course' ? item.date : item.category;
        let btnDisabled = type === 'course' && item.status === 'Closed';

        let link = type === 'course' ? `training-detail.html?id=${item.id}` : '#';

        let actionBtn = '';
        if (type === 'course') {
            if (options.hideBadge) {
                // For upcoming lists where we don't want to emphasize action yet, or maybe just 'Details'
                actionBtn = `<a href="${link}" class="btn btn-outline" style="justify-content:center; margin-top:1rem; width:100%">View Details</a>`;
            } else if (item.vdoUrl) {
                actionBtn = `
                    <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                        <a href="${item.vdoUrl}" target="_blank" class="btn btn-primary" style="flex:1; justify-content:center; font-size:0.85rem;">Watch Now</a>
                        <a href="${link}" class="btn btn-outline" style="flex:1; justify-content:center; font-size:0.85rem;">Details</a>
                    </div>`;
            } else if (item.status === 'Closed') {
                actionBtn = `<a href="${link}" class="btn btn-outline" style="justify-content:center; margin-top:1rem; width:100%">View Details</a>`;
            } else {
                actionBtn = `<a href="${link}" class="btn btn-primary" style="justify-content:center; margin-top:1rem; width:100%">Details & Register</a>`;
            }
        } else {
            actionBtn = `<a href="${link}" class="btn-text" style="margin-top:auto">Read More →</a>`;
        }

        // Badge Logic
        let badgesHtml = '';
        if (!options.hideBadge) {
            badgesHtml = `
            <span class="card-badge ${badgeClass}">${item.status || item.date}</span>
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
                    <span style="color:var(--text-gray)">${item.date}</span>
                </div>
                <h4 class="card-title">${item.title}</h4>
            </div>
        </a>
    `,

    listRow: (c) => {
        // Determine Action
        let action = '';

        if (c.format === 'Online' && c.video) {
            action = `
                <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                    <a href="${c.video}" target="_blank" class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.9rem;">Watch Now</a>
                    <a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:0.5rem 1rem; font-size:0.9rem;">Details</a>
                </div>`;
        } else if (c.status === 'Closed') {
            action = `<button class="btn btn-outline" style="padding:0.5rem 1.5rem; font-size:0.9rem; opacity:0.6; cursor:not-allowed;" disabled>Registration Closed</button>`;
        } else if (c.status === 'Open' || c.status === 'Filling Fast') {
            action = `<a href="training-detail.html?id=${c.id}" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.9rem;">Details & Register</a>`;
        } else {
            // Planned / Announced -> Button Disabled
            action = `<button class="btn btn-outline" style="padding:0.5rem 1.5rem; font-size:0.9rem; opacity:0.6; cursor:not-allowed;" disabled>Coming Soon</button>`;
        }

        // Format Badge
        let formatBadge = `<span style="background:#eff6ff; color:#1e40af; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">On-site</span>`;

        if (c.format === 'Online') {
            formatBadge = `<span style="background:#f0fdf4; color:#15803d; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">Online</span>`;
        } else if (c.format === 'On-site & Online') {
            formatBadge = `<span style="background:#f5f3ff; color:#7c3aed; padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-left:0.5rem;">On-site & Online</span>`;
        }

        return `
        <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:1.5rem; display:flex; flex-wrap:wrap; align-items:center; gap:1.5rem; margin-bottom:0.5rem; transition: all 0.2s; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);" onmouseover="this.style.borderColor='#94a3b8'" onmouseout="this.style.borderColor='#e2e8f0'">
            
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
