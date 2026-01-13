import { DB } from './db.js';
import { Components } from './components.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 0. Element Selectors
    const searchInput = document.getElementById('kb-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('btn-load-more');
    const grid = document.getElementById('knowledge-grid');
    const loadMoreContainer = document.getElementById('load-more-container');

    // State
    let searchQuery = '';
    let filteredItems = [];
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentFilter = 'Featured';

    // 1. Load Data
    try {
        await DBLoader.loadAll();
    } catch (e) {
        console.error("DB Load Error:", e);
        if (grid) grid.innerHTML = `<div style="color:red; padding:2rem;">Error loading data: ${e.message}</div>`;
        return;
    }

    if (!DB.research || DB.research.length === 0) {
        if (grid) grid.innerHTML = `<div style="color:red; padding:2rem;">No data found. Checking: Projects=${(DB.projects || []).length}, Journals=${(DB.journals || []).length}</div>`;
        return;
    }

    let allItems = DB.research || [];

    // Helper to check if item is featured
    const isFeatured = (item) => {
        if (item.featured === true || item.featured === 'True' || item.featured === 'true') return true;
        if (item.tags && Array.isArray(item.tags) && item.tags.some(t => typeof t === 'string' && t.trim().toLowerCase() === 'featured')) return true;
        return false;
    };

    // Sort by Featured then ID Descending
    allItems.sort((a, b) => {
        const aFeat = isFeatured(a);
        const bFeat = isFeatured(b);
        if (aFeat && !bFeat) return -1;
        if (!aFeat && bFeat) return 1;
        return b.id - a.id;
    });

    filteredItems = [...allItems];

    const render = () => {
        if (!grid) return;

        // Pagination Logic
        const start = 0;
        const end = currentPage * itemsPerPage;
        const visibleItems = filteredItems.slice(start, end);

        grid.innerHTML = '';

        if (visibleItems.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-gray)">No items found matching your criteria.</div>`;
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            return;
        }

        visibleItems.forEach(item => {
            const displayItem = {
                ...item,
                category: item.type || 'General',
                date: item.year || '-',
                size: 'PDF'
            };
            grid.innerHTML += Components.fileCard(displayItem);
        });

        if (loadMoreContainer) {
            loadMoreContainer.style.display = end >= filteredItems.length ? 'none' : 'block';
        }
    };

    const applyFilters = () => {
        filteredItems = allItems.filter(item => {
            // Type Filter
            let typeMatch = true;
            if (currentFilter === 'Featured') {
                typeMatch = isFeatured(item);
            } else if (currentFilter !== 'all') {
                typeMatch = item.type === currentFilter;
            }

            // Search Filter
            const q = searchQuery.toLowerCase();
            const searchMatch = !q ||
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.year && item.year.toString().includes(q)) ||
                (item.fund && item.fund.toLowerCase().includes(q)) ||
                (item.tags && Array.isArray(item.tags) && item.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q)));

            return typeMatch && searchMatch;
        });

        currentPage = 1;
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
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
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
    applyFilters();
});
