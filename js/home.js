import { DB } from './db.js';
import { Components } from './components.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Data
    await DBLoader.loadAll();

    // 2. Render Featured Research (from markdown)
    // 2. Render Featured Research (from markdown)
    const docsContainer = document.getElementById('featured-docs');
    if (docsContainer) {
        // Filter featured items
        const featuredItems = (DB.research || []).filter(r => r.featured).slice(0, 2);

        docsContainer.innerHTML = featuredItems.map(item => {
            // Determine Icon
            let icon = item.type === 'Project' ? '📊' : '📄';

            // Parse PDFs (array of {name, link})
            let actionsHtml = '';

            if (!item.pdfs || !Array.isArray(item.pdfs) || item.pdfs.length === 0) {
                // Case 0: No PDF
                actionsHtml = `<button class="btn btn-outline" disabled style="opacity:0.5; cursor:not-allowed;">PDF</button>`;
            } else if (item.pdfs.length === 1) {
                // Case 1: Single PDF
                actionsHtml = `<a href="${item.pdfs[0].link}" class="btn btn-outline" target="_blank" style="font-size:0.9rem">↓ PDF</a>`;
            } else {
                // Case 2: Multiple PDFs
                const links = item.pdfs.map(pdf => `
                    <a href="${pdf.link}" target="_blank" class="dropdown-item" style="display:block; padding:6px 12px; text-decoration:none; color:var(--text-dark); font-size:0.85rem; border-radius:4px; transition:background 0.2s;">
                        📄 ${pdf.name}
                    </a>
                `).join('');

                actionsHtml = `
                <div style="position:relative; display:inline-block;" class="download-dropdown-container">
                    <button class="btn btn-outline" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'" onblur="setTimeout(() => this.nextElementSibling.style.display = 'none', 200)">
                        ↓ PDF (${item.pdfs.length}) ▾
                    </button>
                    <div class="dropdown-menu" style="display:none; position:absolute; right:0; top:110%; background:white; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem; min-width:180px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); z-index:50;">
                        ${links}
                    </div>
                </div>`;
            }

            return `
            <div class="doc-card" style="align-items:flex-start;">
                <div class="doc-icon">
                    ${icon}
                </div>
                <div class="doc-content" style="flex:1;">
                    <div class="doc-meta">
                         <span style="font-weight:600; color:var(--identity-blue)">${item.type}</span> • ${item.year}
                    </div>
                    <h4 class="doc-title" style="margin-top:0.5rem; margin-bottom:0.5rem;">${item.title}</h4>
                    <p style="font-size:0.9rem; color:var(--text-gray); margin-bottom:0.5rem">Fund: ${item.fund || '-'}</p>
                    <div style="font-size:0.75rem; color:#94a3b8">
                         ${item.pdfs ? `${item.pdfs.length} File(s)` : '0 Files'} • Format: PDF
                    </div>
                </div>
                <div class="doc-action" style="align-self: flex-start; margin-top: auto; margin-left: 1rem;">
                    ${actionsHtml}
                </div>
            </div>
            `;
        }).join('');
    }

    // 3. Render Latest Training (Upcoming)
    const trainingContainer = document.getElementById('latest-training');
    if (trainingContainer) {
        const latestCourses = DB.courses
            .filter(c => c.type === 'upcoming' && (c.status === 'Open' || c.status === 'Filling Fast'))
            .slice(0, 3); // Limit to 3

        trainingContainer.innerHTML = latestCourses.map(c => Components.card(c, 'course')).join('');
    }

    // Render Latest News (Limit 3)
    const newsContainer = document.getElementById('featured-news');
    if (newsContainer) {
        // Sort by date desc if needed, assuming DB.news is already sorted or we rely on index order
        newsContainer.innerHTML = DB.news.slice(0, 3).map(n => Components.newsCard(n)).join('');
    }

    // Render Partners
    const partnersContainer = document.getElementById('partners-grid');
    if (partnersContainer) {
        partnersContainer.innerHTML = DB.partners.map(p => `
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                <img src="${p.logo}" alt="${p.name}" style="max-height: 80px; max-width: 100%; object-fit: contain;">
                <p style="font-size: 0.85rem; color: var(--text-gray); font-weight: 500; line-height: 1.4;">${p.name}</p>
            </div>
        `).join('');
    }
});
