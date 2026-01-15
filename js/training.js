import { DB } from './db.js';
import { Components } from './components.js';
import { getQueryParam } from './common.js';
import { DBLoader } from './db-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    await DBLoader.loadAll();

    const upcomingContainer = document.getElementById('upcoming-courses');
    const openContainer = document.getElementById('open-courses');
    const pastContainer = document.getElementById('past-courses');
    const detailContainer = document.getElementById('training-detail');

    if (upcomingContainer && pastContainer) {
        // 1. Filter Courses
        const openItems = DB.courses.filter(c => c.type === 'upcoming' && (c.status === 'Open' || c.status === 'Filling Fast'));
        const upcomingItems = DB.courses
            .filter(c => c.type === 'upcoming' && c.status !== 'Open' && c.status !== 'Filling Fast')
            .sort((a, b) => a.id - b.id);

        // 2. Render Open Courses
        if (openContainer) {
            openContainer.innerHTML = openItems
                .map(c => Components.card(c, 'course'))
                .join('');
        }

        // 3. Render Upcoming Courses (as List)
        upcomingContainer.innerHTML = `<div style="display:flex; flex-direction:column; gap:1rem;">` +
            upcomingItems
                .slice(0, 2)
                .map(c => Components.listRow(c))
                .join('') +
            `</div>`;

        const renderArchive = (items) => {
            if (items.length === 0) {
                pastContainer.innerHTML = `<p style="text-align:center; color:var(--text-gray); padding:2rem;">No courses found.</p>`;
                return;
            }

            const visibleItems = items.slice(0, archiveLimit);
            const html = visibleItems.map(c => {
                // Action Button Logic
                let buttons = [];

                // Video Logic
                if (c.vdoUrl && Array.isArray(c.vdoUrl)) {
                    buttons.push(Components.dropdownAction(c.vdoUrl, 'Watch', 'btn-primary'));
                }

                // PDF Logic
                if (c.pdfUrl && Array.isArray(c.pdfUrl)) {
                    buttons.push(Components.dropdownAction(c.pdfUrl, 'PDF', 'btn-outline'));
                }
                buttons.push(`<a href="training-detail.html?id=${c.id}" class="btn btn-outline" style="padding:6px 16px; font-size:0.9rem;">Details</a>`);

                let actionBtn = `<div style="display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:flex-end;">${buttons.join('')}</div>`;

                return `
                 <div class="card" style="flex-direction:row; padding:0; min-height:140px; align-items:stretch; margin-bottom:1rem;">
                    <div style="width:200px; min-width:200px; background:url('${c.img}') center/cover no-repeat;" class="mobile-hide"></div>
                    <div style="flex:1; padding:1.5rem; display:flex; flex-direction:column; justify-content:center;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                            <span style="font-size:0.85rem; color:var(--text-gray); font-weight:600; text-transform:uppercase;">
                                ${c.date} • ${c.format || 'On-site'}
                                ${c.pdu ? `<span style="display:inline-block; margin-left:0.5rem; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:4px; text-transform:none;">PDU: ${c.pdu}</span>` : ''}
                            </span>
                        </div>
                        <h4 style="margin:0 0 0.5rem 0; font-size:1.2rem;">${c.title}</h4>
                        <div style="margin-top:auto; display:flex; justify-content:flex-end;">
                           ${actionBtn}
                        </div>
                    </div>
                 </div>`;
            }).join('');

            // "See More" Button
            if (items.length > archiveLimit) {
                pastContainer.innerHTML = html + `
                    <div style="text-align:center; margin-top:1rem;">
                        <button id="btn-see-more-archive" class="btn btn-outline" style="padding:0.75rem 2rem;">See More</button>
                    </div>
                `;
                // Add Event Listener
                setTimeout(() => {
                    const btn = document.getElementById('btn-see-more-archive');
                    if (btn) {
                        btn.addEventListener('click', () => {
                            archiveLimit += 10; // Show 10 more
                            renderArchive(items);
                        });
                    }
                }, 0);
            } else {
                pastContainer.innerHTML = html;
            }
        };

        // State & Logic
        let archiveItems = DB.courses.filter(c => c.type === 'past');
        let searchQuery = '';
        let currentFilter = 'all';
        let archiveLimit = 3;

        const applyArchiveFilters = (resetLimit = false) => {
            if (resetLimit) archiveLimit = 3; // Reset on filter change

            const filtered = archiveItems.filter(item => {
                const q = searchQuery.toLowerCase();
                const matchSearch = !q || item.title.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q));
                const matchFilter = currentFilter === 'all' || item.format.includes(currentFilter);
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
                applyArchiveFilters(true);
            });
        }

        if (filterBtns) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.dataset.filter;
                    applyArchiveFilters(true);
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
                     <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3rem;">
                     <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3rem;">
                         <!-- Video -->
                         <!-- Video -->
                         ${(() => {
                    if (!course.vdoUrl || !Array.isArray(course.vdoUrl) || course.vdoUrl.length === 0) return '';
                    return Components.dropdownAction(course.vdoUrl, 'Video', 'btn-primary');
                })()}
                         
                         <!-- PDF -->
                         ${(() => {
                    if (!course.pdfUrl || !Array.isArray(course.pdfUrl) || course.pdfUrl.length === 0) return '';
                    return Components.dropdownAction(course.pdfUrl, 'Download PDF', 'btn-outline');
                })()}
                         ${course.status !== 'Closed'
                    ? `<a href="${course.formLink || course.link || '#'}" target="_blank" class="btn btn-outline" style="padding:1rem 3rem; font-size:1.1rem;">Register Now</a>`
                    : `<button class="btn" style="background:#f1f5f9; color:#94a3b8; padding:1rem 3rem;" disabled>Registration Closed</button>`
                }
                    </div>

                    <!-- Poster Images (Stacked) -->
                    <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:3rem; align-items:center;">
                        ${imagesHtml}
                    </div>

                    <!-- Content -->
                    <div style="background:var(--white); padding:2.5rem; border-radius:16px; border:1px solid #e2e8f0; max-width:800px; margin:0 auto;">
                         <!-- Render Text Content (Simple newline to <br>) -->
                        <div id="course-content" style="font-size:1.1rem; color:var(--text-dark); line-height:1.7; text-align: justify;">
                            ${(course.desc || '').replace(/\n/g, '<br>')}
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
