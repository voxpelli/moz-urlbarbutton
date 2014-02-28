UrlbarButton for Mozilla Add-on SDK
=======

The UrlbarButton module allows for easy adding of buttons to the urlbar in Firefox.

## Usage

    var urlbarButton = require('urlbarbutton').UrlbarButton,
      button;
    
    exports.main = function () {
      button = urlbarButton({
        id : 'foobar-button',
        image : data.url("foobar-button.png"),
        onClick : doTheThing,
      });
    };
    
    exports.onUnload = function (reason) {
      if (reason !== 'shutdown') {
        button.remove();
      }
    };

## Options

* **id** - a string identifier that identifies the specific button.
* **image** - a path to an image for the button. (optional)
* **tooltip** - a tooltip text for the button. (optional)
* **onClick** - a callback to fire on a click on the button. (optional)

### Option syntax: onClick

Should be a function. Is called with the URL of the current page as a single argument and has the document of the page that is checked as its context.

## How to use

Follow the Add-on SDK's documentation for [third party packages](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/adding-menus.html).

## Code inspiration from

* [Firefox Share Add-on](https://github.com/mozilla/fx-share-addon)
* [The toolbarbutton package](https://github.com/voldsoftware/toolbarbutton-jplib)

## Other modules usable with this one

* [ShowForPage](https://github.com/voxpelli/moz-showforpage)

## In action in

* **Flattr Firefox Add-on**: [Source](https://github.com/flattr/fx-flattr-addon)

## Related work

* **Mozilla Add-on SDK**: [New Add-ons UX](https://wiki.mozilla.org/Features/Jetpack/Addons_In_Toolbar) in the (2012Q2 Goals](https://wiki.mozilla.org/Jetpack/Goals/2012Q2)

## Changelog

### 0.6.0

* New method, `setOptions()`, that enables changing tooltip and click action
* New click handler option, `options.gotoUrl`, that will open the specified URL on click

### 0.5.0

* Released, but withdrawn and reverted. Focused on updating the package to better support new SDK versions, but became broken and thus all changes was reverted.

### 0.4.1

* Support for Mozilla's Add-on SDK version 1.13b1

### 0.4.0

* No longer handling the decision of whether a button should be shown or not. Moved the `onLocationChange` and `onPageShow` listeners, that were called when a new page was loaded, into a new module, [ShowForPage](https://github.com/voxpelli/moz-showforpage), and removed support for those listeners along with removing the callbacks that were used in them.
* Changed `setImage` and `setVisibility` to have the href-parameter as the last parameter instead of the first as that makes more sense for an optional parameter.
* Changed `setVisibility` to have its href parameter be optional for real
* Added new `getVisibility` method
* Button can now have a tooltip

### 0.3.0

* No changelog being tracked for this and prior version, but main changes were related to extended ways for a button to be hidden and shown.
