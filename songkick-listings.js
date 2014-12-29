// expose SongkickListings global
var SongkickListings = {};

// perform all setup in here
(function SongkickListingsInit() {
  // config function -- call this to configure the songkick api data,
  //                    the element to inject into, etc.

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
              'Sep', 'Oct', 'Nov', 'Dec'];

  SongkickListings.load = function(config) {
    // check for config options presence
    var requiredConfig = ['elementId', 'templateId', 'artistId', 'apiKey'];
    var missingConfig = [];
    for (var i = 0; i < requiredConfig.length; i++) {
      if (!config[requiredConfig[i]])
        missingConfig.push(requiredConfig[i]);
    }
    if (missingConfig.length) {
      return console.error('SongkickListings.init() requires the following '
        + 'missing parameters: ' + missingConfig.join(', '));
    }

    // equivalent to jQuery $(document).ready()
    $(document).ready(function listingsInject(event) { 
      // ajax request to songkick
      $.ajax({
        url: 'http://api.songkick.com/api/3.0/artists/' 
              + config.artistId 
              + '/calendar.json?apikey='
              + config.apiKey,
        dataType: 'jsonp',
        jsonp: false,
        data: {
          jsoncallback: 'mycallback'
        },
        jsonpCallback: 'mycallback'
      })
      .done(function populateTourDates(res) {
        var skShows = res.resultsPage.results.event; // should be fine in sk api 3.0
        var shows = {};
        for (var i = 0; i < skShows.length; i ++) { // for each soundcloud event
          // get the songkick show object
          var skShow = skShows[i];

          // get a date object
          var d = skShow.start.date.split('-');
          var date = new Date(d[0],d[1]-1,d[2]);

          var songkickShow = {};

          // create date object w/ display
          songkickShow.date = {
            obj: date,
            display: dateFormat(date)
          };
          // create venue object
          songkickShow.venue = {
            name: skShow.venue.displayName,
            link: skShow.venue.uri
          };
          // get the city name
          songkickShow.location = skShow.location.city;
          // get the tickets link
          songkickShow.links = {
            songkick: skShow.uri
          };

          shows[skShow.id] = songkickShow;

          // delete any shows that are too old
          var today = new Date();
          var yesterday = new Date();
          yesterday.setDate(today.getDate()-1);
          for (var id in shows) {
            var show = shows[id];
            if (!show.date || 
                (show.date.obj < yesterday) || 
                (show.announced && show.announced === 'false'))
              delete shows[id]; // delete the show
          }
          shows = values(shows); // get an array of shows (no ids)
          shows = sortShowsByDate(shows); // sort shows by date
          
          // got the shows array. now inject into DOM
          var template = $('#' + config.templateId).html();
          var generateShowsHtml = Handlebars.compile(template);
          $('#' + config.elementId).html(generateShowsHtml({
            shows: shows
          }));

        } // end shows loop
      });
    });
  
    // helper shim (from lodash)
    var keys = function(object) {
      var keys = [];
      for(var k in object) 
        keys.push(k);
      return keys;
    };
  
    // convert a javascript object to an array of its values
    // taken from lo-dash library
    // https://github.com/lodash/lodash/blob/2.4.1/dist/lodash.compat.js#L3244
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    function dateFormat(date) {
      return months[date.getMonth()] + ' ' +
             date.getDate();
    }

    function dateFormatWithYear(date) {
      return months[date.getMonth()] + ' ' +
             date.getDate() + '.' +
             date.getFullYear().toString().substr(2);
    }

    function sortShowsByDate(shows) {
      // comparison function for dates
      function compare(a,b) {
        if (a.date.obj < b.date.obj)
           return -1;
        if (a.date.obj > b.date.obj)
          return 1;
        return 0;
      }
      return shows.sort(compare);
    }
  }
})();