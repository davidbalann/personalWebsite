const STORE = 'dbsys_portfolio_data_v1';
let token = null;

const DEFAULTS = {
  hero: {
    name: "David Balan",
    typingWords: ['C++', 'Python', 'ESP32', 'ONNX', 'Qt', 'FastAPI', 'YOLOv11', 'OpenCV'],
    metrics: [
      { val: '3.72', label: 'GPA / 4.30' },
      { val: '2×', label: 'VEX Worlds' },
      { val: '4', label: 'Projects shipped' }
    ],
    ctaPrimary: { text: 'View Projects', link: '#projects' },
    ctaCoffee: { text: 'Buy me a coffee', link: 'https://buymeacoffee.com/davidbalan', enabled: true },
    ctaGhost: { text: 'Download CV', link: 'David_Balan_CV.pdf' }
  },
  about: {
    p1: "I'm a <strong>3rd-year Computer Science student at Queen's University</strong> specialising in AI — currently on exchange at the University of Manchester. I think in systems: how components compose, where performance is lost, and how software meets the physical world.",
    p2: "My work spans <strong>embedded firmware, computer vision pipelines, and full-stack applications</strong> — with a focus on correctness, efficiency, and real-world impact over theoretical elegance.",
    p3: "Dean's List 2024–25. Mayor's Award at KingHacks 2026. Two-time VEX Robotics World Championship competitor. Firmware shipped at Neuronicworks.",
    currently: "Semester abroad at <strong>University of Manchester</strong>",
    currently_date: "Jan – June 2026",
    education: [
      { title: "Queen's University, Kingston", sub: "B.Computing (Honours) — AI Specialisation · GPA 3.72" },
      { title: "University of Manchester", sub: "Semester Abroad · Jan 2026 – June 2026" }
    ],
    languages: [
      { flag: 'gb', name: 'English', level: 'FLUENT' },
      { flag: 'ro', name: 'Romanian', level: 'FLUENT' },
      { flag: 'ru', name: 'Russian', level: 'LEARNING' }
    ],
    stackFact: "C++, Python, TypeScript — and the tools around them",
    awardFact: "Dean's List · Mayor's Award, KingHacks 2026 · VEX Build Award, Worlds 2025"
  },
  projects: [
    {
      name: "CleanShare", link: "https://github.com/davidbalann/cleanshare", featured: true,
      desc: "Desktop application that detects and blurs sensitive content (alcohol, licence plates) from images using YOLOv11 and ONNX Runtime. Trained on ~1,000 annotated images. Processes 1080p images in ~5 seconds on CPU-only hardware.",
      stack: ["C++", "Qt", "OpenCV", "YOLOv11", "ONNX Runtime", "CMake", "Inno Setup"],
      challenge: "Discovered PyTorch → ONNX export inconsistencies mid-project. Implemented a hybrid C++/Python bridge: images pipe from C++ to a Python inference script, bounding boxes return via a temp JSON file — restoring reliable detections without rewriting the Qt pipeline.",
      outcome: "~80% detection accuracy · 1080p in ~5s on CPU · packaged for Windows deployment",
      hindsight: "I'd investigate the PyTorch → ONNX pipeline earlier — the hybrid C++/Python bridge worked, but a cleaner solution would be to run inference fully in Python as a sidecar process from the start, with a defined IPC contract.",
      stats: [
        { val: '~1k', label: 'Training images' },
        { val: '~80%', label: 'Detection accuracy' },
        { val: '~5s', label: 'Per 1080p image · CPU only' }
      ],
      terminal: [
        { text: '$ ./cleanshare --model yolov11n.onnx', color: 'default' },
        { text: 'Initialising ONNX runtime...', color: 'dim' },
        { text: '✓ Model loaded · trained on 1,000 imgs', color: 'green' },
        { text: 'C++ → Python bridge active...', color: 'dim' },
        { text: '✓ Hybrid pipeline ready', color: 'green' },
        { text: '', color: 'default' },
        { text: 'img_001.jpg | 4.8s | detections: 2', color: 'default' },
        { text: 'img_002.jpg | 4.9s | alcohol: 1, plate: 1', color: 'default' },
        { text: 'img_003.jpg | 5.1s | detections: 0', color: 'default' }
      ]
    },
    {
      name: "CoffeeBot Firmware", link: "", featured: false,
      desc: "Firmware for an ESP32 microcontroller monitoring coffee machine usage via an amp sensor. Samples every second, transmits aggregated state over Wi-Fi to a WLAN server every ~5 seconds — networked displays render real-time usage.",
      stack: ["C++", "ESP32", "I²C", "Wi-Fi", "State Machine"],
      challenge: "Tight memory constraints from the display footprint on the ESP32 — optimised buffer usage and eliminated dynamic allocations to achieve a stable system with near-zero incorrect state displays.",
      outcome: "Deployed at Neuronicworks · stable 24/7 operation",
      hindsight: "I'd add a lightweight watchdog timer from day one and instrument the state machine with telemetry — debugging edge cases on a deployed ESP32 without visibility is painful.",
      stats: [], terminal: []
    },
    {
      name: "Kingston CareMap", link: "", featured: false,
      desc: "Low-data mobile app for Kingston helping users find essential services and food resources under real constraints — limited connectivity, low battery, time pressure. Dual navigation: interactive map + list fallback with need-based filtering.",
      stack: ["React", "FastAPI", "Python", "MySQL", "Docker"],
      challenge: "Designing a friction-reduction flow that minimises dead ends from stale data — prioritised verified listings, displayed last-updated timestamps, and flagged uncertain details with explicit warnings.",
      outcome: "Mayor's Award, KingHacks 2026 — top civic-impact prize",
      hindsight: "I'd invest more time in caching the service data locally so the app is fully functional offline — the dual-navigation fallback helped, but true offline-first would have made it far more resilient in the field.",
      stats: [], terminal: []
    },
    {
      name: "FaceCrypt", link: "", featured: false,
      desc: "Locally-running biometric encryption tool that uses face detection as a gate to protect sensitive files. Simple Tkinter GUI manages encrypted files and the unlock flow — from idea to demo in 36 hours.",
      stack: ["Python", "OpenCV", "face_recognition", "Tkinter", "AES"],
      challenge: "Deriving a stable, deterministic encryption key from a high-dimensional face embedding that remains consistent under varying lighting and pose conditions.",
      outcome: "Built in 36h · presented to judges at hackathon",
      hindsight: "The key derivation from the face embedding was brittle — I'd use a proper fuzzy commitment scheme or a dedicated biometric key derivation library rather than hand-rolling the embedding-to-key mapping.",
      stats: [], terminal: []
    }
  ],
  experience: [
    {
      date: "May – July 2025", role: "Firmware Developer Intern",
      org: "Neuronicworks Inc.", location: "Toronto, ON",
      bullets: [
        "Implemented firmware features enabling reliable comms between displays, sensors, and embedded controllers",
        "Conducted QA testing across projects, documenting integration issues and collaborating to resolve them per SOPs",
        "Created detailed test cases and validation reports to reduce debugging turnaround time"
      ]
    },
    {
      date: "Sept 2025 – Present", role: "Teaching Assistant — CISC 204",
      org: "Queen's University", location: "Kingston, ON",
      bullets: [
        "Led office hours clarifying course concepts and providing targeted assignment feedback",
        "Supported 50+ students bi-weekly, improving assignment scores by ~10% on average",
        "Collaborated with instructors to standardise grading and ensure accessible learning support"
      ]
    },
    {
      date: "Sept 2023 – Present", role: "Strategy Lead & CV/AI Integration",
      org: "Queen's VEX Robotics Team", location: "Dallas, TX — World Championship",
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
  now: { building: ["Personal portfolio with a live admin CMS"], reading: [], doing: ["Semester abroad at University of Manchester"] },
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
let dndSrc = null;
let _pendingConfirm = null;
let selectedSkill = null;

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }
function escHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function setLoginError(msg) { const el = document.getElementById('login-error'); if (el) el.textContent = msg || ''; }

// ── LOGIN ──
function unlock() {
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('admin-content').style.display = 'block';
  load();
}

async function tryLogin() {
  setLoginError('');
  const pwEl = document.getElementById('admin-pw');
  const pw = pwEl ? pwEl.value : '';
  if (!pw) { setLoginError('Enter your password.'); return; }
  try {
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    if (!r.ok) { setLoginError('Wrong password.'); return; }
    const j = await r.json();
    token = j.token;
    unlock();
  } catch (e) { setLoginError('Login failed.'); }
}

// ── PANELS ──
function switchPanel(name) {
  document.querySelectorAll('.sidebar-item[data-panel]').forEach(el =>
    el.classList.toggle('active', el.getAttribute('data-panel') === name));
  document.querySelectorAll('.panel').forEach(el =>
    el.classList.toggle('active', el.id === `panel-${name}`));
}
function toggleCard(el) { el.classList.toggle('open'); }

// ── INLINE CONFIRM ──
function confirmDelete(cardId, message, callback) {
  document.querySelectorAll('.inline-confirm').forEach(el => el.remove());
  const card = document.getElementById(cardId);
  if (!card) { callback(); return; }
  const actions = card.querySelector('.item-card-actions');
  if (!actions) { callback(); return; }
  _pendingConfirm = callback;
  const el = document.createElement('div');
  el.className = 'inline-confirm';
  el.innerHTML = `<span class="inline-confirm-msg">${escHtml(message)}</span>
    <button class="btn danger" onclick="executeConfirm()">Confirm delete</button>
    <button class="btn" onclick="cancelConfirm()">Cancel</button>`;
  actions.after(el);
}
function executeConfirm() {
  document.querySelectorAll('.inline-confirm').forEach(el => el.remove());
  if (_pendingConfirm) { const cb = _pendingConfirm; _pendingConfirm = null; cb(); }
}
function cancelConfirm() {
  document.querySelectorAll('.inline-confirm').forEach(el => el.remove());
  _pendingConfirm = null;
}

// ── RICH TEXT ──
function applyRichText(id, tag) {
  const ta = document.getElementById(id);
  if (!ta) return;
  const start = ta.selectionStart, end = ta.selectionEnd;
  if (start === end) return;
  const sel = ta.value.slice(start, end);
  const open = tag === 'b' ? '<strong>' : '<em>';
  const close = tag === 'b' ? '</strong>' : '</em>';
  const replacement = open + sel + close;
  ta.value = ta.value.slice(0, start) + replacement + ta.value.slice(end);
  ta.selectionStart = start;
  ta.selectionEnd = start + replacement.length;
  ta.focus();
}

function richtxtToolbar(id) {
  return `<div class="richtxt-toolbar">
    <button class="richtxt-btn" title="Bold" onclick="applyRichText('${id}','b')"><strong>B</strong></button>
    <button class="richtxt-btn" title="Italic" onclick="applyRichText('${id}','i')"><em>I</em></button>
    <span class="richtxt-hint">Select text then click</span>
  </div>`;
}

// ── DRAG & DROP ──
function onDragStart(e, type, idx) {
  dndSrc = { type, idx };
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
  setTimeout(() => {
    const card = getDndCard(type, idx);
    if (card) card.classList.add('dnd-dragging');
  }, 0);
}
function onDragOver(e, type, idx) {
  if (!dndSrc || dndSrc.type !== type || dndSrc.idx === idx) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.dnd-over').forEach(el => el.classList.remove('dnd-over'));
  const card = getDndCard(type, idx);
  if (card) card.classList.add('dnd-over');
}
function onDrop(e, type, idx) {
  e.preventDefault();
  document.querySelectorAll('.dnd-dragging, .dnd-over').forEach(el => el.classList.remove('dnd-dragging', 'dnd-over'));
  if (!dndSrc || dndSrc.type !== type || dndSrc.idx === idx) { dndSrc = null; return; }
  const src = dndSrc.idx;
  dndSrc = null;
  const arr = type === 'projects' ? data.projects : type === 'experience' ? data.experience : data.courses;
  const item = arr.splice(src, 1)[0];
  arr.splice(src < idx ? idx - 1 : idx, 0, item);
  if (type === 'projects') renderProjectsList();
  else if (type === 'experience') renderExperienceList();
  else renderCourseworkList();
}
function onDragEnd() {
  document.querySelectorAll('.dnd-dragging, .dnd-over').forEach(el => el.classList.remove('dnd-dragging', 'dnd-over'));
  dndSrc = null;
}
function getDndCard(type, idx) {
  const prefix = type === 'projects' ? 'proj' : type === 'experience' ? 'exp' : 'course';
  return document.getElementById(`${prefix}-card-${idx}`);
}
function dndAttrs(type, idx) {
  return `draggable="true" ondragstart="onDragStart(event,'${type}',${idx})" ondragover="onDragOver(event,'${type}',${idx})" ondrop="onDrop(event,'${type}',${idx})" ondragend="onDragEnd()"`;
}

// ── TAGS (projects) ──
function tagsHtml(section, idx, field, tags) {
  return (tags || []).map((t, ti) =>
    `<span class="tag-chip">${escHtml(t)}<span class="tag-remove" onclick="removeTag('${section}',${idx},'${field}',${ti})">×</span></span>`
  ).join('');
}
function tagEditorHtml(section, idx, field, tags) {
  const id = `tags-${section}-${idx}-${field}`;
  return `<div class="tags-editor" id="${id}">${tagsHtml(section, idx, field, tags)}</div>
    <div class="tag-add-row">
      <input type="text" id="${id}-input" placeholder="Add tag…" onkeydown="if(event.key==='Enter'){addTag('${section}',${idx},'${field}');event.preventDefault()}">
      <button class="btn add" onclick="addTag('${section}',${idx},'${field}')">+</button>
    </div>`;
}
function refreshTagsEl(section, idx, field) {
  const el = document.getElementById(`tags-${section}-${idx}-${field}`);
  if (!el) return;
  const tags = section === 'projects' ? (data.projects[idx][field] || []) : (data.skills[field] || []);
  el.innerHTML = tagsHtml(section, idx, field, tags);
}
function addTag(section, idx, field) {
  const inputEl = document.getElementById(`tags-${section}-${idx}-${field}-input`);
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val) return;
  inputEl.value = '';
  if (section === 'projects') { (data.projects[idx][field] = data.projects[idx][field] || []).push(val); }
  else if (section === 'skills') { (data.skills[field] = data.skills[field] || []).push(val); }
  refreshTagsEl(section, idx, field);
  inputEl.focus();
}
function removeTag(section, idx, field, ti) {
  if (section === 'projects') data.projects[idx][field].splice(ti, 1);
  else if (section === 'skills') data.skills[field].splice(ti, 1);
  refreshTagsEl(section, idx, field);
}

// ── BULLETS (experience) ──
function bulletsHtml(expIdx, bullets) {
  return (bullets || []).map((b, bi) => `
    <div class="bullet-row">
      <textarea oninput="data.experience[${expIdx}].bullets[${bi}]=this.value">${escHtml(b)}</textarea>
      <button class="bullet-del" onclick="deleteBullet(${expIdx},${bi})">×</button>
    </div>`).join('');
}
function refreshBulletList(expIdx) {
  const el = document.getElementById(`bullets-${expIdx}`);
  if (el) el.innerHTML = bulletsHtml(expIdx, data.experience[expIdx].bullets || []);
}
function addBullet(expIdx) {
  (data.experience[expIdx].bullets = data.experience[expIdx].bullets || []).push('');
  refreshBulletList(expIdx);
}
function deleteBullet(expIdx, bi) {
  data.experience[expIdx].bullets.splice(bi, 1);
  refreshBulletList(expIdx);
}

// ── TERMINAL LINES ──
function terminalLineHtml(projIdx, li, line) {
  return `<div class="terminal-line-row">
    <select onchange="data.projects[${projIdx}].terminal[${li}].color=this.value">
      <option value="default"${line.color==='default'?' selected':''}>default</option>
      <option value="dim"${line.color==='dim'?' selected':''}>dim</option>
      <option value="green"${line.color==='green'?' selected':''}>green</option>
      <option value="cyan"${line.color==='cyan'?' selected':''}>cyan</option>
    </select>
    <input type="text" value="${escHtml(line.text)}" placeholder="terminal line…"
           oninput="data.projects[${projIdx}].terminal[${li}]=Object.assign(data.projects[${projIdx}].terminal[${li}],{text:this.value})">
    <button class="bullet-del" onclick="deleteTerminalLine(${projIdx},${li})">×</button>
  </div>`;
}
function refreshTerminalLines(projIdx) {
  const el = document.getElementById(`terminal-${projIdx}`);
  if (el) el.innerHTML = (data.projects[projIdx].terminal || []).map((l, li) => terminalLineHtml(projIdx, li, l)).join('');
}
function addTerminalLine(projIdx) {
  (data.projects[projIdx].terminal = data.projects[projIdx].terminal || []).push({ text: '', color: 'default' });
  refreshTerminalLines(projIdx);
}
function deleteTerminalLine(projIdx, li) {
  data.projects[projIdx].terminal.splice(li, 1);
  refreshTerminalLines(projIdx);
}

// ── SPOTLIGHT STATS ──
function statsHtml(projIdx, stats) {
  return (stats || []).map((s, si) => `
    <div class="stat-row">
      <input type="text" value="${escHtml(s.val)}" placeholder="~80%" title="Value"
             oninput="data.projects[${projIdx}].stats[${si}].val=this.value">
      <input type="text" value="${escHtml(s.label)}" placeholder="Detection accuracy" title="Label"
             oninput="data.projects[${projIdx}].stats[${si}].label=this.value">
      <button class="bullet-del" onclick="deleteStat(${projIdx},${si})">×</button>
    </div>`).join('');
}
function refreshStats(projIdx) {
  const el = document.getElementById(`stats-${projIdx}`);
  if (el) el.innerHTML = statsHtml(projIdx, data.projects[projIdx].stats || []);
}
function addStat(projIdx) {
  const stats = (data.projects[projIdx].stats = data.projects[projIdx].stats || []);
  if (stats.length >= 3) return;
  stats.push({ val: '', label: '' });
  refreshStats(projIdx);
}
function deleteStat(projIdx, si) {
  data.projects[projIdx].stats.splice(si, 1);
  refreshStats(projIdx);
}

// ── EDUCATION ──
function renderEduList() {
  const list = document.getElementById('edu-list');
  if (!list) return;
  list.innerHTML = (data.about.education || []).map((e, i) => `
    <div class="item-card" id="edu-card-${i}">
      <div class="item-card-header" onclick="toggleCard(this.parentElement)">
        <div class="item-card-header-left">
          <span class="item-card-num">EDU_${String(i + 1).padStart(2, '0')}</span>
          <span class="item-card-name" id="edu-name-${i}">${escHtml(e.title) || 'Untitled'}</span>
        </div>
        <span class="item-card-chevron">›</span>
      </div>
      <div class="item-card-body">
        <div class="field"><label>Institution</label><input type="text" value="${escHtml(e.title)}" oninput="data.about.education[${i}].title=this.value;document.getElementById('edu-name-${i}').textContent=this.value||'Untitled'"></div>
        <div class="field"><label>Subtitle</label><input type="text" value="${escHtml(e.sub)}" oninput="data.about.education[${i}].sub=this.value"></div>
        <div class="item-card-actions">
          <button class="btn danger" onclick="confirmDelete('edu-card-${i}','Delete this education entry?',()=>deleteEdu(${i}))">Delete</button>
        </div>
      </div>
    </div>`).join('');
}
function addEdu() {
  (data.about.education = data.about.education || []).push({ title: 'New Institution', sub: '' });
  renderEduList();
  const cards = document.querySelectorAll('#edu-list .item-card');
  if (cards.length) cards[cards.length - 1].classList.add('open');
}
function deleteEdu(i) {
  data.about.education.splice(i, 1);
  renderEduList();
}

// ── LANGUAGES ──
function renderLanguagesList() {
  const list = document.getElementById('languages-list');
  if (!list) return;
  list.innerHTML = (data.about.languages || []).map((l, i) => `
    <div class="item-card" id="lang-card-${i}">
      <div class="item-card-header" onclick="toggleCard(this.parentElement)">
        <div class="item-card-header-left">
          <span class="item-card-num">${escHtml(l.flag.toUpperCase())}</span>
          <span class="item-card-name" id="lang-name-${i}">${escHtml(l.name)} · ${escHtml(l.level)}</span>
        </div>
        <span class="item-card-chevron">›</span>
      </div>
      <div class="item-card-body">
        <div class="field-row">
          <div class="field"><label>Language name</label><input type="text" value="${escHtml(l.name)}" oninput="data.about.languages[${i}].name=this.value;document.getElementById('lang-name-${i}').textContent=this.value+' · '+data.about.languages[${i}].level"></div>
          <div class="field"><label>Flag code (ISO 2-letter, e.g. gb, ro, fr)</label><input type="text" value="${escHtml(l.flag)}" oninput="data.about.languages[${i}].flag=this.value"></div>
        </div>
        <div class="field">
          <label>Proficiency level</label>
          <select oninput="data.about.languages[${i}].level=this.value;document.getElementById('lang-name-${i}').textContent=data.about.languages[${i}].name+' · '+this.value">
            ${['NATIVE','FLUENT','PROFICIENT','LEARNING','BEGINNER'].map(lv => `<option${l.level===lv?' selected':''}>${lv}</option>`).join('')}
          </select>
        </div>
        <div class="item-card-actions">
          <button class="btn danger" onclick="confirmDelete('lang-card-${i}','Delete this language?',()=>deleteLanguage(${i}))">Delete</button>
        </div>
      </div>
    </div>`).join('');
}
function addLanguage() {
  (data.about.languages = data.about.languages || []).push({ flag: 'xx', name: 'New Language', level: 'LEARNING' });
  renderLanguagesList();
  const cards = document.querySelectorAll('#languages-list .item-card');
  if (cards.length) cards[cards.length - 1].classList.add('open');
}
function deleteLanguage(i) {
  data.about.languages.splice(i, 1);
  renderLanguagesList();
}

// ── PROJECTS ──
function renderProjectsList() {
  const list = document.getElementById('projects-list');
  if (!list) return;
  const projects = data.projects || [];
  list.innerHTML = projects.map((p, i) => `
    <div class="item-card" id="proj-card-${i}" ${dndAttrs('projects', i)}>
      <div class="item-card-header" onclick="toggleCard(this.parentElement)">
        <div class="item-card-header-left">
          <span class="dnd-handle" title="Drag to reorder" onclick="event.stopPropagation()">⠿</span>
          <span class="item-card-num">${String(i + 1).padStart(2, '0')}${p.featured ? ' — Featured' : ''}</span>
          <span class="item-card-name" id="proj-name-${i}">${escHtml(p.name) || 'Untitled'}</span>
        </div>
        <span class="item-card-chevron">›</span>
      </div>
      <div class="item-card-body">
        <div class="field-row">
          <div class="field"><label>Name</label><input type="text" value="${escHtml(p.name)}" oninput="data.projects[${i}].name=this.value;document.getElementById('proj-name-${i}').textContent=this.value||'Untitled'"></div>
          <div class="field"><label>Link (GitHub / demo URL)</label><input type="text" value="${escHtml(p.link || '')}" oninput="data.projects[${i}].link=this.value" placeholder="https://github.com/…"></div>
        </div>
        <div class="field" style="display:flex;align-items:center;gap:0.75rem;">
          <label style="margin:0;white-space:nowrap;">Featured spotlight</label>
          <input type="checkbox" ${p.featured ? 'checked' : ''} onchange="setFeatured(${i},this.checked)" style="width:auto;accent-color:var(--accent);">
          <span class="field-hint" style="margin:0;">Only one project can be featured at a time.</span>
        </div>
        <div class="field"><label>Description</label><textarea oninput="data.projects[${i}].desc=this.value">${escHtml(p.desc)}</textarea></div>
        <div class="field"><label>Stack (tags)</label>${tagEditorHtml('projects', i, 'stack', p.stack || [])}</div>
        <div class="field"><label>Technical Challenge</label><textarea oninput="data.projects[${i}].challenge=this.value">${escHtml(p.challenge)}</textarea></div>
        <div class="field"><label>Outcome</label><input type="text" value="${escHtml(p.outcome)}" oninput="data.projects[${i}].outcome=this.value"></div>
        <div class="field"><label>What I'd do differently</label><textarea oninput="data.projects[${i}].hindsight=this.value">${escHtml(p.hindsight)}</textarea></div>
        <div class="divider"></div>
        <div class="field">
          <label>Spotlight stats (max 3 — shown below featured project)</label>
          <div class="stat-row stat-row-header"><span>Value</span><span>Label</span><span></span></div>
          <div id="stats-${i}">${statsHtml(i, p.stats || [])}</div>
          ${(p.stats || []).length < 3 ? `<button class="btn add" style="margin-top:0.4rem" onclick="addStat(${i})">+ Add Stat</button>` : ''}
        </div>
        <div class="field">
          <label>Terminal lines (featured project display)</label>
          <div id="terminal-${i}">${(p.terminal || []).map((l, li) => terminalLineHtml(i, li, l)).join('')}</div>
          <button class="btn add" style="margin-top:0.4rem" onclick="addTerminalLine(${i})">+ Add Line</button>
        </div>
        <div class="item-card-actions">
          <button class="btn danger" onclick="confirmDelete('proj-card-${i}','Delete this project?',()=>deleteProject(${i}))">Delete</button>
        </div>
      </div>
    </div>`).join('');
}
function setFeatured(i, val) {
  data.projects.forEach((p, pi) => p.featured = (pi === i && val));
  renderProjectsList();
  const card = document.getElementById(`proj-card-${i}`);
  if (card) card.classList.add('open');
}
function addProject() {
  (data.projects = data.projects || []).push({ name: 'New Project', link: '', featured: false, desc: '', stack: [], challenge: '', outcome: '', hindsight: '', stats: [], terminal: [] });
  renderProjectsList();
  const cards = document.querySelectorAll('#projects-list .item-card');
  if (cards.length) cards[cards.length - 1].classList.add('open');
}
function deleteProject(i) {
  data.projects.splice(i, 1);
  renderProjectsList();
}

// ── EXPERIENCE ──
function renderExperienceList() {
  const list = document.getElementById('experience-list');
  if (!list) return;
  const exp = data.experience || [];
  list.innerHTML = exp.map((e, i) => `
    <div class="item-card" id="exp-card-${i}" ${dndAttrs('experience', i)}>
      <div class="item-card-header" onclick="toggleCard(this.parentElement)">
        <div class="item-card-header-left">
          <span class="dnd-handle" title="Drag to reorder" onclick="event.stopPropagation()">⠿</span>
          <span class="item-card-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="item-card-name" id="exp-name-${i}">${escHtml(e.role) || 'Untitled'}</span>
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
          <div class="field"><label>Location</label><input type="text" value="${escHtml(e.location || '')}" oninput="data.experience[${i}].location=this.value" placeholder="City, Country"></div>
        </div>
        <div class="field">
          <label>Bullet Points</label>
          <div class="bullet-list" id="bullets-${i}">${bulletsHtml(i, e.bullets || [])}</div>
          <button class="btn add" style="margin-top:0.5rem" onclick="addBullet(${i})">+ Add Bullet</button>
        </div>
        <div class="item-card-actions">
          <button class="btn danger" onclick="confirmDelete('exp-card-${i}','Delete this role?',()=>deleteExperience(${i}))">Delete</button>
        </div>
      </div>
    </div>`).join('');
}
function addExperience() {
  (data.experience = data.experience || []).push({ date: '', role: 'New Role', org: '', location: '', bullets: [] });
  renderExperienceList();
  const cards = document.querySelectorAll('#experience-list .item-card');
  if (cards.length) cards[cards.length - 1].classList.add('open');
}
function deleteExperience(i) {
  data.experience.splice(i, 1);
  renderExperienceList();
}

// ── NOW BULLETS ──
function nowBulletsHtml(field, bullets) {
  return (bullets || []).map((b, bi) => `
    <div class="bullet-row">
      <textarea oninput="data.now['${field}'][${bi}]=this.value">${escHtml(b)}</textarea>
      <button class="bullet-del" onclick="deleteNowBullet('${field}',${bi})">×</button>
    </div>`).join('');
}
function refreshNowBullets(field) {
  const el = document.getElementById(`now-bullets-${field}`);
  if (el) el.innerHTML = nowBulletsHtml(field, data.now[field] || []);
}
function addNowBullet(field) {
  if (!Array.isArray(data.now[field])) data.now[field] = data.now[field] ? [data.now[field]] : [];
  data.now[field].push('');
  refreshNowBullets(field);
  const rows = document.querySelectorAll(`#now-bullets-${field} textarea`);
  if (rows.length) rows[rows.length - 1].focus();
}
function deleteNowBullet(field, bi) {
  data.now[field].splice(bi, 1);
  refreshNowBullets(field);
}

// ── COURSEWORK ──
function renderCourseworkList() {
  const list = document.getElementById('coursework-list');
  if (!list) return;
  const courses = data.courses || [];
  list.innerHTML = courses.map((c, i) => `
    <div class="item-card" id="course-card-${i}" ${dndAttrs('courses', i)}>
      <div class="item-card-header" onclick="toggleCard(this.parentElement)">
        <div class="item-card-header-left">
          <span class="dnd-handle" title="Drag to reorder" onclick="event.stopPropagation()">⠿</span>
          <span class="item-card-num">${escHtml(c.code) || '—'}</span>
          <span class="item-card-name" id="course-name-${i}">${escHtml(c.name) || 'Untitled'}</span>
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
          <button class="btn danger" onclick="confirmDelete('course-card-${i}','Delete this course?',()=>deleteCourse(${i}))">Delete</button>
        </div>
      </div>
    </div>`).join('');
}
function addCourse() {
  (data.courses = data.courses || []).push({ code: '', name: 'New Course', desc: '' });
  renderCourseworkList();
  const cards = document.querySelectorAll('#coursework-list .item-card');
  if (cards.length) cards[cards.length - 1].classList.add('open');
}
function deleteCourse(i) {
  data.courses.splice(i, 1);
  renderCourseworkList();
}

// ── SKILLS ──
const SKILL_GROUPS = [
  { key: 'languages', label: 'Languages' },
  { key: 'systems', label: 'Systems & Embedded' },
  { key: 'ai', label: 'AI / ML' },
  { key: 'devops', label: 'DevOps & Backend' }
];

function normalizeSkill(s) {
  if (typeof s === 'string') return { name: s, source: '' };
  if (s && typeof s === 'object') return { name: s.name || '', source: s.source || '' };
  return { name: '', source: '' };
}
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
  const cls = `tag-chip skill-chip${isSel ? ' selected' : ''}${hasSrc ? ' has-source' : ''}`;
  return `<span class="${cls}" onclick="selectSkill('${groupKey}',${idx})">`
    + `${escHtml(skill.name || '(unnamed)')}`
    + `<span class="tag-remove" onclick="event.stopPropagation();removeSkill('${groupKey}',${idx})">×</span>`
    + `</span>`;
}
function skillEditPanelHtml(groupKey, idx, skill) {
  return `<div class="skill-edit-panel">
    <div class="skill-edit-title">Editing skill: <strong>${escHtml(skill.name || '(unnamed)')}</strong></div>
    <div class="field"><label>Skill name</label>
      <input type="text" value="${escHtml(skill.name)}" oninput="updateSkillField('${groupKey}',${idx},'name',this.value)">
    </div>
    <div class="field"><label>Where I gained this skill (hover tooltip)</label>
      <input type="text" value="${escHtml(skill.source)}" placeholder="e.g. CoffeeBot Firmware · CleanShare"
             oninput="updateSkillField('${groupKey}',${idx},'source',this.value)">
      <div class="field-hint">Shown as a tooltip on the public site. Leave blank for no tooltip.</div>
    </div>
    <div class="skill-edit-actions"><button class="btn" onclick="selectSkill(null,null)">Done</button></div>
  </div>`;
}
function renderSkillsPanel() {
  const panel = document.getElementById('skills-panel');
  if (!panel) return;
  panel.innerHTML = SKILL_GROUPS.map((g, gi) => {
    const skills = (data.skills && data.skills[g.key]) || [];
    const chips = skills.map((s, si) => skillChipHtml(g.key, si, s)).join('');
    const editor = (selectedSkill && selectedSkill.group === g.key && skills[selectedSkill.idx])
      ? skillEditPanelHtml(g.key, selectedSkill.idx, skills[selectedSkill.idx]) : '';
    return `${gi > 0 ? '<div class="divider"></div>' : ''}
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
    selectedSkill = null;
  } else {
    selectedSkill = { group: groupKey, idx: idx };
  }
  renderSkillsPanel();
  if (selectedSkill) {
    const inputs = document.querySelectorAll('.skill-edit-panel input');
    if (inputs.length >= 2) inputs[1].focus();
  }
}
function updateSkillField(groupKey, idx, field, value) {
  if (!data.skills || !data.skills[groupKey] || !data.skills[groupKey][idx]) return;
  data.skills[groupKey][idx][field] = value;
}

// ── HERO ──
function renderHeroPanel() {
  if (!data.hero) return;
  const h = data.hero;
  const nameEl = document.getElementById('hero-name');
  if (nameEl) nameEl.value = h.name || '';
  const ctaPrimaryText = document.getElementById('hero-cta-primary-text');
  const ctaPrimaryLink = document.getElementById('hero-cta-primary-link');
  const ctaCoffeeText  = document.getElementById('hero-cta-coffee-text');
  const ctaCoffeeLink  = document.getElementById('hero-cta-coffee-link');
  const ctaCoffeeEnabled = document.getElementById('hero-cta-coffee-enabled');
  const ctaGhostText   = document.getElementById('hero-cta-ghost-text');
  const ctaGhostLink   = document.getElementById('hero-cta-ghost-link');
  if (ctaPrimaryText) ctaPrimaryText.value = h.ctaPrimary?.text || '';
  if (ctaPrimaryLink) ctaPrimaryLink.value = h.ctaPrimary?.link || '';
  if (ctaCoffeeText)  ctaCoffeeText.value  = h.ctaCoffee?.text  || '';
  if (ctaCoffeeLink)  ctaCoffeeLink.value  = h.ctaCoffee?.link  || '';
  if (ctaCoffeeEnabled) ctaCoffeeEnabled.checked = h.ctaCoffee?.enabled !== false;
  if (ctaGhostText)   ctaGhostText.value   = h.ctaGhost?.text   || '';
  if (ctaGhostLink)   ctaGhostLink.value   = h.ctaGhost?.link   || '';
  renderTypingWords();
  renderMetrics();
}
function renderTypingWords() {
  const el = document.getElementById('typing-words-editor');
  if (!el) return;
  const words = data.hero?.typingWords || [];
  el.innerHTML = words.map((w, i) =>
    `<span class="tag-chip">${escHtml(w)}<span class="tag-remove" onclick="removeTypingWord(${i})">×</span></span>`
  ).join('');
}
function addTypingWord() {
  const inp = document.getElementById('typing-word-input');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';
  (data.hero.typingWords = data.hero.typingWords || []).push(val);
  renderTypingWords();
  inp.focus();
}
function removeTypingWord(i) {
  data.hero.typingWords.splice(i, 1);
  renderTypingWords();
}
function renderMetrics() {
  const el = document.getElementById('metrics-list');
  if (!el) return;
  const metrics = data.hero?.metrics || [];
  el.innerHTML = metrics.map((m, i) => `
    <div class="stat-row" id="metric-row-${i}">
      <input type="text" value="${escHtml(m.val)}" placeholder="3.72" title="Value"
             oninput="data.hero.metrics[${i}].val=this.value">
      <input type="text" value="${escHtml(m.label)}" placeholder="GPA / 4.30" title="Label"
             oninput="data.hero.metrics[${i}].label=this.value">
      <button class="bullet-del" onclick="deleteMetric(${i})">×</button>
    </div>`).join('');
}
function addMetric() {
  const metrics = (data.hero.metrics = data.hero.metrics || []);
  if (metrics.length >= 4) return;
  metrics.push({ val: '', label: '' });
  renderMetrics();
}
function deleteMetric(i) {
  data.hero.metrics.splice(i, 1);
  renderMetrics();
}

// ── RENDER ALL ──
function renderAll() {
  if (!data) return;
  // Hero
  renderHeroPanel();
  // About
  document.getElementById('about-p1').value = data.about?.p1 || '';
  document.getElementById('about-p2').value = data.about?.p2 || '';
  document.getElementById('about-p3').value = data.about?.p3 || '';
  document.getElementById('about-currently').value = data.about?.currently || '';
  document.getElementById('about-currently-date').value = data.about?.currently_date || '';
  document.getElementById('about-stack-fact').value = data.about?.stackFact || '';
  document.getElementById('about-award-fact').value = data.about?.awardFact || '';
  renderEduList();
  renderLanguagesList();
  // Projects
  renderProjectsList();
  // Experience
  renderExperienceList();
  // Skills
  migrateSkillsData();
  renderSkillsPanel();
  // Coursework
  renderCourseworkList();
  // Now
  const n = data.now || {};
  ['building', 'reading', 'doing'].forEach(f => {
    if (!Array.isArray(n[f])) data.now[f] = n[f] ? [n[f]] : [];
    refreshNowBullets(f);
  });
  // Contact
  document.getElementById('contact-email').value = data.contact?.email || '';
  document.getElementById('contact-github').value = data.contact?.github || '';
  document.getElementById('contact-linkedin').value = data.contact?.linkedin || '';
}

// No-op kept for backward compat — use confirmResetAll() instead
function resetAll() { confirmResetAll(); }

// Inline confirm for the reset action (no card container needed)
function confirmResetAll() {
  document.querySelectorAll('.inline-confirm').forEach(el => el.remove());
  _pendingConfirm = () => {
    data = deepCopy(DEFAULTS);
    localStorage.setItem(STORE, JSON.stringify(data));
    renderAll();
    document.querySelectorAll('.reset-confirm').forEach(el => el.remove());
  };
  const sidebar = document.querySelector('.sidebar-section:last-child');
  if (!sidebar) return;
  const el = document.createElement('div');
  el.className = 'inline-confirm reset-confirm';
  el.style.cssText = 'margin:0.5rem 1.25rem;';
  el.innerHTML = `<span class="inline-confirm-msg">Reset everything?</span>
    <button class="btn danger" onclick="executeConfirm()">Yes, reset</button>
    <button class="btn" onclick="cancelConfirm()">Cancel</button>`;
  sidebar.appendChild(el);
}

async function load() {
  try {
    const r = await fetch('/api/load', { cache: 'no-store' });
    if (r.ok) {
      data = await r.json();
      if (!data.hero) data.hero = deepCopy(DEFAULTS.hero);
      else {
        if (!data.hero.typingWords) data.hero.typingWords = deepCopy(DEFAULTS.hero.typingWords);
        if (!data.hero.metrics) data.hero.metrics = deepCopy(DEFAULTS.hero.metrics);
        if (!data.hero.ctaPrimary) data.hero.ctaPrimary = deepCopy(DEFAULTS.hero.ctaPrimary);
        if (!data.hero.ctaCoffee) data.hero.ctaCoffee = deepCopy(DEFAULTS.hero.ctaCoffee);
        if (!data.hero.ctaGhost) data.hero.ctaGhost = deepCopy(DEFAULTS.hero.ctaGhost);
      }
      if (!data.about) data.about = deepCopy(DEFAULTS.about);
      else {
        data.about.education = data.about.education || deepCopy(DEFAULTS.about.education);
        data.about.languages = data.about.languages || deepCopy(DEFAULTS.about.languages);
        if (data.about.stackFact === undefined) data.about.stackFact = DEFAULTS.about.stackFact;
        if (data.about.awardFact === undefined) data.about.awardFact = DEFAULTS.about.awardFact;
      }
      if (!data.projects?.length) data.projects = deepCopy(DEFAULTS.projects);
      else {
        data.projects = data.projects.map((p, i) => ({
          stats: [], terminal: [],
          ...DEFAULTS.projects[i] ? { stats: DEFAULTS.projects[i].stats, terminal: DEFAULTS.projects[i].terminal } : {},
          ...p,
          stats: p.stats || [],
          terminal: p.terminal || []
        }));
      }
      if (!data.experience?.length) data.experience = deepCopy(DEFAULTS.experience);
      if (!data.skills) data.skills = deepCopy(DEFAULTS.skills);
      if (!data.courses?.length) data.courses = deepCopy(DEFAULTS.courses);
      if (!data.now) data.now = deepCopy(DEFAULTS.now);
      if (!data.contact) data.contact = deepCopy(DEFAULTS.contact);
      localStorage.setItem(STORE, JSON.stringify(data));
      renderAll();
      return;
    }
  } catch (e) { console.warn('JSONBin fetch failed, using local', e); }
  const stored = localStorage.getItem(STORE);
  if (stored) {
    data = JSON.parse(stored);
    if (!data.hero) data.hero = deepCopy(DEFAULTS.hero);
    if (!data.about?.languages) { if (data.about) data.about.languages = deepCopy(DEFAULTS.about.languages); }
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
  // Collect textarea values (not using oninput)
  data.about.p1 = document.getElementById('about-p1').value;
  data.about.p2 = document.getElementById('about-p2').value;
  data.about.p3 = document.getElementById('about-p3').value;
  data.about.currently = document.getElementById('about-currently').value;
  data.about.currently_date = document.getElementById('about-currently-date').value;
  data.about.stackFact = document.getElementById('about-stack-fact').value;
  data.about.awardFact = document.getElementById('about-award-fact').value;
  // Hero CTA fields (not using oninput to avoid partial-object writes)
  data.hero = data.hero || {};
  data.hero.name = document.getElementById('hero-name').value;
  data.hero.ctaPrimary = {
    text: document.getElementById('hero-cta-primary-text').value,
    link: document.getElementById('hero-cta-primary-link').value
  };
  data.hero.ctaCoffee = {
    text: document.getElementById('hero-cta-coffee-text').value,
    link: document.getElementById('hero-cta-coffee-link').value,
    enabled: document.getElementById('hero-cta-coffee-enabled').checked
  };
  data.hero.ctaGhost = {
    text: document.getElementById('hero-cta-ghost-text').value,
    link: document.getElementById('hero-cta-ghost-link').value
  };
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
  } catch (e) { s.textContent = '⚠ Saved locally (offline)'; }
  setTimeout(() => { s.classList.remove('show'); s.textContent = '✓ Saved'; }, 3000);
}

// Expose globals
window.tryLogin = tryLogin;
window.switchPanel = switchPanel;
window.toggleCard = toggleCard;
window.confirmResetAll = confirmResetAll;
window.executeConfirm = executeConfirm;
window.cancelConfirm = cancelConfirm;
window.applyRichText = applyRichText;
window.addEdu = addEdu; window.deleteEdu = deleteEdu;
window.addLanguage = addLanguage; window.deleteLanguage = deleteLanguage;
window.addProject = addProject; window.deleteProject = deleteProject; window.setFeatured = setFeatured;
window.addStat = addStat; window.deleteStat = deleteStat;
window.addTerminalLine = addTerminalLine; window.deleteTerminalLine = deleteTerminalLine;
window.addExperience = addExperience; window.deleteExperience = deleteExperience;
window.addBullet = addBullet; window.deleteBullet = deleteBullet;
window.addTag = addTag; window.removeTag = removeTag;
window.addSkill = addSkill; window.removeSkill = removeSkill;
window.selectSkill = selectSkill; window.updateSkillField = updateSkillField;
window.addNowBullet = addNowBullet; window.deleteNowBullet = deleteNowBullet; window.refreshNowBullets = refreshNowBullets;
window.addCourse = addCourse; window.deleteCourse = deleteCourse;
window.addTypingWord = addTypingWord; window.removeTypingWord = removeTypingWord;
window.addMetric = addMetric; window.deleteMetric = deleteMetric;
window.onDragStart = onDragStart; window.onDragOver = onDragOver; window.onDrop = onDrop; window.onDragEnd = onDragEnd;
window.confirmDelete = confirmDelete;
window.saveAll = saveAll;
