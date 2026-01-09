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

    card: (item, type) => {
        let badgeClass = item.status === 'Ongoing' || item.status === 'Open' ? 'badge-green' : 'badge-gray';
        let meta = type === 'course' ? item.date : item.category;
        let btnDisabled = type === 'course' && item.status === 'Closed';

        let link = type === 'course' ? `training-detail.html?id=${item.id}` : '#';

        let actionBtn = '';
        if (type === 'course') {
            if (item.format === 'Online' && item.video) {
                actionBtn = `
                    <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                        <a href="${item.video}" target="_blank" class="btn btn-primary" style="flex:1; justify-content:center; font-size:0.85rem;">Watch Now</a>
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

        return `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${item.img}" class="card-img" alt="${item.title}">
                <span class="card-badge ${badgeClass}">${item.status || item.date}</span>
            </div>
            <div class="card-body">
                <div class="card-meta">
                    <span class="meta-blue">${meta}</span>
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
    `
};
