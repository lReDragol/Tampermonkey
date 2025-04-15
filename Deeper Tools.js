// ==UserScript==
// @name         Deeper Tools
// @description  Набор инструментов для Deeper
// @author       https://github.com/lReDragol
// @namespace    http://tampermonkey.net/
// @version      3.5.2
// @icon         https://avatars.mds.yandex.net/get-socsnippets/10235467/2a0000019509580bc84108597cea65bc46ee/square_83
// @match        http://34.34.34.34/*
// @match        *://*/*
// @license      MIT
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL  https://update.greasyfork.org/scripts/527972/Deeper%20Tools.user.js
// @updateURL    https://update.greasyfork.org/scripts/527972/Deeper%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========= КАРТА countryCode => Название страны на русском =========
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
            AD: "Андорра",
            AE: "Объединенные Арабские Эмираты",
            AF: "Афганистан",
            AG: "Антигуа и Барбуда",
            AI: "Ангилья",
            AL: "Албания",
            AM: "Армения",
            AO: "Ангола",
            AR: "Аргентина",
            AS: "Американское Самоа",
            AT: "Австрия",
            AU: "Австралия",
            AW: "Аруба",
            AX: "Аландские острова",
            AZ: "Азербайджан",
            BA: "Босния и Герцеговина",
            BB: "Барбадос",
            BD: "Бангладеш",
            BE: "Бельгия",
            BF: "Буркина-Фасо",
            BG: "Болгария",
            BH: "Бахрейн",
            BI: "Бурунди",
            BJ: "Бенин",
            BL: "Сен-Бартелеми",
            BM: "Бермуды",
            BN: "Бруней",
            BO: "Боливия",
            BQ: "Карибская Нидерландия",
            BR: "Бразилия",
            BS: "Багамы",
            BT: "Бутан",
            BW: "Ботсвана",
            BY: "Беларусь",
            BZ: "Белиз",
            CA: "Канада",
            CC: "Кокосовые (Килинг) острова",
            CD: "Конго (Киншаса)",
            CF: "Центрально-Африканская Республика",
            CG: "Конго (Браззавиль)",
            CH: "Швейцария",
            CI: "Кот-д'Ивуар",
            CK: "Острова Кука",
            CL: "Чили",
            CM: "Камерун",
            CN: "Китай",
            CO: "Колумбия",
            CR: "Коста-Рика",
            CU: "Куба",
            CV: "Кабо-Верде",
            CW: "Кюрасао",
            CX: "Остров Рождества",
            CY: "Кипр",
            CZ: "Чехия",
            DE: "Германия",
            DJ: "Джибути",
            DK: "Дания",
            DM: "Доминика",
            DO: "Доминиканская Республика",
            DZ: "Алжир",
            EC: "Эквадор",
            EE: "Эстония",
            EG: "Египет",
            ER: "Эритрея",
            ES: "Испания",
            ET: "Эфиопия",
            FI: "Финляндия",
            FJ: "Фиджи",
            FK: "Фолклендские острова",
            FM: "Федеративные Штаты Микронезии",
            FO: "Фарерские острова",
            FR: "Франция",
            GA: "Габон",
            GB: "Великобритания",
            GD: "Гренада",
            GE: "Грузия",
            GF: "Французская Гвиана",
            GG: "Гернси",
            GH: "Гана",
            GI: "Гибралтар",
            GL: "Гренландия",
            GM: "Гамбия",
            GN: "Гвинея",
            GP: "Гваделупа",
            GQ: "Экваториальная Гвинея",
            GR: "Греция",
            GS: "Южная Джорджия и Южные Сандвичевы острова",
            GT: "Гватемала",
            GU: "Гуам",
            GW: "Гвинея-Бисау",
            GY: "Гайана",
            HK: "Гонконг (Китай)",
            HN: "Гондурас",
            HR: "Хорватия",
            HT: "Гаити",
            HU: "Венгрия",
            ID: "Индонезия",
            IE: "Ирландия",
            IL: "Израиль",
            IM: "Остров Мэн",
            IN: "Индия",
            IO: "Британская территория в Индийском океане",
            IQ: "Ирак",
            IR: "Иран",
            IS: "Исландия",
            IT: "Италия",
            JE: "Джерси",
            JM: "Ямайка",
            JO: "Иордания",
            JP: "Япония",
            KE: "Кения",
            KG: "Киргизия",
            KH: "Камбоджа",
            KI: "Кирибати",
            KM: "Коморы",
            KN: "Сент-Китс и Невис",
            KR: "Южная Корея",
            KW: "Кувейт",
            KY: "Каймановы острова",
            KZ: "Казахстан",
            KP: "Северная Корея",
            LA: "Лаос",
            LB: "Ливан",
            LC: "Сент-Люсия",
            LI: "Лихтенштейн",
            LK: "Шри-Ланка",
            LR: "Либерия",
            LS: "Лесото",
            LT: "Литва",
            LU: "Люксембург",
            LV: "Латвия",
            LY: "Ливия",
            MA: "Марокко",
            MC: "Монако",
            MD: "Молдавия",
            ME: "Черногория",
            MF: "Сен-Мартен (фр.)",
            MG: "Мадагаскар",
            MH: "Маршалловы острова",
            MK: "Северная Македония",
            ML: "Мали",
            MM: "Мьянма (Бирма)",
            MN: "Монголия",
            MO: "Макао (Китай)",
            MP: "Северные Марианские острова",
            MQ: "Мартиника",
            MR: "Мавритания",
            MS: "Монтсеррат",
            MT: "Мальта",
            MU: "Маврикий",
            MV: "Мальдивы",
            MW: "Малави",
            MX: "Мексика",
            MY: "Малайзия",
            MZ: "Мозамбик",
            NA: "Намибия",
            NC: "Новая Каледония",
            NE: "Нигер",
            NF: "Остров Норфолк",
            NG: "Нигерия",
            NI: "Никарагуа",
            NL: "Нидерланды",
            NO: "Норвегия",
            NP: "Непал",
            NR: "Науру",
            NU: "Ниуэ",
            NZ: "Новая Зеландия",
            OM: "Оман",
            PA: "Панама",
            PE: "Перу",
            PF: "Французская Полинезия",
            PG: "Папуа — Новая Гвинея",
            PH: "Филиппины",
            PK: "Пакистан",
            PL: "Польша",
            PM: "Сен-Пьер и Микелон",
            PN: "Острова Питкэрн",
            PR: "Пуэрто-Рико",
            PS: "Палестинские территории",
            PT: "Португалия",
            PW: "Палау",
            PY: "Парагвай",
            QA: "Катар",
            RE: "Реюньон",
            RO: "Румыния",
            RS: "Сербия",
            RU: "Россия",
            RW: "Руанда",
            SA: "Саудовская Аравия",
            SB: "Соломоновы острова",
            SC: "Сейшельские Острова",
            SD: "Судан",
            SE: "Швеция",
            SG: "Сингапур",
            SH: "Острова Святой Елены, Вознесения и Тристан-да-Кунья",
            SI: "Словения",
            SJ: "Шпицберген и Ян-Майен",
            SK: "Словакия",
            SL: "Сьерра-Леоне",
            SM: "Сан-Марино",
            SN: "Сенегал",
            SO: "Сомали",
            SR: "Суринам",
            SS: "Южный Судан",
            ST: "Сан-Томе и Принсипи",
            SV: "Сальвадор",
            SX: "Синт-Мартен",
            SY: "Сирия",
            SZ: "Эсватини",
            TC: "Теркс и Кайкос",
            TD: "Чад",
            TF: "Французские Южные и Антарктические Территории",
            TG: "Того",
            TH: "Таиланд",
            TJ: "Таджикистан",
            TK: "Токелау",
            TL: "Восточный Тимор",
            TM: "Туркменистан",
            TN: "Тунис",
            TO: "Тонга",
            TR: "Турция",
            TT: "Тринидад и Тобаго",
            TV: "Тувалу",
            TW: "Тайвань",
            TZ: "Танзания",
            UA: "Украина",
            UB: "Запад США",
            UC: "Средний Запад США",
            UD: "Юго-Запад США",
            UE: "Северо-Восток США",
            UF: "Юго-Восток США",
            UG: "Уганда",
            US: "Соединенные Штаты",
            UY: "Уругвай",
            UZ: "Узбекистан",
            VA: "Ватикан",
            VC: "Сент-Винсент и Гренадины",
            VE: "Венесуэла",
            VG: "Британские Виргинские острова",
            VI: "Американские Виргинские острова",
            VN: "Вьетнам",
            VU: "Вануату",
            WF: "Уоллис и Футуна",
            WS: "Самоа",
            XK: "Косово",
            YE: "Йемен",
            YT: "Майотта",
            ZA: "Южная Африка",
            ZM: "Замбия",
            ZW: "Зимбабве"
        };

    // ---------------------- Обёртка для GM_xmlhttpRequest (аналог fetch) ----------------------
    function gmFetch(url, init = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: init.method || 'GET',
                url: url,
                headers: init.headers || {},
                data: init.body || null,
                onload: function(response) {
                    try {
                        response.json = function() {
                            return Promise.resolve(JSON.parse(response.responseText));
                        };
                    } catch(e) {
                        response.json = function() {
                            return Promise.reject(e);
                        };
                    }
                    resolve(response);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // ---------------------- Функции включения/выключения сканера доменов ----------------------
    function getScannerEnabled() {
        return GM_getValue('domainScannerEnabled', false);
    }
    function setScannerEnabled(val) {
        GM_setValue('domainScannerEnabled', val);
        updateScannerMenuCommand();
        if (!val) {
            const container = document.getElementById('domain-scanner-container');
            if (container) container.remove();
        } else {
            ensureScannerContainer();
        }
        console.log('[Deeper Tools] Domain Scanner: ' + (val ? 'ON' : 'OFF'));
    }

    // ---------------------- Перехват XHR для отслеживания доменов и паролей ----------------------
    const nativeOpen = XMLHttpRequest.prototype.open;
    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        if (getScannerEnabled()) {
            try {
                const urlObj = new URL(url);
                addDomain(urlObj.hostname);
            } catch(e) {}
        }
        return nativeOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
        if (
            this._url &&
            this._url.includes('/api/admin/login') &&
            this._method &&
            this._method.toUpperCase() === 'POST'
        ) {
            try {
                const parsed = JSON.parse(body);
                if (parsed && parsed.password) {
                    if (!localStorage.getItem('adminPassword')) {
                        localStorage.setItem('adminPassword', parsed.password);
                        console.log('[Deeper Tools] Пароль сохранён из XHR.');
                    }
                }
            } catch (err) {
                console.error('[Deeper Tools] Ошибка парсинга XHR при авторизации:', err);
            }
        }
        return nativeSend.apply(this, arguments);
    };

    // ---------------------- Автологин, если пароль сохранён ----------------------
    if (window.location.href.includes('/login/')) {
        const storedPassword = localStorage.getItem('adminPassword');
        if (storedPassword) {
            window.addEventListener('load', () => {
                gmFetch('http://34.34.34.34/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "username": "admin",
                        "password": storedPassword
                    })
                })
                .then(response => {
                    if (response.status === 200) {
                        window.location.href = 'http://34.34.34.34/admin/dashboard';
                    }
                    return response.json();
                })
                .then(data => console.log('[Deeper Tools] Авторизация прошла успешно:', data))
                .catch(error => console.error('[Deeper Tools] Ошибка при авторизации:', error));
            });
        } else {
            console.log('[Deeper Tools] Пароль не найден. Выполните ручную авторизацию.');
        }
    }

    // ---------------------- Главное меню на странице 34.34.34.34 ----------------------
    if (window.location.href.startsWith('http://34.34.34.34/')) {
        // Кнопка-иконка (открывает меню)
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

        // Меню
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
            menuContainer.style.display = (menuContainer.style.display === 'none') ? 'flex' : 'none';
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

        // Новая кнопка для массового переключения тунелей
        const allToffBtn = document.createElement('button');
        allToffBtn.textContent = 'All_T_OFF';
        allToffBtn.title = "Тут можно отключить все домены от определённых тунелей и переключить их на другой.";
        Object.assign(allToffBtn.style, buttonStyle);

        menuContainer.appendChild(downloadBtn);
        menuContainer.appendChild(uploadBtn);
        menuContainer.appendChild(disableRebootBtn);
        menuContainer.appendChild(forgetBtn);
        menuContainer.appendChild(allToffBtn);

        function ensureMenu() {
            if (!document.body.contains(iconButton)) {
                document.body.appendChild(iconButton);
            }
            if (!document.body.contains(menuContainer)) {
                document.body.appendChild(menuContainer);
            }
        }
        document.addEventListener('DOMContentLoaded', ensureMenu);
        new MutationObserver(ensureMenu).observe(document.documentElement, { childList: true, subtree: true });

        // ---------------------- Получение белого списка ----------------------
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
                localStorage.removeItem('adminPassword');
                alert('[Deeper Tools] Пароль очищен. Авторизуйтесь вручную.');
            }
        });

        // ---------------------- Кнопка All_T_OFF: массовое переключение тунелей ----------------------
        allToffBtn.addEventListener('click', showAllToffPopup);

        // ---------------------- Модальное окно для массового переключения тунелей ----------------------
        async function showAllToffPopup() {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = '20000';

            const popup = document.createElement('div');
            // Увеличиваем ширину окна на 10% (с 400px до 440px)
            popup.style.maxWidth = '440px';
            popup.style.width = '90%';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.background = '#fff';
            popup.style.padding = '20px';
            popup.style.borderRadius = '8px';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

            const title = document.createElement('h3');
            title.textContent = 'Массовое отключение доменов';
            popup.appendChild(title);

            const tunnelsContainer = document.createElement('div');
            tunnelsContainer.style.maxHeight = '300px';
            tunnelsContainer.style.overflowY = 'auto';
            tunnelsContainer.style.marginBottom = '10px';
            popup.appendChild(tunnelsContainer);

            // Создаем контейнер для кнопок с горизонтальным расположением
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.justifyContent = 'flex-end';
            btnContainer.style.gap = '10px';

            // Новая кнопка "Переключить все"
            const switchAllBtn = document.createElement('button');
            switchAllBtn.textContent = 'Переключить все';
            switchAllBtn.style.backgroundColor = '#0077cc';
            switchAllBtn.style.color = '#fff';
            switchAllBtn.style.borderRadius = '4px';
            switchAllBtn.style.padding = '8px 14px';
            // Кнопка "Отключиться"
            const offBtn = document.createElement('button');
            offBtn.textContent = 'Отключиться';
            offBtn.style.backgroundColor = '#bb0000';
            offBtn.style.color = '#fff';
            offBtn.style.borderRadius = '4px';
            offBtn.style.padding = '8px 14px';
            // Кнопка "Отмена"
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Отмена';
            cancelBtn.style.backgroundColor = '#666';
            cancelBtn.style.color = '#fff';
            cancelBtn.style.borderRadius = '4px';
            cancelBtn.style.padding = '8px 14px';

            btnContainer.appendChild(switchAllBtn);
            btnContainer.appendChild(offBtn);
            btnContainer.appendChild(cancelBtn);
            popup.appendChild(btnContainer);

            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            function closePopup() { overlay.remove(); }
            cancelBtn.addEventListener('click', closePopup);

            // Получение списка тунелей
            let tunnelsList = [];
            try {
                const response = await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels');
                if (response.status !== 200) {
                    throw new Error('Ошибка получения списка тунелей');
                }
                tunnelsList = await response.json();
            } catch (err) {
                console.error('[Deeper Tools] Ошибка при получении тунелей:', err);
                alert('Ошибка получения списка тунелей. Смотрите консоль.');
                closePopup();
                return;
            }

            // Отрисовка списка тунелей по строкам: "Название страны regionCode activeNum" с чекбоксом
            tunnelsList.forEach(tunnel => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.justifyContent = 'space-between';
                row.style.marginBottom = '5px';
                row.style.fontSize = '14px';

                const leftDiv = document.createElement('div');
                leftDiv.style.display = 'flex';
                leftDiv.style.alignItems = 'center';

                const cName = countryNames[tunnel.countryCode] || tunnel.countryCode;
                const rCode = tunnel.regionCode;
                const textSpan = document.createElement('span');
                // Формат: "Канада AMN"
                textSpan.textContent = `${cName} ${rCode}`;
                leftDiv.appendChild(textSpan);

                const rightDiv = document.createElement('div');
                rightDiv.style.display = 'flex';
                rightDiv.style.alignItems = 'center';

                const activeSpan = document.createElement('span');
                activeSpan.style.width = '30px';
                activeSpan.style.textAlign = 'right';
                activeSpan.style.display = 'inline-block';
                activeSpan.textContent = tunnel.activeNum;
                activeSpan.style.marginRight = '10px';

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

            // Обработчик для кнопки "Переключить все"
            switchAllBtn.addEventListener('click', async () => {
                // Собираем выбранные тунели (их tunnelCode)
                const checkedItems = [...tunnelsContainer.querySelectorAll('input[type=checkbox]')].filter(ch => ch.checked);
                if (checkedItems.length === 0) {
                    alert('Не выбрано ни одного туннеля.');
                    return;
                }
                const selectedCandidateTunnelCodes = checkedItems.map(ch => ch.dataset.tunnelCode);

                let whitelist = [];
                try {
                    whitelist = await getExistingWhitelist();
                } catch(err) {
                    console.error('[Deeper Tools] Ошибка получения белого списка:', err);
                    alert('Ошибка получения белого списка. Смотрите консоль.');
                    return;
                }
                let freshTunnelsList = [];
                try {
                    const response2 = await gmFetch('http://34.34.34.34/api/smartRoute/listTunnels');
                    if (response2.status !== 200) {
                        throw new Error('Ошибка получения списка тунелей (повторно)');
                    }
                    freshTunnelsList = await response2.json();
                } catch (err) {
                    console.error('[Deeper Tools] Ошибка при повторном запросе тунелей:', err);
                    alert('Ошибка при запросе тунелей. Смотрите консоль.');
                    return;
                }
                // Логика "Переключить все": для каждого домена из белого списка обновляем tunnelCode
                for (const domainEntry of whitelist) {
                    // Выбираем кандидатов из выбранных тунелей
                    const candidates = freshTunnelsList.filter(t => selectedCandidateTunnelCodes.includes(t.tunnelCode));
                    if (candidates.length === 0) continue;
                    const maxActive = Math.max(...candidates.map(t => t.activeNum));
                    const bestCandidates = candidates.filter(t => t.activeNum === maxActive);
                    const chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
                    try {
                        const editRes = await gmFetch('http://34.34.34.34/api/smartRoute/editWhiteEntry/domain', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                domainName: domainEntry.domainName,
                                fromTunnelCode: domainEntry.tunnelCode,
                                toTunnelCode: chosen.tunnelCode
                            })
                        });
                        if (editRes.status !== 200) {
                            console.error('[Deeper Tools] Ошибка переключения для домена:', domainEntry.domainName);
                        }
                    } catch(err) {
                        console.error('[Deeper Tools] Ошибка при переключении:', err);
                    }
                }
                alert('Массовое переключение выполнено.');
                closePopup();
            });

            // Обработчик для кнопки "Отключиться"
            offBtn.addEventListener('click', async () => {
                const checkedItems = [...tunnelsContainer.querySelectorAll('input[type=checkbox]')].filter(ch => ch.checked);
                if (checkedItems.length === 0) {
                    alert('Не выбрано ни одного туннеля.');
                    return;
                }
                for (const item of checkedItems) {
                    const fromTunnel = item.dataset.tunnelCode;
                    const entriesToSwitch = (await getExistingWhitelist()).filter(entry => entry.tunnelCode === fromTunnel);
                    const candidates = freshTunnelsList.filter(t => t.tunnelCode !== fromTunnel);
                    if (candidates.length === 0) {
                        console.warn('Нет кандидатов для переключения, пропускаем:', fromTunnel);
                        continue;
                    }
                    const maxActive = Math.max(...candidates.map(t => t.activeNum));
                    const bestCandidates = candidates.filter(t => t.activeNum === maxActive);
                    for (const domainEntry of entriesToSwitch) {
                        const chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
                        try {
                            const editRes = await gmFetch('http://34.34.34.34/api/smartRoute/editWhiteEntry/domain', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    domainName: domainEntry.domainName,
                                    fromTunnelCode: fromTunnel,
                                    toTunnelCode: chosen.tunnelCode
                                })
                            });
                            if (editRes.status !== 200) {
                                console.error('[Deeper Tools] Ошибка переключения для домена:', domainEntry.domainName);
                            }
                        } catch(err) {
                            console.error('[Deeper Tools] Ошибка при переключении:', err);
                        }
                    }
                }
                alert('Массовое переключение выполнено.');
                closePopup();
            });
        }
    }

    // ---------------------- Сканер доменов ----------------------
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

    // ---------------------- Контейнер для списка доменов ----------------------
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

    // ---------------------- Добавление выбранных доменов в deeper ----------------------
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

    // ---------------------- Пункт меню Tampermonkey для включения/выключения сканера ----------------------
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
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            ensureScannerContainer();
        } else {
            document.addEventListener('DOMContentLoaded', ensureScannerContainer);
        }
    }
})();
