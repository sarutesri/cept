import { DB } from './db.js';

export const DBLoader = {
    async loadAll() {
        const currentYear = new Date().getFullYear();
        // Scan current year and 3 years back (e.g., 2026, 2025, 2024, 2023)
        const yearsToCheck = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

        // Load News (Yearly + Master fallback)
        const newsPromises = yearsToCheck.map(year => this.tryLoad(`content/news-${year}.md`));
        newsPromises.push(this.tryLoad('content/news-master.md'));

        // Load Courses (Yearly + Master fallback)
        const coursePromises = yearsToCheck.map(year => this.tryLoad(`content/training-${year}.md`));
        coursePromises.push(this.tryLoad('content/training-master.md'));

        // Load Research (Master file for now, can be yearly split later)
        const researchPromise = this.tryLoad('content/research.md');

        const [newsResults, courseResults, researchResults] = await Promise.all([
            Promise.all(newsPromises),
            Promise.all(coursePromises),
            researchPromise
        ]);

        // Flatten and sort by ID descending (newest first)
        DB.news = newsResults.flat().sort((a, b) => b.id - a.id);

        // Process Courses: Auto-archive logic
        const now = new Date();
        DB.courses = courseResults.flat().map(course => {
            if (course.date) {
                // Try to parse date (supports "15 Jan 2026", "10-12 Mar 2026")
                // Extract the last part which usually contains Month Year
                const dateParts = course.date.split(' ');
                if (dateParts.length >= 2) {
                    const month = dateParts[dateParts.length - 2];
                    const year = dateParts[dateParts.length - 1];
                    const day = parseInt(dateParts[0].split('-')[0]); // Get first day if range

                    const courseDate = new Date(`${day} ${month} ${year}`);

                    if (!isNaN(courseDate) && courseDate < now) {
                        course.type = 'past';
                        course.status = 'Closed';
                    }
                }
            }
            return course;
        }).sort((a, b) => b.id - a.id);

        DB.research = researchResults.flat();

        console.log("DB Loaded with Yearly Split & Auto-Archive:", DB);
        return DB;
    },

    async tryLoad(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) return [];

            const text = await response.text();

            // Parse the found file
            const articles = text.split('---ARTICLE---').map(chunk => chunk.trim()).filter(chunk => chunk.length > 0);

            return articles.map(articleText => {
                const lines = articleText.split('\n');
                const metadata = {};
                let contentStartLine = 0;

                // Parse Metadata
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('@')) {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex > -1) {
                            const key = line.substring(1, colonIndex).trim();
                            const value = line.substring(colonIndex + 1).trim();

                            if (key === 'id') {
                                metadata[key] = parseInt(value, 10);
                            } else if (key === 'pdfs' || key === 'tags') {
                                // Parse list: [Name](Link), [Name2](Link2) or Tag1, Tag2
                                metadata[key] = this.parseList(value, key);
                            } else if (key === 'featured') {
                                metadata[key] = value.toLowerCase() === 'true';
                            } else {
                                metadata[key] = value;
                            }
                        }
                    } else if (line !== '') {
                        contentStartLine = i;
                        break;
                    }
                }

                // Extract Body
                const body = lines.slice(contentStartLine).join('\n').trim();

                return {
                    ...metadata,
                    content: body
                };
            });

        } catch (error) {
            // File not found is expected/ignored
            return [];
        }
    },

    parseList(value, key) {
        if (!value) return [];

        if (key === 'tags') {
            return value.split(',').map(t => t.trim());
        }

        if (key === 'pdfs') {
            // Parse [Name](Link) regex
            const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const matches = [];
            let match;
            while ((match = regex.exec(value)) !== null) {
                matches.push({ name: match[1].trim(), link: match[2].trim() });
            }
            return matches;
        }

        return [];
    }
};
