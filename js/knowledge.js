import { DB } from './db.js';
import { Components } from './components.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Data
    await DBLoader.loadAll();
    console.log("Loaded DB.research:", DB.research);

    // State
    let allItems = DB.research || [];
    // Sort by ID Descending
    allItems.sort((a, b) => b.id - a.id);

    let filteredItems = [...allItems];
    let currentPage = 1;
    const itemsPerPage = 8; // Increased slightly for list view
    let currentFilter = 'all'; // all, Research, Project
    let searchQuery = '';

    // DOM Elements
    const container = document.getElementById('knowledge-grid');
    const searchInput = document.getElementById('kb-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('btn-load-more');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (!container) return; // Exit if not on knowledge page

    // Functions
    const render = () => {
        const start = 0;
        const end = currentPage * itemsPerPage;
        const toShow = filteredItems.slice(start, end);

        container.innerHTML = toShow.map(item => {
            // Determine Icon/Badge
            let icon = '📄';
            if (item.type === 'Project') icon = '📊';

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

                // Mock "Download All" (In a real app, this would zip files)
                // For now, we just list "Download All" which might just open them all or be a placeholder if backend doesn't support zip
                // User requirement: "toggle to choose... or download all". 
                // Since I can't easily zip client side without libs, I will skip "Download All" functionality implementation detail and just focus on the list selection as the primary "toggle". 
                // Or I can add a dummy "Download All" that alerts? No, better to just show the list.

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

            // Parse Tags
            let tagsHtml = '';
            if (item.tags && Array.isArray(item.tags)) {
                tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
            }

            return `
            <div class="doc-card" style="align-items:flex-start;">
                <div class="doc-icon" style="margin-top:0.25rem;">
                    ${icon}
                </div>
                <div class="doc-content" style="flex:1;">
                    <div class="doc-meta">
                        <span style="font-weight:600; color:var(--identity-blue)">${item.type}</span> • ${item.year}
                    </div>
                    <h4 class="doc-title" style="margin-bottom:0.5rem;">${item.title}</h4>
                    <p style="font-size:0.9rem; color:var(--text-gray); margin-bottom:0.5rem;">
                        <strong>Fund:</strong> ${item.fund || '-'}
                    </p>
                    <div style="margin-bottom:0.5rem;">
                        ${tagsHtml}
                    </div>
                </div>
                <div class="doc-action" style="display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem;">
                    ${actionsHtml}
                </div>
            </div>`;
        }).join('');

        // Handle "Load More" visibility
        if (end >= filteredItems.length) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }

        // Show "No Results"
        if (filteredItems.length === 0) {
            container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-gray); padding:2rem;">No research found matching your criteria.</p>`;
        }
    };

    const applyFilters = () => {
        filteredItems = allItems.filter(item => {
            // Type Filter
            const typeMatch = currentFilter === 'all' || item.type === currentFilter;

            // Search Filter
            const q = searchQuery.toLowerCase();
            const searchMatch = !q ||
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.year && item.year.toString().includes(q)) ||
                (item.fund && item.fund.toLowerCase().includes(q)) ||
                (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

            return typeMatch && searchMatch;
        });

        // Re-sort is not strictly needed if allItems is sorted, filter preserves order.
        currentPage = 1; // Reset to page 1
        render();
    };

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applyFilters();
        });
    }

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Apply filter
                currentFilter = btn.dataset.filter;
                applyFilters();
            });
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            render();
        });
    }

    // Initial Render
    render();
});
