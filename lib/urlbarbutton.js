/*global require: false, exports: false */
/*jslint forin: true, indent: 2 */

var winUtils = require("window-utils"),
  UrlbarButton;

UrlbarButton = function (options) {
  "use strict";

  if (!options || !options.id) {
    return;
  }

  var windowTracker,
    // Methods used internally
    getPageDocument,
    // Methods exposed externally
    getButtons,
    setImage,
    setVisibility,
    remove;

  getPageDocument = function (windowElement) {
    var document, pageWindow, pageTabBrowser;

    if (windowElement.gBrowser) {
      pageWindow = windowElement;
    } else {
      pageWindow = windowElement.ownerDocument.defaultView;
    }

    if (windowElement.tagName === 'tab') {
      pageTabBrowser = pageWindow.gBrowser.getBrowserForTab(windowElement);
      document = pageTabBrowser.contentDocument;
    } else {
      document = pageWindow.gBrowser.contentDocument;
    }

    return document;
  };

  getButtons = function (href) {
    var button, window,
      elements = [];

    for (window in winUtils.browserWindowIterator()) {
      if (!href || (window.gBrowser && href === getPageDocument(window).location.href)) {
        button = window.document.getElementById(options.id);
        if (button) {
          elements.push(button);
        }
      }
    }

    return elements;
  };

  setImage = function (src, href) {
    getButtons(href).forEach(function (button) {
      button.src = src;
    });
  };

  setVisibility = function (show, href) {
    if (href) {
      getButtons(href).forEach(function (button) {
        button.collapsed = !show;
      });
    }
  };

  remove = function () {
    windowTracker.unload();
  };

  windowTracker = new winUtils.WindowTracker({
    onTrack: function (window) {
      var button, urlbarIcons;

      urlbarIcons = window.document.getElementById("urlbar-icons");

      if (urlbarIcons && winUtils.isBrowser(window)) {
        button = window.document.getElementById(options.id);

        if (button) {
          button.parentNode.removeChild(button);
        }

        button = window.document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "image");

        button.id = options.id;
        button.className = "urlbar-icon";
        button.collapsed = true;

        if (options.image) {
          button.setAttribute("src", options.image);
        }
        if (options.onClick) {
          button.addEventListener("click", function (event) {
            var doc = getPageDocument(event.originalTarget);
            options.onClick.call(doc, doc.location.href, event);
          });
        }

        urlbarIcons.insertBefore(button, urlbarIcons.firstChild);
      }
    },
    onUntrack: function (window) {
      var button = window.document.getElementById(options.id);

      if (button) {
        button.parentNode.removeChild(button);
      }
    }
  });

  return {
    getButtons : getButtons,
    setImage : setImage,
    setVisibility : setVisibility,
    remove : remove
  };
};

exports.UrlbarButton = UrlbarButton;
