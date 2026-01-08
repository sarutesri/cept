import { DB } from './db.js';
import { Components } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('knowledge-grid');
    if (container) {
        container.innerHTML = DB.projects.map(p => Components.fileCard(p)).join('');
    }
});
