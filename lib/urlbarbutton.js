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

  var visibilityCallback,
    // Methods used internally
    getPageDocument,
    // Methods exposed internally
    getButtons, setImage, setVisibility;

  getPageDocument = function (pageTab) {
    var pageTab = (pageTab ? pageTab : tabBrowser.activeTab),
      pageWindow = pageTab.ownerDocument.defaultView,
      pageTabBrowser = pageWindow.gBrowser.getBrowserForTab(pageTab);

    return pageTabBrowser.contentDocument
  };

  getButtons = function (href) {
    var elements = [],
      button, window;

    for (window in winUtils.windowIterator()) {
      if (!href || href === getPageDocument(window.gBrowser.selectedTab).location.href) {
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

  visibilityCallback = function (href, hide) {
    if (hide !== undefined) {
      setVisibility(href, !hide);
    }
  };

  new winUtils.WindowTracker({
    onTrack: function (window) {
      var button, urlbarIcons;

      urlbarIcons = window.document.getElementById("urlbar-icons");

      if (urlbarIcons) {
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

        if (options.onPageShow) {
          var appcontent = window.document.getElementById("appcontent"),
            refreshButton = function (event) {
              var doc = (event.type == 'hashchange' ? event.originalTarget.document : event.originalTarget),
                button, href;

              if (doc.defaultView.frameElement) return; // skip iframes/frames

              button = window.document.getElementById(options.id);
              href = doc.location.href;

              options.onPageShow.call(doc, href, visibilityCallback.bind(undefined, href));
            };

          appcontent.addEventListener('hashchange', refreshButton);
          appcontent.addEventListener('pageshow', refreshButton, true);
        }
      }
    },
    onUntrack: function (window) {
      //TODO: Unload something?
    }
  });

  tabBrowser.Tracker({
    onTrack: function (tabbrowser) {
      if ((!options.onLocationChange && !options.onPageShow)) {
        return;
      }

      if (options.onPageShow) {
        tabbrowser.tabContainer.addEventListener('TabSelect', function () {
          var doc = tabbrowser.contentDocument;
          options.onPageShow.call(tabbrowser.contentDocument, doc.location.href, visibilityCallback.bind(undefined, doc.location.href));
        });
      }

      if (options.onLocationChange) {
        tabbrowser.addProgressListener({
          QueryInterface: function (aIID) {
            if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
              return this;
            }
            throw Cr.NS_NOINTERFACE;
          },
          onLocationChange: function () {
            var doc = tabbrowser.contentDocument;
            console.log('LocationChange!');
            options.onLocationChange.call(tabbrowser.contentDocument, doc.location.href, visibilityCallback.bind(undefined, doc.location.href));
          }
        }, Ci.nsIWebProgress.NOTIFY_LOCATION);
      }
    },
    onUntrack: function (tabbrowser) {
      //TODO: Unload something?
    }
  });

  return {
    getButtons : getButtons,
    setImage : setImage,
    setVisibility : setVisibility
  };
};

exports.UrlbarButton = UrlbarButton;
