// ── PORTFOLIO DATA LOADER ──
(function() {
  const STORE  = 'dbsys_portfolio_data_v1';

  function applyData(d) {
    // About
    const a = d.about;
    if (a) {
      const paras = document.querySelectorAll('#about-text p');
      if (paras[0]) paras[0].innerHTML = a.p1;
      if (paras[1]) paras[1].innerHTML = a.p2;
      if (paras[2]) paras[2].innerHTML = a.p3;
      const cv = document.getElementById('currently-val');
      if (cv) cv.innerHTML = a.currently + ' <span>\u00b7 ' + a.currently_date + '</span>';
      // Dynamic education
      if (a.education && a.education.length) {
        const factsEl = document.getElementById('edu-facts');
        if (factsEl) {
          factsEl.innerHTML = a.education.map((e,i) => `
            <div class="fact">
              <div class="fact-icon">EDU_${String(i+1).padStart(2,'0')}</div>
              <div class="fact-text"><strong>${e.title}</strong><span>${e.sub}</span></div>
            </div>`).join('');
        }
      } else {
        const e1t = document.getElementById('edu1-title'); if (e1t) e1t.textContent = a.edu1_title||'';
        const e1s = document.getElementById('edu1-sub');   if (e1s) e1s.textContent = a.edu1_sub||'';
        const e2t = document.getElementById('edu2-title'); if (e2t) e2t.textContent = a.edu2_title||'';
        const e2s = document.getElementById('edu2-sub');   if (e2s) e2s.textContent = a.edu2_sub||'';
      }
    }
    // Projects
    if (d.projects && d.projects.length) {
      const sp = d.projects[0];
      const spName = document.getElementById('sp-name'); if (spName) spName.textContent = sp.name;
      const spDesc = document.getElementById('sp-desc'); if (spDesc) spDesc.textContent = sp.desc;
      const spOut  = document.getElementById('sp-outcome'); if (spOut) spOut.textContent = sp.outcome;
      const spStack = document.getElementById('sp-stack');
      if (spStack) spStack.innerHTML = sp.stack.map(t=>`<span class="tag accent">${t}</span>`).join('');
      const grid = document.getElementById('project-grid');
      if (grid) grid.innerHTML = d.projects.slice(1).map((p,i)=>`
        <div class="project-card reveal" style="position:relative;">
          <div class="project-num">${String(i+2).padStart(2,'0')}</div>
          <h3 class="project-name">${p.name}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-stack">${p.stack.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div class="project-challenge"><strong>TECHNICAL CHALLENGE</strong>${p.challenge}</div>
          <div class="project-outcome">${p.outcome}</div>
          <div class="project-hindsight">
            <div class="project-hindsight-label">What I'd do differently</div>
            <div class="project-hindsight-text">${p.hindsight}</div>
            <div class="project-hindsight-back">\u2190 move away to close</div>
          </div>
        </div>`).join('');
    }
    // Experience
    if (d.experience && d.experience.length) {
      const tgrid = document.getElementById('exp-tgrid');
      if (tgrid) tgrid.innerHTML = d.experience.map(e=>`
        <div class="exp-tdate reveal">${e.date}<div class="exp-tdot"></div></div>
        <div class="exp-tcontent reveal reveal-delay-1">
          <div class="exp-role">${e.role}</div>
          <div class="exp-org">${e.org}</div>
          <ul class="exp-bullets">${e.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
        </div>`).join('');
    }
    // Skills
    if (d.skills) {
      // Escape text for safe insertion into HTML attributes.
      const escAttr = (s) => String(s)
        .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
        .replace(/</g,'&lt;').replace(/>/g,'&gt;');
      // A skill entry may be either a plain string (legacy) or {name, source}.
      const renderSkill = (t) => {
        const name = (t && typeof t === 'object') ? (t.name || '') : String(t);
        const source = (t && typeof t === 'object' && t.source) ? t.source : '';
        const tip = source && source.trim() ? ` data-tip="${escAttr(source)}"` : '';
        return `<span class="skill-tag"${tip}>${name}</span>`;
      };
      [['languages','skill-g-languages'],['systems','skill-g-systems'],['ai','skill-g-ai'],['devops','skill-g-devops']].forEach(([k,id])=>{
        const el = document.getElementById(id);
        if (el && d.skills[k]) el.innerHTML = d.skills[k].map(renderSkill).join('');
      });
    }
    // Now
    if (d.now) {
      // Normalize each field to an array of non-empty strings.
      // Admin may save arrays (bullet lists) OR legacy single strings.
      const normalize = (v) => {
        if (Array.isArray(v)) return v.filter(x => x && String(x).trim());
        if (v && String(v).trim()) return [String(v)];
        return [];
      };
      const fields = [
        { key: 'BUILDING', items: normalize(d.now.building) },
        { key: 'READING',  items: normalize(d.now.reading)  },
        { key: 'DOING',    items: normalize(d.now.doing)    },
      ].filter(f => f.items.length);
      const box = document.getElementById('now-box');
      const rows = document.getElementById('now-rows');
      if (box && rows && fields.length) {
        rows.innerHTML = fields.map(f => {
          const content = f.items.length === 1
            ? `<span style="font-size:0.82rem;color:var(--muted);line-height:1.45;">${f.items[0]}</span>`
            : `<ul class="now-bullets">${f.items.map(it => `<li>${it}</li>`).join('')}</ul>`;
          return `
            <div style="display:flex;gap:1rem;align-items:flex-start;">
              <span style="font-family:var(--mono);font-size:0.58rem;color:var(--muted2);letter-spacing:0.1em;text-transform:uppercase;flex-shrink:0;width:58px;padding-top:0.15rem;">${f.key}</span>
              <div style="flex:1;min-width:0;">${content}</div>
            </div>`;
        }).join('');
        box.style.display = '';
      }
    }
    // Courses
    if (d.courses && d.courses.length) {
      const grid = document.getElementById('course-grid');
      if (grid) grid.innerHTML = d.courses.map(c => `
        <div class="course-card reveal">
          <div class="course-code">${c.code}</div>
          <div class="course-name">${c.name}</div>
          <div class="course-desc">${c.desc}</div>
        </div>`).join('');
    }
    // Contact
    if (d.contact) {
      const em = document.getElementById('contact-email-el');
      const gh = document.getElementById('contact-github-el');
      const li = document.getElementById('contact-linkedin-el');
      if (em) { em.href = 'mailto:'+d.contact.email; em.textContent = d.contact.email; }
      if (gh) { gh.href = 'https://'+d.contact.github; const v=document.getElementById('contact-github-val'); if(v) v.textContent=d.contact.github; }
      if (li) { li.href = 'https://'+d.contact.linkedin; const v=document.getElementById('contact-linkedin-val'); if(v) v.textContent=d.contact.linkedin; }
    }

    // Newly injected nodes (projects/experience/courses) start hidden by `.reveal`.
    // Tell the scroll-reveal observer to pick them up.
    window.dispatchEvent(new Event('__content_updated'));
  }

  // Apply local data immediately (server load will overwrite if available)
  const stored = localStorage.getItem(STORE);
  if (stored) applyData(JSON.parse(stored));

  fetch('/api/load')
    .then(res => res.json())
    .then(data => applyData(data));
})();

