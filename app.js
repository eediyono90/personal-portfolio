(function () {
  var STRINGS = {
    en: {
      about: 'About', work: 'Work Experience', projects: 'Projects',
      contact: 'Contact', education: 'Education', skills: 'Skills', languages: 'Languages',
    },
    zh: {
      about: '个人简介', work: '工作经历', projects: '项目经历',
      contact: '联系方式', education: '教育背景', skills: '专业技能', languages: '语言能力',
    },
  };

  var SECTION_ICON = {
    about: 'fa-solid fa-user', work: 'fa-solid fa-briefcase', projects: 'fa-solid fa-code-branch',
    contact: 'fa-solid fa-bullseye', education: 'fa-solid fa-graduation-cap',
    skills: 'fa-solid fa-list-check', languages: 'fa-solid fa-language',
  };

  var NETWORK_ICON = { GitHub: 'fa-brands fa-github', LinkedIn: 'fa-brands fa-linkedin' };

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

  function boxHeading(key, t) {
    return '<i class="' + SECTION_ICON[key] + '"></i> ' + esc(t[key]);
  }

  function render(data, lang) {
    var t = STRINGS[lang];
    var root = document.getElementById('resume');
    root.innerHTML = '';

    // Header
    var header = el('div', 'r-header');
    header.appendChild(el('h1', null, esc(data.basics.name)));
    header.appendChild(el('div', 'r-title', esc(data.basics.label)));
    header.appendChild(el('hr'));
    root.appendChild(header);

    var grid = el('div', 'r-grid');
    var main = el('div', 'r-main');
    var sidebar = el('div', 'r-sidebar');

    // About (main)
    if (data.basics.summary) {
      var about = el('div', 'r-box');
      about.appendChild(el('h2', null, boxHeading('about', t)));
      about.appendChild(el('p', 'r-summary', esc(data.basics.summary)));
      main.appendChild(about);
    }

    // Work (main)
    if (data.work && data.work.length) {
      var work = el('div', 'r-box');
      work.appendChild(el('h2', null, boxHeading('work', t)));
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
      main.appendChild(work);
    }

    // Projects (main)
    if (data.projects && data.projects.length) {
      var proj = el('div', 'r-box r-projects');
      proj.appendChild(el('h2', null, boxHeading('projects', t)));
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
      main.appendChild(proj);
    }

    // Contact (sidebar)
    var contactBox = el('div', 'r-box');
    contactBox.appendChild(el('h2', null, boxHeading('contact', t)));
    var cul = el('ul', 'r-contact-list');
    var loc = data.basics.location && data.basics.location.city;
    if (loc) {
      var li0 = el('li');
      li0.appendChild(el('span', 'r-contact-icon', '<i class="fa-solid fa-location-dot"></i>'));
      li0.appendChild(el('span', null, esc(loc)));
      cul.appendChild(li0);
    }
    if (data.basics.phone) {
      var li1 = el('li');
      li1.appendChild(el('span', 'r-contact-icon', '<i class="fa-solid fa-phone"></i>'));
      li1.appendChild(el('span', null, esc(data.basics.phone)));
      cul.appendChild(li1);
    }
    if (data.basics.email) {
      var li2 = el('li');
      li2.appendChild(el('span', 'r-contact-icon', '<i class="fa-solid fa-envelope"></i>'));
      var a2 = el('a', null, esc(data.basics.email)); a2.href = 'mailto:' + data.basics.email;
      li2.appendChild(a2);
      cul.appendChild(li2);
    }
    (data.basics.profiles || []).forEach(function (p) {
      var li = el('li');
      li.appendChild(el('span', 'r-contact-icon', '<i class="' + (NETWORK_ICON[p.network] || 'fa-solid fa-link') + '"></i>'));
      var a = el('a', null, esc(p.username));
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      li.appendChild(a);
      cul.appendChild(li);
    });
    contactBox.appendChild(cul);
    sidebar.appendChild(contactBox);

    // Education (sidebar)
    if (data.education && data.education.length) {
      var edu = el('div', 'r-box');
      edu.appendChild(el('h2', null, boxHeading('education', t)));
      data.education.forEach(function (e) {
        var item = el('div', 'r-edu-item');
        item.appendChild(el('div', 'r-edu-year', dateRange(e, lang)));
        var body = el('div', 'r-edu-body');
        body.appendChild(el('h3', null, esc(e.institution)));
        body.appendChild(el('p', null, esc(e.studyType) + (e.area ? ' — ' + esc(e.area) : '')));
        item.appendChild(body);
        edu.appendChild(item);
      });
      sidebar.appendChild(edu);
    }

    // Skills (sidebar)
    if (data.skills && data.skills.length) {
      var sk = el('div', 'r-box');
      sk.appendChild(el('h2', null, boxHeading('skills', t)));
      data.skills.forEach(function (g) {
        var grp = el('div', 'r-skills-group');
        grp.appendChild(el('h4', null, esc(g.name)));
        (g.keywords || []).forEach(function (k) {
          grp.appendChild(el('span', 'r-badge', esc(k)));
        });
        sk.appendChild(grp);
      });
      sidebar.appendChild(sk);
    }

    // Languages (sidebar)
    if (data.languages && data.languages.length) {
      var langBox = el('div', 'r-box');
      langBox.appendChild(el('h2', null, boxHeading('languages', t)));
      data.languages.forEach(function (l) {
        var row = el('div', 'r-lang-row');
        row.appendChild(el('span', null, esc(l.language)));
        row.appendChild(el('span', 'r-lang-badge', esc(l.fluency)));
        langBox.appendChild(row);
      });
      sidebar.appendChild(langBox);
    }

    grid.appendChild(main);
    grid.appendChild(sidebar);
    root.appendChild(grid);

    document.title = data.basics.name + ' — ' + data.basics.label;
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
