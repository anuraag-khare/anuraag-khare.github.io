# Anuraag Khare - Portfolio & Blog

A personal website featuring my portfolio and technical blog, built with Jekyll and hosted on GitHub Pages.

🌐 **Live Site**: [anuraag-khare.github.io](https://anuraag-khare.github.io)

## ✨ Features

- **Portfolio**: Showcasing my work experience, projects, and technical skills
- **Blog**: Technical articles on backend engineering, GenAI, and software development
- **SEO Optimized**: Built-in SEO tags, sitemap, and RSS feed
- **Fast & Lightweight**: Static site with no JavaScript frameworks

## 🛠️ Tech Stack

- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting
- **SCSS/CSS** - Styling with custom cyber-minimalism theme
- **Vanilla JS** - Minimal JavaScript for interactions

## 📁 Project Structure

```
.
├── _includes/          # Reusable HTML components
│   ├── head.html       # <head> section with meta tags
│   ├── header.html     # Site navigation
│   └── footer.html     # Site footer
├── _layouts/           # Page templates
│   ├── default.html    # Base layout
│   ├── post.html       # Blog post layout
│   └── page.html       # Generic page layout
├── _posts/             # Blog posts (Markdown)
├── assets/
│   ├── css/            # Stylesheets
│   │   ├── style.css   # Main styles
│   │   └── blog.css    # Blog-specific styles
│   ├── js/             # JavaScript files
│   └── images/         # Image assets
├── _config.yml         # Jekyll configuration
├── index.html          # Homepage (Portfolio)
├── blog.html           # Blog listing page
├── 404.html            # Custom 404 page
├── Gemfile             # Ruby dependencies
└── favicon.svg         # Site favicon
```

## 🚀 Local Development

### Prerequisites

- Ruby >= 3.0
- Bundler gem

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anuraag-khare/anuraag-khare.github.io.git
   cd anuraag-khare.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Run the development server**
   ```bash
   bundle exec jekyll serve
   ```
   
   With drafts:
   ```bash
   bundle exec jekyll serve --drafts
   ```

4. **Open in browser**
   
   Visit [http://localhost:4000](http://localhost:4000)

## ✍️ Writing Blog Posts

Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "Your Post Title"
date: 2024-12-04
description: "A brief description of your post"
categories: [Category]
tags: [Tag1, Tag2, Tag3]
reading_time: 5
---

Your content here...
```

### Front Matter Options

| Field | Required | Description |
|-------|----------|-------------|
| `layout` | Yes | Use `post` for blog posts |
| `title` | Yes | Post title |
| `date` | Yes | Publication date |
| `description` | No | Meta description for SEO |
| `categories` | No | Post categories |
| `tags` | No | Post tags |
| `reading_time` | No | Estimated read time in minutes |

## 📝 Drafts

Store work-in-progress posts in `_drafts/` folder (create if needed):

```
_drafts/
  my-upcoming-post.md
```

Preview drafts with:
```bash
bundle exec jekyll serve --drafts
```

## 🎨 Customization

### Colors

Edit CSS variables in `assets/css/style.css`:

```css
:root {
    --bg-color: #050505;
    --accent-primary: #3b82f6;
    --accent-secondary: #8b5cf6;
    /* ... more variables */
}
```

### Site Configuration

Update `_config.yml` for:
- Site title and description
- Author information
- Social links
- Permalink structure

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

