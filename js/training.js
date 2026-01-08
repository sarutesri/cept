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

        pastContainer.innerHTML = DB.courses
            .filter(c => c.type === 'past')
            .map(c => Components.card(c, 'course'))
            .join('');
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
