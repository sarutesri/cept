# CEPT Website - Developer Guide

This project is a scalable, pure HTML/JS website for the Center of Excellence in Electrical Power Technology (CEPT). It uses a modular architecture for both CSS and JS.

> [!IMPORTANT]
> **ES Modules Requirement**: This project uses modern ES Modules (`import`/`export`). Browsers block these when opening files directly (`file://`). 
> **You MUST run this site via a local web server** (e.g., VS Code "Live Server" extension) to see the content and navigation.

## 📂 Project Structure

```
cept/
├── index.html           # Home Page
├── ... (other HTMLs)
├── css/
│   ├── style.css        # Main Entry (Imports others)
│   ├── variables.css    # Theme Colors & Variables
│   ├── base.css         # Reset & Typography
│   ├── layout.css       # Header, Footer, Grid
│   ├── components.css   # Buttons, Cards
│   └── pages.css        # Page-specific styles (Hero, etc.)
├── js/
│   ├── db.js            # CENTRAL DATABASE (Exported)
│   ├── components.js    # HTML Templates (Exported)
│   ├── common.js        # Shared Header/Footer (Exported)
│   └── [page].js        # Page-specific logic (Imports others)
└── assets/              # Images and Resources
```

## 🛠 How to Update Content

All content is stored in **`js/db.js`**. 

1.  **Open `js/db.js`**.
2.  Edit the `DB` object (News, Courses, Team, etc.).
3.  Save and refresh your browser (via local server).

## 📝 Content Management (The Easy Way)

We use **Master Markdown Files** to store all content in one place. You don't need to touch the code to add news or courses!

### 1. Adding News (Yearly)
To keep things organized, file names include the year.
- **Current Year**: `content/news-2026.md`
- **Next Year**: Just create `content/news-2027.md`. The website will find it automatically!

Open the current year's file and add your block:

```markdown
@id: 205
@title: New Research Grant
@date: 10 Feb 2026
...
```

### 2. Adding Courses
You can use `content/training-master.md` for evergreen courses, or `content/training-2026.md` for this year's schedule. The system loads both!

```markdown
@id: 105
@title: Advanced Solar Systems
@date: April 2026
@price: 5,000 THB
@status: Open
@type: upcoming
@img: assets/images/courses/solar.jpg

# Advanced Solar Systems

Course description goes here...
```

**That's it!** Save the file, and the website updates automatically.
