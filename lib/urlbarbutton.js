var Ci = require("chrome").Ci,
  Cr = require("chrome").Cr,
  winUtils = require("window-utils"),
  tabBrowser = require("tab-browser"),
  UrlbarButton;

UrlbarButton = function (options) {
  "use strict";

  if (!options || !options.id) {
    return;
  }

  var windowTracker, tabTracker,
    // Methods used internally
    getPageDocument, visibilityCallback, windowPageShowEvent, tabSelectEvent, tabProgressListener,
    // Methods exposed externally
    getButtons, setImage, setVisibility, remove;

  getPageDocument = function (pageTab) {
    pageTab = (pageTab ? pageTab : tabBrowser.activeTab)

    var pageWindow = pageTab.ownerDocument.defaultView,
      pageTabBrowser = pageWindow.gBrowser.getBrowserForTab(pageTab);

    return pageTabBrowser.contentDocument
  };

  getButtons = function (href) {
    var elements = [],
      button, window;

    for (window in winUtils.browserWindowIterator()) {
      if (!href || (window.gBrowser && href === getPageDocument(window.gBrowser.selectedTab).location.href)) {
        button = window.document.getElementById(options.id);
        if (button) {
          elements.push(button);
        }
      }
    }

    return elements;
  }

  setImage = function (href, src) {
    getButtons(href).forEach(function (button) {
      button.src = src;
    });
  };

  setVisibility = function (href, show) {
    if (href) {
      getButtons(href).forEach(function (button) {
        button.collapsed = !show;
      });
    }
  };

  remove = function () {
    tabTracker.unload();
    windowTracker.unload();
  };

  visibilityCallback = function (href, hide) {
    if (hide !== undefined) {
      setVisibility(href, !hide);
    }
  };

  windowPageShowEvent = function (event) {
    var doc = (event.type == 'hashchange' ? event.originalTarget.document : event.originalTarget),
      href;

    if (doc.defaultView.frameElement) return; // skip iframes/frames

    href = doc.location.href;

    options.onPageShow.call(doc, href, visibilityCallback.bind(undefined, href), getPageDocument().location.href !== href);
  };

  tabSelectEvent = function (event) {
    var doc = getPageDocument(event.originalTarget);
    options.onPageShow.call(doc, doc.location.href, visibilityCallback.bind(undefined, doc.location.href), false);
  };

  tabProgressListener = {
    QueryInterface: function (aIID) {
      if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
        return this;
      }
      throw Cr.NS_NOINTERFACE;
    },
    onLocationChange: function (aProgress, aRequest, aURI) {
      options.onLocationChange(aURI.spec, visibilityCallback.bind(undefined, aURI.spec));
    }
  };

  windowTracker = new winUtils.WindowTracker({
    onTrack: function (window) {
      var button, urlbarIcons, doc, appcontent;

      urlbarIcons = window.document.getElementById("urlbar-icons");

      if (urlbarIcons) {
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
            var doc = getPageDocument();
            options.onClick.call(doc, doc.location.href, event);
          });
        }

        urlbarIcons.insertBefore(button, urlbarIcons.firstChild);

        // Add listener for page show events

        if (options.onPageShow) {
          appcontent = window.document.getElementById("appcontent");
          appcontent.addEventListener('hashchange', windowPageShowEvent);
          appcontent.addEventListener('pageshow', windowPageShowEvent, true);
        }
      }
    },
    onUntrack: function (window) {
      var button = window.document.getElementById(options.id),
        appcontent;

      if (button) {
        button.parentNode.removeChild(button);
      }

      if (options.onPageShow) {
        appcontent = window.document.getElementById("appcontent");
        appcontent.removeEventListener('hashchange', windowPageShowEvent);
        appcontent.removeEventListener('pageshow', windowPageShowEvent, true);
      }
    }
  });

  tabTracker = new tabBrowser.Tracker({
    onTrack: function (tabbrowser) {
      if (options.onPageShow) {
        tabbrowser.tabContainer.addEventListener('TabSelect', tabSelectEvent);
      }
      if (options.onLocationChange) {
        tabbrowser.addProgressListener(tabProgressListener);
      }
    },
    onUntrack: function (tabbrowser) {
      if (options.onPageShow) {
        tabbrowser.tabContainer.removeEventListener('TabSelect', tabSelectEvent);
      }
      if (options.onLocationChange) {
        tabbrowser.removeProgressListener(tabProgressListener);
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
