UrlbarButton for Mozilla Add-on SDK
=======

The UrlbarButton module allows for easy adding of buttons to the Urlbar in Firefox.

## Usage

    var UrlbarButton = require('urlbarbutton').UrlbarButton;
    UrlbarButton({
      id : 'foobar-button',
      image : data.url("foobar-button.png"),
      onClick : autosubmit,
      showForPage : checkFlattrability
    });

## Options

* **id** - a string identifier that identifies the specific Urlbar button.
* **image** - an image for the Urlbar button. (optional)
* **onClick** - a callback to fire on a click on the Urlbar button. (optional)
* **showForPage** - a callback that checks if the button should be showed on the current page or not. (optional)

### Option syntax: showForPage

Should be a function. Is called with two arguments – the URL of the current page and a callback function that is invoked with "true" if the button should be hidden or "false" if it should be shown. The context of the showForPage function is the document of the page that is checked.

## In action in

* **Flattr Firefox Add-on**
