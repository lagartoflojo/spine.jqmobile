$(document).bind('mobileinit', function(){
  $.mobile.ajaxEnabled = false;
  $.mobile.pushStateEnabled = false;
  //$.mobile.hashListeningEnabled = true;
});

$(document).bind( "pagebeforechange", function( e, data ) {
  var DEBUG = true;
  function debug(err){
    if (DEBUG) console.log(err);
  }

  // We only want to handle changePage() calls where the caller is
  // asking us to load a page by URL.
  debug("in pagebeforechange: " + (typeof data.toPage));
  
  if ( typeof data.toPage === "string" ) {

    var hash = $.mobile.path.parseUrl( data.toPage ).hash;
    debug("in data.toPage is string: " + hash)
    e.preventDefault();
    return;
    if($(hash).html() !== null) {
      debug('hash is not null')
      $.mobile.changePage($(hash))
      e.preventDefault();
    }
  } // end string

  if ( typeof data.toPage === "object" ) {
    jQuery.each(data.toPage, function(i,v){
      debug("in data.toPage is object tag: " + v.tagName);
      debug("in data.toPage is object id: " + v.id);
      debug("in data.toPage is object classname: " + v.className);
    //  console.log("in data.toPage is object innerhtml: " + v.innerHTML.replace(/^\s*/, "").replace(/\s*$/, ""));
    });
    
  }

});