import { DB } from './db.js';
import { Components } from './components.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Data
    await DBLoader.loadAll();

    // 2. Render Latest Documents (First 2)
    const docsContainer = document.getElementById('featured-docs');
    if (docsContainer) {
        docsContainer.innerHTML = DB.projects.slice(0, 2).map(p => Components.fileCard(p)).join('');
    }

    // Render Latest News
    const newsContainer = document.getElementById('featured-news');
    if (newsContainer) {
        newsContainer.innerHTML = DB.news.map(n => Components.newsCard(n)).join('');
    }

    // Render Partners
    const partnersContainer = document.getElementById('partners-grid');
    if (partnersContainer) {
        partnersContainer.innerHTML = DB.partners.map(p => `
            <div class="partner-logo">
                <img src="${p.logo}" alt="${p.name}" class="partner-img">
            </div>
        `).join('');
    }
});
