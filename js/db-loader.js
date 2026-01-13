
import { DB } from './db.js';

export const DBLoader = {
    loadAll: async function () {
        console.log("Loading databases from CSV...");

        const files = {
            projects: 'content/projects.csv',
            journals: 'content/journals.csv',
            courses: 'content/training.csv',
            news: 'content/news.csv'
        };

        const promises = Object.entries(files).map(async ([key, url]) => {
            try {
                const data = await this.loadCSV(url);
                DB[key] = data;
            } catch (e) {
                console.error(`Failed to load ${key} from ${url}`, e);
                DB[key] = [];
            }
        });

        await Promise.all(promises);

        // Helper functions
        const parseJsonField = (item, field) => {
            if (item[field] && typeof item[field] === 'string') {
                try {
                    if (item[field].trim().startsWith('[') || item[field].trim().startsWith('{')) {
                        item[field] = JSON.parse(item[field]);
                    }
                } catch (e) { }
            }
        };

        const parseCSVField = (val) => {
            if (typeof val !== 'string') return null;
            val = val.trim();
            if (val.startsWith('[') || val.startsWith('{')) {
                try { return JSON.parse(val); } catch (e) { }
            }
            if (val.includes(',')) {
                return val.split(',').map(s => s.trim()).filter(s => s);
            }
            return null;
        };

        const convertDriveLink = (url) => {
            if (!url || typeof url !== 'string') return url;
            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
            }
            return url;
        };

        // 1. Normalize Individual Datasets FIRST
        // Remove 'research' from here, we build it later
        ['projects', 'journals', 'courses', 'news'].forEach(k => {
            if (DB[k]) {
                DB[k].forEach(item => {
                    // ID Normalization
                    if (item.id) item.id = parseInt(item.id);

                    // JSON Parsing
                    parseJsonField(item, 'tags');
                    parseJsonField(item, 'pdfs');

                    // Images
                    if (item.images) {
                        const parsed = parseCSVField(item.images);
                        if (parsed) item.images = parsed;
                        else if (typeof item.images === 'string' && item.images) item.images = [item.images];
                    }

                    if (item.img && typeof item.img === 'string') {
                        const parsed = parseCSVField(item.img);
                        if (parsed) {
                            if (!item.images || item.images.length === 0) item.images = parsed;
                            item.img = parsed[0];
                        }
                    }

                    if (!item.img && item.images && item.images.length > 0) {
                        item.img = item.images[0];
                    }

                    parseJsonField(item, 'fileUrl');

                    // Drive Links
                    if (item.img) item.img = convertDriveLink(item.img);
                    if (item.images && Array.isArray(item.images)) {
                        item.images = item.images.map(url => convertDriveLink(url));
                    }

                    // Schema & content Normalization
                    if (item.pdf && !item.pdfs) {
                        item.pdfs = [{ name: 'Download PDF', link: item.pdf }];
                    }
                    if (item.fileUrl && (!item.pdfs || item.pdfs.length === 0)) {
                        if (Array.isArray(item.fileUrl)) {
                            item.pdfs = item.fileUrl;
                        } else if (item.fileUrl && item.fileUrl !== '#' && item.fileUrl !== '') {
                            item.pdfs = [{ name: 'Download', link: item.fileUrl }];
                        }
                    }

                    // Desc
                    if (!item.desc && item.des) item.desc = item.des;
                    if (!item.desc) item.desc = item.title || "";

                    // Type Defaulting
                    if (!item.type) {
                        if (k === 'journals') item.type = 'Research';
                        if (k === 'projects') item.type = 'Project';
                    }

                    // Training Specific
                    if (k === 'courses') {
                        if (item.status) {
                            item.status = item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase();
                            if (item.status === 'Filling fast') item.status = 'Filling Fast';
                        }
                        if (item.type) {
                            const t = item.type.toLowerCase();
                            if (t.includes('site') && t.includes('line')) item.format = 'On-site & Online';
                            else if (t.includes('site')) item.format = 'On-site';
                            else if (t.includes('line')) item.format = 'Online';

                            if (t.includes('site') || t.includes('line')) {
                                if (item.status === 'Closed' || item.status === 'Archived') item.type = 'past';
                                else item.type = 'upcoming';
                            }
                        }
                        if (!item.type) {
                            if (item.status === 'Closed' || item.status === 'Archived') item.type = 'past';
                            else item.type = 'upcoming';
                        }
                    }
                });

                // Sort by ID Descending
                DB[k].sort((a, b) => (b.id || 0) - (a.id || 0));
            }
        });

        // 2. Post-Merge for Research
        // Now that projects/journals are normalized and have types, we merge them.
        DB.research = [...(DB.projects || []), ...(DB.journals || [])];

        // Sort research again (merged list needs sorting)
        DB.research.sort((a, b) => (b.id || 0) - (a.id || 0));

        console.log("DB Loaded:", DB);
    },

    loadCSV: async function (url) {
        // Add cache buster
        const bust = `?t=${new Date().getTime()}`;
        const response = await fetch(url + bust);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        return this.parseCSV(text);
    },

    parseCSV: function (text) {
        // Strip BOM if present
        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.slice(1);
        }

        const rows = [];
        let currentRow = [];
        let currentVal = '';
        let insideQuote = false;

        // Robust char-by-char parsing to handle quoted fields containing commas or newlines
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (insideQuote) {
                if (char === '"' && nextChar === '"') {
                    // Escaped quote ("") -> literal quote (")
                    currentVal += '"';
                    i++; // Skip the 2nd quote
                } else if (char === '"') {
                    // End of quoted field
                    insideQuote = false;
                } else {
                    currentVal += char;
                }
            } else {
                if (char === '"') {
                    // Start of quoted field
                    insideQuote = true;
                } else if (char === ',') {
                    // Separator: End of cell
                    currentRow.push(currentVal);
                    currentVal = '';
                } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                    // End of row
                    // Handle CRLF -> Skip \n
                    if (char === '\r') i++;

                    currentRow.push(currentVal);
                    rows.push(currentRow);
                    currentRow = [];
                    currentVal = '';
                } else if (char === '\r') {
                    // Classic Mac line ending (just \r)
                    currentRow.push(currentVal);
                    rows.push(currentRow);
                    currentRow = [];
                    currentVal = '';
                } else {
                    currentVal += char;
                }
            }
        }

        // Push last row if data remains
        if (currentVal || currentRow.length > 0) {
            currentRow.push(currentVal);
            rows.push(currentRow);
        }

        if (rows.length === 0) return [];

        // Headers are first row
        // Trim headers to be safe
        const headers = rows[0].map(h => h.trim());

        // Map data rows to objects
        return rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((h, index) => {
                // If row has matching column
                if (row[index] !== undefined) {
                    // Try to guess numbers? No, keep as string like Excel logic usually returns,
                    // but we can be smart or keep raw. Let's keep raw string to avoid leading zero loss.
                    // The main loader normalize logic (parseInt(item.id)) handles numbers.
                    obj[h] = row[index];
                }
            });
            return obj;
        });
    }
};
