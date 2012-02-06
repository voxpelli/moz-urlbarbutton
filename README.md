UrlbarButton for Mozilla Add-on SDK
=======

The UrlbarButton module allows for easy adding of buttons to the urlbar in Firefox.

## Usage

    var UrlbarButton = require('urlbarbutton').UrlbarButton;
    UrlbarButton({
      id : 'foobar-button',
      image : data.url("foobar-button.png"),
      onClick : doTheThing,
      showForPage : checkPage
    });

## Options

* **id** - a string identifier that identifies the specific urlbar button.
* **image** - an image for the urlbar button. (optional)
* **onClick** - a callback to fire on a click on the urlbar button. (optional)
* **showForPage** - a callback that checks if the button should be showed on the current page or not. (optional)

### Option syntax: showForPage

Should be a function. Is called with two arguments - the URL of the current page and a callback function that is invoked with "true" if the button should be hidden or "false" if it should be shown. The context of the showForPage function is the document of the page that is checked.

## How to use

Follow the Add-on SDK's documentation for [third party packages](https://addons.mozilla.org/en-US/developers/docs/sdk/1.4/dev-guide/addon-development/third-party-packages.html).

## Code inspiration from

* [Firefox Share Add-on](https://github.com/mozilla/fx-share-addon)
* [The toolbarbutton package](https://github.com/voldsoftware/toolbarbutton-jplib)

## In action in

* **Flattr Firefox Add-on**: [Source](https://github.com/flattr/fx-flattr-addon)
