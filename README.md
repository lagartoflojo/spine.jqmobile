# Notice

2012-03-09: I'm no longer using Spine with jQuery Mobile, so I'm no longer maintaining this repository.

# Introduction
Spine.jQMobile is a set of files that help you integrate
jQuery Mobile and Spine.js.

# Setup
Include ```jquery-mobile-options``` before including jQuery Mobile,
and include ```spine.jqmobilecontroller``` after Spine and
before your own application code).

# Usage
Spine.JQMobileController is meant to be used instead of Spine.Controller
when the controller's ```@el``` is associated with a ```data-role='page'``` element,
and along with a Spine.Manager which will handle moving from one page to another.
JQMobileController extends Spine.Controller,
so everything works normally.

When you change your page's content dynamically,
you can trigger the ```jqm:updatelayout``` event to re-style the entire page.

By default, ```jquery-mobile-options``` outputs a lot of useful logging information,
which you can turn off by setting the ```DEBUG``` variable to ```false```.

# Example

Your ```index.coffee``` file, where your main application controller resides,
could look like this, assuming you are using Sprockets in a Rails application:

```coffeescript
#= require json2
#= require jquery
#= require jquery-tmpl
#= require spine
#= require spine/manager
#= require spine/ajax
#= require spine/route

#= require spine.jqmobilecontroller

#= require_tree ./lib
#= require_self
#= require_tree ./models
#= require_tree ./controllers
#= require_tree ./views

class App extends Spine.Controller

  events:
    'click .show-car': 'showCar'

  @view: (name, item) ->
    $.tmpl("app/views/#{name}", item)

  constructor: ->
    super
    @manager = new Spine.Manager

    @routes
      "!/car-:id": (params) ->
        @log "opening car #{params.id}"
        @cars ||= []
        unless @cars[params.id]
          @log ' -> it wasn\'t here -- appending'
          @cars[params.id] = new App.Cars(car_id: params.id)
          @manager.add @cars[params.id]
          @append @cars[params.id]
          @log ' -> appended'
        @cars[params.id].active()

    Spine.Route.setup()

  showCar: ->
    @navigate '#!/car-2'

window.App = App
```

Note that our App controller extends Spine.Controller,
as this controller is not associated with a ```data-role='page'``` element,
and, as you can see below, it's the Cars controller that extends Spine.JQMobileController.

The route values don't start with a pound (\#),
but when we call ```@navigate```, we put the pound there.

After creating a controller, we add it to the Spine.Manager,
append it to the page,
and then call ```.active()``` on it.
Internally, ```active()``` will call jQuery Mobile's ```changePage()``` function.

We are keeping an array of all Cars controllers that we instantiate,
so that we don't add them again if they've already been loaded.


The Cars controller looks like this:

```coffeescript
Car = Spine.Car

class Cars extends Spine.JQMobileController
  constructor:
    super
    @pageId "car-#{@car_id}"

    Car.bind 'refresh', @render
    Car.fetch()

  render:
    @car = Car.find(@car_id)
    @html App.view('cars/show')
    @trigger 'jqm:updatelayout'
```

When the Cars controller is instantiated,
it will only consist of an empty section tag with a 'data-role' of 'page'
and an 'id' of 'car-X',
ie. ```<section id='car-2' data-role='page'></section>```
(JQMobileController automatically sets the tag to 'section' and data-role to 'page',
while the id is set using JQMobileController's ```@pageId``` shortcut).
This is the only HTML that will be appended to the page by the router in the App controller,
so it's the only code that will be styled by jQuery Mobile.

The render function actually loads content onto the page,
and it only gets called after ```Car.fetch()``` is finished.
At this time, we have to tell jQuery Mobile to style the entire page again,
and we do this by triggering the ```jqm:updatelayout``` event.
Internally, this event calls ```@el.page('destroy').page()```.
