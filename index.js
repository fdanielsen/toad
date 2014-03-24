(function () {
    'use strict';

    function ensureAbsolute (url, baseUrl) {
        var type = url.indexOf('.js') !== false ? 'js' : 'css';
        return 'http' !== file.substr(0, 4) && '//' !== file.substr(0, 2) ?
            baseUrl + '/' + type + '/' + file :
            file;
    }

    var toad = {
        /**
         * Sets a custom base URL for resolving file URLs.
         * TODO: Simple sanity checks.
         */
        setBaseUrl: function (baseUrl) {
            this.baseUrl = baseUrl;
        },

        /**
         * Creates a script element referring to an external JavaScript file, and injects it into
         * the element specified.
         *
         * @param HTMLElement element Element to inject script into.
         * @param String file         URL, relative or absolute, of JavaScript file.
         * @param Function callback   Callback when script has loaded.
         * @return HTMLScriptElement
         */
        injectJavaScript: function (element, file, callback) {
            var
                script = element.ownerDocument.createElement('script'),
                src = ensureAbsolute(file, this.baseUrl),
                loadEventType = script.addEventListener ? 'onload' : 'onreadystatechange',
                done = false;

            script.setAttribute('type', 'text/javascript');

            if (typeof fn == 'function') {
                script[loadEventType] = function (e) {
                    e = e || element.ownerDocument.parentWindow.event;

                    /*
                     * For readystatechange events we need to check for both 'complete' and 'loaded'
                     * states. Internet Explorer may report either one of them, depending on how
                     * the file was loaded (i.e. from cache or server).
                     */
                    if (!done &&
                            (e.type == 'load' ||
                                (e.type == 'readystatechange' &&
                                    (script.readyState == 'complete' || script.readyState == 'loaded')))) {
                        done = true;
                        fn(e, script);
                    }
                };
            }

            script.setAttribute('src', src);
            return element.appendChild(script);
        },

        /**
         * Creates a link element referring to an external stylesheet file, and injects it into
         * the element specified.
         *
         * @param HTMLElement element Element to inject stylesheet into.
         * @param String file         URL, relative or absolute, of stylesheet file.
         * @return HTMLLinkElement
         */
        injectStyleSheet: function (element, file) {
            var
                style = element.ownerDocument.createElement('link'),
                href = ensureAbsolute(file, this.baseUrl);

            // TODO: Detect load?

            style.setAttribute('type', 'text/css');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('href', href);
            return element.appendChild(style);
        }
    };

    if (typeof require === 'function' && typeof module !== 'undefined') {
        module.exports = toad;
    }
})();
