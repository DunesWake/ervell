$ = require 'cheerio'
request = require 'superagent'

# truncate = require '../../lib/truncate.coffee'

Posts = require '../../collections/posts.coffee'

@index = (req, res, next) ->
  posts = new Posts
  posts.fetch
    error: next
    success: (a, b) ->
      console.log(a, b)
      # res.locals.POSTS = posts
      # res.render 'index',
      #   posts: posts.models
      #   truncate: truncate

# @show = (req, res, next) ->
#   url = req.path.replace '/blog', ''
#   return next() if url is "/feed/rss"

#   request("#{BLOG_URL}#{url}")
#     .end (err, response) ->
#       $html = $(response?.text)

#       title = if $html.find('title').html() is 'Blog'
#         'Blog'
#       else
#         "Blog – #{$html.find('title').html()}"

#       res.render 'show',
#         title: title
#         html: $html.find('.page-content').html()
#         image: $html.find('img').attr('src')
