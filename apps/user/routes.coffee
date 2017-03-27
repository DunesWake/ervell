_ = require 'underscore'
Q = require 'bluebird-q'
Backbone = require 'backbone'
User = require "../../models/user"
ChannelBlocks = require "../../collections/channel_blocks.coffee"
UserBlocks = require "../../collections/user_blocks"
FollowBlocks = require "../../collections/follow_blocks"
Channel = require "../../models/channel"
sd = require("sharify").data
cache = require "../../lib/cache.coffee"
tips = require './tips.coffee'

@fetchAuthor = (req, res, next) ->
  author = new User id: req.params.username
  author.fetch
    cache: true
    success: (author) ->
      res.locals.author = author
      res.locals.sd.USER = author.toJSON()
    complete: -> next()

showTips = (req, res) ->
  (req.user?.id is res.locals.author.id and req.user?.get('show_tour') isnt false)

addTips = (req) ->
  _.reject tips, (tip) -> req.cookies[tip.id]

fetchFocus = (user, per=1)->
  dfd = Q.defer()
  
  blocks = new ChannelBlocks [], 
    channel_slug: user.get('profile_id'),
    direction: 'asc'
    per: per
  
  blocks.fetch
    success: ->
      blocks.map (block) -> block.set silent: true
      dfd.resolve blocks
    error: (blocks, err) -> dfd.resolve()

  dfd.promise

@user = (req, res, next) ->
  return next() unless res.locals.author

  blocks = new UserBlocks null,
    user_slug: req.params.username

  if req.params.block_id
    res.locals.sd.CLIENT_PATH = "block/#{req.params.block_id}"

  if req.query.subject
    blocks.options = _.extend blocks.options, subject: req.query.subject
    res.locals.sd.SUBJECT = req.query.subject

  if req.query.sort
    res.locals.sd.SORT = sort_by = req.query.sort
    res.locals.sd.SEED = seed = Math.floor(Math.random() * 100000000) + 1
    blocks.options = _.extend blocks.options,
      sort: sort_by
      seed: seed

  blocks.fetch
    data:
      auth_token: req.user?.get('authentication_token')
    error: (m, err) -> next err
    success: ->
      blocks.unshift(addTips(req)) if showTips(req, res)
      res.locals.sd.BLOCKS = blocks.toJSON()
      res.render "index", author: res.locals.author, blocks: blocks.models

@userChannelsByAlpha = (req, res, next) ->
  return next() unless res.locals.author

  channels = new UserBlocks null,
    user_slug: req.params.username
    subject: 'channels'

  Q.all [
    channels.fetchUntilEnd data: auth_token: req.user?.get('authentication_token')
    fetchFocus res.locals.author, req.query.per
  ]
  .then ([response, focus]) ->  
    res.locals.sd.FOCUS = focus.toJSON()
    alpha = res.locals.sd.ALPHA = channels.groupByAlpha()
    res.render 'alpha',
      alpha: alpha
      focus: focus

@followers = (req, res, next) ->
  return next() unless res.locals.author
  return next() if res.locals.author?.id is 21

  blocks = new FollowBlocks null,
    object_id: req.params.username
    object_type: 'users'
    suffix: 'ers'

  blocks.fetch
    cache: true
    data:
      auth_token: req.user?.get('authentication_token')
    success: (data, response) ->
      res.locals.sd.BLOCKS = blocks.toJSON()
      res.locals.sd.FOLLOWERS = blocks.toJSON()
      res.render "index",
        blocks: blocks.models
        author: res.locals.author
        followers: true
    error: (m, err) -> next err

@following = (req, res, next) ->
  return next() unless res.locals.author
  return next() if res.locals.author?.id is 21

  blocks = new FollowBlocks null,
    object_id: req.params.username
    object_type: 'users'
    suffix: 'ing'

  blocks.fetch
    cache: true
    data:
      auth_token: req.user?.get('authentication_token')
    success: (data, response) ->
      res.locals.sd.BLOCKS = blocks.toJSON()
      res.locals.sd.FOLLOWING = blocks.toJSON()
      res.render "index",
        blocks: blocks.models
        author: res.locals.author
        following: true
    error: (m, err) -> next err

@update = (req, res, next) ->
  return next() unless res.locals.author and (res.locals.author.id is res.locals.user.id)
  cache.del "#{res.locals.author.url()}{}"
  res.send 200

@catchChannel = (req, res, next) ->
  channel = new Channel id: req.params.username
  channel.fetch
    success: ->
      res.redirect 301, "/#{channel.get('user').slug}/#{channel.get('slug')}"
    error: (m, err) -> next err

@redirectUser = (req, res, next) ->
  res.redirect 301, "/#{req.params.username}"
