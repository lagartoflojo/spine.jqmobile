# Base controller designed to be used with Spine.Manager.
# Overrides activate() so that calling active() on the controller
# will automatically show it, using jQM's changePage function.

class Spine.JQMobileController extends Spine.Controller
  constructor: ->
    super
    @bind 'jqm:updatelayout', @_jqmUpdateLayout


  activate: ->
    $.mobile.changePage(@el)
    @

  deactivate: ->
    @

  isActive: ->
    @el.hasClass('ui-page-active')

  _jqmUpdateLayout: =>
    @el.page('destroy').page()