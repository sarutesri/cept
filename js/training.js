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
        // Render List
        upcomingContainer.innerHTML = DB.courses
            .filter(c => c.type === 'upcoming')
            .map(c => Components.card(c, 'course'))
            .join('');

        const renderArchive = (items) => {
            if (items.length === 0) {
                pastContainer.innerHTML = `<p style="text-align:center; color:var(--text-gray); padding:2rem;">No courses found.</p>`;
                return;
            }

            pastContainer.innerHTML = items.map(c => {
                // Determine Action
                let actionBtn = `<span style="color:var(--text-gray); font-size:0.9rem; background:#f1f5f9; padding:4px 12px; border-radius:4px;">Closed</span>`;

                if (c.format === 'Online' && c.video) {
                    actionBtn = `<a href="${c.video}" target="_blank" class="btn btn-primary" style="padding:6px 16px; font-size:0.9rem;">▶ Watch Video</a>`;
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

            detailContainer.innerHTML = `
                <div class="card" style="border:none; box-shadow:none; flex-direction: row; flex-wrap: wrap; gap: 2rem;">
                    <div style="flex: 1; min-width: 300px;">
                        <div style="border-radius:12px; margin-bottom:1rem; overflow:hidden;">
                            <img src="${course.img}" style="width:100%; height:auto; display:block;">
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 300px;">
                        <span class="card-badge ${badgeClass}" style="position:static; display:inline-block; margin-bottom:1rem;">${course.status}</span>
                        <h1 style="font-size:2rem; margin-bottom:1rem; line-height:1.2;">${course.title}</h1>
                        
                        <!-- Render Parsed Markdown -->
                        <div id="course-content" style="font-size:1.1rem; color:var(--text-dark); margin-bottom:2rem;">
                            ${marked.parse(course.content)}
                        </div>
                        
                        <div style="background:var(--bg-light); padding:1.5rem; border-radius:8px; margin-bottom:2rem;">
                            <div style="margin-bottom:0.5rem"><strong>Date:</strong> ${course.date}</div>

                            <div style="margin-bottom:0.5rem"><strong>Price:</strong> ${course.price}</div>
                        </div>

                        ${course.status !== 'Closed'
                    ? `<a href="${course.link}" class="btn btn-primary" style="width:100%; justify-content:center;">Register Now</a>`
                    : `<button class="btn" style="background:#f1f5f9; color:#94a3b8; width:100%; justify-content:center;" disabled>Registration Closed</button>`
                }
                    </div>
                </div>
                
                 <div style="margin-top:3rem; padding-top:2rem; border-top:1px solid #eee;">
                    <a href="training.html" class="btn btn-outline">← Back to All Courses</a>
                </div>
            `;


        } else {
            detailContainer.innerHTML = `<p style="text-align:center; padding:4rem;">Course not found.</p>`;
        }
    }
});
