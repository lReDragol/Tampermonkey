// ==UserScript==
// @name         Steam recommendations.
// @namespace    Steam recommendations.
// @version      1.8
// @description  Steam recommendations.
// @author       Drago
// @match        https://store.steampowered.com/explore/
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    var isRunning = false;
    var toggleButton = document.createElement('button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';

    function clickElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.click();
        }
    }

    function waitAndClickElement(selector, delay) {
        setTimeout(function() {
            clickElement(selector);
        }, delay);
    }

    function clickElementsLoop() {
        if (!isRunning) {
            return;
        }

        clickElement('#responsive_page_template_content > div.page_content_ctn > div > div:nth-child(1) > div');
        setTimeout(function() {
            location.reload();
        }, 11000);
    }

    function updateButtonColor() {
        toggleButton.style.backgroundColor = isRunning ? 'green' : 'red';
    }

    toggleButton.textContent = 'Start';
    updateButtonColor();

    toggleButton.addEventListener('click', function() {
        isRunning = !isRunning;
        toggleButton.textContent = isRunning ? 'Stop' : 'Start';
        updateButtonColor();

        if (isRunning) {
            clickElementsLoop();
        }
    });

    document.body.appendChild(toggleButton);

    window.addEventListener('beforeunload', function() {
        localStorage.setItem('steamScriptIsRunning', JSON.stringify(isRunning));
    });

    window.addEventListener('load', function() {
        var storedState = localStorage.getItem('steamScriptIsRunning');
        if (storedState !== null) {
            isRunning = JSON.parse(storedState);
            if (isRunning) {
                clickElementsLoop();
            }
        }
    });
})();