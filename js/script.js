/* =========================================================
   CloudExify Web Dev — Month 1 Project 1
   Vanilla JS only — no frameworks, no build step
   ========================================================= */

/* ---------- Mobile nav (hamburger) ---------- */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---------- Signature Feature: Live theme switcher ---------- */
(function initTheme() {
  const STORAGE_KEY = 'portfolio-theme';
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark'
      || (!root.getAttribute('data-theme')
          && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });
})();

/* ---------- Signature Feature: Typewriter hero intro ---------- */
(function initTypewriter() {
  const phrases = [
    'a Full-Stack Developer.',
    'a Mobile App Developer.',
    'an AI/ML Enthusiast.',
    'a CloudExify Intern.',
  ];
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    typedEl.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
      setTimeout(tick, 65);
      return;
    }

    charIndex--;
    typedEl.textContent = current.substring(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(tick, 300);
      return;
    }
    setTimeout(tick, 35);
  }

  tick();
})();

/* ---------- Signature Feature: Scroll-triggered skill bars ---------- */
(function initSkillBars() {
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;

  if (!('IntersectionObserver' in window)) {
    skills.forEach((el) => {
      el.querySelector('.fill').style.width = el.dataset.percent + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.fill');
          fill.style.width = entry.target.dataset.percent + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skills.forEach((el) => observer.observe(el));
})();

/* ---------- Signature Feature: Live project filter ---------- */
(function initProjectFilter() {
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.project-card');
  const emptyState = document.querySelector('.filter-empty');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const tags = card.dataset.tags.split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    });
  });
})();

