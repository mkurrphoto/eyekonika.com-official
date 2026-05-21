import { projects } from './projects-data.js';

export function buildProjectPage(slug) {
    const project = projects.find(p => p.slug === slug);
    if (!project) {
        document.body.textContent = 'Project not found.';
        return;
    }

    const nav = document.createElement('nav');
    nav.innerHTML = `
        <a href="/" id="logo"><img src="/images/brand/Eyekonika_logo_blue_rectangle.png" alt="Eyekonika" /></a>
        <a href="/projects.html#${project.slug}">← All Projects</a>
    `;

    const hero = document.createElement('div');
    hero.className = 'project-hero';
    const heroImg = document.createElement('img');
    heroImg.className = 'project-hero-img';
    heroImg.src = project.image;
    heroImg.alt = project.name;
    const heroOverlay = document.createElement('div');
    heroOverlay.className = 'project-hero-overlay';
    const heroContent = document.createElement('div');
    heroContent.className = 'project-hero-content';
    heroContent.innerHTML = `
        <p class="project-eyebrow">${project.locationFull}</p>
        <h1 class="project-title">${project.titleHtml}</h1>
        <p class="project-subtitle">${project.subtitle}</p>
    `;
    hero.appendChild(heroImg);
    hero.appendChild(heroOverlay);
    hero.appendChild(heroContent);

    const body = document.createElement('div');
    body.className = 'project-body';

    const desc = document.createElement('p');
    desc.className = 'project-description';
    desc.textContent = project.description;

    const grid = document.createElement('div');
    grid.className = project.gridClass ? `project-grid ${project.gridClass}` : 'project-grid';
    project.gallery.forEach(({ src, alt }) => {
        const item = document.createElement('div');
        item.className = 'project-grid-item';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        item.appendChild(img);
        grid.appendChild(item);
    });

    const backLink = document.createElement('a');
    backLink.className = 'back-link';
    backLink.href = `/projects.html#${project.slug}`;
    backLink.textContent = '← Back to Projects';

    body.appendChild(desc);
    body.appendChild(grid);
    body.appendChild(backLink);

    document.body.appendChild(nav);
    document.body.appendChild(hero);
    document.body.appendChild(body);
}
