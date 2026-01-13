import { DB } from './db.js';
import { Components } from './components.js';
import { getQueryParam } from './common.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await DBLoader.loadAll();

        // Check if we are on the list page or detail page
        const listContainer = document.getElementById('news-grid');
        const detailContainer = document.getElementById('news-detail');

        if (listContainer) {
            // Render List
            listContainer.innerHTML = DB.news.map(n => Components.newsCard(n)).join('');
        } else if (detailContainer) {
            // Render Detail
            const id = parseInt(getQueryParam('id'));
            const news = DB.news.find(n => n.id === id);

            if (news) {
                document.title = `${news.title} - CEPT News`;

                // Render Skeleton/Loading Structure
                // Support multiple images
                // Ensure we have a valid array of strings, filtering out null/undefined
                let images = news.images || [];
                if (images.length === 0 && news.img) {
                    images = [news.img];
                }

                const imagesHtml = images
                    .filter(img => img) // Guard against undefined/null
                    .map(img => `
                    <img src="${img}" style="width:100%; max-width:800px; height:auto; display:block; margin:0 auto; border-radius:12px; box-shadow:var(--shadow-md);">
                `).join('<br>');

                // Render Detail Structure
                detailContainer.innerHTML = `
                    <div style="max-width:900px; margin:0 auto;">
                        
                        <!-- Header -->
                        <div style="text-align:center; margin-bottom:3rem;">
                            <span style="color:var(--accent-maroon); font-weight:700; text-transform:uppercase; letter-spacing:1px; font-size:0.9rem;">${news.category || 'News'}</span>
                            <h1 style="font-size:2.5rem; margin:1rem 0; line-height:1.2; color:var(--text-dark);">${news.title}</h1>
                            <p style="font-size:1.1rem; color:var(--text-gray);">${news.date}</p>
                        </div>

                        <!-- Content -->
                        <div style="background:var(--white); padding:2.5rem; border-radius:16px; border:1px solid #e2e8f0; max-width:800px; margin:0 auto; margin-bottom:3rem;">
                             <!-- Render Text Content (Simple newline to <br>) -->
                            <div id="course-content" style="font-size:1.1rem; color:var(--text-dark); line-height:1.7; text-align: justify;">
                                ${(news.desc || '').replace(/\n/g, '<br>')}
                            </div>
                        </div>

                        <!-- Images (Stacked) -->
                        <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:3rem; align-items:center;">
                            ${imagesHtml}
                        </div>

                        <div style="margin-top:3rem; padding-top:2rem; text-align:center;">
                            <a href="news.html" class="btn btn-outline">← Back to All News</a>
                        </div>
                    </div>
                `;


            } else {
                detailContainer.innerHTML = `<p style="text-align:center; padding:4rem;">News article not found.</p>`;
            }
        }
    } catch (e) {
        console.error("Critical Error:", e);
        document.body.innerHTML = `<div style="padding:2rem; color:red; text-align:center; background:white;">
            <h1>Something went wrong</h1>
            <p>${e.message}</p>
            <pre style="text-align:left; background:#eee; padding:1rem; overflow:auto;">${e.stack}</pre>
        </div>`;
    }
});
