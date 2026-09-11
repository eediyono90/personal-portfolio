(function () {
  var STRINGS = {
    en: {
      about: 'About', work: 'Work Experience', projects: 'Projects',
      contact: 'Contact', education: 'Education', skills: 'Skills', languages: 'Languages',
      footer: 'Generated from JSON Resume.', loading: 'Loading…',
    },
    zh: {
      about: '个人简介', work: '工作经历', projects: '项目经历',
      contact: '联系方式', education: '教育背景', skills: '专业技能', languages: '语言能力',
      footer: '基于 JSON Resume 生成。', loading: '加载中…',
    },
  };

  var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function formatDate(dateStr, lang) {
    if (!dateStr) return lang === 'zh' ? '至今' : 'Present';
    var parts = dateStr.split('-');
    var y = parts[0], m = parseInt(parts[1], 10);
    return lang === 'zh' ? (y + '年' + m + '月') : (MONTHS_EN[m - 1] + ' ' + y);
  }

  function dateRange(item, lang) {
    var start = formatDate(item.startDate, lang);
    var end = item.endDate ? formatDate(item.endDate, lang) : (lang === 'zh' ? '至今' : 'Present');
    return start + ' – ' + end;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(data, lang) {
    var t = STRINGS[lang];
    var root = document.getElementById('resume');
    root.innerHTML = '';

    // Header
    var header = el('div', 'r-header');
    header.appendChild(el('h1', null, esc(data.basics.name)));
    header.appendChild(el('div', 'r-title', esc(data.basics.label)));
    var contact = el('div', 'r-contact');
    var loc = data.basics.location && (data.basics.location.city || '');
    if (loc) contact.appendChild(el('span', null, esc(loc)));
    if (data.basics.email) contact.appendChild(el('a', null, esc(data.basics.email))).href = 'mailto:' + data.basics.email;
    if (data.basics.phone) contact.appendChild(el('span', null, esc(data.basics.phone)));
    (data.basics.profiles || []).forEach(function (p) {
      var a = el('a', null, esc(p.network) + ': ' + esc(p.username));
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      contact.appendChild(a);
    });
    header.appendChild(contact);
    header.appendChild(el('hr'));
    root.appendChild(header);

    // About
    if (data.basics.summary) {
      var about = el('div', 'r-box');
      about.appendChild(el('h2', null, esc(t.about)));
      about.appendChild(el('p', 'r-summary', esc(data.basics.summary)));
      root.appendChild(about);
    }

    // Work
    if (data.work && data.work.length) {
      var work = el('div', 'r-box');
      work.appendChild(el('h2', null, esc(t.work)));
      data.work.forEach(function (job) {
        var j = el('div', 'r-job');
        var head = el('div', 'r-job-head');
        head.appendChild(el('span', 'r-job-where', esc(job.name) + (job.location ? ' — ' + esc(job.location) : '')));
        head.appendChild(el('span', 'r-job-date', dateRange(job, lang)));
        j.appendChild(head);
        j.appendChild(el('div', 'r-job-position', esc(job.position)));
        if (job.highlights && job.highlights.length) {
          var ul = el('ul');
          job.highlights.forEach(function (h) { ul.appendChild(el('li', null, esc(h))); });
          j.appendChild(ul);
        }
        work.appendChild(j);
      });
      root.appendChild(work);
    }

    // Projects
    if (data.projects && data.projects.length) {
      var proj = el('div', 'r-box r-projects');
      proj.appendChild(el('h2', null, esc(t.projects)));
      var pul = el('ul');
      data.projects.forEach(function (p) {
        var li = el('li');
        li.appendChild(el('span', 'r-proj-name', esc(p.name)));
        li.appendChild(document.createTextNode(': ' + p.description));
        if (p.url) {
          var a = el('a', 'r-proj-link', lang === 'zh' ? '查看 →' : 'View →');
          a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
          li.appendChild(a);
        }
        pul.appendChild(li);
      });
      proj.appendChild(pul);
      root.appendChild(proj);
    }

    // Education
    if (data.education && data.education.length) {
      var edu = el('div', 'r-box');
      edu.appendChild(el('h2', null, esc(t.education)));
      data.education.forEach(function (e) {
        var item = el('div', 'r-edu-item');
        item.appendChild(el('div', 'r-edu-year', dateRange(e, lang)));
        var body = el('div', 'r-edu-body');
        body.appendChild(el('h3', null, esc(e.institution)));
        body.appendChild(el('p', null, esc(e.studyType) + (e.area ? ' — ' + esc(e.area) : '')));
        item.appendChild(body);
        edu.appendChild(item);
      });
      root.appendChild(edu);
    }

    // Skills
    if (data.skills && data.skills.length) {
      var sk = el('div', 'r-box');
      sk.appendChild(el('h2', null, esc(t.skills)));
      data.skills.forEach(function (g) {
        var grp = el('div', 'r-skills-group');
        grp.appendChild(el('h4', null, esc(g.name)));
        (g.keywords || []).forEach(function (k) {
          grp.appendChild(el('span', 'r-badge', esc(k)));
        });
        sk.appendChild(grp);
      });
      root.appendChild(sk);
    }

    // Languages
    if (data.languages && data.languages.length) {
      var langBox = el('div', 'r-box');
      langBox.appendChild(el('h2', null, esc(t.languages)));
      data.languages.forEach(function (l) {
        var row = el('div', 'r-lang-row');
        row.appendChild(el('span', null, esc(l.language)));
        row.appendChild(el('span', 'r-lang-badge', esc(l.fluency)));
        langBox.appendChild(row);
      });
      root.appendChild(langBox);
    }

    document.title = data.basics.name + ' — ' + data.basics.label;
    document.querySelectorAll('[data-i18n="footer-note"]').forEach(function (n) { n.textContent = t.footer; });
  }

  var cache = {};
  function load(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('assets/resume.' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { cache[lang] = d; return d; });
  }

  function setLang(lang) {
    document.getElementById('lang-en').setAttribute('aria-pressed', String(lang === 'en'));
    document.getElementById('lang-zh').setAttribute('aria-pressed', String(lang === 'zh'));
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('cv-lang', lang);
    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    load(lang).then(function (data) { render(data, lang); });
  }

  document.getElementById('lang-en').addEventListener('click', function () { setLang('en'); });
  document.getElementById('lang-zh').addEventListener('click', function () { setLang('zh'); });

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('lang') || localStorage.getItem('cv-lang') || 'en';
  if (initial !== 'en' && initial !== 'zh') initial = 'en';
  setLang(initial);
})();
