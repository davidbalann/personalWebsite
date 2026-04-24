(function () {
  // Only show once per session
  if (sessionStorage.getItem('db_intro')) {
    document.getElementById('intro-overlay').remove();
    document.getElementById('iflash').remove();
    return;
  }
  document.body.style.overflow = 'hidden';

  const seq = [
    { t: 'DavidBalan.Dev · boot sequence',                        cls: 'hi',  ms: 160  },
    { t: '──────────────────────────────────────────',    cls: 'sep', ms: 380  },
    { t: '',                                               cls: 'dim', ms: 460  },
    { t: 'PROC  ·  David Balan',                          cls: 'hi',  ms: 540  },
    { t: 'INST  ·  B.Computing (AI)  ·  Queen\'s University', cls: 'mid', ms: 720 },
    { t: 'NET   ·  Manchester  ↔  Kingston, ON',          cls: 'mid', ms: 880  },
    { t: 'SPEC  ·  Embedded · Systems · Vision',          cls: 'mid', ms: 1020 },
    { t: '',                                               cls: 'dim', ms: 1140 },
    { t: '[ firmware         ]   OK',                     cls: 'grn', ms: 1230 },
    { t: '[ computer_vision  ]   OK',                     cls: 'grn', ms: 1390 },
    { t: '[ full_stack       ]   OK',                     cls: 'grn', ms: 1540 },
    { t: '[ creativity       ]   OK',                     cls: 'grn', ms: 1690 },
    { t: '',                                               cls: 'dim', ms: 1800 },
  ];

  const container = document.getElementById('ilines');

  seq.forEach(({ t, cls, ms }) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'iline ' + cls;
      el.textContent = t;
      container.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('vis')));
    }, ms);
  });

  // Progress bar
  setTimeout(() => {
    const track = document.getElementById('ibar-track');
    track.classList.add('vis');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById('ibar-fill').style.width = '100%';
    }));
  }, 1860);

  // Ready indicator
  setTimeout(() => {
    document.getElementById('iready').classList.add('vis');
  }, 2820);

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    sessionStorage.setItem('db_intro', '1');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);

    const flash = document.getElementById('iflash');
    const overlay = document.getElementById('intro-overlay');
    const skip = document.getElementById('iskip');

    // Quick flash to page colour, then fade overlay
    flash.style.opacity = '0.9';
    setTimeout(() => {
      flash.style.opacity = '0';
      overlay.classList.add('out');
      if (skip) skip.style.opacity = '0';
    }, 100);
    setTimeout(() => {
      overlay.remove();
      flash.remove();
      if (skip) skip.remove();
    }, 720);
  }

  let dismissed = false;
  // Auto-dismiss
  setTimeout(dismiss, 3400);

  // Skip interactions
  const onKey = () => dismiss();
  document.addEventListener('keydown', onKey);
  document.getElementById('intro-overlay').addEventListener('click', dismiss);
  document.getElementById('iskip').addEventListener('click', e => { e.stopPropagation(); dismiss(); });
})();
