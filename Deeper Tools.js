// ==UserScript==
// @name         Deeper Tools
// @description  Набор инструментов для Deeper
// @author       https://github.com/lReDragol
// @namespace    http://tampermonkey.net/
// @version      3.7
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
// @downloadURL  https://update.greasyfork.org/scripts/527972/Deeper%20Tools.user.js
// @updateURL    https://update.greasyfork.org/scripts/527972/Deeper%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const palettes = {
        default: {},
        green: {
            '--bg-primary':      '#2a2a2a',
            '--bg-secondary':    '#383838',
            '--bg-tertiary':     '#454545',
            '--text-primary':    '#d0f4d0',
            '--text-secondary':  '#b0e8b0',
            '--text-muted':      '#8ac48a',
            '--accent':          '#4caf50',
            '--border-primary':  '#4d4d4d',
            '--border-light':    '#777777',
            '--hover-bg':        '#505050',
            '--active-bg':       '#626262',
            '--highlight':       '#6ee76e',
            '--disabled-bg':     '#2f2f2f'
        },
        red: {
            '--bg-primary':      '#2b1a1a',
            '--bg-secondary':    '#3d1f1f',
            '--bg-tertiary':     '#502525',
            '--text-primary':    '#ffe6e6',
            '--text-secondary':  '#ffb3b3',
            '--text-muted':      '#cc7f7f',
            '--accent':          '#ff4d4d',
            '--border-primary':  '#661010',
            '--border-light':    '#993333',
            '--hover-bg':        '#661515',
            '--active-bg':       '#7a1a1a',
            '--highlight':       '#ff7f7f',
            '--disabled-bg':     '#2f1c1c'
        },
        purple: {
            '--bg-primary':      '#1a1a2a',
            '--bg-secondary':    '#28283a',
            '--bg-tertiary':     '#35354b',
            '--text-primary':    '#c0c0e8',
            '--text-secondary':  '#9e9ede',
            '--text-muted':      '#8a8abf',
            '--accent':          '#e0e0f8',
            '--border-primary':  '#3d3d4d',
            '--border-light':    '#777787',
            '--hover-bg':        '#505050',
            '--active-bg':       '#626262',
            '--highlight':       '#8f8fdf',
            '--disabled-bg':     '#2f2f2f'
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
        /* AntD Layout */
        .ant-layout, .ant-layout-header, .ant-layout-sider, .ant-layout-content, .ant-layout-footer {
            background: var(--bg-primary) !important; color: var(--text-primary) !important;
        }
        /* Cards and panels */
        .ant-card, .card, .panel { background: var(--bg-tertiary) !important; box-shadow: none !important; color: var(--text-primary) !important; }
        /* Menus */
        .ant-menu, .ant-menu-item, .ant-menu-submenu, .ant-menu-item-group-title {
            background: var(--bg-secondary) !important; color: var(--text-primary) !important;
        }
        /* Modals and popovers */
        .ant-modal-content, .ant-popover-inner-content, .ant-popover-title {
            background: var(--bg-secondary) !important; color: var(--text-primary) !important; border-color: var(--border-primary) !important;
        }
        /* Tooltips */
        .ant-tooltip-inner { background: var(--bg-secondary) !important; color: var(--text-primary) !important; }
        /* Tabs */
        .ant-tabs-nav, .ant-tabs-tab, .ant-tabs-tab-active, .ant-tabs-content-holder {
            background: var(--bg-secondary) !important; color: var(--text-primary) !important;
        }
        /* Tags and badges */
        .ant-tag, .ant-tag-green, .ant-badge-status-success, .ant-badge-status-default {
            background: var(--bg-tertiary) !important; color: var(--text-primary) !important;
        }
        /* Icons */
        .anticon, .anticon svg { color: var(--accent) !important; fill: var(--accent) !important; }
        /* Scrollbars */
        ::-webkit-scrollbar { width: 8px; background: var(--bg-secondary); }
        ::-webkit-scrollbar-thumb { background: var(--border-primary); border-radius: 4px; }
        /* Text selection */
        ::selection { background: var(--highlight) !important; color: var(--bg-primary) !important; }
        /* Sticky controls */
        .tm-sticky-controls { position: sticky; bottom: 0; z-index: 999; background: var(--bg-secondary); padding: 8px; display: flex; justify-content: space-between; align-items: center; }
        /* Page list styling */
        .page-list-container { margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .page-list-item {
            position: relative; padding: 1rem 3rem 1rem 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 0.5rem;
        }
        .page-list-item .delete-button {
            position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; color: var(--text-secondary); font-size: 1.25rem; line-height: 1; cursor: pointer;
        }
        .page-list-item .delete-button:hover { color: var(--accent); }`;

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
            const vars = Object.entries(pal)
                .map(([k,v]) => `${k}: ${v};`)
                .join('\n');
            styleEl.textContent = `
                :root { ${vars} }
                ${CSS_BASE}
            `;
        }
    }

    if (
    window.location.href.startsWith('http://34.34.34.34/') ||
    window.location.href.startsWith('http://11.22.33.44/')
    ) {
        applyTheme(currentThemeIndex);
    }

    const countryNames = {
        LL: "не проходить тунель",
        ANY: "любая страна или регион",
        AMER: "---Америка---",
        ASIA: "---Азия---",
        AFRI: "---Африка---",
        EURO: "---Европа---",
        OCEA: "---Океания---",
        AMN: "Северная Америка",
        AMC: "Карибский бассейн",
        AMM: "Центральная Америка",
        AMS: "Южная Америка",
        ASC: "Центральная Азия",
        ASE: "Восточная Азия",
        ASW: "Западная Азия",
        ASS: "Южная Азия",
        ASD: "Юго-Восточная Азия",
        AFN: "Северная Африка",
        AFM: "Центральная Африка",
        AFE: "Восточная Африка",
        AFW: "Западная Африка",
        AFS: "Южная Африка",
        EUN: "Северная Европа",
        EUE: "Восточная Европа",
        EUW: "Западная Европа",
        EUS: "Южная Европа",
        OCP: "Полинезия",
        OCA: "Австралия и Новая Зеландия",
        OCM: "Меланезия",
        OCN: "Микронезия",
        AD: "Андорра", AE: "Объединенные Арабские Эмираты", AF: "Афганистан",
        AG: "Антигуа и Барбуда", AI: "Ангилья", AL: "Албания", AM: "Армения",
        AO: "Ангола", AR: "Аргентина", AS: "Американское Самоа", AT: "Австрия",
        AU: "Австралия", AW: "Аруба", AX: "Аландские острова", AZ: "Азербайджан",
        BA: "Босния и Герцеговина", BB: "Барбадос", BD: "Бангладеш", BE: "Бельгия",
        BF: "Буркина-Фасо", BG: "Болгария", BH: "Бахрейн", BI: "Бурунди",
        BJ: "Бенин", BL: "Сен-Бартелеми", BM: "Бермуды", BN: "Бруней",
        BO: "Боливия", BQ: "Карибская Нидерландия", BR: "Бразилия", BS: "Багамы",
        BT: "Бутан", BW: "Ботсвана", BY: "Беларусь", BZ: "Белиз",
        CA: "Канада", CC: "Кокосовые (Килинг) острова", CD: "Конго (Киншаса)",
        CF: "ЦАР", CG: "Конго (Браззавиль)", CH: "Швейцария", CI: "Кот-д’Ивуар",
        CK: "Острова Кука", CL: "Чили", CM: "Камерун", CN: "Китай",
        CO: "Колумбия", CR: "Коста-Рика", CU: "Куба", CV: "Кабо-Верде",
        CW: "Кюрасао", CX: "Остров Рождества", CY: "Кипр", CZ: "Чехия",
        DE: "Германия", DJ: "Джибути", DK: "Дания", DM: "Доминика",
        DO: "Доминиканская Республика", DZ: "Алжир", EC: "Эквадор", EE: "Эстония",
        EG: "Египет", ER: "Эритрея", ES: "Испания", ET: "Эфиопия",
        FI: "Финляндия", FJ: "Фиджи", FK: "Фолклендские острова", FM: "Микронезия",
        FO: "Фарерские острова", FR: "Франция", GA: "Габон", GB: "Великобритания",
        GD: "Гренада", GE: "Грузия", GF: "Французская Гвиана", GG: "Гернси",
        GH: "Гана", GI: "Гибралтар", GL: "Гренландия", GM: "Гамбия",
        GN: "Гвинея", GP: "Гваделупа", GQ: "Экваториальная Гвинея", GR: "Греция",
        GS: "Южная Джорджия и Южные Сандвичевы острова", GT: "Гватемала", GU: "Гуам",
        GW: "Гвинея-Бисау", GY: "Гайана", HK: "Гонконг (КНР)", HN: "Гондурас",
        HR: "Хорватия", HT: "Гаити", HU: "Венгрия", ID: "Индонезия",
        IE: "Ирландия", IL: "Израиль", IM: "Остров Мэн", IN: "Индия",
        IO: "Британская территория в Индийском океане", IQ: "Ирак", IR: "Иран",
        IS: "Исландия", IT: "Италия", JE: "Джерси", JM: "Ямайка",
        JO: "Иордания", JP: "Япония", KE: "Кения", KG: "Киргизия",
        KH: "Камбоджа", KI: "Кирибати", KM: "Коморы", KN: "Сент-Китс и Невис",
        KP: "Северная Корея", KR: "Южная Корея", KW: "Кувейт", KY: "Каймановы острова",
        KZ: "Казахстан", LA: "Лаос", LB: "Ливан", LC: "Сент-Люсия",
        LI: "Лихтенштейн", LK: "Шри-Ланка", LR: "Либерия", LS: "Лесото",
        LT: "Литва", LU: "Люксембург", LV: "Латвия", LY: "Ливия",
        MA: "Марокко", MC: "Монако", MD: "Молдавия", ME: "Черногория",
        MF: "Сен-Мартен (Фр.)", MG: "Мадагаскар", MH: "Маршалловы Острова",
        MK: "Северная Македония", ML: "Мали", MM: "Мьянма", MN: "Монголия",
        MO: "Макао (КНР)", MP: "Северные Марианские острова", MQ: "Мартиника",
        MR: "Мавритания", MS: "Монтсеррат", MT: "Мальта", MU: "Маврикий",
        MV: "Мальдивы", MW: "Малави", MX: "Мексика", MY: "Малайзия",
        MZ: "Мозамбик", NA: "Намибия", NC: "Новая Каледония", NE: "Нигер",
        NF: "Остров Норфолк", NG: "Нигерия", NI: "Никарагуа", NL: "Нидерланды",
        NO: "Норвегия", NP: "Непал", NR: "Науру", NU: "Ниуэ",
        NZ: "Новая Зеландия", OM: "Оман", PA: "Панама", PE: "Перу",
        PF: "Французская Полинезия", PG: "Папуа — Новая Гвинея", PH: "Филиппины",
        PK: "Пакистан", PL: "Польша", PM: "Сен-Пьер и Микелон", PN: "Острова Питкэрн",
        PR: "Пуэрто-Рико", PS: "Палестинские территории", PT: "Португалия",
        PW: "Палау", PY: "Парагвай", QA: "Катар", RE: "Реюньон",
        RO: "Румыния", RS: "Сербия", RU: "Россия", RW: "Руанда",
        SA: "Саудовская Аравия", SB: "Соломоновы Острова", SC: "Сейшельские Острова",
        SD: "Судан", SE: "Швеция", SG: "Сингапур", SH: "Остров Святой Елены",
        SI: "Словения", SJ: "Шпицберген и Ян-Майен", SK: "Словакия", SL: "Сьерра-Леоне",
        SM: "Сан-Марино", SN: "Сенегал", SO: "Сомали", SR: "Суринам",
        SS: "Южный Судан", ST: "Сан-Томе и Принсипи", SV: "Сальвадор", SX: "Синт-Мартен",
        SY: "Сирия", SZ: "Эсватини", TC: "Теркс и Кайкос", TD: "Чад",
        TF: "Французские Южные и Антарктические Территории", TG: "Того", TH: "Таиланд",
        TJ: "Таджикистан", TK: "Токелау", TL: "Восточный Тимор", TM: "Туркменистан",
        TN: "Тунис", TO: "Тонга", TR: "Турция", TT: "Тринидад и Тобаго",
        TV: "Тувалу", TW: "Тайвань", TZ: "Танзания", UA: "Украина",
        UB: "Запад США", UC: "Средний Запад США", UD: "Югозапад США", UE: "Северо-Восток США",
        UF: "Юго-Восток США", UG: "Уганда", US: "США", UY: "Уругвай",
        UZ: "Узбекистан", VA: "Ватикан", VC: "Сент-Винсент и Гренадины",
        VE: "Венесуэла", VG: "Британские Виргинские Острова", VI: "Американские Виргинские Острова",
        VN: "Вьетнам", VU: "Вануату", WF: "Уоллис и Футуна", WS: "Самоа",
        XK: "Косово", YE: "Йемен", YT: "Майотта", ZA: "Южная Африка",
        ZM: "Замбия", ZW: "Зимбабве"
    };

    function gmFetch(url, init = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: init.method || 'GET',
                url: url,
                headers: init.headers || {},
                data: init.body || null,
                onload: function(response) {
                    response.json = () => Promise.resolve(JSON.parse(response.responseText));
                    resolve(response);
                },
                onerror: reject
            });
        });
    }

    async function loadRegionMap() {
        if (window.__regionMap) return window.__regionMap;
        const url = `${location.origin}/assets/index.B4Azi2TB.js`;
        const resp = await gmFetch(url);
        const txt = resp.responseText;
        const m = txt.match(/const p1 = (\{[\s\S]*?\});/);
        if (!m) throw new Error('Не удалось получить список стран/регионов');
        // eslint-disable-next-line no-eval
        const p1 = eval('(' + m[1] + ')');
        window.__regionMap = p1;
        return p1;
    }

    async function optimizeRegions() {
        console.log('🔄 Запуск оптимизации регионов (батчи по 5)');

        const btn = document.getElementById('optimize-regions-btn');
        btn.disabled = true;
        btn.textContent = 'Оптимизация…';

        const regionMap = {
            AMN: ["BM","CA","GL","MX","PM","US","UB","UC","UD","UE","UF"],
            AMC: ["AG","AI","AW","BB","BL","BQ","BS","CU","CW","DM","DO","GD","GP","HT","JM","KN","KY","LC","MF","MQ","MS","PR","SX","TC","TT","VC","VG","VI"],
            AMM: ["BZ","CR","GT","HN","NI","PA","SV"],
            AMS: ["AR","BO","BR","CL","CO","EC","FK","GF","GS","GY","PE","PY","SR","UY","VE"],
            ASC: ["KG","KZ","TJ","TM","UZ"],
            ASE: ["CN","HK","JP","KP","KR","MN","MO","TW"],
            ASW: ["AE","AM","AZ","BH","IR","GE","IL","IQ","JO","KW","LB","OM","PS","QA","SA","SY","YE"],
            ASS: ["AF","BD","BT","IN","LK","MV","NP","PK"],
            ASD: ["BN","ID","KH","LA","MM","MY","PH","SG","TH","TL","VN"],
            AFN: ["DZ","EG","LY","MA","SD","TN"],
            AFM: ["AO","CD","CF","CG","CM","GA","GQ","ST","TD"],
            AFE: ["BI","DJ","ER","ET","KE","KM","MG","MU","MW","MZ","RE","RW","SC","SO","SS","TF","TZ","UG","YT","ZM","ZW"],
            AFW: ["BF","BJ","CI","CV","GH","GM","GN","GW","LR","ML","MR","NE","NG","SH","SL","SN","TG"],
            AFS: ["BW","LS","NA","SZ","ZA"],
            EUN: ["AX","DK","EE","FI","FO","GB","GG","IE","IM","IS","JE","LT","LV","NO","SE","SJ"],
            EUE: ["BG","BY","CZ","HU","MD","PL","RO","RU","SK","UA"],
            EUW: ["AT","BE","CH","DE","FR","LI","LU","MC","NL"],
            EUS: ["AD","AL","BA","CY","ES","GI","GR","HR","IT","ME","MK","MT","PT","RS","SI","SM","TR","VA","XK"],
            OCP: ["AS","CK","NU","PF","PN","TK","TO","TV","WF","WS"],
            OCA: ["AU","CC","CX","NF","NZ"],
            OCM: ["FJ","NC","PG","SB","VU"],
            OCN: ["FM","GU","KI","MH","MP","NR","PW"]
        };

        const sleep = ms => new Promise(res => setTimeout(res, ms));

        let state = GM_getValue('optimizeState', { processed: [], stats: [] });
        const processed = new Set(state.processed);
        const stats = state.stats;

        const allRegions = Object.keys(regionMap);
        const pending = allRegions.filter(r => !processed.has(r));
        console.log('🌍 Ожидают обработки регионы:', pending);

        function saveJSON(obj, filename) {
            const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            GM_download({
                url,
                name: filename,
                saveAs: true
            });
            URL.revokeObjectURL(url);
        }

        async function processRegion(regionCode) {
            console.log(`➡️ Обработка региона ${regionCode}`);
            const countries = regionMap[regionCode];
            let best = { regionCode, countryCode: null, tunnelCode: null, activeNum: -1 };

            for (const countryCode of countries) {
                console.log(`  ▶️ Пробуем ${regionCode}→${countryCode}`);
                await gmFetch('http://34.34.34.34/api/smartRoute/addTunnel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ regionCode, countryCode })
                });

                console.log('    ⏳ Ждём 15 секунд…');
                await sleep(15000);

                console.log('    📦 Получаем список туннелей');
                const all = await (await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels')).json();
                const entry = all.find(t => t.regionCode === regionCode && t.countryCode === countryCode);
                const num = entry?.activeNum || 0;
                console.log(`    🔢 activeNum=${num}`);

                if (num > best.activeNum) {
                    best = { regionCode, countryCode, tunnelCode: entry?.tunnelCode, activeNum: num };
                }

                if (entry?.tunnelCode) {
                    console.log(`    ❌ Удаляем туннель ${entry.tunnelCode}`);
                    await gmFetch('http://34.34.34.34/api/smartRoute/deleteTunnels', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify([entry.tunnelCode])
                    });
                }
            }

            console.log(`  ✅ Лучший: ${best.countryCode} (${best.activeNum})`);
            saveJSON(best, `stats_${regionCode}.json`);
            console.log(`  💾 stats_${regionCode}.json сохранён`);

            return best;
        }

        while (pending.length) {
            const batch = pending.splice(0, 5);
            console.log('🚀 Обрабатываем батч:', batch);
            const results = await Promise.all(batch.map(processRegion));

            for (const res of results) {
                stats.push(res);
                processed.add(res.regionCode);
            }
            state = { processed: Array.from(processed), stats };
            GM_setValue('optimizeState', state);

            saveJSON(state, 'optimizeState.json');
            console.log('💾 optimizeState.json сохранён');
        }

        stats.sort((a, b) => b.activeNum - a.activeNum);
        const top10 = stats.slice(0, 10);
        console.log('🏆 Топ-10 регионов:', top10);

        for (const { regionCode, countryCode } of top10) {
            console.log(`➕ Восстанавливаем ${regionCode}→${countryCode}`);
            await gmFetch('http://34.34.34.34/api/smartRoute/addTunnel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regionCode, countryCode })
            });
        }

        console.log('📦 Получаем финальный список туннелей');
        const finalList = await (await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels')).json();
        const toDelete = finalList
            .filter(t => !top10.some(x => x.tunnelCode === t.tunnelCode))
            .map(t => t.tunnelCode);
        console.log('🗑️ Удаляем лишние туннели:', toDelete);
        if (toDelete.length) {
            await gmFetch('http://34.34.34.34/api/smartRoute/deleteTunnels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(toDelete)
            });
        }

        console.log('✅ Оптимизация завершена');
        alert(`Оптимизация завершена: оставлено ${top10.length} туннелей.`);
        btn.textContent = 'Оптимизировать регионы';
        btn.disabled = false;
    }

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

            if (
            window.location.href.startsWith('http://34.34.34.34/') ||
            window.location.href.startsWith('http://11.22.33.44/')
        ) {
            const themeBtn = document.createElement('button');
            themeBtn.id = 'toggle-theme-btn';
            themeBtn.textContent = 'Тема';
            Object.assign(themeBtn.style, buttonStyle);
            themeBtn.addEventListener('click', () => {
                currentThemeIndex = (currentThemeIndex + 1) % themeNames.length;
                applyTheme(currentThemeIndex);
            });
            menu.appendChild(themeBtn);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    });

    function getScannerEnabled() {
        return GM_getValue('domainScannerEnabled', false);
    }
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

    const nativeOpen = XMLHttpRequest.prototype.open;
    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method; this._url = url;
        if (getScannerEnabled()) {
            try { const u = new URL(url); addDomain(u.hostname); } catch {}
        }
        return nativeOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
        if (this._url?.includes('/api/admin/login') && this._method?.toUpperCase()==='POST') {
            try {
                const p = JSON.parse(body);
                if (p.password && !GM_getValue('adminPassword')) {
                    GM_setValue('adminPassword', p.password);
                    console.log('[Deeper Tools] Пароль сохранён из XHR.');
                }
            } catch(e){}
        }
        return nativeSend.apply(this, arguments);
    };

    if (window.location.href.includes('/login/')) {
        const storedPassword = GM_getValue('adminPassword');
        if (storedPassword) {
            window.addEventListener('load', () => {
                gmFetch('http://34.34.34.34/api/admin/login', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({username:'admin',password:storedPassword})
                })
                .then(r => { if (r.status===200) window.location.href='/admin/dashboard'; return r.json(); })
                .then(d => console.log('[Deeper Tools] Авторизация:',d))
                .catch(e=>console.error(e));
            });
        }
    }

if (
    window.location.href.startsWith('http://34.34.34.34/') ||
    window.location.href.startsWith('http://11.22.33.44/')
) {
    const iconButton = document.createElement('div');
    iconButton.style.position = 'fixed';
    iconButton.style.width = '25px';
    iconButton.style.height = '25px';
    iconButton.style.top = '10px';
    iconButton.style.right = '10px';
    iconButton.style.zIndex = '9999';
    iconButton.style.backgroundColor = 'rgb(240, 240, 252)';
    iconButton.style.borderRadius = '4px';
    iconButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    iconButton.style.cursor = 'pointer';
    iconButton.style.display = 'flex';
    iconButton.style.alignItems = 'center';
    iconButton.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.src = 'https://avatars.mds.yandex.net/get-socsnippets/10235467/2a0000019509580bc84108597cea65bc46ee/square_83';
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    iconButton.appendChild(img);

    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '45px';
    menuContainer.style.right = '10px';
    menuContainer.style.zIndex = '10000';
    menuContainer.style.padding = '10px';
    menuContainer.style.border = '1px solid #ccc';
    menuContainer.style.borderRadius = '4px';
    menuContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    menuContainer.style.backgroundColor = '#fff';
    menuContainer.style.display = 'none';
    menuContainer.style.flexDirection = 'column';

    function toggleMenu() {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'flex' : 'none';
    }
    iconButton.addEventListener('click', toggleMenu);

    const buttonStyle = {
        margin: '5px 0',
        padding: '8px 14px',
        backgroundColor: '#f8f8f8',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Поделиться доменами';
    Object.assign(downloadBtn.style, buttonStyle);

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = 'Добавить домены';
    Object.assign(uploadBtn.style, buttonStyle);

    const disableRebootBtn = document.createElement('button');
    disableRebootBtn.textContent = 'Отключить перезагрузку';
    Object.assign(disableRebootBtn.style, buttonStyle);

    const forgetBtn = document.createElement('button');
    forgetBtn.textContent = 'Забыть пароль';
    Object.assign(forgetBtn.style, buttonStyle);

    const allToffBtn = document.createElement('button');
    allToffBtn.textContent = 'All_T_OFF';
    allToffBtn.title = 'Тут можно отключить все домены от определённых тунелей и переключить их на другой.';
    Object.assign(allToffBtn.style, buttonStyle);

    menuContainer.appendChild(downloadBtn);
    menuContainer.appendChild(uploadBtn);
    menuContainer.appendChild(disableRebootBtn);
    menuContainer.appendChild(forgetBtn);
    menuContainer.appendChild(allToffBtn);

    function ensureMenu() {
        if (!document.body.contains(iconButton)) document.body.appendChild(iconButton);
        if (!document.body.contains(menuContainer)) document.body.appendChild(menuContainer);
    }
    document.addEventListener('DOMContentLoaded', ensureMenu);
    new MutationObserver(ensureMenu).observe(document.documentElement, { childList: true, subtree: true });

        async function getExistingWhitelist() {
            const pageSize = 100;
            let pageNo = 1;
            let total = 0;
            let allItems = [];
            let firstIteration = true;
            do {
                const url = `http://34.34.34.34/api/smartRoute/getRoutingWhitelist/domain?pageNo=${pageNo}&pageSize=${pageSize}`;
                const response = await gmFetch(url);
                if (response.status !== 200) {
                    throw new Error('Ошибка при запросе списка на странице ' + pageNo);
                }
                const data = await response.json();
                if (firstIteration) {
                    total = data.total;
                    firstIteration = false;
                }
                if (data.list && data.list.length > 0) {
                    allItems = allItems.concat(data.list);
                }
                pageNo++;
            } while (allItems.length < total);
            return allItems;
        }

        downloadBtn.addEventListener('click', async () => {
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Скачивание...';
            try {
                const allItems = await getExistingWhitelist();
                const finalData = { total: allItems.length, list: allItems };
                const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('[Deeper Tools] Ошибка при скачивании:', error);
                alert('Ошибка при скачивании данных. Проверьте консоль.');
            }
            downloadBtn.textContent = 'Скачать домены';
            downloadBtn.disabled = false;
        });

        uploadBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.style.display = 'none';
            input.addEventListener('change', async function() {
                if (input.files.length === 0) return;
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        if (!jsonData.list || !Array.isArray(jsonData.list)) {
                            throw new Error('Неверный формат файла: ожидалось поле list[].');
                        }
                        const fileDomainNames = jsonData.list.map(item => item.domainName);
                        const existing = await getExistingWhitelist();
                        const existingDomainNames = existing.map(item => item.domainName);
                        const duplicates = fileDomainNames.filter(d => existingDomainNames.includes(d));
                        if (duplicates.length > 0) {
                            console.log('[Deeper Tools] Удаляем дубликаты:', duplicates);
                            const delRes = await gmFetch('http://34.34.34.34/api/smartRoute/deleteFromWhitelist/domain', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(duplicates)
                            });
                            if (delRes.status !== 200) {
                                console.error('[Deeper Tools] Ошибка при удалении дубликатов:', duplicates);
                            }
                        }
                        for (let item of jsonData.list) {
                            const payload = { domainName: item.domainName, tunnelCode: item.tunnelCode };
                            const res = await gmFetch('http://34.34.34.34/api/smartRoute/addToWhitelist/domain', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            if (res.status !== 200) {
                                console.error('[Deeper Tools] Ошибка добавления домена:', item.domainName);
                            }
                        }
                        alert('[Deeper Tools] Данные успешно загружены!');
                    } catch(err) {
                        console.error('[Deeper Tools] Ошибка загрузки:', err);
                        alert('Ошибка загрузки. Смотрите консоль.');
                    }
                };
                reader.readAsText(file);
            });
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });

        disableRebootBtn.addEventListener('click', async () => {
            disableRebootBtn.disabled = true;
            disableRebootBtn.textContent = 'Отключение...';
            try {
                const queryParams = '?on=false&hour=0&minute=0&day=0';
                const response = await gmFetch(`http://34.34.34.34/api/autoReboot/config${queryParams}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.status !== 200) {
                    throw new Error('Ошибка при отключении перезагрузки');
                }
                alert('[Deeper Tools] Перезагрузка отключена!');
            } catch (error) {
                console.error('[Deeper Tools] Ошибка отключения перезагрузки:', error);
                alert('Ошибка отключения перезагрузки. Смотрите консоль.');
            }
            disableRebootBtn.textContent = 'Отключить перезагрузку';
            disableRebootBtn.disabled = false;
        });

        forgetBtn.addEventListener('click', () => {
            if (confirm('Внимание! Логин и пароль будут очищены. Продолжить?')) {
                GM_setValue('adminPassword', null);
                alert('[Deeper Tools] Пароль очищен. Авторизуйтесь вручную.');
            }
        });

        allToffBtn.addEventListener('click', showAllToffPopup);

        async function showAllToffPopup() {

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        zIndex: '20000'
    });

    const popup = document.createElement('div');
    Object.assign(popup.style, {
        maxWidth: '600px',
        width: '95%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    });

    const title = document.createElement('h3');
    title.textContent = 'Массовое отключение доменов';
    popup.appendChild(title);
    const tunnelsContainer = document.createElement('div');
    Object.assign(tunnelsContainer.style, {
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '10px'
    });
    popup.appendChild(tunnelsContainer);

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px'
        //flexWrap: 'wrap'       // чтобы кнопки не вылезали
    });

    const switchAllBtn = document.createElement('button');
    switchAllBtn.textContent = 'Переключить все';
    Object.assign(switchAllBtn.style, {
        backgroundColor: '#0077cc',
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 14px',
        cursor: 'pointer'
    });

    const offBtn = document.createElement('button');
    offBtn.textContent = 'Отключиться';
    Object.assign(offBtn.style, {
        backgroundColor: '#bb0000',
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 14px',
        cursor: 'pointer'
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Отмена';
    Object.assign(cancelBtn.style, {
        backgroundColor: '#666',
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 14px',
        cursor: 'pointer'
    });

    const randomizeBtn = document.createElement('button');
    randomizeBtn.textContent = 'Рандомайзер';
    Object.assign(randomizeBtn.style, {
        backgroundColor: '#007700',
        color: '#fff',
        borderRadius: '4px',
        padding: '8px 14px',
        cursor: 'pointer'
    });

    btnContainer.appendChild(switchAllBtn);
    btnContainer.appendChild(offBtn);
    btnContainer.appendChild(randomizeBtn);
    btnContainer.appendChild(cancelBtn);
    popup.appendChild(btnContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    function closePopup() {
        overlay.remove();
    }
    cancelBtn.addEventListener('click', closePopup);

    let tunnelsList = [];
    try {
        const response = await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels');
        if (response.status !== 200) throw new Error('Ошибка получения списка тунелей');
        tunnelsList = await response.json();
    } catch (err) {
        console.error('[Deeper Tools] Ошибка при получении тунелей:', err);
        alert('Ошибка получения списка тунелей. Смотрите консоль.');
        closePopup();
        return;
    }

    tunnelsList.forEach(tunnel => {
        const row = document.createElement('div');
        Object.assign(row.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '14px'
        });

        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';
        const cName = countryNames[tunnel.countryCode] || tunnel.countryCode;
        const textSpan = document.createElement('span');
        textSpan.textContent = `${cName} ${tunnel.regionCode}`;
        leftDiv.appendChild(textSpan);

        const rightDiv = document.createElement('div');
        Object.assign(rightDiv.style, { display: 'flex', alignItems: 'center' });
        const activeSpan = document.createElement('span');
        Object.assign(activeSpan.style, { width: '30px', textAlign: 'right', display: 'inline-block', marginRight: '10px' });
        activeSpan.textContent = tunnel.activeNum;

        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.dataset.tunnelCode = tunnel.tunnelCode;
        chk.dataset.regionCode = tunnel.regionCode;
        chk.dataset.countryCode = tunnel.countryCode;
        chk.dataset.activeNum = tunnel.activeNum;

        rightDiv.appendChild(activeSpan);
        rightDiv.appendChild(chk);
        row.appendChild(leftDiv);
        row.appendChild(rightDiv);
        tunnelsContainer.appendChild(row);
    });

    switchAllBtn.addEventListener('click', async () => {
        const checkedItems = [...tunnelsContainer.querySelectorAll('input[type=checkbox]')].filter(ch => ch.checked);
        if (!checkedItems.length) {
            alert('Не выбрано ни одного туннеля.');
            return;
        }
        let whitelist;
        try {
            whitelist = await getExistingWhitelist();
        } catch (err) {
            console.error('[Deeper Tools] Ошибка получения белого списка:', err);
            alert('Ошибка получения белого списка. Смотрите консоль.');
            return;
        }
        let freshTunnels;
        try {
            const resp = await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels');
            if (resp.status !== 200) throw new Error();
            freshTunnels = await resp.json();
        } catch (err) {
            console.error('[Deeper Tools] Ошибка повторного получения тунелей:', err);
            alert('Ошибка при запросе тунелей. Смотрите консоль.');
            return;
        }
        const selectedCodes = checkedItems.map(ch => ch.dataset.tunnelCode);
        for (const domainEntry of whitelist) {
            const candidates = freshTunnels.filter(t => selectedCodes.includes(t.tunnelCode));
            if (!candidates.length) continue;
            const maxActive = Math.max(...candidates.map(t => t.activeNum));
            const best = candidates.filter(t => t.activeNum === maxActive);
            const chosen = best[Math.floor(Math.random() * best.length)];
            try {
                await gmFetch('http://34.34.34.34/api/smartRoute/editWhiteEntry/domain', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        domainName: domainEntry.domainName,
                        fromTunnelCode: domainEntry.tunnelCode,
                        toTunnelCode: chosen.tunnelCode
                    })
                });
            } catch (e) {
                console.error('[Deeper Tools] Ошибка переключения для домена:', domainEntry.domainName, e);
            }
        }
        alert('Массовое переключение выполнено.');
        closePopup();
    });

    offBtn.addEventListener('click', async () => {
        const checkedItems = [...tunnelsContainer.querySelectorAll('input[type=checkbox]')].filter(ch => ch.checked);
        if (!checkedItems.length) {
            alert('Не выбрано ни одного туннеля.');
            return;
        }
        let freshTunnels;
        try {
            const resp = await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels');
            if (resp.status !== 200) throw new Error();
            freshTunnels = await resp.json();
        } catch (err) {
            console.error('[Deeper Tools] Ошибка повторного получения тунелей:', err);
            alert('Ошибка при запросе тунелей. Смотрите консоль.');
            return;
        }
        for (const item of checkedItems) {
            const fromCode = item.dataset.tunnelCode;
            const whitelist = await getExistingWhitelist();
            const entries = whitelist.filter(e => e.tunnelCode === fromCode);
            const candidates = freshTunnels.filter(t => t.tunnelCode !== fromCode);
            if (!candidates.length) continue;
            const maxActive = Math.max(...candidates.map(t => t.activeNum));
            const best = candidates.filter(t => t.activeNum === maxActive);
            for (const domainEntry of entries) {
                const chosen = best[Math.floor(Math.random() * best.length)];
                try {
                    await gmFetch('http://34.34.34.34/api/smartRoute/editWhiteEntry/domain', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            domainName: domainEntry.domainName,
                            fromTunnelCode: fromCode,
                            toTunnelCode: chosen.tunnelCode
                        })
                    });
                } catch (e) {
                    console.error('[Deeper Tools] Ошибка отключения для домена:', domainEntry.domainName, e);
                }
            }
        }
        alert('Массовое отключение выполнено.');
        closePopup();
    });

    randomizeBtn.addEventListener('click', async () => {
        try {
            const whitelist = await getExistingWhitelist();
            if (!whitelist.length) {
                alert('Нет доменов для распределения.');
                return;
            }
            const resp = await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels');
            const tunnels = (await resp.json()).map(t => t.tunnelCode);
            if (!tunnels.length) {
                alert('Нет доступных туннелей.');
                return;
            }

            const domains = [...whitelist];
            for (let i = domains.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [domains[i], domains[j]] = [domains[j], domains[i]];
            }

            for (let idx = 0; idx < domains.length; idx++) {
                const entry = domains[idx];
                const toTunnel = tunnels[idx % tunnels.length];
                await gmFetch('http://34.34.34.34/api/smartRoute/editWhiteEntry/domain', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        domainName: entry.domainName,
                        fromTunnelCode: entry.tunnelCode,
                        toTunnelCode: toTunnel
                    })
                });
            }
            alert('Рандомизация доменов завершена!');
            closePopup();
        } catch (err) {
            console.error('[Deeper Tools] Ошибка рандомизации:', err);
            alert('Ошибка при рандомизации. Смотрите консоль.');
        }
    });
}


        const domainSet = new Set();
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            if (getScannerEnabled()) {
                try {
                    const url = (typeof input === 'string') ? input : input.url;
                    const urlObj = new URL(url);
                    addDomain(urlObj.hostname);
                } catch(e) {}
            }
            return originalFetch.apply(this, arguments);
        };

        const observer = new MutationObserver(mutations => {
            if (!getScannerEnabled()) return;
            mutations.forEach(m => {
                if (m.addedNodes) {
                    m.addedNodes.forEach(node => {
                        if (node.tagName) {
                            const src = node.src || node.href;
                            if (src) {
                                try {
                                    const urlObj = new URL(src);
                                    addDomain(urlObj.hostname);
                                } catch(e) {}
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        setInterval(() => {
            if (!getScannerEnabled()) return;
            const entries = performance.getEntriesByType('resource');
            entries.forEach(entry => {
                try {
                    const urlObj = new URL(entry.name);
                    addDomain(urlObj.hostname);
                } catch(e) {}
            });
        }, 1000);

        function addDomain(domain) {
            if (!domainSet.has(domain)) {
                domainSet.add(domain);
                updateDomainList();
            }
        }

        function ensureScannerContainer() {
            if (!getScannerEnabled()) return;
            if (document.getElementById('domain-scanner-container')) return;
            const container = document.createElement('div');
            container.id = 'domain-scanner-container';
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.width = '300px';
            container.style.maxHeight = '80vh';
            container.style.overflowY = 'auto';
            container.style.backgroundColor = 'white';
            container.style.border = '1px solid black';
            container.style.zIndex = '10000';
            container.style.padding = '10px';
            container.style.fontSize = '12px';
            container.style.fontFamily = 'monospace';
            container.style.color = 'black';
            container.style.whiteSpace = 'pre-wrap';
            const domainList = document.createElement('div');
            domainList.id = 'domain-list';
            container.appendChild(domainList);
            const addBtn = document.createElement('button');
            addBtn.id = 'add-to-deeper-btn';
            addBtn.textContent = 'Добавить в deeper';
            Object.assign(addBtn.style, {
                display: 'block',
                width: '100%',
                marginTop: '10px',
                padding: '6px 10px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
            });
            addBtn.addEventListener('click', addToDeeper);
            container.appendChild(addBtn);
            document.body.appendChild(container);
        }

        function updateDomainList() {
            const container = document.getElementById('domain-scanner-container');
            if (!container) return;
            const listEl = container.querySelector('#domain-list');
            const checkedStates = {};
            listEl.querySelectorAll('.domain-checkbox').forEach(cb => {
                checkedStates[cb.dataset.domain] = cb.checked;
            });
            const sortedArr = Array.from(domainSet).sort();
            listEl.innerHTML = '';
            sortedArr.forEach(domain => {
                const domainRow = document.createElement('div');
                domainRow.style.display = 'flex';
                domainRow.style.justifyContent = 'space-between';
                domainRow.style.alignItems = 'center';
                domainRow.style.marginBottom = '3px';
                const domainText = document.createElement('span');
                domainText.textContent = domain;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('domain-checkbox');
                checkbox.dataset.domain = domain;
                checkbox.checked = !!checkedStates[domain];
                domainRow.appendChild(domainText);
                domainRow.appendChild(checkbox);
                listEl.appendChild(domainRow);
            });
        }

        async function addToDeeper() {
            try {
                const response = await gmFetch('http://34.34.34.34/api/smartRoute/getRoutingWhitelist/domain?pageNo=1&pageSize=100');
                if (response.status !== 200) {
                    alert('[Deeper Tools] Ошибка при получении белого списка');
                    return;
                }
                const data = await response.json();
                const existingDomains = new Set();
                const tunnelCodes = [];
                if (Array.isArray(data.list)) {
                    data.list.forEach(item => {
                        if (item.domainName) existingDomains.add(item.domainName);
                        if (item.tunnelCode) tunnelCodes.push(item.tunnelCode);
                    });
                }
                if (tunnelCodes.length === 0) {
                    tunnelCodes.push('defaultCode');
                }
                const container = document.getElementById('domain-scanner-container');
                if (!container) return;
                const checkboxes = container.querySelectorAll('.domain-checkbox');
                const selectedDomains = [];
                checkboxes.forEach(cb => {
                    if (cb.checked) {
                        selectedDomains.push(cb.dataset.domain);
                    }
                });
                if (selectedDomains.length === 0) {
                    alert('[Deeper Tools] Выберите домены для добавления.');
                    return;
                }
                const newItems = [];
                selectedDomains.forEach(d => {
                    if (!existingDomains.has(d)) {
                        const randomIndex = Math.floor(Math.random() * tunnelCodes.length);
                        newItems.push({
                            domainName: d,
                            tunnelCode: tunnelCodes[randomIndex]
                        });
                    }
                });
                if (newItems.length === 0) {
                    alert('[Deeper Tools] Нет новых доменов для добавления.');
                    return;
                }
                for (let item of newItems) {
                    const r = await gmFetch('http://34.34.34.34/api/smartRoute/addToWhitelist/domain', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(item)
                    });
                    if (r.status !== 200) {
                        console.error('[Deeper Tools] Ошибка при добавлении домена:', item);
                    }
                }
                alert('[Deeper Tools] Новые домены добавлены в deeper!');
            } catch (err) {
                console.error('[Deeper Tools] Ошибка при добавлении в deeper:', err);
                alert('Ошибка при добавлении. Смотрите консоль.');
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
                scannerMenuCommandId = GM_registerMenuCommand(label, () => {
                    setScannerEnabled(!getScannerEnabled());
                });
            }
        }
        if (GM_getValue('domainScannerEnabled') === undefined) {
            GM_setValue('domainScannerEnabled', false);
        }
        updateScannerMenuCommand();
        if (getScannerEnabled()) {
            if (['complete','interactive'].includes(document.readyState)) {
                ensureScannerContainer();
            } else {
                document.addEventListener('DOMContentLoaded', ensureScannerContainer);
            }
        }
    }
})();
