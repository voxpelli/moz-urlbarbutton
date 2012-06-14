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
</api>

<api name="getButtons">
@method
Returns an array of the button elements in all the browsers windows.

@param [href] {String}
	Limit the buttons returned to just those from windows with an active tab pointing to the specified URL.
</api>

<api name="setImage">
@method
Sets the image of the button.

@param src {String}
	The path of the image to use for the buttons.
@param [href] {String}
	Limits the buttons for which the image is changed to just those from windows with an active tab pointing to the specified URL.
</api>

<api name="setVisibility">
@method
Sets the visibility of the button.

@param show {Boolean}
	Specify `true` to show the button and `false` to hide it.
@param [href] {String}
	Limits the buttons for which the visibility is changed to just those from windows with an active tab pointing to the specified URL.
</api>

<api name="getVisibility">
@method
Gets the visibility of the button - returns `true` if a button is showed in any checked window, `false` if no buttons are shown in any of the checked windows and `undefined` if no windows are checked.

@param [href] {String}
	Limits the buttons for which the visibility is checked to just those from windows with an active tab pointing to the specified URL.
</api>

<api name="remove">
@method
Removes the button from the browser, should eg. be used when a restartless add-on is disabled or uninstalled.
</api>
</api>
