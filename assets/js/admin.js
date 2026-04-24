const STORE = 'dbsys_portfolio_data_v1';
  let token = null;

  const DEFAULTS = {
    about: {
      p1: "I'm a <strong>3rd-year Computer Science student at Queen's University</strong> specialising in AI — currently on exchange at the University of Manchester. I think in systems: how components compose, where performance is lost, and how software meets the physical world.",
      p2: "My work spans <strong>embedded firmware, computer vision pipelines, and full-stack applications</strong> — with a focus on correctness, efficiency, and real-world impact over theoretical elegance.",
      p3: "Dean's List 2024–25. Mayor's Award at KingHacks 2026. Two-time VEX Robotics World Championship competitor. Firmware shipped at Neuronicworks.",
      currently: "Semester abroad at <strong>University of Manchester</strong>",
      currently_date: "Jan – June 2026",
      education: [
        { title: "Queen's University, Kingston", sub: "B.Computing (Honours) — AI Specialisation · GPA 3.72" },
        { title: "University of Manchester", sub: "Semester Abroad · Jan 2026 – June 2026" }
      ]
    },
    projects: [
      {
        name: "CleanShare", link: "https://github.com/davidbalann/cleanshare", featured: true,
        desc: "Desktop application that detects and blurs sensitive content (alcohol, licence plates) from images using YOLOv11 and ONNX Runtime. Trained on ~1,000 annotated images. Processes 1080p images in ~5 seconds on CPU-only hardware.",
        stack: ["C++", "Qt", "OpenCV", "YOLOv11", "ONNX Runtime", "CMake", "Inno Setup"],
        challenge: "Discovered PyTorch → ONNX export inconsistencies mid-project. Implemented a hybrid C++/Python bridge: images pipe from C++ to a Python inference script, bounding boxes return via a temp JSON file — restoring reliable detections without rewriting the Qt pipeline.",
        outcome: "~80% detection accuracy · 1080p in ~5s on CPU · packaged for Windows deployment",
        hindsight: "I'd investigate the PyTorch → ONNX pipeline earlier — the hybrid C++/Python bridge worked, but a cleaner solution would be to run inference fully in Python as a sidecar process from the start, with a defined IPC contract."
      },
      {
        name: "CoffeeBot Firmware", link: "", featured: false,
        desc: "Firmware for an ESP32 microcontroller monitoring coffee machine usage via an amp sensor. Samples every second, transmits aggregated state over Wi-Fi to a WLAN server every ~5 seconds — networked displays render real-time usage.",
        stack: ["C++", "ESP32", "I²C", "Wi-Fi", "State Machine"],
        challenge: "Tight memory constraints from the display footprint on the ESP32 — optimised buffer usage and eliminated dynamic allocations to achieve a stable system with near-zero incorrect state displays.",
        outcome: "Deployed at Neuronicworks · stable 24/7 operation",
        hindsight: "I'd add a lightweight watchdog timer from day one and instrument the state machine with telemetry — debugging edge cases on a deployed ESP32 without visibility is painful."
      },
      {
        name: "Kingston CareMap", link: "", featured: false,
        desc: "Low-data mobile app for Kingston helping users find essential services and food resources under real constraints — limited connectivity, low battery, time pressure. Dual navigation: interactive map + list fallback with need-based filtering.",
        stack: ["React", "FastAPI", "Python", "MySQL", "Docker"],
        challenge: "Designing a friction-reduction flow that minimises dead ends from stale data — prioritised verified listings, displayed last-updated timestamps, and flagged uncertain details with explicit warnings.",
        outcome: "Mayor's Award, KingHacks 2026 — top civic-impact prize",
        hindsight: "I'd invest more time in caching the service data locally so the app is fully functional offline — the dual-navigation fallback helped, but true offline-first would have made it far more resilient in the field."
      },
      {
        name: "FaceCrypt", link: "", featured: false,
        desc: "Locally-running biometric encryption tool that uses face detection as a gate to protect sensitive files. Simple Tkinter GUI manages encrypted files and the unlock flow — from idea to demo in 36 hours.",
        stack: ["Python", "OpenCV", "face_recognition", "Tkinter", "AES"],
        challenge: "Deriving a stable, deterministic encryption key from a high-dimensional face embedding that remains consistent under varying lighting and pose conditions.",
        outcome: "Built in 36h · presented to judges at hackathon",
        hindsight: "The key derivation from the face embedding was brittle — I'd use a proper fuzzy commitment scheme or a dedicated biometric key derivation library rather than hand-rolling the embedding-to-key mapping."
      }
    ],
    experience: [
      {
        date: "May – July 2025",
        role: "Firmware Developer Intern",
        org: "Neuronicworks Inc.",
        location: "Toronto, ON",
        bullets: [
          "Implemented firmware features enabling reliable comms between displays, sensors, and embedded controllers",
          "Conducted QA testing across projects, documenting integration issues and collaborating to resolve them per SOPs",
          "Created detailed test cases and validation reports to reduce debugging turnaround time"
        ]
      },
      {
        date: "Sept 2025 – Present",
        role: "Teaching Assistant — CISC 204",
        org: "Queen's University",
        location: "Kingston, ON",
        bullets: [
          "Led office hours clarifying course concepts and providing targeted assignment feedback",
          "Supported 50+ students bi-weekly, improving assignment scores by ~10% on average",
          "Collaborated with instructors to standardise grading and ensure accessible learning support"
        ]
      },
      {
        date: "Sept 2023 – Present",
        role: "Strategy Lead & CV/AI Integration",
        org: "Queen's VEX Robotics Team",
        location: "Dallas, TX — World Championship",
        bullets: [
          "Trained and integrated YOLOv11 object detection models for real-time game-state perception",
          "Led Strategy team — analysed competitors and match data to develop match-winning approaches",
          "Competed at 2024 & 2025 VEX Robotics World Championship; won Build Award, Worlds 2025",
          "Acted as liaison between the robotics team and Queen's School of Computing faculty"
        ]
      }
    ],
    skills: {
      languages: ["C / C++", "Python", "TypeScript", "Java", "Bash", "Rust"],
      systems: ["ESP32", "I²C", "Qt", "CMake", "GDB", "Kubernetes"],
      ai: ["OpenCV", "YOLOv11", "ONNX Runtime", "scikit-learn", "pandas", "NumPy"],
      devops: ["FastAPI", "React", "Docker", "MySQL", "Git / GitHub", "CI/CD"]
    },
    now: {
      building: "Personal portfolio with a live admin CMS",
      reading: "",
      doing: "Semester abroad at University of Manchester"
    },
    courses: [
      { code: "CISC 221", name: "Computer Architecture", desc: "Instruction sets, memory hierarchy, performance analysis, pipelining" },
      { code: "CISC 324", name: "Operating Systems", desc: "Processes, threads, IPC, scheduling, memory management, protection" },
      { code: "CISC 220", name: "System-Level Programming", desc: "C, pointers, memory layout, low-level I/O, debugging with GDB" },
      { code: "CISC 235", name: "Data Structures", desc: "Lists, trees, graphs, hash tables, algorithmic complexity" },
      { code: "CISC 327", name: "Software QA & Testing", desc: "Test strategies, automation, static analysis, CI integration" },
      { code: "CISC 320", name: "Software Development", desc: "C++, design patterns, testing, maintainability at scale" }
    ],
    contact: { email: "davidbalann@icloud.com", github: "github.com/davidbalann", linkedin: "linkedin.com/in/balan-david" }
  };

  let data = null;

  function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

  function escHtml(s) {
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function setLoginError(msg) { const el = document.getElementById('login-error'); if (el) el.textContent = msg||''; }

  function unlock() {
    const gate = document.getElementById('login-gate');
    const content = document.getElementById('admin-content');
    if (gate) gate.style.display = 'none';
    if (content) content.style.display = 'block';
    load();
  }

  async function tryLogin() {
    setLoginError('');
    const pw = prompt('Enter admin password:');
    if (!pw) return;

    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      if (!r.ok) {
        setLoginError('Wrong password.');
        return;
      }
      const j = await r.json();
      token = j.token;
      unlock();
    } catch (e) {
      setLoginError('Login failed.');
    }
  }

  function switchPanel(name) {
    document.querySelectorAll('.sidebar-item[data-panel]').forEach(el => el.classList.toggle('active', el.getAttribute('data-panel') === name));
    document.querySelectorAll('.panel').forEach(el => el.classList.toggle('active', el.id === `panel-${name}`));
  }

  function toggleCard(el) { el.classList.toggle('open'); }

  // ── TAGS ──
  function tagsHtml(section, idx, field, tags) {
    return (tags||[]).map((t,ti) =>
      `<span class="tag-chip">${escHtml(t)}<span class="tag-remove" onclick="removeTag('${section}',${idx},'${field}',${ti})">×</span></span>`
    ).join('');
  }

  function tagEditorHtml(section, idx, field, tags) {
    const id = `tags-${section}-${idx}-${field}`;
    return `<div class="tags-editor" id="${id}">${tagsHtml(section,idx,field,tags)}</div>
      <div class="tag-add-row">
        <input type="text" id="${id}-input" placeholder="Add tag…" onkeydown="if(event.key==='Enter'){addTag('${section}',${idx},'${field}');event.preventDefault()}">
        <button class="btn add" onclick="addTag('${section}',${idx},'${field}')">+</button>
      </div>`;
  }

  function refreshTagsEl(section, idx, field) {
    const el = document.getElementById(`tags-${section}-${idx}-${field}`);
    if (!el) return;
    const tags = section === 'projects' ? (data.projects[idx][field]||[]) : (data.skills[field]||[]);
    el.innerHTML = tagsHtml(section, idx, field, tags);
  }

  function addTag(section, idx, field) {
    const inputEl = document.getElementById(`tags-${section}-${idx}-${field}-input`);
    if (!inputEl) return;
    const val = inputEl.value.trim();
    if (!val) return;
    inputEl.value = '';
    if (section === 'projects') { (data.projects[idx][field] = data.projects[idx][field]||[]).push(val); }
    else if (section === 'skills') { (data.skills[field] = data.skills[field]||[]).push(val); }
    refreshTagsEl(section, idx, field);
    inputEl.focus();
  }

  function removeTag(section, idx, field, ti) {
    if (section === 'projects') data.projects[idx][field].splice(ti, 1);
    else if (section === 'skills') data.skills[field].splice(ti, 1);
    refreshTagsEl(section, idx, field);
  }

  // ── BULLETS ──
  function bulletsHtml(expIdx, bullets) {
    return (bullets||[]).map((b,bi) => `
      <div class="bullet-row">
        <textarea oninput="data.experience[${expIdx}].bullets[${bi}]=this.value">${escHtml(b)}</textarea>
        <button class="bullet-del" onclick="deleteBullet(${expIdx},${bi})">×</button>
      </div>`).join('');
  }

  function refreshBulletList(expIdx) {
    const el = document.getElementById(`bullets-${expIdx}`);
    if (el) el.innerHTML = bulletsHtml(expIdx, data.experience[expIdx].bullets||[]);
  }

  function addBullet(expIdx) {
    (data.experience[expIdx].bullets = data.experience[expIdx].bullets||[]).push('');
    refreshBulletList(expIdx);
  }

  function deleteBullet(expIdx, bi) {
    data.experience[expIdx].bullets.splice(bi, 1);
    refreshBulletList(expIdx);
  }

  // ── EDU ──
  function renderEduList() {
    const list = document.getElementById('edu-list');
    if (!list) return;
    list.innerHTML = (data.about.education||[]).map((e,i) => `
      <div class="item-card" id="edu-card-${i}">
        <div class="item-card-header" onclick="toggleCard(this.parentElement)">
          <div class="item-card-header-left">
            <span class="item-card-num">EDU_${String(i+1).padStart(2,'0')}</span>
            <span class="item-card-name" id="edu-name-${i}">${escHtml(e.title)||'Untitled'}</span>
          </div>
          <span class="item-card-chevron">›</span>
        </div>
        <div class="item-card-body">
          <div class="field"><label>Institution</label><input type="text" value="${escHtml(e.title)}" oninput="data.about.education[${i}].title=this.value;document.getElementById('edu-name-${i}').textContent=this.value||'Untitled'"></div>
          <div class="field"><label>Subtitle</label><input type="text" value="${escHtml(e.sub)}" oninput="data.about.education[${i}].sub=this.value"></div>
          <div class="item-card-actions"><button class="btn danger" onclick="deleteEdu(${i})">Delete</button></div>
        </div>
      </div>`).join('');
  }

  function addEdu() {
    (data.about.education = data.about.education||[]).push({ title: 'New Institution', sub: '' });
    renderEduList();
    const cards = document.querySelectorAll('#edu-list .item-card');
    if (cards.length) cards[cards.length-1].classList.add('open');
  }

  function deleteEdu(i) {
    if (!confirm('Delete this entry?')) return;
    data.about.education.splice(i, 1);
    renderEduList();
  }

  // ── PROJECTS ──
  function renderProjectsList() {
    const list = document.getElementById('projects-list');
    if (!list) return;
    const projects = data.projects||[];
    list.innerHTML = projects.map((p,i) => `
      <div class="item-card" id="proj-card-${i}">
        <div class="item-card-header" onclick="toggleCard(this.parentElement)">
          <div class="item-card-header-left">
            <span class="item-card-num">${String(i+1).padStart(2,'0')}${p.featured?' — Featured':''}</span>
            <span class="item-card-name" id="proj-name-${i}">${escHtml(p.name)||'Untitled'}</span>
          </div>
          <span class="item-card-chevron">›</span>
        </div>
        <div class="item-card-body">
          <div class="field-row">
            <div class="field"><label>Name</label><input type="text" value="${escHtml(p.name)}" oninput="data.projects[${i}].name=this.value;document.getElementById('proj-name-${i}').textContent=this.value||'Untitled'"></div>
            <div class="field"><label>Link (GitHub / demo URL)</label><input type="text" value="${escHtml(p.link||'')}" oninput="data.projects[${i}].link=this.value" placeholder="https://github.com/…"></div>
          </div>
          <div class="field" style="display:flex;align-items:center;gap:0.75rem;">
            <label style="margin:0;white-space:nowrap;">Featured spotlight</label>
            <input type="checkbox" ${p.featured?'checked':''} onchange="setFeatured(${i},this.checked)" style="width:auto;accent-color:var(--accent);">
            <span class="field-hint" style="margin:0;">Only one project can be featured at a time.</span>
          </div>
          <div class="field"><label>Description</label><textarea oninput="data.projects[${i}].desc=this.value">${escHtml(p.desc)}</textarea></div>
          <div class="field"><label>Stack (tags)</label>${tagEditorHtml('projects',i,'stack',p.stack||[])}</div>
          <div class="field"><label>Technical Challenge</label><textarea oninput="data.projects[${i}].challenge=this.value">${escHtml(p.challenge)}</textarea></div>
          <div class="field"><label>Outcome</label><input type="text" value="${escHtml(p.outcome)}" oninput="data.projects[${i}].outcome=this.value"></div>
          <div class="field"><label>What I'd do differently</label><textarea oninput="data.projects[${i}].hindsight=this.value">${escHtml(p.hindsight)}</textarea></div>
          <div class="item-card-actions">
            ${i>0?`<button class="btn" onclick="moveProject(${i},-1)">↑ Up</button>`:''}
            ${i<projects.length-1?`<button class="btn" onclick="moveProject(${i},1)">↓ Down</button>`:''}
            <button class="btn danger" onclick="deleteProject(${i})">Delete</button>
          </div>
        </div>
      </div>`).join('');
  }

  function setFeatured(i, val) {
    data.projects.forEach((p,pi) => p.featured = (pi === i && val));
    renderProjectsList();
    const card = document.getElementById(`proj-card-${i}`);
    if (card) card.classList.add('open');
  }

  function addProject() {
    (data.projects=data.projects||[]).push({name:'New Project',link:'',featured:false,desc:'',stack:[],challenge:'',outcome:'',hindsight:''});
    renderProjectsList();
    const cards = document.querySelectorAll('#projects-list .item-card');
    if (cards.length) cards[cards.length-1].classList.add('open');
  }

  function deleteProject(i) {
    if (!confirm('Delete this project?')) return;
    data.projects.splice(i,1);
    renderProjectsList();
  }

  function moveProject(i, dir) {
    const j = i+dir;
    if (j<0||j>=data.projects.length) return;
    [data.projects[i],data.projects[j]]=[data.projects[j],data.projects[i]];
    renderProjectsList();
  }

  // ── EXPERIENCE ──
  function renderExperienceList() {
    const list = document.getElementById('experience-list');
    if (!list) return;
    const exp = data.experience||[];
    list.innerHTML = exp.map((e,i) => `
      <div class="item-card" id="exp-card-${i}">
        <div class="item-card-header" onclick="toggleCard(this.parentElement)">
          <div class="item-card-header-left">
            <span class="item-card-num">${String(i+1).padStart(2,'0')}</span>
            <span class="item-card-name" id="exp-name-${i}">${escHtml(e.role)||'Untitled'}</span>
          </div>
          <span class="item-card-chevron">›</span>
        </div>
        <div class="item-card-body">
          <div class="field-row">
            <div class="field"><label>Role</label><input type="text" value="${escHtml(e.role)}" oninput="data.experience[${i}].role=this.value;document.getElementById('exp-name-${i}').textContent=this.value||'Untitled'"></div>
            <div class="field"><label>Date Range</label><input type="text" value="${escHtml(e.date)}" oninput="data.experience[${i}].date=this.value"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Organisation</label><input type="text" value="${escHtml(e.org)}" oninput="data.experience[${i}].org=this.value"></div>
            <div class="field"><label>Location</label><input type="text" value="${escHtml(e.location||'')}" oninput="data.experience[${i}].location=this.value" placeholder="City, Country"></div>
          </div>
          <div class="field">
            <label>Bullet Points</label>
            <div class="bullet-list" id="bullets-${i}">${bulletsHtml(i,e.bullets||[])}</div>
            <button class="btn add" style="margin-top:0.5rem" onclick="addBullet(${i})">+ Add Bullet</button>
          </div>
          <div class="item-card-actions">
            ${i>0?`<button class="btn" onclick="moveExp(${i},-1)">↑ Up</button>`:''}
            ${i<exp.length-1?`<button class="btn" onclick="moveExp(${i},1)">↓ Down</button>`:''}
            <button class="btn danger" onclick="deleteExperience(${i})">Delete</button>
          </div>
        </div>
      </div>`).join('');
  }

  function addExperience() {
    (data.experience=data.experience||[]).push({date:'',role:'New Role',org:'',bullets:[]});
    renderExperienceList();
    const cards = document.querySelectorAll('#experience-list .item-card');
    if (cards.length) cards[cards.length-1].classList.add('open');
  }

  function deleteExperience(i) {
    if (!confirm('Delete this role?')) return;
    data.experience.splice(i,1);
    renderExperienceList();
  }

  function moveExp(i, dir) {
    const j = i+dir;
    if (j<0||j>=data.experience.length) return;
    [data.experience[i],data.experience[j]]=[data.experience[j],data.experience[i]];
    renderExperienceList();
  }

  // ── NOW BULLETS ──
  function nowBulletsHtml(field, bullets) {
    return (bullets||[]).map((b,bi) => `
      <div class="bullet-row">
        <textarea oninput="data.now['${field}'][${bi}]=this.value">${escHtml(b)}</textarea>
        <button class="bullet-del" onclick="deleteNowBullet('${field}',${bi})">×</button>
      </div>`).join('');
  }

  function refreshNowBullets(field) {
    const el = document.getElementById(`now-bullets-${field}`);
    if (el) el.innerHTML = nowBulletsHtml(field, data.now[field]||[]);
  }

  function addNowBullet(field) {
    if (!Array.isArray(data.now[field])) data.now[field] = data.now[field] ? [data.now[field]] : [];
    data.now[field].push('');
    refreshNowBullets(field);
    const rows = document.querySelectorAll(`#now-bullets-${field} textarea`);
    if (rows.length) rows[rows.length-1].focus();
  }

  function deleteNowBullet(field, bi) {
    data.now[field].splice(bi, 1);
    refreshNowBullets(field);
  }

  // ── COURSEWORK ──
  function renderCourseworkList() {
    const list = document.getElementById('coursework-list');
    if (!list) return;
    const courses = data.courses||[];
    list.innerHTML = courses.map((c,i) => `
      <div class="item-card" id="course-card-${i}">
        <div class="item-card-header" onclick="toggleCard(this.parentElement)">
          <div class="item-card-header-left">
            <span class="item-card-num">${escHtml(c.code)||'—'}</span>
            <span class="item-card-name" id="course-name-${i}">${escHtml(c.name)||'Untitled'}</span>
          </div>
          <span class="item-card-chevron">›</span>
        </div>
        <div class="item-card-body">
          <div class="field-row">
            <div class="field"><label>Course Code</label><input type="text" value="${escHtml(c.code)}" oninput="data.courses[${i}].code=this.value"></div>
            <div class="field"><label>Course Name</label><input type="text" value="${escHtml(c.name)}" oninput="data.courses[${i}].name=this.value;document.getElementById('course-name-${i}').textContent=this.value||'Untitled'"></div>
          </div>
          <div class="field"><label>Description</label><textarea oninput="data.courses[${i}].desc=this.value">${escHtml(c.desc)}</textarea></div>
          <div class="item-card-actions">
            ${i>0?`<button class="btn" onclick="moveCourse(${i},-1)">↑ Up</button>`:''}
            ${i<courses.length-1?`<button class="btn" onclick="moveCourse(${i},1)">↓ Down</button>`:''}
            <button class="btn danger" onclick="deleteCourse(${i})">Delete</button>
          </div>
        </div>
      </div>`).join('');
  }

  function addCourse() {
    (data.courses=data.courses||[]).push({code:'',name:'New Course',desc:''});
    renderCourseworkList();
    const cards = document.querySelectorAll('#coursework-list .item-card');
    if (cards.length) cards[cards.length-1].classList.add('open');
  }

  function deleteCourse(i) {
    if (!confirm('Delete this course?')) return;
    data.courses.splice(i,1);
    renderCourseworkList();
  }

  function moveCourse(i, dir) {
    const j = i+dir;
    if (j<0||j>=data.courses.length) return;
    [data.courses[i],data.courses[j]]=[data.courses[j],data.courses[i]];
    renderCourseworkList();
  }

  // ── SKILLS ──
  const SKILL_GROUPS = [
    {key:'languages', label:'Languages'},
    {key:'systems',   label:'Systems & Embedded'},
    {key:'ai',        label:'AI / ML'},
    {key:'devops',    label:'DevOps & Backend'}
  ];

  // Currently-selected skill for editing: {group: string, idx: number} | null
  let selectedSkill = null;

  // Normalize a single skill entry to {name, source}
  function normalizeSkill(s) {
    if (typeof s === 'string') return { name: s, source: '' };
    if (s && typeof s === 'object') return { name: s.name || '', source: s.source || '' };
    return { name: '', source: '' };
  }

  // Migrate data.skills from legacy strings to {name, source} objects.
  function migrateSkillsData() {
    if (!data || !data.skills) return;
    SKILL_GROUPS.forEach(g => {
      const arr = data.skills[g.key] || [];
      data.skills[g.key] = arr.map(normalizeSkill);
    });
  }

  function skillChipHtml(groupKey, idx, skill) {
    const isSel = selectedSkill && selectedSkill.group === groupKey && selectedSkill.idx === idx;
    const hasSrc = !!(skill.source && skill.source.trim());
    const cls = `tag-chip skill-chip${isSel?' selected':''}${hasSrc?' has-source':''}`;
    // event.stopPropagation on the × prevents the chip's click handler from firing.
    return `<span class="${cls}" onclick="selectSkill('${groupKey}',${idx})">`
      + `${escHtml(skill.name || '(unnamed)')}`
      + `<span class="tag-remove" onclick="event.stopPropagation();removeSkill('${groupKey}',${idx})">×</span>`
      + `</span>`;
  }

  function skillEditPanelHtml(groupKey, idx, skill) {
    return `
      <div class="skill-edit-panel">
        <div class="skill-edit-title">Editing skill: <strong>${escHtml(skill.name||'(unnamed)')}</strong></div>
        <div class="field">
          <label>Skill name</label>
          <input type="text" value="${escHtml(skill.name)}"
                 oninput="updateSkillField('${groupKey}',${idx},'name',this.value)">
        </div>
        <div class="field">
          <label>Where I gained this skill (hover tooltip)</label>
          <input type="text" value="${escHtml(skill.source)}"
                 placeholder="e.g. CoffeeBot Firmware · CleanShare"
                 oninput="updateSkillField('${groupKey}',${idx},'source',this.value)">
          <div class="field-hint">Shown as a tooltip when visitors hover the skill on the public site. Leave blank for no tooltip.</div>
        </div>
        <div class="skill-edit-actions">
          <button class="btn" onclick="selectSkill(null,null)">Done</button>
        </div>
      </div>`;
  }

  function renderSkillsPanel() {
    const panel = document.getElementById('skills-panel');
    if (!panel) return;
    panel.innerHTML = SKILL_GROUPS.map((g,gi) => {
      const skills = (data.skills && data.skills[g.key]) || [];
      const chips = skills.map((s,si) => skillChipHtml(g.key, si, s)).join('');
      const editor = (selectedSkill && selectedSkill.group === g.key && skills[selectedSkill.idx])
        ? skillEditPanelHtml(g.key, selectedSkill.idx, skills[selectedSkill.idx])
        : '';
      return `
        ${gi>0?'<div class="divider"></div>':''}
        <div class="field">
          <label>${g.label}</label>
          <div class="tags-editor">${chips}</div>
          <div class="tag-add-row">
            <input type="text" id="skill-add-${g.key}" placeholder="Add skill…"
                   onkeydown="if(event.key==='Enter'){addSkill('${g.key}');event.preventDefault()}">
            <button class="btn add" onclick="addSkill('${g.key}')">+</button>
          </div>
          ${editor}
        </div>`;
    }).join('');
  }

  function addSkill(groupKey) {
    const inp = document.getElementById(`skill-add-${groupKey}`);
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    inp.value = '';
    data.skills = data.skills || {};
    data.skills[groupKey] = data.skills[groupKey] || [];
    data.skills[groupKey].push({ name: val, source: '' });
    renderSkillsPanel();
    const focusEl = document.getElementById(`skill-add-${groupKey}`);
    if (focusEl) focusEl.focus();
  }

  function removeSkill(groupKey, idx) {
    if (!data.skills || !data.skills[groupKey]) return;
    data.skills[groupKey].splice(idx, 1);
    // Fix up selection if affected by the removal
    if (selectedSkill && selectedSkill.group === groupKey) {
      if (selectedSkill.idx === idx) selectedSkill = null;
      else if (selectedSkill.idx > idx) selectedSkill.idx -= 1;
    }
    renderSkillsPanel();
  }

  function selectSkill(groupKey, idx) {
    if (groupKey === null || groupKey === 'null') {
      selectedSkill = null;
    } else if (selectedSkill && selectedSkill.group === groupKey && selectedSkill.idx === idx) {
      // Clicking the same chip deselects
      selectedSkill = null;
    } else {
      selectedSkill = { group: groupKey, idx: idx };
    }
    renderSkillsPanel();
    // Restore focus to the source input for quick editing
    if (selectedSkill) {
      const inputs = document.querySelectorAll('.skill-edit-panel input');
      if (inputs.length >= 2) inputs[1].focus();
    }
  }

  // Updates data in-place without re-rendering (to avoid stealing input focus).
  // The chip label will refresh when the editor is closed or another chip is selected.
  function updateSkillField(groupKey, idx, field, value) {
    if (!data.skills || !data.skills[groupKey] || !data.skills[groupKey][idx]) return;
    data.skills[groupKey][idx][field] = value;
  }

  // ── RENDER ALL ──
  function renderAll() {
    if (!data) return;
    document.getElementById('about-p1').value = data.about?.p1||'';
    document.getElementById('about-p2').value = data.about?.p2||'';
    document.getElementById('about-p3').value = data.about?.p3||'';
    document.getElementById('about-currently').value = data.about?.currently||'';
    document.getElementById('about-currently-date').value = data.about?.currently_date||'';
    document.getElementById('contact-email').value = data.contact?.email||'';
    document.getElementById('contact-github').value = data.contact?.github||'';
    document.getElementById('contact-linkedin').value = data.contact?.linkedin||'';
    renderEduList();
    renderProjectsList();
    renderExperienceList();
    migrateSkillsData();
    renderSkillsPanel();
    renderCourseworkList();
    const n = data.now||{};
    ['building','reading','doing'].forEach(f => {
      if (!Array.isArray(n[f])) data.now[f] = n[f] ? [n[f]] : [];
      refreshNowBullets(f);
    });
  }

  function resetAll() {
    if (!confirm('Reset all data to defaults? This cannot be undone.')) return;
    data = deepCopy(DEFAULTS);
    localStorage.setItem(STORE, JSON.stringify(data));
    renderAll();
  }

  async function load() {
    try {
      const r = await fetch('/api/load');
      if (r.ok) {
        data = await r.json();
        if (!data.about) data.about = deepCopy(DEFAULTS.about);
        data.about.education = data.about.education || deepCopy(DEFAULTS.about.education);
        if (!data.projects?.length) data.projects = deepCopy(DEFAULTS.projects);
        if (!data.experience?.length) data.experience = deepCopy(DEFAULTS.experience);
        if (!data.skills) data.skills = deepCopy(DEFAULTS.skills);
        if (!data.courses?.length) data.courses = deepCopy(DEFAULTS.courses);
        if (!data.now) data.now = deepCopy(DEFAULTS.now);
        if (!data.contact) data.contact = deepCopy(DEFAULTS.contact);
        localStorage.setItem(STORE, JSON.stringify(data));
        renderAll(); return;
      }
    } catch(e) { console.warn('JSONBin fetch failed, using local', e); }
    const stored = localStorage.getItem(STORE);
    if (stored) {
      data = JSON.parse(stored);
      if (!data.projects?.length) data.projects = deepCopy(DEFAULTS.projects);
      if (!data.experience?.length) data.experience = deepCopy(DEFAULTS.experience);
      if (!data.skills) data.skills = deepCopy(DEFAULTS.skills);
      if (!data.contact) data.contact = deepCopy(DEFAULTS.contact);
    } else {
      data = deepCopy(DEFAULTS);
    }
    renderAll();
  }

  async function saveAll() {
    if (!data) return;
    data.about.p1 = document.getElementById('about-p1').value;
    data.about.p2 = document.getElementById('about-p2').value;
    data.about.p3 = document.getElementById('about-p3').value;
    data.about.currently = document.getElementById('about-currently').value;
    data.about.currently_date = document.getElementById('about-currently-date').value;
    data.contact.email = document.getElementById('contact-email').value;
    data.contact.github = document.getElementById('contact-github').value;
    data.contact.linkedin = document.getElementById('contact-linkedin').value;
    data.now = data.now || {};
    localStorage.setItem(STORE, JSON.stringify(data));
    const s = document.getElementById('save-status');
    s.textContent = 'Saving…'; s.classList.add('show');
    try {
      if (!token) throw new Error('Not authenticated');
      const r = await fetch('/api/save', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      s.textContent = r.ok ? '✓ Published globally' : '⚠ Saved locally (API error)';
    } catch(e) { s.textContent = '⚠ Saved locally (offline)'; }
    setTimeout(() => { s.classList.remove('show'); s.textContent = '✓ Saved'; }, 3000);
  }

  window.tryLogin = tryLogin;
  window.switchPanel = switchPanel;
  window.toggleCard = toggleCard;
  window.resetAll = resetAll;
  window.addEdu = addEdu; window.deleteEdu = deleteEdu;
  window.addProject = addProject; window.deleteProject = deleteProject; window.moveProject = moveProject; window.setFeatured = setFeatured;
  window.addExperience = addExperience; window.deleteExperience = deleteExperience; window.moveExp = moveExp;
  window.addBullet = addBullet; window.deleteBullet = deleteBullet;
  window.addTag = addTag; window.removeTag = removeTag;
  window.addSkill = addSkill; window.removeSkill = removeSkill;
  window.selectSkill = selectSkill; window.updateSkillField = updateSkillField;
  window.addNowBullet = addNowBullet; window.deleteNowBullet = deleteNowBullet; window.refreshNowBullets = refreshNowBullets;
  window.saveAll = saveAll;

  // Locked by default; click Unlock to authenticate.
