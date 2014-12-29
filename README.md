Songkick-Listings.js
============================

A javascript library to dramatically simplify displaying an artist's tour dates on a website using the Songkick API. Using handlebars templating, this project aims to simplify the concert data fetching and html rendering.

Installation
-----------------------------

With bower:

```bash
bower install songkick-listings.js
```

Or download the .js and include it manually:

[songkick-listings.js](https://raw.githubusercontent.com/thomasdashney/songkick-listings.js/master/songkick-listings.js)

Dependencies
-----------------------------

Songkick-Listings.js depends on the following javascript libraries:

* [jQuery](http://jquery.com)
* [Handlebars.js](http://handlebarsjs.com) (for templating)

I plan to remove jQuery as a dependency in future--I welcome with open arms the contribution efforts of developers in this area.

Usage Example
-----------------------------

The following code will get all of the show dates for "Snarky Puppy", render some HTML with the provided template, and inject it into the specified DOM element.

![](http://i.imgur.com/CU3l4yW.png)

```html
<!-- show listings template rendered/injected into here -->
<div id="show-listings">

</div>

<!-- template for show-listings -->
<script id="show-listings-template" type="text/x-handlebars-template">
    {{#if shows}}
        <table>
            <tr>
                <th>Date</th>
                <th>Venue</th>
                <th>Location</th>
            </tr>
          {{#shows}}
            <tr>
                <td>{{date.display}}</td>
                <td>{{venue.name}}</td>
                <td>{{location}}</td>
            </tr>
          {{/shows}}
        </table>
        <p>Show data by Songkick</p>
    {{else}}
        <div class="no-upcoming-shows">
            (there are no upcoming shows)
        </div>
    {{/if}}
</script>

<!-- include jQuery and Handlebars dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min.js"></script>
<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>

<!-- include songkick-listings.js -->
<script src="../songkick-listings.js"></script>

<script>
	var config = {
	    elementId: 'show-listings',
	    templateId: 'show-listings-template',
	    artistId: 29793, // snarky puppy
	    apiKey: 'my-songkick-api-key'
	};
	SongkickListings.load(config);
</script>
```

Configuration Options
--------------------
When calling `SongkickListings.load(config)`, the following config options must be specified:

* `elementId` - The id of the element to dynamically insert the show listings into
* `templateId` - The id of the `<script type="text/x-handlebars">` element containing the show listings template. This will be rendered with the fetched Songkick data and inserted into the element specified via `elementId`
* `artistId` - The Songkick artist id to fetch show listings for
* `apiKey` - Your song kick api key

Contributing
---------------------
Please submit an issue or PR! I am open to any suggestions that may improve the functionality of this project.
