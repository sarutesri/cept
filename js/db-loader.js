
import { DB } from './db.js';

export const DBLoader = {
    loadAll: async function () {
        console.log("Loading databases from XLSX...");

        const files = {
            projects: 'content/projects.xlsx',
            journals: 'content/journals.xlsx',
            courses: 'content/training.xlsx',
            news: 'content/news.xlsx'
        };

        const promises = Object.entries(files).map(async ([key, url]) => {
            try {
                const data = await this.loadXLSX(url);
                // Merge into DB object
                if (key === 'projects' || key === 'journals') {
                    // Combine into research for backward compatibility or separation
                    // The UI currently uses DB.research.
                    // We need to decide how to map.
                    // Request says: projects, journals.
                    // Existing code uses DB.research.
                    // I will push both to DB.research for now, or keep separate?
                    // Let's keep separate in DB, but maybe merge for the 'research' view if needed.
                    // However, standardizing:
                    DB[key] = data;
                } else {
                    DB[key] = data;
                }
            } catch (e) {
                console.error(`Failed to load ${key} from ${url}`, e);
                DB[key] = [];
            }
        });

        await Promise.all(promises);

        // Post-processing
        // 1. Merge projects + journals into DB.research for the Knowledge/Research page
        // The user intentionally split them. 
        // If the UI expects DB.research, we should populate it.
        DB.research = [...(DB.projects || []), ...(DB.journals || [])];

        // 2. Parse JSON fields (tags, pdfs, images)
        // Helper to safe parse
        const parseJsonField = (item, field) => {
            if (item[field] && typeof item[field] === 'string') {
                try {
                    // Start/End check to avoid parsing simple strings (though imports created json strings)
                    if (item[field].trim().startsWith('[') || item[field].trim().startsWith('{')) {
                        item[field] = JSON.parse(item[field]);
                    }
                } catch (e) {
                    // ignore
                }
            }
        };

        ['research', 'projects', 'journals', 'courses', 'news'].forEach(k => {
            if (DB[k]) {
                DB[k].forEach(item => {
                    // 1. JSON Parsing
                    parseJsonField(item, 'tags');
                    parseJsonField(item, 'pdfs'); // projects/journals
                    parseJsonField(item, 'images'); // courses
                    parseJsonField(item, 'fileUrl'); // legacy backup

                    // 2. ID Normalization
                    if (item.id) item.id = parseInt(item.id);

                    // 3. Schema Normalization (Fix PDF mismatch)
                    // If 'pdf' column exists (single string) but 'pdfs' (array) is missing
                    if (item.pdf && !item.pdfs) {
                        item.pdfs = [{ name: 'Download PDF', link: item.pdf }];
                    }
                    // If 'fileUrl' exists but 'pdfs' missing (legacy projects)
                    if (item.fileUrl && (!item.pdfs || item.pdfs.length === 0)) {
                        // fileUrl might be json string or plain url
                        if (Array.isArray(item.fileUrl)) {
                            item.pdfs = item.fileUrl; // It was parsed JSON
                        } else if (item.fileUrl && item.fileUrl !== '#' && item.fileUrl !== '') {
                            item.pdfs = [{ name: 'Download', link: item.fileUrl }];
                        }
                    }

                    // 4. Content/Desc Normalization
                    // Ensure 'desc' is populated. If missing, use 'title' or empty string.
                    if (!item.desc) {
                        item.desc = item.title || "";
                    }

                    // 5. Type Normalization
                    // If typ is missing, guess it
                    if (!item.type) {
                        if (k === 'journals') item.type = 'Research';
                        if (k === 'projects') item.type = 'Project';
                    }

                    // 6. Training Specific Normalization
                    if (k === 'courses') {
                        // Normalize Status (Title Case)
                        if (item.status) {
                            item.status = item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase();
                            if (item.status === 'Filling fast') item.status = 'Filling Fast';
                        }

                        // Map Excel 'type' (on-site) to 'format', and derive real 'type' (upcoming/past)
                        // If item.type is "on-site" or "on-line", move it to format
                        if (item.type && (item.type.toLowerCase().includes('site') || item.type.toLowerCase().includes('line'))) {
                            item.format = item.type.charAt(0).toUpperCase() + item.type.slice(1);

                            if (item.status === 'Closed' || item.status === 'Archived') {
                                item.type = 'past';
                            } else {
                                item.type = 'upcoming';
                            }
                        }

                        // Smart Type (Upcoming vs Past) based on Date if possible
                        // Simple check: if date contains 2026 -> upcoming, 2025 -> past (unless late 2025)
                        // For now, let's trust the default or the file. 
                        // But if type is missing now, set it.
                        if (!item.type) {
                            if (item.status === 'Closed' || item.status === 'Archived') {
                                item.type = 'past';
                            } else {
                                item.type = 'upcoming';
                            }
                        }
                    }
                });

                // Sort by ID Descending (Global Rule: latest id first)
                DB[k].sort((a, b) => (b.id || 0) - (a.id || 0));
            }
        });

        console.log("DB Loaded:", DB);
    },

    loadXLSX: async function (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        // Use SheetJS
        if (!window.XLSX) throw new Error("XLSX library not loaded");

        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        return jsonData;
    }
};
