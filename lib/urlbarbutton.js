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
            var activeTab = tabBrowser.activeTab,
              activeTabWindow = activeTab.ownerDocument.defaultView,
              activeTabBrowser = activeTabWindow.gBrowser.getBrowserForTab(activeTab),
              doc = activeTabBrowser.contentDocument;

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

              options.onPageShow.call(doc, href, function (hide) {
                // Make sure that we only update the urlbar if the check was for the current URL
                //TODO: Check that the page is still the one we wanted to check
                if (true && hide !== null) {
                  button.collapsed = hide;
                }
              });
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
      if ((!options.onLocationChange && !options.onPageShow) || !tabbrowser.ownerDocument.getElementById(options.id)) {
        return;
      }

      var callback = function (callback) {
        return function () {
          var button = tabbrowser.ownerDocument.getElementById(options.id),
            href = tabbrowser.contentDocument.location.href;

          callback.call(tabbrowser.contentDocument, href, function (hide) {
            // Make sure that we only update the urlbar if the check was for the current URL
            if (tabbrowser.contentDocument.location.href === href && hide !== null) {
              button.collapsed = hide;
            }
          });
        };
      },
      urlBarListener;

      if (options.onPageShow) {
        tabbrowser.tabContainer.addEventListener('TabSelect', callback(options.onPageShow));
      }

      if (options.onLocationChange) {
        urlBarListener = {
          QueryInterface: function (aIID) {
            if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
              return this;
            }
            throw Cr.NS_NOINTERFACE;
          },
          onLocationChange: callback(options.onLocationChange)
        };
        tabbrowser.addProgressListener(urlBarListener, Ci.nsIWebProgress.NOTIFY_LOCATION);
      }
    },
    onUntrack: function (tabbrowser) {
      //TODO: Unload something?
    }
  });
};

exports.UrlbarButton = UrlbarButton;
