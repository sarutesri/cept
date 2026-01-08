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

    // 3. Render Latest Training (Upcoming)
    const trainingContainer = document.getElementById('latest-training');
    if (trainingContainer) {
        const latestCourses = DB.courses
            .filter(c => c.type === 'upcoming')
            .slice(0, 3); // Limit to 3 (or 6 if needed to fill grid)

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
            <div class="partner-logo">
                <img src="${p.logo}" alt="${p.name}" class="partner-img">
            </div>
        `).join('');
    }
});
