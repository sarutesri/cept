import { DB } from './db.js';
import { Components } from './components.js';
import { getQueryParam } from './common.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
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
            detailContainer.innerHTML = `
                <div class="card" style="border:none; box-shadow:none;">
                    <div style="border-radius:12px; margin-bottom:2rem; overflow:hidden;">
                        <img src="${news.img}" style="width:100%; height:auto; display:block;">
                    </div>
                    <div style="max-width:800px; margin:0 auto;">
                        <h1 style="font-size:2.5rem; margin-bottom:1.5rem; line-height:1.2;">${news.title}</h1>
                        
                        <!-- Render Parsed Markdown -->
                        <div id="markdown-content" style="font-size:1.2rem; color:var(--text-dark); line-height:1.8;">
                            ${marked.parse(news.content)}
                        </div>

                        <div style="margin-top:3rem; padding-top:2rem; border-top:1px solid #eee;">
                            <a href="news.html" class="btn btn-outline">← Back to All News</a>
                        </div>
                    </div>
                </div>
            `;


        } else {
            detailContainer.innerHTML = `<p style="text-align:center; padding:4rem;">News article not found.</p>`;
        }
    }
});
