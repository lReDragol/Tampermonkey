// ==UserScript==
// @name         Найти прокси на сайте spysone
// @namespace    spysone-proxy-finder
// @version      1
// @description  Поиск прокси на сайте spysone и отображение в новом окне поверх всех слоев при нажатии кнопки "Найти прокси"
// @match        https://spys.one/proxies/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// ==/UserScript==

(function() {
  'use strict';

  function removeUnwantedText() {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      if (script.type === "text/javascript" && script.textContent.includes("document.write(\"<font class=spy2>")) {
        script.textContent = "";
      }
    }
  }

  function getProxies() {
    console.log("Starting to search for proxies...");
    removeUnwantedText();
    const proxyTable = document.querySelector("html > body > table > tbody > tr > td > table > tbody");
    if (!proxyTable) {
      console.log("Ошибка: Не удалось найти прокси-таблицу на странице");
      return;
    }

    const proxyRows = proxyTable.querySelectorAll("tr.spy1x, tr.spy1xx");
    if (proxyRows.length === 0) {
      console.log("Ошибка: Не удалось найти ни одной строки прокси в таблице");
      return;
    }

    console.log(`Найдене ${proxyRows.length} прокси на странице:`);
    const proxyList = [];
    proxyRows.forEach((row) => {
      const proxyColumns = row.querySelectorAll("td[colspan='1']");
      if (proxyColumns.length >= 2) {
        const ip = proxyColumns[0].querySelector("font.spy14");
        const port = proxyColumns[0].querySelector("script");
        const protocol = proxyColumns[1].querySelector("font.spy1");
        if (ip && port && protocol) {
          const proxy = `${ip.textContent}:${port.textContent.replace(/\D/g, '')} ${protocol.textContent}`;
          proxyList.push(proxy);
          console.log(proxy);
        }
      }
    });

    if (proxyList.length > 0) {
      const proxyText = proxyList.join("\n");
      const popup = window.open("", "Proxies", "width=500,height=500,resizable,scrollbars=yes,top=100,left=100");
      popup.document.body.innerHTML = `<pre>${proxyText}</pre>`;
      popup.focus();
    } else {
      console.log("Ошибка: На странице не найдено ни одного действующего прокси-сервера");
    }
  }

  const button = document.createElement("button");
  button.textContent = "Найти прокси";
  button.style.position = "fixed";
  button.style.top = "50px";
  button.style.right = "50px";
  button.style.zIndex = "9999";
  button.addEventListener("click", getProxies);
  document.body.appendChild(button);
})();
