_ = require 'underscore'
Backbone = require "backbone"
Backbone.$ = $
Comment = require "../../../models/comment.coffee"
mediator = require '../../../lib/mediator.coffee'
sd = require("sharify").data
analytics = require '../../../lib/analytics.coffee'

newCommentTemplate = -> require('../templates/new_comment.jade') arguments...

module.exports = class NewCommentView extends Backbone.View

  events:
    'keyup .new-comment__field' : 'onKeyUp'

  initialize: (options)->
    @block_id = options.block_id
    @render() if options.autoRender

  onKeyUp: (e)->
    e.preventDefault()
    e.stopPropagation()

    switch e.keyCode
      when 13
        @addComment()

  fieldIsEmpty: -> @$input.val() is ""

  addComment: ->
    if not @fieldIsEmpty()
      userAttrs = _.pick(mediator.shared.current_user.attributes, ['slug', 'username', 'avatar', 'id'])

      comment = new Comment
        body: @$input.val()
        user: userAttrs
        created_at: new Date()
      , block_id: @block_id

      @$input.attr "disabled", "disabled"

      comment.save {},
        success: =>
          analytics.track.click "New Channel created"
          @$input.removeAttr 'disabled'
          @$input.val ""
          mediator.trigger 'new:comment', comment

  render: ->
    @$el.html newCommentTemplate()
    @$input = @$('input.new-comment__field')
