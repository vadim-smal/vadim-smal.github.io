// Function to create navigation buttons
function createNavButtons(navigation) {
    return navigation.map(nav =>
        `<a href="${nav.href}" class="btn">${nav.text}</a>`
    ).join('');
}

// Function to create skill tags
function createSkillTags(skills) {
    return skills.map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

// Function to create social links
function createSocialLinks(social) {
    return social.map(link =>
        `<a href="${link.url}" class="social-link">${link.name}</a>`
    ).join('');
}

// Function to populate header
function populateHeader(data) {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.innerHTML = `
        <div class="hero-card">
            <div class="rune-field"></div>
            <div class="particle-field"></div>
            <div class="hero">
                <div class="hero-avatar">
                    <img src="${data.header.avatar}" alt="${data.header.name} avatar">
                </div>
                <div class="hero-text">
                    <div class="hero-name">${data.header.name}</div>
                    <div class="hero-meta">
                        <span class="hero-role">${data.header.role}</span>
                        <span class="hero-location">📍 ${data.header.location}</span>
                    </div>
                    <div class="hero-badge">${data.header.title}</div>
                    <div class="hero-tagline">${data.header.tagline}</div>
                </div>
            </div>
        </div>
    `;
}

// Function to populate about section
function populateAbout(data) {
    const about = document.getElementById('about');
    about.innerHTML = `
        <h2>${data.about.title}</h2>
        <p>${data.about.description}</p>

        <div class="skills-container">
            <h3>${data.about.skills.title}</h3>
            <div class="skill-tags">
                ${createSkillTags(data.about.skills.items)}
            </div>
        </div>

        <div class="experience-section">
            <h3>${data.about.experience.title}</h3>
            ${data.about.experience.items.map(exp => `
                <div class="experience-item">
                    <h4>${exp.company}</h4>
                    <p class="role">${exp.role}</p>
                    <p class="duration">${exp.duration}</p>
                </div>
            `).join('')}
        </div>

        <div class="education-section">
            <h3>${data.about.education.title}</h3>
            ${data.about.education.items.map(edu => `
                <div class="education-item">
                    <h4>${edu.school}</h4>
                    <p>${edu.degree}</p>
                    <p class="duration">${edu.duration}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to create post cards
function createPostCards(posts) {
    return posts.map(post => `
        <a class="post-card-link" href="post.html?id=${post.id}">
        <div class="post-card" data-post-id="${post.id}">
            <h3>${post.title}</h3>
            <div class="post-date">${new Date(post.date).toLocaleDateString()}</div>
            <p>${post.description}</p>
        </div>
        </a>
    `).join('');
}

// Function to populate posts section
async function populatePosts() {
    const postsContainer = document.querySelector('.posts-grid');
    if (!postsContainer) return;

    try {
        const postsData = await loadJSON('./data/posts.json');
        if (!postsData) {
            throw new Error('Failed to load posts data');
        }
        const posts = postsData.posts || [];
        const mode = document.body.dataset.page || 'home';
        const visiblePosts = mode === 'home' ? posts.slice(0, 3) : posts;
        postsContainer.innerHTML = createPostCards(visiblePosts);

    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <h3>Failed to load posts</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

// Function to populate contact section
function populateContact(data) {
    const contact = document.getElementById('contact');
    contact.innerHTML = `
        <h2>${data.contact.title}</h2>
        <p>${data.contact.description}</p>
        <div class="social-links">
            ${data.contact.social.map(link =>
                `<a href="${link.url}" class="social-link">${link.name}</a>`
            ).join('')}
        </div>
    `;
}

// Function to populate footer
function populateFooter(data) {
    const footer = document.querySelector('.site-footer');
    footer.innerHTML = `
        <span class="site-footer-credits">
            ╔══════════════════╗<br>
            ${data.footer.copyright}<br>
            ${data.footer.tagline}<br>
            ╚══════════════════╝
        </span>
    `;
}

// Function to update document metadata
function updateDocumentMetadata(data) {
    document.title = `${data.header.name} | ${data.header.role}`;
    document.querySelector('meta[name="description"]').content =
        `Personal portfolio and blog of ${data.header.name} (${data.header.title.replace(/⚔️/g, '').trim()}) - ${data.header.role}`;
}

function populateResumeSection(mainData, cvData) {
    const resume = document.getElementById('resume');
    if (!resume) return;
    resume.innerHTML = `
        <h2><a href="resume.html">${mainData.sections.resume.title}</a></h2>
        <a class="resume-card-link" href="resume.html">
            <div class="resume-card">
                <p>${cvData.summary}</p>
            </div>
        </a>
    `;
}

function populateResumePage(cvData) {
    const resume = document.getElementById('resume');
    if (!resume) return;
    resume.innerHTML = `
        <div class="resume-header">
            <a class="resume-back" href="index.html">← Back</a>
            <h2 class="resume-title">${cvData.title}</h2>
            <p class="resume-subtitle">${cvData.summary}</p>
        </div>
        <div class="resume-card full">
            <div class="resume-block">
                <h3>${cvData.skills.title}</h3>
                <div class="skill-tags">
                    ${createSkillTags(cvData.skills.items)}
                </div>
            </div>

            <div class="resume-block">
                <h3>${cvData.experience.title}</h3>
                ${cvData.experience.items.map(exp => `
                    <div class="experience-item${exp.duration.includes('Present') ? ' is-current' : ''}">
                        <h4>${exp.company}${exp.duration.includes('Present') ? '<span class="current-badge">current</span>' : ''}</h4>
                        <p class="role">${exp.role}</p>
                        <p class="duration">${exp.duration}</p>
                    </div>
                `).join('')}
            </div>

            <div class="resume-block">
                <h3>${cvData.education.title}</h3>
                ${cvData.education.items.map(edu => `
                    <div class="education-item">
                        <h4>${edu.school}</h4>
                        <p>${edu.degree}</p>
                        <p class="duration">${edu.duration}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function buildPageShell(mode, mainData) {
    if (mode === 'chronicles') {
        document.body.innerHTML = `
            <div class="page-wrapper">
                <main class="main-content">
                    <section id="hero" class="hero-section"></section>
                    <section id="posts" class="posts-section">
                        <a class="resume-back" href="index.html">← Back</a>
                        <h2>${mainData.sections.posts.title_all}</h2>
                        <div class="posts-grid"></div>
                    </section>
                </main>
                <footer class="site-footer"></footer>
            </div>
        `;
        return;
    }

    if (mode === 'resume') {
        document.body.innerHTML = `
            <div class="page-wrapper">
                <main class="main-content">
                    <section id="hero" class="hero-section"></section>
                    <section id="resume"></section>
                </main>
                <footer class="site-footer"></footer>
            </div>
        `;
        return;
    }

    document.body.innerHTML = `
        <div class="page-wrapper">
            <main class="main-content">
                <section id="hero" class="hero-section"></section>
                <section id="resume"></section>
                <section id="posts" class="posts-section">
                    <h2><a href="chronicles.html">${mainData.sections.posts.title_home}</a></h2>
                    <div class="posts-grid"></div>
                </section>
                <section id="contact"></section>
            </main>
            <footer class="site-footer"></footer>
        </div>
    `;
}

// Main function to initialize the page
async function initializePage() {
    try {
        const [mainData, cvData] = await Promise.all([
            loadJSON('./data/main.json'),
            loadJSON('./data/cv.json')
        ]);
        if (!mainData || !cvData) {
            throw new Error('Failed to load main data');
        }
        const mode = document.body.dataset.page || 'home';
        buildPageShell(mode, mainData);

        updateDocumentMetadata(mainData);
        populateHeader(mainData);
        if (mode === 'home') {
            populateResumeSection(mainData, cvData);
        }
        if (mode === 'resume') {
            populateResumePage(cvData);
        }
        await populatePosts();
        if (mode === 'home') {
            populateContact(mainData);
        }
        populateFooter(mainData);
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
