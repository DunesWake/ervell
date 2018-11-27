Promise = require 'bluebird-q'
{ shuffle, extend } = require 'underscore'
{ API_URL, HOMEPAGE_SPLASH, HOMEPAGE_EXPLORE_USER_IDS, BLOG_URL } = require('sharify').data
{ DEMO_USER_AUTH_TOKEN } = process.env
graphQL = require '../../lib/graphql'
cached = require '../../lib/cached'
ExploreBlocks = require '../../collections/explore_blocks'
# Posts = require '../../collections/posts.coffee'
truncate = require '../../lib/truncate.coffee'

@index = (_req, res, next) ->
  # posts = new Posts
  # posts.url = "#{BLOG_URL}/featured.json"

  userIds = (HOMEPAGE_EXPLORE_USER_IDS or '').split(',').map (x) -> parseInt(x, 10)
  exploreBlocks = new ExploreBlocks
  extend exploreBlocks.options, user_ids: userIds, per: 20, filter: 'block'

  Promise.all [
    (cached 'homepage:explore-blocks', 3600, -> exploreBlocks.fetch())
    # posts.fetch()
  ]

  .spread (exploreBlocksResponse) ->
    locals = { truncate: truncate, posts: [] }

    if exploreBlocksResponse?
      # Re-initialize the collection with the possibly cached response to parse it
      exploreBlocks = new ExploreBlocks exploreBlocksResponse, parse: true
      res.locals.sd.EXPLORE_BLOCKS = exploreBlocks.toJSON()
      extend locals, explore_blocks: exploreBlocks.models

    extend locals, splash: res.locals.sd.HOMEPAGE_SPLASH

    res.render 'index', locals

  .catch next
