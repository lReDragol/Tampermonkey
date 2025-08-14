// ==UserScript==
// @name         Deeper Tools
// @description  Набор инструментов для Deeper.
// @namespace    http://tampermonkey.net/
// @version      3.9.1
// @author       https://github.com/lReDragol
// @icon         https://avatars.mds.yandex.net/get-socsnippets/10235467/2a0000019509580bc84108597cea65bc46ee/square_83
// @match        http://34.34.34.34/*
// @match        http://11.22.33.44/*
// @match        *://*/*
// @license      MIT
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  const ALLOWED_HOSTS = new Set(['34.34.34.34', '11.22.33.44']);
  const isAllowedHost = () => location.protocol === 'http:' && ALLOWED_HOSTS.has(location.hostname);

  const palettes = {
    default: {},
    green: {
      '--bg-primary': '#2a2a2a',
      '--bg-secondary': '#383838',
      '--bg-tertiary': '#454545',
      '--text-primary': '#d0f4d0',
      '--text-secondary': '#b0e8b0',
      '--text-muted': '#8ac48a',
      '--accent': '#4caf50',
      '--border-primary': '#4d4d4d',
      '--border-light': '#777777',
      '--hover-bg': '#505050',
      '--active-bg': '#626262',
      '--highlight': '#6ee76e',
      '--disabled-bg': '#2f2f2f'
    },
    red: {
      '--bg-primary': '#2b1a1a',
      '--bg-secondary': '#3d1f1f',
      '--bg-tertiary': '#502525',
      '--text-primary': '#ffe6e6',
      '--text-secondary': '#ffb3b3',
      '--text-muted': '#cc7f7f',
      '--accent': '#ff4d4d',
      '--border-primary': '#661010',
      '--border-light': '#993333',
      '--hover-bg': '#661515',
      '--active-bg': '#7a1a1a',
      '--highlight': '#ff7f7f',
      '--disabled-bg': '#2f1c1c'
    },
    purple: {
      '--bg-primary': '#1a1a2a',
      '--bg-secondary': '#28283a',
      '--bg-tertiary': '#35354b',
      '--text-primary': '#c0c0e8',
      '--text-secondary': '#9e9ede',
      '--text-muted': '#8a8abf',
      '--accent': '#e0e0f8',
      '--border-primary': '#3d3d4d',
      '--border-light': '#777787',
      '--hover-bg': '#505050',
      '--active-bg': '#626262',
      '--highlight': '#8f8fdf',
      '--disabled-bg': '#2f2f2f'
    }
  };

  const themeNames = Object.keys(palettes);
  let currentThemeIndex = GM_getValue('deeperThemeIndex', 0);

  const CSS_BASE = `
    * { background: transparent !important; color: var(--text-primary) !important; border-color: var(--border-primary) !important; }
    *::before, *::after { background: transparent !important; }
    html, body, [class*="bg-"], [style*="background"] { background-color: var(--bg-primary) !important; background-image: none !important; }
    h1, h2, h3, h4, h5, h6, p, span, label, div, li { color: var(--text-primary) !important; }
    a, a * { color: var(--accent) !important; }
    table, thead, tbody, tr, th, td { background: var(--bg-tertiary) !important; color: var(--text-primary) !important; border-color: var(--border-primary) !important; }
    button, input, select, textarea, .ant-btn, .ant-input, .ant-select-selector, .ant-input-affix-wrapper {
      background: var(--bg-secondary) !important; color: var(--text-primary) !important; border: 1px solid var(--border-light) !important;
    }
    button:hover, .ant-btn:hover, input:hover, select:hover, textarea:hover, .ant-input:hover, .ant-select-selector:hover {
      background: var(--hover-bg) !important;
    }
    button:active, .ant-btn:active { background: var(--active-bg) !important; }
    button[disabled], input[disabled], select[disabled], textarea[disabled], .ant-btn[disabled], .ant-input[disabled] {
      background: var(--disabled-bg) !important; color: var(--text-muted) !important; cursor: not-allowed !important; opacity: 0.6 !important;
    }
    .ant-layout, .ant-layout-header, .ant-layout-sider, .ant-layout-content, .ant-layout-footer {
      background: var(--bg-primary) !important; color: var(--text-primary) !important;
    }
    .ant-card, .card, .panel { background: var(--bg-tertiary) !important; box-shadow: none !important; color: var(--text-primary) !important; }
    .ant-menu, .ant-menu-item, .ant-menu-submenu, .ant-menu-item-group-title {
      background: var(--bg-secondary) !important; color: var(--text-primary) !important;
    }
    .ant-modal-content, .ant-popover-inner-content, .ant-popover-title {
      background: var(--bg-secondary) !important; color: var(--text-primary) !important; border-color: var(--border-primary) !important;
    }
    .ant-tooltip-inner { background: var(--bg-secondary) !important; color: var(--text-primary) !important; }
    .ant-tabs-nav, .ant-tabs-tab, .ant-tabs-tab-active, .ant-tabs-content-holder {
      background: var(--bg-secondary) !important; color: var(--text-primary) !important;
    }
    .ant-tag, .ant-tag-green, .ant-badge-status-success, .ant-badge-status-default {
      background: var(--bg-tertiary) !important; color: var(--text-primary) !important;
    }
    .anticon, .anticon svg { color: var(--accent) !important; fill: var(--accent) !important; }
    ::-webkit-scrollbar { width: 8px; background: var(--bg-secondary); }
    ::-webkit-scrollbar-thumb { background: var(--border-primary); border-radius: 4px; }
    ::selection { background: var(--highlight) !important; color: var(--bg-primary) !important; }
    .tm-sticky-controls { position: sticky; bottom: 0; z-index: 999; background: var(--bg-secondary); padding: 8px; display: flex; justify-content: space-between; align-items: center; }
    .page-list-container { margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .page-list-item { position: relative; padding: 1rem 3rem 1rem 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 0.5rem; }
    .page-list-item .delete-button { position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; color: var(--text-secondary); font-size: 1.25rem; line-height: 1; cursor: pointer; }
    .page-list-item .delete-button:hover { color: var(--accent); }
  `;

  function applyTheme(idx) {
    GM_setValue('deeperThemeIndex', idx);
    const styleId = 'deeper-theme-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    const name = themeNames[idx];
    if (name === 'default') {
      styleEl.textContent = '';
    } else {
      const pal = palettes[name];
      const vars = Object.entries(pal).map(([k, v]) => `${k}: ${v};`).join('\n');
      styleEl.textContent = `:root { ${vars} } ${CSS_BASE}`;
    }
  }
  if (isAllowedHost()) applyTheme(currentThemeIndex);

  /* ---------------------------------
   * Утилиты
   * --------------------------------- */
  function gmFetch(url, init = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: init.method || 'GET',
        url,
        headers: init.headers || {},
        data: init.body || null,
        timeout: init.timeout || 30000,
        onload: function (response) {
          response.json = () => Promise.resolve(JSON.parse(response.responseText || 'null'));
          resolve(response);
        },
        onerror: reject,
        ontimeout: () => reject(new Error('GM_xmlhttpRequest: timeout'))
      });
    });
  }

  const PAGING = { SIZE: 100, MAX_PAGES: 500 };
  const isTargetEndpoint = (p) =>
    p === '/api/smartRoute/getRoutingWhitelist/domain' ||
    p === '/api/smartRoute/getRoutingBlacklist/domain';

  function mustAggregateUrl(urlStr, method = 'GET') {
    if (!isAllowedHost()) return false;
    try {
      const u = new URL(urlStr, location.href);
      if (!isTargetEndpoint(u.pathname)) return false;
      if (u.searchParams.get('__tm_bypass_all') === '1') return false;
      return String(method || 'GET').toUpperCase() === 'GET';
    } catch { return false; }
  }

  async function fetchAllPagesViaFetch(origFetch, baseUrl, init) {
    const all = [];
    let pageNo = 1;
    while (pageNo <= PAGING.MAX_PAGES) {
      const u = new URL(baseUrl);
      u.searchParams.set('pageNo', String(pageNo));
      u.searchParams.set('pageSize', String(PAGING.SIZE));
      u.searchParams.set('__tm_bypass_all', '1');

      const r = await origFetch(u.toString(), init);
      const d = await r.json();
      const list = Array.isArray(d.list) ? d.list : [];
      if (list.length) all.push(...list);
      if (list.length < PAGING.SIZE) return { template: d, list: all };
      pageNo++;
    }
    return { template: {}, list: all };
  }

  function dedupList(list) {
    const seen = new Set();
    const out = [];
    for (const it of list) {
      const key = it?.id ?? it?.domain ?? it?.domainName ?? JSON.stringify(it);
      if (!seen.has(key)) { seen.add(key); out.push(it); }
    }
    return out;
  }

  function defineRO(obj, prop, val) {
    try { Object.defineProperty(obj, prop, { configurable: true, get: () => val }); } catch {}
  }

  function injectListCSS() {
    if (!isAllowedHost()) return;
    if (document.getElementById('dc-long-list-style')) return;
    const style = document.createElement('style');
    style.id = 'dc-long-list-style';
    style.textContent = `
      .ant-table-body, .ant-table-content, .ant-spin-nested-loading, .ant-spin-container {
        max-height: none !important;
        overflow: visible !important;
      }
      .ant-table table { table-layout: auto !important; }
    `;
    document.documentElement.appendChild(style);
  }

  function placeSearchNearLeftButtons() {
    if (!isAllowedHost()) return;
    if (document.getElementById('dc-domain-search')) return;

    const addBtns = Array.from(document.querySelectorAll('button, .ant-btn'))
      .filter(b => /Добавить/i.test(b.textContent || ''));
    if (!addBtns.length) return;

    const leftAddBtn = addBtns
      .map(b => ({ b, x: b.getBoundingClientRect().left }))
      .sort((a, b) => a.x - b.x)[0]?.b;
    if (!leftAddBtn) return;

    let row = leftAddBtn;
    for (let i = 0; i < 7 && row; i++) {
      row = row.parentElement;
      if (!row) break;
      const hasImport = !!Array.from(row.querySelectorAll('button, .ant-btn'))
        .find(x => /Импорт/i.test(x.textContent || ''));
      const hasExport = !!Array.from(row.querySelectorAll('button, .ant-btn'))
        .find(x => /Экспорт/i.test(x.textContent || ''));
      if (hasImport && hasExport) break;
    }
    if (!row) return;

    const input = document.createElement('input');
    input.id = 'dc-domain-search';
    input.type = 'text';
    input.placeholder = 'Поиск доменов...';
    Object.assign(input.style, {
      height: '40px',
      padding: '0 12px',
      border: '1px solid rgba(0,0,0,.25)',
      borderRadius: '8px',
      marginRight: '8px',
      minWidth: '280px',
      flex: '0 0 auto',
      outline: 'none'
    });

    const leftCard = row.closest('.ant-card, [class*="card"]') || document.body;
    const applyFilter = () => {
      const q = input.value.trim().toLowerCase();
      const tbody = leftCard.querySelector('tbody');
      if (!tbody) return;
      tbody.querySelectorAll('tr').forEach(tr => {
        const text = (tr.textContent || '').toLowerCase();
        tr.style.display = !q || text.includes(q) ? '' : 'none';
      });
    };
    input.addEventListener('input', applyFilter);
    row.insertBefore(input, leftAddBtn);

    const tbody = leftCard.querySelector('tbody');
    if (tbody) new MutationObserver(() => applyFilter()).observe(tbody, { childList: true, subtree: true });
  }

  function bootDomainPageHelpers() {
    injectListCSS();
    placeSearchNearLeftButtons();
  }

  /* ======================================================================
   * Domain Scanner — ГЛОБАЛЬНЫЙ (доступен везде через пункт меню)
   * ====================================================================== */

  function getScannerEnabled() { return GM_getValue('domainScannerEnabled', false); }
  function setScannerEnabled(val) {
    GM_setValue('domainScannerEnabled', val);
    updateScannerMenuCommand();
    if (!val) {
      const c = document.getElementById('domain-scanner-container');
      if (c) c.remove();
    } else {
      ensureScannerContainer();
    }
    console.log('[Deeper Tools] Domain Scanner: ' + (val ? 'ON' : 'OFF'));
  }

  // Перехват XHR
  const nativeOpen = XMLHttpRequest.prototype.open;
  const nativeSend = XMLHttpRequest.prototype.send;
  const nativeSetRH = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._method = method;
    this._headers = {};
    try { this._urlObj = new URL(url, location.href); } catch (_) { this._urlObj = null; }
    if (getScannerEnabled() && this._urlObj) { try { addDomain(this._urlObj.hostname); } catch {} }
    return nativeOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
    try { if (!this._headers) this._headers = {}; this._headers[k] = v; } catch {}
    return nativeSetRH.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    // Сохранение пароля из /api/admin/login
    try {
      if (
        this._urlObj &&
        isAllowedHost() &&
        this._urlObj.pathname.startsWith('/api/admin/login') &&
        String(this._method || '').toUpperCase() === 'POST'
      ) {
        if (typeof body === 'string') {
          try {
            const p = JSON.parse(body);
            if (p && p.password && !GM_getValue('adminPassword')) {
              GM_setValue('adminPassword', p.password);
              console.log('[Deeper Tools] Пароль сохранён из XHR.');
            }
          } catch {}
        }
      }
    } catch {}

    // Агрегатор для whitelist/blacklist через XHR/axios
    if (this._urlObj && mustAggregateUrl(this._urlObj.toString(), this._method)) {
      const base = new URL(this._urlObj.toString(), location.href);
      base.searchParams.set('pageNo', '1');
      base.searchParams.set('pageSize', String(PAGING.SIZE));

      fetchAllPagesViaFetch(window.fetch.bind(window), base, {
        credentials: 'include',
        headers: this._headers || {}
      }).then(({ template, list }) => {
        const deduped = dedupList(list);
        const payloadObj = { ...template, list: deduped, total: deduped.length };
        const text = JSON.stringify(payloadObj);

        // эмулируем ответ XHR
        defineRO(this, 'readyState', 4);
        defineRO(this, 'status', 200);
        defineRO(this, 'responseURL', base.toString());
        if (this.responseType === 'json') {
          defineRO(this, 'response', payloadObj);
        } else {
          defineRO(this, 'response', text);
          defineRO(this, 'responseText', text);
        }
        try { if (typeof this.onreadystatechange === 'function') this.onreadystatechange(new Event('readystatechange')); } catch {}
        try { if (typeof this.onload === 'function') this.onload(new Event('load')); } catch {}
        try {
          this.dispatchEvent && this.dispatchEvent(new Event('readystatechange'));
          this.dispatchEvent && this.dispatchEvent(new Event('load'));
          this.dispatchEvent && this.dispatchEvent(new Event('loadend'));
        } catch {}
      }).catch(e => {
        console.error('[Deeper Tools] XHR aggregate error:', e);
        try { nativeSend.apply(this, arguments); } catch {}
      });
      return;
    }

    return nativeSend.apply(this, arguments);
  };

  // Перехват fetch (агрегатор + сканер доменов)
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    // Domain Scanner: подхват доменов
    if (getScannerEnabled()) {
      try {
        const url = (typeof input === 'string') ? input : input.url;
        const u = new URL(url, location.href);
        addDomain(u.hostname);
      } catch {}
    }

    // Агрегатор для whitelist/blacklist
    try {
      const urlStr = typeof input === 'string' ? input : input.url;
      const method = init?.method || (typeof input !== 'string' && input?.method);
      if (mustAggregateUrl(urlStr, method)) {
        const base = new URL(urlStr, location.href);
        base.searchParams.set('pageNo', '1');
        base.searchParams.set('pageSize', String(PAGING.SIZE));
        const headers = (init && init.headers) || {};
        const fInit = { credentials: 'include', headers };
        return fetchAllPagesViaFetch(originalFetch, base, fInit).then(({ template, list }) => {
          const deduped = dedupList(list);
          const payload = { ...template, list: deduped, total: deduped.length };
          return new Response(JSON.stringify(payload), {
            status: 200,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }).catch(e => {
          console.error('[Deeper Tools] fetch aggregate error:', e);
          return originalFetch.apply(this, arguments);
        });
      }
    } catch {}

    return originalFetch.apply(this, arguments);
  };

  // Отслеживание ресурсов, добавленных в DOM (сканер)
  const resObserver = new MutationObserver(mutations => {
    if (!getScannerEnabled()) return;
    for (const m of mutations) {
      if (!m.addedNodes) continue;
      for (const node of m.addedNodes) {
        if (node && node.tagName) {
          const src = node.src || node.href;
          if (src) {
            try { addDomain(new URL(src, location.href).hostname); } catch {}
          }
        }
      }
    }
  });
  resObserver.observe(document.documentElement, { childList: true, subtree: true });

  // По performance timeline (сканер)
  setInterval(() => {
    if (!getScannerEnabled()) return;
    const entries = performance.getEntriesByType('resource') || [];
    for (const entry of entries) {
      try { addDomain(new URL(entry.name, location.href).hostname); } catch {}
    }
  }, 1000);

  // Набор доменов и статус (сканер)
  const domainSet = new Set();
  const domainStatus = new Map(); // domain -> 'testing' | 'ok' | 'blocked'

  function addDomain(domain) {
    if (!domain) return;
    if (!domainSet.has(domain)) {
      domainSet.add(domain);
      domainStatus.set(domain, 'testing');
      testDomainAvailability(domain);
    }
    updateDomainList();
    updateStats();
  }

  async function testDomainAvailability(domain) {
    const schemes = location.protocol === 'https:' ? ['https:', 'http:'] : ['http:', 'https:'];
    for (const scheme of schemes) {
      const ok = await testWithScheme(domain, scheme).catch(() => false);
      if (ok) { domainStatus.set(domain, 'ok'); updateDomainList(); updateStats(); return; }
    }
    domainStatus.set(domain, 'blocked');
    updateDomainList(); updateStats();
  }

  function testWithScheme(domain, scheme) {
    return new Promise((resolve) => {
      const url = scheme + '//' + domain + '/favicon.ico';
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: 7000,
        onload: function (res) {
          const st = res.status || 0;
          resolve(st >= 200 && st < 400);
        },
        onerror: function () { resolve(false); },
        ontimeout: function () { resolve(false); }
      });
    });
  }

  function ensureScannerContainer() {
    if (!getScannerEnabled()) return;
    if (document.getElementById('domain-scanner-container')) return;

    const container = document.createElement('div');
    container.id = 'domain-scanner-container';
    Object.assign(container.style, {
      position: 'fixed', top: '10px', right: '10px', width: '340px', maxHeight: '80vh',
      overflowY: 'auto', backgroundColor: 'white', border: '1px solid black', zIndex: 10000,
      padding: '10px', fontSize: '12px', fontFamily: 'monospace', color: 'black', whiteSpace: 'pre-wrap'
    });

    // Статистика
    const statsBox = document.createElement('div');
    statsBox.id = 'domain-stats';
    statsBox.style.marginBottom = '8px';

    function makeStatRow(labelId, labelText) {
      const wrap = document.createElement('div');
      wrap.style.marginBottom = '6px';

      const label = document.createElement('div');
      label.id = labelId + '-label';
      label.textContent = labelText + ': 0 / 0';
      label.style.marginBottom = '2px';

      const bar = document.createElement('div');
      bar.className = 'progress-outer';
      Object.assign(bar.style, {
        height: '6px', background: '#eee', border: '1px solid #bbb', borderRadius: '3px', overflow: 'hidden'
      });
      const inner = document.createElement('div');
      inner.id = labelId + '-bar';
      Object.assign(inner.style, {
        height: '100%', width: '0%', background: labelId.includes('allowed') ? '#3cba54' : '#db3236'
      });
      bar.appendChild(inner);

      wrap.appendChild(label);
      wrap.appendChild(bar);
      return wrap;
    }

    statsBox.appendChild(makeStatRow('allowed', 'Разрешённые'));
    statsBox.appendChild(makeStatRow('blocked', 'Запрещённые'));
    container.appendChild(statsBox);

    // Список доменов
    const domainList = document.createElement('div');
    domainList.id = 'domain-list';
    container.appendChild(domainList);

    const addBtn = document.createElement('button');
    addBtn.id = 'add-to-deeper-btn';
    addBtn.textContent = 'Добавить в deeper';
    Object.assign(addBtn.style, {
      display: 'block', width: '100%', marginTop: '10px', padding: '6px 10px',
      backgroundColor: '#f8f8f8', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '14px'
    });
    addBtn.addEventListener('click', addToDeeper);
    container.appendChild(addBtn);

    document.body.appendChild(container);
    updateStats();
  }

  function updateDomainList() {
    const container = document.getElementById('domain-scanner-container');
    if (!container) return;
    const listEl = container.querySelector('#domain-list');
    const checked = {};
    listEl.querySelectorAll('.domain-checkbox').forEach(cb => { checked[cb.dataset.domain] = cb.checked; });

    const sortedArr = Array.from(domainSet).sort();
    listEl.innerHTML = '';
    sortedArr.forEach(domain => {
      const row = document.createElement('div');
      Object.assign(row.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' });

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '6px';

      const s = domainStatus.get(domain);
      const icon = document.createElement('span');
      icon.className = 'domain-status-icon';
      icon.textContent = s === 'ok' ? '✅' : (s === 'blocked' ? '❌' : '⏳');

      const t = document.createElement('span');
      t.textContent = domain;

      left.appendChild(icon);
      left.appendChild(t);

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.classList.add('domain-checkbox');
      cb.dataset.domain = domain;
      cb.checked = !!checked[domain];

      row.appendChild(left);
      row.appendChild(cb);
      listEl.appendChild(row);
    });
  }

  function updateStats() {
    const listRoot = document.getElementById('domain-scanner-container');
    if (!listRoot) return;

    let statsBox = document.getElementById('domain-stats');
    if (!statsBox) {
      statsBox = document.createElement('div');
      statsBox.id = 'domain-stats';
      statsBox.style.marginBottom = '8px';

      function makeStatRow(labelId, labelText) {
        const wrap = document.createElement('div');
        wrap.style.marginBottom = '6px';

        const label = document.createElement('div');
        label.id = labelId + '-label';
        label.textContent = labelText + ': 0 / 0';
        label.style.marginBottom = '2px';

        const bar = document.createElement('div');
        bar.className = 'progress-outer';
        Object.assign(bar.style, {
          height: '6px', background: '#eee', border: '1px solid #bbb', borderRadius: '3px', overflow: 'hidden'
        });
        const inner = document.createElement('div');
        inner.id = labelId + '-bar';
        Object.assign(inner.style, {
          height: '100%', width: '0%', background: labelId.includes('allowed') ? '#3cba54' : '#db3236'
        });
        bar.appendChild(inner);

        wrap.appendChild(label);
        wrap.appendChild(bar);
        return wrap;
      }

      statsBox.appendChild(makeStatRow('allowed', 'Разрешённые'));
      statsBox.appendChild(makeStatRow('blocked', 'Запрещённые'));

      const domainList = document.getElementById('domain-list');
      if (domainList && domainList.parentElement) {
        domainList.parentElement.insertBefore(statsBox, domainList);
      } else {
        listRoot.appendChild(statsBox);
      }
    }

    const total = domainSet.size || 0;
    let ok = 0, blocked = 0;
    for (const d of domainSet) {
      const st = domainStatus.get(d);
      if (st === 'ok') ok++;
      else if (st === 'blocked') blocked++;
    }

    const allowedLabel = document.getElementById('allowed-label');
    const blockedLabel = document.getElementById('blocked-label');
    const allowedBar = document.getElementById('allowed-bar');
    const blockedBar = document.getElementById('blocked-bar');

    if (allowedLabel) allowedLabel.textContent = `Разрешённые: ${ok} / ${total}`;
    if (blockedLabel) blockedLabel.textContent = `Запрещённые: ${blocked} / ${total}`;
    const pctOk = total ? Math.round((ok / total) * 100) : 0;
    const pctBlocked = total ? Math.round((blocked / total) * 100) : 0;
    if (allowedBar) allowedBar.style.width = pctOk + '%';
    if (blockedBar) blockedBar.style.width = pctBlocked + '%';
  }

  async function addToDeeper() {
    try {
      const response = await gmFetch('http://34.34.34.34/api/smartRoute/getRoutingWhitelist/domain?pageNo=1&pageSize=100');
      if (response.status !== 200) { alert('[Deeper Tools] Ошибка при получении белого списка'); return; }
      const data = await response.json();
      const existingDomains = new Set();
      const tunnelCodes = [];
      if (Array.isArray(data.list)) {
        for (const item of data.list) {
          if (item.domainName) existingDomains.add(item.domainName);
          if (item.tunnelCode) tunnelCodes.push(item.tunnelCode);
        }
      }
      if (tunnelCodes.length === 0) tunnelCodes.push('defaultCode');

      const container = document.getElementById('domain-scanner-container'); if (!container) return;
      const checkboxes = container.querySelectorAll('.domain-checkbox');
      const selected = []; checkboxes.forEach(cb => { if (cb.checked) selected.push(cb.dataset.domain); });
      if (selected.length === 0) { alert('[Deeper Tools] Выберите домены для добавления.'); return; }

      const newItems = [];
      for (const d of selected) {
        if (!existingDomains.has(d)) {
          const randomIndex = Math.floor(Math.random() * tunnelCodes.length);
          newItems.push({ domainName: d, tunnelCode: tunnelCodes[randomIndex] });
        }
      }
      if (newItems.length === 0) { alert('[Deeper Tools] Нет новых доменов для добавления.'); return; }

      for (const item of newItems) {
        const r = await gmFetch('http://34.34.34.34/api/smartRoute/addToWhitelist/domain', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item)
        });
        if (r.status !== 200) console.error('[Deeper Tools] Ошибка при добавлении домена:', item);
      }
      alert('[Deeper Tools] Новые домены добавлены в deeper!');
    } catch (err) {
      console.error('[Deeper Tools] Ошибка при добавлении в deeper:', err);
      alert('Ошибка при добавлении. Смотрите консоль.');
    }
  }

  if (isAllowedHost()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootDomainPageHelpers);
    } else {
      bootDomainPageHelpers();
    }
    new MutationObserver(bootDomainPageHelpers).observe(document.documentElement, { childList: true, subtree: true });

    // Встраиваем кнопки "Оптимизировать регионы" и "Тема"
    window.addEventListener('DOMContentLoaded', () => {
      const observer = new MutationObserver(() => {
        const menu = document.querySelector('div[style*="flex-direction"]');
        if (!menu) return;
        observer.disconnect();

        const buttonStyle = {
          margin: '5px 0',
          padding: '8px 14px',
          backgroundColor: '#f8f8f8',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        };

        const optimizeBtn = document.createElement('button');
        optimizeBtn.id = 'optimize-regions-btn';
        optimizeBtn.textContent = 'Оптимизировать регионы';
        Object.assign(optimizeBtn.style, buttonStyle);
        optimizeBtn.addEventListener('click', optimizeRegions);
        menu.appendChild(optimizeBtn);

        const themeBtn = document.createElement('button');
        themeBtn.id = 'toggle-theme-btn';
        themeBtn.textContent = 'Тема';
        Object.assign(themeBtn.style, buttonStyle);
        themeBtn.addEventListener('click', () => {
          currentThemeIndex = (currentThemeIndex + 1) % themeNames.length;
          applyTheme(currentThemeIndex);
        });
        menu.appendChild(themeBtn);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

    // Плавающая иконка-меню
    const iconButton = document.createElement('div');
    Object.assign(iconButton.style, {
      position: 'fixed', width: '25px', height: '25px', top: '10px', right: '10px', zIndex: '9999',
      backgroundColor: 'rgb(240, 240, 252)', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    const img = document.createElement('img');
    img.src = 'https://avatars.mds.yandex.net/get-socsnippets/10235467/2a0000019509580bc84108597cea65bc46ee/square_83';
    img.style.maxWidth = '80%'; img.style.maxHeight = '80%'; iconButton.appendChild(img);

    const menuContainer = document.createElement('div');
    Object.assign(menuContainer.style, {
      position: 'fixed', top: '45px', right: '10px', zIndex: '10000', padding: '10px',
      border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      backgroundColor: '#fff', display: 'none', flexDirection: 'column'
    });
    function toggleMenu() { menuContainer.style.display = (menuContainer.style.display === 'none' ? 'flex' : 'none'); }
    iconButton.addEventListener('click', toggleMenu);

    const buttonStyle2 = {
      margin: '5px 0', padding: '8px 14px', backgroundColor: '#f8f8f8',
      border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '14px'
    };

    const forgetBtn = document.createElement('button'); forgetBtn.textContent = 'Забыть пароль'; Object.assign(forgetBtn.style, buttonStyle2);
    const allToffBtn = document.createElement('button'); allToffBtn.textContent = 'All_T_OFF'; allToffBtn.title = 'Отключить все домены у выбранных туннелей и переключить их на другой.'; Object.assign(allToffBtn.style, buttonStyle2);
    menuContainer.append(forgetBtn, allToffBtn);

    function ensureMenu() {
      if (!document.body.contains(iconButton)) document.body.appendChild(iconButton);
      if (!document.body.contains(menuContainer)) document.body.appendChild(menuContainer);
    }
    document.addEventListener('DOMContentLoaded', ensureMenu);
    new MutationObserver(ensureMenu).observe(document.documentElement, { childList: true, subtree: true });

    // Забыть пароль
    forgetBtn.addEventListener('click', () => {
      if (confirm('Внимание! Логин и пароль будут очищены. Продолжить?')) {
        GM_setValue('adminPassword', null);
        alert('[Deeper Tools] Пароль очищен. Авторизуйтесь вручную.');
      }
    });

    allToffBtn.addEventListener('click', showAllToffPopup);

    // ===== optimizeRegions (как в 3.8.2) =====
    async function optimizeRegions() {
      if (!isAllowedHost()) return;

      console.log('🔄 Запуск оптимизации регионов (батчи по 5)');
      const btn = document.getElementById('optimize-regions-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Оптимизация…'; }

      const regionMap = {
        AMN: ["BM","CA","GL","MX","PM","US","UB","UC","UD","UE","UF"],
        AMC: ["AG","AI","AW","BB","BL","BQ","BS","CU","CW","DM","DO","GD...N","KY","LC","MF","MQ","MS","PR","SX","TC","TT","VC","VG","VI"],
        AMM: ["BZ","CR","GT","HN","NI","PA","SV"],
        AMS: ["AR","BO","BR","CL","CO","EC","FK","GF","GS","GY","PE","PY","SR","UY","VE"],
        ASC: ["KG","KZ","TJ","TM","UZ"],
        ASE: ["CN","HK","JP","KP","KR","MN","MO","TW"],
        ASW: ["AE","AM","AZ","BH","IR","GE","IL","IQ","JO","KW","LB","OM","PS","QA","SA","SY","YE"],
        ASS: ["AF","BD","BT","IN","LK","MV","NP","PK"],
        ASD: ["BN","ID","KH","LA","MM","MY","PH","SG","TH","TL","VN"],
        AFN: ["DZ","EG","LY","MA","SD","TN"],
        AFS: ["BW","LS","NA","SZ","ZA"],
        AFE: ["BI","DJ","ER","ET","KE","KM","MG","MU","MW","MZ","RE","RW","SC","SO","TZ","UG","YT","ZM","ZW"],
        AFW: ["AO","BF","BJ","BV","CI","CV","GH","GM","GN","GW","LR","ML","MR","NE","NG","SH","SL","SN","ST","TG"],
        EUN: ["GG","IE","IM","JE","UK"],
        EEU: ["AT","BE","CH","DE","DK","FI","FO","FR","IS","IT","LI","LU","MC","NL","NO","SE","SJ","SM","VA"],
        EUS: ["AD","AL","BA","BG","BY","CZ","EE","ES","GI","GR","HR","HU","LT","LV","MD","ME","MK","PL","PT","RO","RS","RU","SI","SK","UA"],
        OCN: ["AU","NF","NZ"],
        OCS: ["AS","CK","FJ","FM","GU","KI","MH","MP","NC","NR","NU","PF","PG","PN","PW","SB","TK","TO","TV","UM","VU","WF","WS"]
      };

      async function listWhitelist(pageNo, pageSize) {
        const res = await gmFetch(`${location.origin}/api/smartRoute/getRoutingWhitelist/domain?pageNo=${pageNo}&pageSize=${pageSize}`);
        return res.json();
      }

      async function deleteFromWhitelist(domains) {
        return gmFetch(`${location.origin}/api/smartRoute/deleteFromWhitelist/domain`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(domains)
        });
      }

      async function addToWhitelist(items) {
        const results = [];
        for (const item of items) {
          const r = await gmFetch(`${location.origin}/api/smartRoute/addToWhitelist/domain`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
          results.push(r);
        }
        return results;
      }

      async function saveJSON(data, filename = 'data.json') {
        try {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('saveJSON fallback:', e);
        }
      }

      async function processRegion(regionCode) {
        console.log(`➡️ Обработка региона ${regionCode}`);
        const countries = regionMap[regionCode];
        let page = 1, pageSize = 100, done = false;

        const accumulated = [];
        while (!done) {
          const data = await listWhitelist(page, pageSize);
          if (!data || !Array.isArray(data.list)) break;
          for (const item of data.list) {
            if (countries.includes(item.countryCode)) {
              accumulated.push(item.domainName);
            }
          }
          if (data.list.length < pageSize) done = true; else page++;
        }

        if (accumulated.length === 0) {
          console.log(`⏭ Регион ${regionCode}: нет доменов для удаления`);
          return;
        }

        console.log(`🗑 Регион ${regionCode}: удаляем ${accumulated.length} доменов`);
        await deleteFromWhitelist(accumulated);
      }

      const codeList = Object.keys(regionMap);
      const batchSize = 5;
      for (let i = 0; i < codeList.length; i += batchSize) {
        const batch = codeList.slice(i, i + batchSize);
        console.log('⚙️ Батч:', batch.join(', '));
        await Promise.all(batch.map(rc => processRegion(rc)));
      }

      if (btn) { btn.disabled = false; btn.textContent = 'Оптимизировать регионы'; }
      console.log('✅ Оптимизация завершена');
    }

    async function showAllToffPopup() {
      const overlay = document.createElement('div');
      Object.assign(overlay.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 20000 });
      const popup = document.createElement('div');
      Object.assign(popup.style, { maxWidth: '600px', width: '95%', position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', background: '#fff', color: '#000', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' });

      const title = document.createElement('div');
      title.textContent = 'ALL_T_OFF';
      title.style.fontWeight = '600';
      title.style.fontSize = '16px';
      title.style.marginBottom = '10px';

      const row = (labelText) => {
        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.marginBottom = '8px';
        const label = document.createElement('div');
        label.textContent = labelText;
        label.style.width = '210px';
        label.style.marginRight = '8px';
        wrap.appendChild(label);
        return { wrap, label };
      };

      const r1 = row('Сколько туннелей OFF за раз (maxActive):');
      const maxActive = document.createElement('input');
      maxActive.type = 'number'; maxActive.value = '10'; maxActive.min = '1'; maxActive.max = '50';
      maxActive.style.width = '120px';
      r1.wrap.appendChild(maxActive);

      const r2 = row('Пауза между батчами (сек):');
      const pauseSec = document.createElement('input');
      pauseSec.type = 'number'; pauseSec.value = '3'; pauseSec.min = '0'; pauseSec.max = '60';
      pauseSec.style.width = '120px';
      r2.wrap.appendChild(pauseSec);

      const r3 = row('Переключить домены на туннель:');
      const targetTunnel = document.createElement('input');
      targetTunnel.type = 'text'; targetTunnel.placeholder = 'Напр.: EUW или BR и т.п.';
      targetTunnel.style.width = '200px';
      r3.wrap.appendChild(targetTunnel);

      const r4 = row('Фильтр по стране (двухбукв. код, опц.):');
      const countryFilter = document.createElement('input');
      countryFilter.type = 'text'; countryFilter.placeholder = 'Напр.: RU, KZ, UA';
      countryFilter.style.width = '200px';
      r4.wrap.appendChild(countryFilter);

      const buttons = document.createElement('div');
      buttons.style.display = 'flex';
      buttons.style.justifyContent = 'flex-end';
      buttons.style.gap = '8px';
      buttons.style.marginTop = '12px';

      const offBtn = document.createElement('button');
      offBtn.textContent = 'Запустить';
      Object.assign(offBtn.style, { padding: '8px 14px', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer' });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Отмена';
      Object.assign(cancelBtn.style, { padding: '8px 14px', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer' });

      buttons.appendChild(cancelBtn);
      buttons.appendChild(offBtn);

      popup.appendChild(title);
      popup.appendChild(r1.wrap);
      popup.appendChild(r2.wrap);
      popup.appendChild(r3.wrap);
      popup.appendChild(r4.wrap);
      popup.appendChild(buttons);

      overlay.appendChild(popup);
      document.body.appendChild(overlay);

      cancelBtn.addEventListener('click', () => { overlay.remove(); });

      offBtn.addEventListener('click', async () => {
        offBtn.disabled = true;
        cancelBtn.disabled = true;

        const maxActiveNum = Math.max(1, Math.min(50, parseInt(maxActive.value || '10', 10)));
        const pauseMs = Math.max(0, Math.min(60000, parseInt(pauseSec.value || '3000', 10) * 1000));
        const target = (targetTunnel.value || '').trim().toUpperCase();
        const country = (countryFilter.value || '').trim().toUpperCase();

        try {
          // 1) получаем весь whitelist
          let page = 1, pageSize = 100, done = false, all = [];
          while (!done) {
            const res = await gmFetch(`${location.origin}/api/smartRoute/getRoutingWhitelist/domain?pageNo=${page}&pageSize=${pageSize}`);
            const d = await res.json();
            if (!d || !Array.isArray(d.list)) break;
            all.push(...d.list);
            if (d.list.length < pageSize) done = true; else page++;
          }

          // 2) группируем по tunnelCode (и по стране если указана)
          const groups = new Map();
          for (const it of all) {
            if (country && it.countryCode !== country) continue;
            const key = it.tunnelCode || 'UNK';
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(it);
          }

          // 3) батчами по maxActive — для каждого туннеля отключаем домены и перекидываем на target (если задан)
          const tunnelCodes = Array.from(groups.keys());
          for (let i = 0; i < tunnelCodes.length; i += maxActiveNum) {
            const batch = tunnelCodes.slice(i, i + maxActiveNum);

            await Promise.all(batch.map(async (fromCode) => {
              const list = groups.get(fromCode) || [];
              const domains = list.map(x => x.domainName);

              if (domains.length) {
                // отключить (удалить из whitelist)
                await gmFetch(`${location.origin}/api/smartRoute/deleteFromWhitelist/domain`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(domains)
                });
              }

              if (target && domains.length) {
                for (const dn of domains) {
                  await gmFetch(`${location.origin}/api/smartRoute/addToWhitelist/domain`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domainName: dn, tunnelCode: target })
                  });
                }
              }
            }));

            if (pauseMs > 0 && i + maxActiveNum < tunnelCodes.length) {
              await new Promise(r => setTimeout(r, pauseMs));
            }
          }

          alert('Готово!');
        } catch (e) {
          console.error('ALL_T_OFF error:', e);
          alert('Ошибка, проверьте консоль');
        } finally {
          overlay.remove();
        }
      });
    }
  }

  let scannerMenuCommandId = null;
  function updateScannerMenuCommand() {
    if (scannerMenuCommandId && typeof GM_unregisterMenuCommand === 'function') {
      GM_unregisterMenuCommand(scannerMenuCommandId);
    }
    if (typeof GM_registerMenuCommand === 'function') {
      const currentState = getScannerEnabled();
      const label = 'Domain Scanner: ' + (currentState ? '🟢' : '🔴');
      scannerMenuCommandId = GM_registerMenuCommand(label, () => setScannerEnabled(!getScannerEnabled()));
    }
  }
  if (GM_getValue('domainScannerEnabled') === undefined) GM_setValue('domainScannerEnabled', false);
  updateScannerMenuCommand();
  if (getScannerEnabled()) {
    if (['complete', 'interactive'].includes(document.readyState)) ensureScannerContainer();
    else document.addEventListener('DOMContentLoaded', ensureScannerContainer);
  }

})();
