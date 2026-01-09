import { DB } from './db.js';
import { Components } from './components.js';
import { getQueryParam } from './common.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    await DBLoader.loadAll();

    const upcomingContainer = document.getElementById('upcoming-courses');
    const pastContainer = document.getElementById('past-courses');
    const detailContainer = document.getElementById('training-detail');

    if (upcomingContainer && pastContainer) {
        // Render List - Show only active registration upcoming courses
        upcomingContainer.innerHTML = DB.courses
            .filter(c => c.type === 'upcoming' && (c.status === 'Open' || c.status === 'Filling Fast'))
            .slice(0, 3)
            .map(c => Components.card(c, 'course'))
            .join('');

        const renderArchive = (items) => {
            if (items.length === 0) {
                pastContainer.innerHTML = `<p style="text-align:center; color:var(--text-gray); padding:2rem;">No courses found.</p>`;
                return;
            }

            pastContainer.innerHTML = items.map(c => {
                // Determine Action
                let actionBtn = `<a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:6px 16px; font-size:0.9rem;">View Details</a>`;

                if (c.format === 'Online' && c.video) {
                    actionBtn = `
                        <div style="display:flex; gap:0.5rem;">
                            <a href="${c.video}" target="_blank" class="btn btn-primary" style="padding:6px 16px; font-size:0.9rem;">▶ Watch</a>
                            <a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:6px 16px; font-size:0.9rem;">Details</a>
                        </div>
                    `;
                }

                return `
                 <div class="card" style="flex-direction:row; padding:0; overflow:hidden; min-height:140px; align-items:stretch;">
                    <div style="width:200px; min-width:200px; background:url('${c.img}') center/cover no-repeat;" class="mobile-hide"></div>
                    <div style="flex:1; padding:1.5rem; display:flex; flex-direction:column; justify-content:center;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                            <span style="font-size:0.85rem; color:var(--text-gray); font-weight:600; text-transform:uppercase;">${c.date} • ${c.format || 'On-site'}</span>
                        </div>
                        <h4 style="margin:0 0 0.5rem 0; font-size:1.2rem;">${c.title}</h4>
                        <div style="margin-top:auto; display:flex; justify-content:flex-end;">
                           ${actionBtn}
                        </div>
                    </div>
                 </div>`;
            }).join('');
        };

        // State & Logic
        let archiveItems = DB.courses.filter(c => c.type === 'past');
        let searchQuery = '';
        let currentFilter = 'all';

        const applyArchiveFilters = () => {
            const filtered = archiveItems.filter(item => {
                const q = searchQuery.toLowerCase();
                const matchSearch = !q || item.title.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q));
                const matchFilter = currentFilter === 'all' || (item.format === currentFilter);
                return matchSearch && matchFilter;
            });
            renderArchive(filtered);
        };

        // Render Initial
        applyArchiveFilters();

        // Listeners for Archive
        const searchInput = document.getElementById('archive-search');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                applyArchiveFilters();
            });
        }

        if (filterBtns) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.dataset.filter;
                    applyArchiveFilters();
                });
            });
        }
    } else if (detailContainer) {
        // Render Detail
        const id = parseInt(getQueryParam('id'));
        const course = DB.courses.find(c => c.id === id);

        if (course) {
            document.title = `${course.title} - CEPT Training`;
            let badgeClass = course.status === 'Ongoing' || course.status === 'Open' ? 'badge-green' : 'badge-gray';

            // Support multiple images (Posters)
            const images = course.images || [course.img];
            const imagesHtml = images.map(img => `
                <img src="${img}" style="width:100%; max-width:800px; height:auto; display:block; margin:0 auto; border-radius:12px; box-shadow:var(--shadow-md);">
            `).join('<br>');

            detailContainer.innerHTML = `
                <div style="max-width:900px; margin:0 auto;">
                    
                    <!-- Header -->
                    <div style="text-align:center; margin-bottom:2rem;">
                        <span class="card-badge ${badgeClass}" style="position:static; display:inline-block; margin-bottom:1rem;">${course.status}</span>
                        <h1 style="font-size:2.5rem; margin-bottom:1rem; line-height:1.2; color:var(--text-dark);">${course.title}</h1>
                        <p style="font-size:1.1rem; color:var(--text-gray);">${course.date} • ${course.price}</p>
                    </div>

                    <!-- Action Button (Moved Up) -->
                    <div style="text-align:center; margin-bottom:3rem;">
                         ${course.status !== 'Closed'
                    ? `<a href="${course.link}" class="btn btn-primary" style="padding:1rem 3rem; font-size:1.1rem; box-shadow: var(--shadow-md);">Register Now</a>`
                    : `<button class="btn" style="background:#f1f5f9; color:#94a3b8; padding:1rem 3rem;" disabled>Registration Closed</button>`
                }
                    </div>

                    <!-- Poster Images (Stacked) -->
                    <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:3rem; align-items:center;">
                        ${imagesHtml}
                    </div>

                    <!-- Content -->
                    <div style="background:var(--white); padding:2.5rem; border-radius:16px; border:1px solid #e2e8f0; max-width:800px; margin:0 auto;">
                         <!-- Render Parsed Markdown -->
                        <div id="course-content" style="font-size:1.1rem; color:var(--text-dark); line-height:1.7;">
                            ${marked.parse(course.content)}
                        </div>
                    </div>
                    
                     <div style="margin-top:3rem; padding-top:2rem; text-align:center;">
                        <a href="training.html" class="btn btn-outline">← Back to All Courses</a>
                    </div>
                </div>
            `;


        } else {
            detailContainer.innerHTML = `<p style="text-align:center; padding:4rem;">Course not found.</p>`;
        }
    }
});