// Copy email on click
  const emailEl = document.getElementById('contact-email-el');
  if (emailEl) emailEl.addEventListener('click', function(e) {
    e.preventDefault();
    navigator.clipboard.writeText(this.textContent.trim()).then(() => {
      const t = document.getElementById('copy-toast');
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2000);
    });
  });

  // Back to top
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 400), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile nav
  document.getElementById('hamburger').addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open')));

  // Secret admin access — click logo 5× quickly
  let logoClicks = 0, logoTimer;
  document.getElementById('nav-logo').addEventListener('click', () => {
    logoClicks++;
    clearTimeout(logoTimer);
    if (logoClicks >= 5) { logoClicks = 0; window.location.href = 'admin.html'; }
    logoTimer = setTimeout(() => logoClicks = 0, 1500);
  });

  // Dark mode
  const darkToggle = document.getElementById('dark-toggle');
  const savedDark = localStorage.getItem('dark') === 'true';
  if (savedDark) { document.body.classList.add('dark'); darkToggle.textContent = 'LIGHT'; }
  darkToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    darkToggle.textContent = isDark ? 'LIGHT' : 'DARK';
    localStorage.setItem('dark', isDark);
  });

  // Smooth anchor fade transitions
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.scrollTo({ top: target.offsetTop - 60 });
        document.body.classList.remove('fade-out');
      }, 150);
    });
  });

  // Console easter egg
  console.log('%c David Balan — Software | AI', 'font-size:18px; font-weight:bold; color:#2a6e7c;');
  console.log('%c davidbalann@icloud.com | github.com/davidbalann', 'font-size:12px; color:#888;');
  console.log('%c If you\'re reading this, you\'re probably the kind of person I\'d enjoy working with.', 'font-size:11px; color:#aaa; font-style:italic;');

  // Scroll progress
  const progressFill = document.getElementById('scroll-progress-fill');
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    progressFill.style.height = (window.scrollY / total * 100) + '%';
  }, { passive: true });

  // Last updated
  document.getElementById('last-updated').textContent = 'Last updated · ' + new Date().toLocaleDateString('en-GB', {month:'long', year:'numeric'});

  // Typing animation
  const words = ['C++', 'Python', 'ESP32', 'ONNX', 'Qt', 'FastAPI', 'YOLOv11', 'OpenCV'];
  const typingEl = document.getElementById('typing-word');
  let wi = 0, ci = 0, deleting = false;
  function typeLoop() {
    const word = words[wi];
    if (!deleting) {
      typingEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      typingEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeLoop, 300); return; }
    }
    setTimeout(typeLoop, deleting ? 60 : 90);
  }
  typeLoop();

  // Scroll reveal (supports dynamic content injection)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  }

  observeReveals();
  window.addEventListener('__content_updated', observeReveals);
  // Hero is visible immediately
  document.querySelectorAll('#hero .reveal, #hero [class*="hero"]').forEach(el => el.classList.add('visible'));

  // Nav active state
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--text)' : '';
    });
  });

  // Tweaks
  window.addEventListener('message', e => {
    if (e.data?.type === '__activate_edit_mode') {
      document.getElementById('tweaks-panel').classList.add('open');
    } else if (e.data?.type === '__deactivate_edit_mode') {
      document.getElementById('tweaks-panel').classList.remove('open');
    }
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  document.getElementById('tweak-accent').addEventListener('change', function() {
    const h = this.value;
    document.documentElement.style.setProperty('--accent', `oklch(0.70 0.16 ${h})`);
    document.documentElement.style.setProperty('--accent-dim', `oklch(0.70 0.16 ${h} / 0.12)`);
    const h2 = (parseInt(h) + 50) % 360;
    document.documentElement.style.setProperty('--accent2', `oklch(0.70 0.16 ${h2})`);
    document.documentElement.style.setProperty('--accent2-dim', `oklch(0.70 0.16 ${h2} / 0.12)`);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accentHue: h } }, '*');
  });

  document.getElementById('tweak-grid').addEventListener('input', function() {
    const v = this.value / 1000;
    document.querySelector('.grid-bg').style.setProperty('--grid-op', v);
    document.querySelector('.grid-bg').style.backgroundImage =
      `linear-gradient(rgba(255,255,255,${v}) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,${v}) 1px, transparent 1px)`;
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { gridOpacity: this.value } }, '*');
  });

  document.getElementById('tweak-status').addEventListener('change', function() {
    document.querySelector('.hero-status').innerHTML =
      `<div class="status-dot"></div>${this.value}`;
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { statusText: this.value } }, '*');
  });