/* ---------- Bonus: active nav-link highlight while scrolling ---------- */
(function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const linkFor = (id) =>
    document.querySelector(`.nav-link[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinkEls.forEach((l) => l.classList.remove('active-link'));
          link.classList.add('active-link');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ---------- Project details modal (opens on clicking a project card) ---------- */
(function initProjectModal() {
  const PROJECT_DATA = {
    freelancehub: {
      num: '01',
      tagline: 'Freelance Marketplace App',
      title: 'FreelanceHub',
      description:
        'A cross-platform freelance marketplace connecting clients with freelancers, ' +
        'covering the full job lifecycle — posting, bidding, milestone-based contracts, ' +
        'and payment tracking — built as a two-app system with a dedicated admin console.',
      features: [
        'Role-based authentication for clients, freelancers, and admins',
        'Bidding system with proposal tracking on each job post',
        'Milestone-based contracts with status updates',
        'Dedicated admin app for moderating jobs and users',
      ],
      challenges:
        'Keeping bid and contract state in sync across two separate apps (client/freelancer ' +
        'and admin) was the hardest part — solved with a shared Supabase schema and realtime ' +
        'subscriptions so both apps reflect changes instantly.',
      stack: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL'],
      links: [],
    },
    interviewlens: {
      num: '02',
      tagline: 'AI-Powered Interview Coach',
      title: 'InterviewLens',
      description:
        'A voice and text interview-practice tool that gives candidates AI-generated feedback ' +
        'on their answers, guides them toward the STAR format, and scores responses against a ' +
        'target job description.',
      features: [
        'Voice and text answer input for interview practice',
        'AI feedback scored against STAR-format structure',
        'Job-fit analysis comparing answers to a target job description',
        'Session history stored per user in Firebase',
      ],
      challenges:
        'Prompting the Gemini API to return consistent, structured feedback (not just free text) ' +
        'took several iterations — solved by constraining the prompt to return a fixed JSON shape ' +
        'that the UI could render reliably.',
      stack: ['React 18', 'TypeScript', 'Gemini API', 'Firebase'],
      links: [],
    },
    agripulse: {
      num: '03',
      tagline: 'Smart Irrigation Scheduling System',
      title: 'AgriPulse',
      description:
        'A web-based smart farming tool that prioritizes irrigation across multiple fields using ' +
        'real-time soil moisture data, so limited water resources go to the fields that need them ' +
        'most first.',
      features: [
        'Real-time soil moisture dashboard per field',
        'Greedy-algorithm-based irrigation priority ranking',
        'Field-by-field scheduling recommendations',
        'Lightweight, dependency-free front end',
      ],
      challenges:
        'Balancing fairness with urgency in the scheduling algorithm — a purely greedy approach ' +
        'risked starving lower-priority fields, so priority scores were weighted to account for how ' +
        'long a field had been waiting.',
      stack: ['HTML/CSS/JS', 'Python', 'Greedy Algorithm'],
      links: [],
    },
    bookverse: {
      num: '04',
      tagline: 'Online Bookstore',
      title: 'BookVerse',
      description:
        'A full e-commerce bookstore with live search, a session-based shopping cart, and a ' +
        'complete admin panel for managing inventory and orders — built in two versions, plain ' +
        'PHP and Laravel 11.',
      features: [
        'Live search across the book catalog',
        'Session-based cart that persists while browsing',
        'Full admin panel for managing books, stock, and orders',
        'Rebuilt from plain PHP into Laravel 11 with Eloquent and Blade',
      ],
      challenges:
        'Migrating the plain-PHP version to Laravel meant re-modeling raw SQL queries into ' +
        'Eloquent relationships without breaking the existing cart/session logic — handled by ' +
        'rebuilding and testing one module at a time instead of a single big rewrite.',
      stack: ['Laravel 11', 'PHP', 'MySQL', 'Blade'],
      links: [],
    },
    resourcegame: {
      num: '05',
      tagline: 'Data Structures Game Project',
      title: 'Resource Gathering Game',
      description:
        'An interactive resource-gathering game with three difficulty levels, built to ' +
        'demonstrate practical implementation of data structures and algorithms in a ' +
        'game-based environment rather than as isolated exercises.',
      features: [
        'Linked list manages all map resources for fast insertion/removal without shifting',
        'Stack-based undo (LIFO) restores the last player position and collected resources',
        'Queue-driven in-game message system displays notifications in FIFO order',
        "Dijkstra's algorithm scores player efficiency against the optimal path in Easy mode",
        'Moving obstacles (Medium) and a continuously roaming, resource-eating AI agent (Hard)',
        'Trap-detection algorithm checks surrounding tiles to award bonus points when the AI is fully blocked',
      ],
      challenges:
        'The first version only had a timer and static obstacles, which did not really ' +
        'showcase algorithmic thinking. Based on instructor feedback, Easy mode was redesigned ' +
        'to compare the player\u2019s path against a Dijkstra-computed optimal path for bonus scoring, ' +
        'and Hard mode was redesigned around actively capturing a moving AI agent before it depletes ' +
        'the resources, instead of just avoiding it.',
      stack: ['Java', 'JavaFX', "Dijkstra's Algorithm", 'Stack/Queue/LinkedList'],
      links: [],
    },
    pharmacysystem: {
      num: '06',
      tagline: 'Desktop Inventory & Billing System',
      title: 'PharmacyManagementSystem',
      description:
        'A desktop pharmacy management system built with Java Swing and a MySQL backend, ' +
        'covering login, medicine inventory, suppliers, manufacturers, orders, sales, and ' +
        'customer records \u2014 my first proper OOP project, built as a two-person team.',
      features: [
        'DB-connected login system',
        'Full CRUD for medicines, suppliers, manufacturers, orders, and customers',
        'Multi-panel GUI built with CardLayout for smooth navigation between modules',
        'Sales tracking alongside real-time inventory records',
      ],
      challenges:
        'Coordinating a shared MySQL schema across a two-person team while both were still new ' +
        'to JDBC meant occasional conflicting changes to table structure \u2014 resolved by agreeing on ' +
        'a fixed schema upfront and having one person own the DBConnection utility class that the ' +
        'rest of the app\u2019s panels called into.',
      stack: ['Java Swing', 'JDBC', 'MySQL', 'OOP'],
      links: [],
    },
    portfolionext: {
      num: '07',
      tagline: 'Portfolio Website',
      title: 'Portfolio',
      description:
        'A multi-page rebuild of this portfolio on Next.js and TypeScript, split into dedicated ' +
        'Home, Work, About, and Contact routes instead of a single scrolling page. It has a dark/light theme toggle, a mobile-friendly responsive layout, and a project modal for detailed case studies with a separate admin panel for managing projects and content. The site is deployed on Vercel for fast performance and scalability.',
      features: [
        'Dedicated Home / Work / About / Contact routes built on the Next.js App Router',
        'Home page summarizing focus areas (Web, Mobile, AI & LLM Integration) with quick stats',
        'Featured project spotlight (InterviewLens) linking out to a full case-study page',
        'Separate admin panel for managing projects and content, with a live preview of changes',
        'Component-based structure (components/, lib/) for reusable UI across routes',
      ],
      challenges:
        'Translating a single-page, scroll-driven layout into a multi-route Next.js structure ' +
        'meant re-thinking navigation and shared UI (header, footer, contact CTA) as reusable ' +
        'components instead of static sections repeated on one page.',
      stack: ['Next.js', 'React 19', 'TypeScript', 'Vercel'],
      links: [
        { url: 'https://github.com/NoorFatima-code/Portfolio', label: 'GitHub Repo' },
        { url: 'https://portfolio-sigma-pink-o3h95vbawo.vercel.app', label: 'Live Demo' },
      ],
    },
  };

  const cards = document.querySelectorAll('.project-card');
  const overlay = document.getElementById('projectModalOverlay');
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  if (!cards.length || !overlay || !modal) return;

  const els = {
    num: document.getElementById('modalNum'),
    tagline: document.getElementById('modalTagline'),
    title: document.getElementById('modalTitle'),
    desc: document.getElementById('modalDesc'),
    features: document.getElementById('modalFeatures'),
    challenges: document.getElementById('modalChallenges'),
    stack: document.getElementById('modalStack'),
    links: document.getElementById('modalLinks'),
  };

  let lastFocused = null;

  function populateModal(data) {
    els.num.textContent = data.num;
    els.tagline.textContent = data.tagline;
    els.title.textContent = data.title;
    els.desc.textContent = data.description;
    els.challenges.textContent = data.challenges;

    els.features.innerHTML = '';
    data.features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      els.features.appendChild(li);
    });

    els.stack.innerHTML = '';
    data.stack.forEach((tech) => {
      const li = document.createElement('li');
      li.textContent = tech;
      els.stack.appendChild(li);
    });

    els.links.innerHTML = '';
    (data.links || []).forEach((link) => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.label;
      a.target = '_blank';
      a.rel = 'noopener';
      els.links.appendChild(a);
    });
  }

  function openModal(key, triggerEl) {
    const data = PROJECT_DATA[key];
    if (!data) return;

    populateModal(data);
    lastFocused = triggerEl || document.activeElement;

    overlay.hidden = false;
    document.body.classList.add('modal-open');
    closeBtn.focus();

    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  cards.forEach((card) => {
    const key = card.dataset.project;
    if (!key) return;

    card.addEventListener('click', () => openModal(key, card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(key, card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
})();

/* ---------- Contact form: client-side validation only (no backend yet) ---------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(row, message) {
    row.classList.add('has-error');
    let errorEl = row.querySelector('.error-text');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-text';
      row.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(row) {
    row.classList.remove('has-error');
    const errorEl = row.querySelector('.error-text');
    if (errorEl) errorEl.remove();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameRow = form.name.closest('.form-row');
    const emailRow = form.email.closest('.form-row');
    const messageRow = form.message.closest('.form-row');

    [nameRow, emailRow, messageRow].forEach(clearFieldError);

    let hasError = false;

    if (form.name.value.trim() === '') {
      setFieldError(nameRow, 'Please enter your name.');
      hasError = true;
    }
    if (!emailPattern.test(form.email.value.trim())) {
      setFieldError(emailRow, 'Please enter a valid email address.');
      hasError = true;
    }
    if (form.message.value.trim() === '') {
      setFieldError(messageRow, 'Please enter a message.');
      hasError = true;
    }

    if (hasError) {
      feedback.textContent = 'Please fix the errors above.';
      feedback.className = 'form-feedback error';
      return;
    }

    // No backend yet (that's Month 2) — show a success state instead.
    feedback.textContent = "Thanks! Your message has been noted — I'll get back to you soon.";
    feedback.className = 'form-feedback success';
    form.reset();
  });
})();