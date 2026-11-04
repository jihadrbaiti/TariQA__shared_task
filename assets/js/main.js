/* ==========================================================================
   TariqQA site script
   - wires links from config.js
   - mobile navigation, theme toggle, active section highlighting
   - scroll reveal
   - "Take the test" sample quiz with a traffic-light result
   Plain ES5-friendly JavaScript, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var links = cfg.links || {};
  var root = document.documentElement;

  /* ---------------------------------------------------------------------
     1. Links and contact details from config.js
     --------------------------------------------------------------------- */
  var linkEls = document.querySelectorAll('[data-link]');
  Array.prototype.forEach.call(linkEls, function (a) {
    var key = a.getAttribute('data-link');
    var url = links[key];
    if (url) {
      a.setAttribute('href', url);
      if (/^https?:/i.test(url)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      }
    } else {
      a.setAttribute('href', '#');
      a.classList.add('is-tba');
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('title', 'Link to be announced');
      if (!a.querySelector('.tba-badge')) {
        var badge = document.createElement('span');
        badge.className = 'tba-badge';
        badge.textContent = 'soon';
        a.appendChild(badge);
      }
      a.addEventListener('click', function (e) { e.preventDefault(); });
    }
  });

  var emailEls = document.querySelectorAll('[data-email]');
  Array.prototype.forEach.call(emailEls, function (el) {
    if (cfg.contactEmail) {
      el.textContent = cfg.contactEmail;
      if (el.tagName === 'A') { el.setAttribute('href', 'mailto:' + cfg.contactEmail); }
    } else {
      el.textContent = 'contact e-mail to be announced';
      el.classList.add('tba');
      if (el.tagName === 'A') { el.removeAttribute('href'); }
    }
  });

  /* ---------------------------------------------------------------------
     2. Navigation (mobile toggle + active link)
     --------------------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(nav.querySelectorAll('.nav-links a'), function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ('IntersectionObserver' in window && navAnchors.length) {
    var sectionMap = {};
    navAnchors.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) { sectionMap[id] = a; }
    });
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove('active'); });
          var a = sectionMap[entry.target.id];
          if (a) { a.classList.add('active'); }
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    Object.keys(sectionMap).forEach(function (id) {
      activeObserver.observe(document.getElementById(id));
    });
  }

  /* ---------------------------------------------------------------------
     3. Theme toggle (system preference by default, remembered per browser)
     --------------------------------------------------------------------- */
  function storedTheme() {
    try { return localStorage.getItem('tariqqa-theme'); } catch (e) { return null; }
  }
  function storeTheme(v) {
    try { localStorage.setItem('tariqqa-theme', v); } catch (e) { /* ignore */ }
  }
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var attr = root.getAttribute('data-theme');
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = attr === 'dark' || (!attr && prefersDark);
      var next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      storeTheme(next);
    });
  }
  var initial = storedTheme();
  if ((initial === 'dark' || initial === 'light') && !root.getAttribute('data-theme')) {
    root.setAttribute('data-theme', initial);
  }

  /* ---------------------------------------------------------------------
     4. Scroll reveal
     --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function revealNow(all) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    Array.prototype.forEach.call(revealEls, function (el) {
      if (el.classList.contains('in-view')) { return; }
      if (all || el.getBoundingClientRect().top < vh) { el.classList.add('in-view'); }
    });
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(revealEls, function (el) { revealObserver.observe(el); });
    // Deep links such as index.html#data and browsers that delay observer
    // callbacks: show whatever is already on screen (or above it) right away.
    revealNow(false);
    window.addEventListener('load', function () { revealNow(false); });
    window.addEventListener('hashchange', function () { setTimeout(function () { revealNow(false); }, 50); });
  } else {
    revealNow(true);
  }

  /* ---------------------------------------------------------------------
     5. "Take the test" quiz (sample questions from the dataset)
     --------------------------------------------------------------------- */
  var QUIZ = [
    { lang: 'MSA', dir: 'rtl',
      q: 'أولوية المرور عند تقاطع بدون إشارات؟',
      opts: ['السيارات من اليمين', 'السيارات من اليسار', 'السيارات الكبيرة فقط'], ans: 'A' },
    { lang: 'Darija', dir: 'rtl',
      q: 'واش يمكن التجاوز من اليمين؟',
      opts: ['لا', 'نعم', 'نعم، إلا كانت الطريق واسعة'], ans: 'A' },
    { lang: 'English', dir: 'ltr',
      q: 'What is the point deduction for a driver who fails to respect a stop sign or a red light signal?',
      opts: ['6 points', '4 points', '2 points'], ans: 'B' },
    { lang: 'Legal · MSA', dir: 'rtl',
      q: 'تعتبر مخالفة من الدرجة الثانية إذا تم تجاوز السرعة القصوى المسموح بها بمدى يتراوح بين:',
      opts: ['عشرة (10) إلى أقل من عشرين (20) كلم في الساعة', 'ثلاثين (30) إلى أقل من أربعين (40) كلم في الساعة', 'عشرين (20) إلى أقل من ثلاثين (30) كلم في الساعة'], ans: 'C' },
    { lang: 'MSA', dir: 'rtl',
      q: 'ما هو الرصيد الأقصى من النقط الذي يخصص لرخصة السياقة عند انتهاء الفترة الاختبارية بنجاح؟',
      opts: ['20 نقطة', '40 نقطة', '30 نقطة'], ans: 'C' },
    { lang: 'Darija', dir: 'rtl',
      q: 'شنو تدير إذا شفت خط مستمر وخط متقطع جنب بعض؟',
      opts: ['يمنع التجاوز نهائياً من الجهتين لوجود الخط المستمر.', 'يمكنك التجاوز من جهة الخط المتقطع فقط.', 'يمكنك التجاوز من الجهتين طالما أن الطريق خالية.'], ans: 'B' },
    { lang: 'English', dir: 'ltr',
      q: 'According to Article 185, what is the fine for committing a second-class violation?',
      opts: ['200 to 400 dirhams', '1,200 to 2,000 dirhams', '500 to 1,000 dirhams'], ans: 'C' },
    { lang: 'MSA', dir: 'rtl',
      q: 'ما هو الأجل المحدد لصاحب رخصة السياقة لإشعار الإدارة بكل تغيير يطرأ على عنوانه؟',
      opts: ['داخل ثلاثة أشهر من وقوع التغيير', 'داخل شهر واحد من وقوع التغيير', 'داخل شهرين من وقوع التغيير'], ans: 'B' },
    { lang: 'Legal · MSA', dir: 'rtl',
      q: 'ما هي عقوبة الحبس المقررة للقتل غير العمدي الناتج عن حادثة سير حسب المادة 172؟',
      opts: ['من شهر واحد إلى سنتين', 'من ثلاثة أشهر إلى خمس سنوات', 'من سنة إلى عشر سنوات'], ans: 'B' },
    { lang: 'Darija', dir: 'rtl',
      q: 'شنو تدير إذا صادفت حيوان على الطريق؟',
      opts: ['قلل السرعة، وحاول التوقف بأمان.', 'استعمل المنبه الصوتي بقوة، وحاول إبعاده عن الطريق.', 'غير مسار السيارة بسرعة، لتفادي الاصطدام بالحيوان.'], ans: 'A' },
    { lang: 'MSA', dir: 'rtl',
      q: 'ما هي مدة صلاحية شهادة التأمين بالمغرب؟',
      opts: ['عادة تكون مدة صلاحية شهادة التأمين سنة واحدة، ويجب تجديدها قبل انتهاءها.', 'تمتد صلاحية شهادة التأمين عادة لسنتين، ويتم تجديدها تلقائياً عند أداء أقساط التأمين السنوية.', 'تظل شهادة التأمين صالحة لمدة ستة أشهر فقط، ويتوجب الحصول على شهادة جديدة بعد كل فحص تقني للمركبة.'], ans: 'A' }
  ];

  var quiz = document.getElementById('quiz');
  if (quiz) {
    var LETTERS = ['A', 'B', 'C'];
    var qMain = quiz.querySelector('.quiz-main');
    var qTag = quiz.querySelector('#quiz-tag');
    var qProgress = quiz.querySelector('#quiz-progress');
    var qText = quiz.querySelector('#quiz-q');
    var qOpts = quiz.querySelector('#quiz-opts');
    var qNext = quiz.querySelector('#quiz-next');
    var qRestart = quiz.querySelector('#quiz-restart');
    var qFeedback = quiz.querySelector('#quiz-feedback');
    var qLight = quiz.querySelector('#quiz-light');
    var qScore = quiz.querySelector('#quiz-score');
    var index = 0, score = 0, answered = 0, locked = false;

    function setLight(state) {
      qLight.classList.remove('is-red', 'is-amber', 'is-green');
      if (state) { qLight.classList.add('is-' + state); }
    }

    function render() {
      var item = QUIZ[index];
      locked = false;
      qMain.setAttribute('dir', item.dir);
      qMain.classList.toggle('is-rtl', item.dir === 'rtl');
      qTag.textContent = item.lang;
      qProgress.textContent = 'Question ' + (index + 1) + ' of ' + QUIZ.length;
      qText.textContent = item.q;
      qFeedback.textContent = '';
      qFeedback.className = 'quiz-feedback';
      qOpts.innerHTML = '';
      item.opts.forEach(function (text, i) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt';
        btn.setAttribute('data-letter', LETTERS[i]);
        btn.innerHTML = '<span class="k">' + LETTERS[i] + '</span><span class="t"></span>';
        btn.querySelector('.t').textContent = text;
        btn.addEventListener('click', function () { answer(LETTERS[i], btn); });
        li.appendChild(btn);
        qOpts.appendChild(li);
      });
      qNext.disabled = true;
      setLight('amber');
      updateScore();
    }

    function answer(letter, btn) {
      if (locked) { return; }
      locked = true;
      answered += 1;
      var item = QUIZ[index];
      var correct = letter === item.ans;
      if (correct) { score += 1; }
      Array.prototype.forEach.call(qOpts.querySelectorAll('.opt'), function (b) {
        b.disabled = true;
        if (b.getAttribute('data-letter') === item.ans) { b.classList.add('correct'); }
      });
      if (!correct) { btn.classList.add('wrong'); }
      setLight(correct ? 'green' : 'red');
      qFeedback.textContent = correct
        ? 'Correct. Green light!'
        : 'Not quite. The correct answer is ' + item.ans + '.';
      qFeedback.className = 'quiz-feedback ' + (correct ? 'ok' : 'ko');
      qNext.disabled = false;
      updateScore();
      if (index === QUIZ.length - 1) { qNext.textContent = 'See your result'; }
    }

    function updateScore() {
      qScore.textContent = score + ' / ' + answered;
    }

    function finish() {
      var pct = answered ? Math.round(100 * score / answered) : 0;
      qMain.setAttribute('dir', 'ltr');
      qMain.classList.remove('is-rtl');
      qTag.textContent = 'Result';
      qProgress.textContent = 'Test complete';
      qText.textContent = score + ' correct out of ' + answered + ' (' + pct + '%). ' +
        (pct >= 80 ? 'Licence granted. Now build a system that does the same.'
                   : 'The Highway Code is harder than it looks. Can your model do better?');
      qOpts.innerHTML = '';
      qFeedback.textContent = '';
      qNext.disabled = true;
      setLight(pct >= 80 ? 'green' : 'red');
    }

    qNext.addEventListener('click', function () {
      if (index < QUIZ.length - 1) { index += 1; render(); }
      else { finish(); }
    });
    qRestart.addEventListener('click', function () {
      index = 0; score = 0; answered = 0;
      qNext.textContent = 'Next question';
      render();
    });
    render();
  }

  /* ---------------------------------------------------------------------
     6. Organizers, generated from assets/organizers.csv
        Displays first_name, last_name, role, and affiliation.
        Note: browsers block fetch() on file:// pages, so preview the site
        through a web server (python -m http.server) or on GitHub Pages.
     --------------------------------------------------------------------- */
  function parseCSV(text) {
    var rows = [], row = [], field = '', inQuotes = false, c, i;
    text = text.replace(/^\uFEFF/, '');
    for (i = 0; i < text.length; i++) {
      c = text.charAt(i);
      if (inQuotes) {
        if (c === '"') {
          if (text.charAt(i + 1) === '"') { field += '"'; i++; } else { inQuotes = false; }
        } else { field += c; }
      } else if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text.charAt(i + 1) === '\n') { i++; }
        row.push(field); rows.push(row); row = []; field = '';
      } else { field += c; }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    if (!rows.length) { return []; }
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1)
      .filter(function (r) { return r.some(function (v) { return v.trim() !== ''; }); })
      .map(function (r) {
        if (r.length !== head.length && window.console) {
          console.warn('organizers.csv: row has ' + r.length + ' fields but the header has ' + head.length + ':', r.join(','));
        }
        var o = {};
        head.forEach(function (h, k) { o[h] = (r[k] || '').trim(); });
        return o;
      });
  }

  function textDiv(cls, text) {
    var d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    return d;
  }

  function personCard(p) {
    var fullName = [p.first_name, p.last_name].filter(Boolean).join(' ');
    var card = document.createElement('div');
    card.className = 'person reveal';
    card.appendChild(textDiv('name', fullName));
    if (p.role) { card.appendChild(textDiv('role', p.role)); }
    if (p.affiliation) { card.appendChild(textDiv('aff', p.affiliation)); }
    return card;
  }

  var peopleBox = document.getElementById('organizers-list');
  if (peopleBox) {
    var showPeopleMsg = function (msg) {
      peopleBox.innerHTML = '';
      var m = document.createElement('p');
      m.className = 'people-msg';
      m.textContent = msg;
      peopleBox.appendChild(m);
    };
    var csvPath = cfg.organizersCsv || peopleBox.getAttribute('data-src') || 'assets/organizers.csv';
    var loadFailed = function () {
      showPeopleMsg(location.protocol === 'file:'
        ? 'The organizer list cannot load from a local file. Preview the site through a web server (python -m http.server) or on GitHub Pages.'
        : 'The organizer list could not be loaded. Please try again later.');
    };
    if (!window.fetch) {
      loadFailed();
    } else {
      fetch(csvPath, { cache: 'no-cache' })
        .then(function (r) {
          if (!r.ok) { throw new Error('HTTP ' + r.status); }
          return r.text();
        })
        .then(function (text) {
          var people = parseCSV(text).filter(function (p) { return p.first_name || p.last_name; });
          if (!people.length) { showPeopleMsg('Organizers will be announced soon.'); return; }
          peopleBox.innerHTML = '';
          people.forEach(function (p) {
            var card = personCard(p);
            peopleBox.appendChild(card);
            if (revealObserver) { revealObserver.observe(card); } else { card.classList.add('in-view'); }
          });
        })
        .catch(loadFailed);
    }
  }

  /* ---------------------------------------------------------------------
     7. Current year in the footer
     --------------------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
