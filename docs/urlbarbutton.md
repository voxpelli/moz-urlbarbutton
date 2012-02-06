The `urlbarbutton` API allows for easy adding of buttons to the urlbar in Firefox.

## Example ##

    var UrlbarButton = require('urlbarbutton').UrlbarButton;
    UrlbarButton({
      id : 'foobar-button',
      image : data.url("foobar-button.png"),
      onClick : doTheThing,
      showForPage : checkPage
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
	A callback to fire on a click on the urlbar button.

@prop [showForPage] {Function}
  A callback that checks if the button should be showed on the current page or not.
</api>
</api>
