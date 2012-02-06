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
          button.addEventListener("click", options.onClick);
        }

        urlbarIcons.insertBefore(button, urlbarIcons.firstChild);
      }
    // },
    // onUntrack: function (window) {
    //TODO: Unload something?
    }
  });

  tabBrowser.Tracker({
    onTrack: function (tabbrowser) {
      if (!options.showForPage || !tabbrowser.ownerDocument.getElementById(options.id)) {
        return;
      }

      var urlBarListener = {
        QueryInterface: function (aIID) {
          if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
            return this;
          }
          throw Cr.NS_NOINTERFACE;
        },
        onLocationChange: function () {
          var button = tabbrowser.ownerDocument.getElementById(options.id),
            href = tabbrowser.contentDocument.location.href;
          options.showForPage.call(tabbrowser.contentDocument, href, function (hide) {
            // Make sure that we only update the urlbar if the check was for the current URL
            if (tabbrowser.contentDocument.location.href === href) {
              button.collapsed = hide;
            }
          });
        }
      };

      tabbrowser.addProgressListener(urlBarListener, Ci.nsIWebProgress.NOTIFY_LOCATION);
    // },
    // onUntrack: function (tabbrowser) {
    //TODO: Unload something?
    }
  });
};

exports.UrlbarButton = UrlbarButton;
