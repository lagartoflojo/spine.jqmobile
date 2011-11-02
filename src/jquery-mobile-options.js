$(document).bind('mobileinit', function(){
  $.mobile.ajaxEnabled = false;
  $.mobile.pushStateEnabled = false;
});

$(document).bind( "pagebeforechange", function( e, data ) {
  var DEBUG = true;
  function debug(err){
    if (DEBUG) console.log(err);
  }

  debug("in pagebeforechange: " + (typeof data.toPage));
  
  // Stop the default changePage behavior when the toPage parameter
  // is a URL (ie. a string).
  if ( typeof data.toPage === "string" ) {

    var hash = $.mobile.path.parseUrl( data.toPage ).href;
    debug("in data.toPage is string: " + hash)

    e.preventDefault();
  } // end string


  // This is here only for debugging purposes.
  if ( typeof data.toPage === "object" ) {
    jQuery.each(data.toPage, function(i,v){
      debug("in data.toPage is object tag: " + v.tagName);
      debug("in data.toPage is object id: " + v.id);
      debug("in data.toPage is object classname: " + v.className);
    //  console.log("in data.toPage is object innerhtml: " + v.innerHTML.replace(/^\s*/, "").replace(/\s*$/, ""));
    });
  } // end object

});
