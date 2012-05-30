The `urlbarbutton` API allows for easy adding of buttons to the urlbar in Firefox.

## Example ##

    var UrlbarButton = require('urlbarbutton').UrlbarButton;
    UrlbarButton({
      id : 'foobar-button',
      image : data.url("foobar-button.png"),
      onClick : doTheThing,
      onLocationChange : checkUrl,
      onPageShow : checkForStuffInHTML
    });

<api name="UrlbarButton">
@class

Module exports `UrlbarButton` constructor allowing users to create a urlbar button.

<api name="UrlbarButton">
@constructor
Creates a urlbarbutton.

@param options {Object}
  Options for the urlbarbutton, with the following parameters:

@prop id {String}
	An identifier for the specific urlbar button.

@prop [image] {String}
	A url to an image for the urlbar button.

@prop [onClick] {Function}
	A callback to fire when the urlbar button is clicked. Is called with the HTML page as its context and with the URL of the page as its first parameter.

@prop [onLocationChange] {Function}
  A callback for checking if the button should be showed on the current page or not. Called when the location is changed in the location bar. Is called with the HTML page as its context and gets two parameters - first is the URL of the page, second is a callback to use for telling whether the button should be shown or not. Callback should be sent true if the button should be hidden, false if it should be shown and null if the state shouldn't be changed.

@prop [onPageShow] {Function}
  Same as onLocationChange, but called when the page is loaded.
</api>
</api>
