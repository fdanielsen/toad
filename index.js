/**
 * Utility for loading CSS and JavaScript files into a browser context.
 *
 * Supports Internet Explorer 9+ and other modern browsers.
 */
(function () {
    'use strict';

    var baseUrl = '';

    function getType (url) {
        url = url.toLowerCase();
        if (url.indexOf('.js') !== -1) {
            return 'js';
        }
        else if (url.indexOf('.css') !== -1) {
            return 'css';
        }
        return false;
    }

    function ensureAbsolute (url) {
        var type = getType(url);
        return 'http' !== url.substr(0, 4) && '//' !== url.substr(0, 2) ?
            baseUrl + '/' + type + '/' + url :
            url;
    }

    var toad = {
        /**
         * Sets a custom base URL for resolving file URLs.
         * TODO: Simple sanity checks.
         */
        setBaseUrl: function (newBaseUrl) {
            baseUrl = newBaseUrl;
        },

        inject: function (element, files, callback) {
            var
                numFiles = files.length,
                filesDone = [],
                loaders = {
                    js: this.injectJavaScript,
                    css: this.injectStyleSheet
                };

            function fileDone (file) {
                filesDone.push(file)
                if (filesDone.length == numFiles && typeof callback === 'function') {
                    callback(filesDone);
                }
            }

            files.forEach(function (file) {
                loaders[getType(file)](element, file, fileDone);
            });
        },

        /**
         * Creates a script element referring to an external JavaScript file, and injects it into
         * the element specified.
         *
         * @param HTMLElement element Element to inject script into.
         * @param String file         URL, relative or absolute, of JavaScript file.
         * @param Function [success]  Function called after the script has loaded successfully.
         * @param Function [error]    Function called if an error occurred while loading the
         *                            script.
         * @return HTMLScriptElement
         */
        injectJavaScript: function (element, file, success, error) {
            var
                script = element.ownerDocument.createElement('script'),
                src = ensureAbsolute(file);

            if (typeof success === 'function') {
                script.onload = function () {
                    success(file);
                    script.onload = null;
                };
            }

            if (typeof error === 'function') {
                script.onerror = function () {
                    error(file);
                    element.removeChild(script);
                    script.onerror = null;
                };
            }

            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', src);

            return element.appendChild(script);
        },

        /**
         * Creates a link element referring to an external stylesheet file, and injects it into
         * the element specified.
         *
         * @param HTMLElement element Element to inject stylesheet into.
         * @param String file         URL, relative or absolute, of stylesheet file.
         * @param Function [success]  Function called after the stylesheet has loaded successfully.
         * @param Function [error]    Function called if an error occurred while loading the
         *                            stylesheet.
         * @return HTMLLinkElement
         */
        injectStyleSheet: function (element, file, success, error) {
            var
                style = element.ownerDocument.createElement('link'),
                href = ensureAbsolute(file);

            if (typeof success === 'function') {
                style.onload = function () {
                    success(file);
                    style.onload = null;
                };
            }

            if (typeof error === 'function') {
                style.onerror = function () {
                    error(file);
                    element.removeChild(style);
                    style.onerror = null;
                };
            }

            style.setAttribute('type', 'text/css');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('href', href);

            return element.appendChild(style);
        }
    };

    if (typeof require === 'function' && typeof module !== 'undefined') {
        module.exports = toad;
    }
    else {
        window.toad = toad;
    }
})();
