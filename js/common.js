/**
 * Common JS
 * Handles shared Header/Footer injection and global utilities.
 */

// --- HEADER ---
const renderHeader = () => {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    // Determine active page
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    const isActive = (p) => (page === p || (page === '' && p === 'index.html')) ? 'active' : '';

    placeholder.innerHTML = `
    <header>
        <div class="container">
            <nav>
                <a href="index.html" class="logo-group">
                    <div class="logo-box">C</div>
                    <div class="logo-text">
                        <h1>CEPT</h1>
                        <p>CHULALONGKORN UNIVERSITY</p>
                    </div>
                </a>
                
                <button class="mobile-toggle" id="mobile-toggle">☰</button>

                <div class="nav-menu" id="nav-menu">
                    <a href="index.html" class="nav-link ${isActive('index.html')}">Home</a>
                    <a href="knowledge.html" class="nav-link ${isActive('knowledge.html')}">Knowledge Base</a>
                    <a href="training.html" class="nav-link ${isActive('training.html') || isActive('training-detail.html') ? 'active' : ''}">Training</a>
                    <a href="news.html" class="nav-link ${isActive('news.html') || isActive('news-detail.html') ? 'active' : ''}">News</a>
                    <a href="team.html" class="nav-link ${isActive('team.html')}">Our Team</a>
                </div>
            </nav>
        </div>
    </header>
    <div style="height: 72px;"></div> <!-- Spacer for fixed header -->
    `;

    // Mobile Menu Logic
    const toggleBtn = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
};

// --- FOOTER ---
const renderFooter = () => {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = `
    <footer>
        <div class="container">
            <div class="grid grid-4" style="gap: 4rem; grid-template-columns: 2fr 1fr 1fr;">
                <div>
                    <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:1rem;">
                        <div class="footer-logo-box">C</div>
                        <h3 style="color:white; font-size:1.25rem;">CEPT</h3>
                    </div>
                    <p style="margin-bottom:1.5rem;">Center of Excellence in Electrical Power Technology.<br>Bridging academic wisdom with practical industrial solutions.</p>
                    
                    <!-- Social Links -->
                    <div style="display:flex; gap:1rem; margin-top: 1.5rem;">
                        <a href="https://facebook.com" target="_blank" style="color:white; font-size:1.5rem;" title="Facebook">
                            <!-- Facebook Icon SVG -->
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                        </a>
                        <a href="https://youtube.com" target="_blank" style="color:white; font-size:1.5rem;" title="YouTube">
                            <!-- YouTube Icon SVG -->
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 style="color:white; margin-bottom:1rem;">Contact Us</h4>
                    <p>Engineering Bldg 4, Room 123</p>
                    <p>Chulalongkorn University</p>
                    <p>contact@cept.chula.ac.th</p>
                    <a href="https://maps.google.com/?q=Faculty+of+Engineering+Chulalongkorn+University" target="_blank" style="display:inline-flex; align-items:center; gap:0.5rem; color:#60a5fa; margin-top:0.5rem;">
                        📍 Get Directions (Google Maps)
                    </a>
                </div>
                <div>
                    <h4 style="color:white; margin-bottom:1rem;">Quick Links</h4>
                    <ul style="display:flex; flex-direction:column; gap:0.5rem;">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="knowledge.html">Knowledge Base</a></li>
                        <li><a href="training.html">Training</a></li>
                    </ul>
                </div>
            </div>
            <div style="text-align:center; margin-top:3rem; padding-top:2rem; border-top:1px solid #1e293b; font-size:0.8rem;">
                © 2026 CEPT Chulalongkorn University. All rights reserved.
            </div>
        </div>
    </footer>
    `;
};

// --- UTILS ---
export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
});
