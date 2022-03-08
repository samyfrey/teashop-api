const express = require('express')
const passport = require('passport')
const Post = require('../models/post')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE a Post
// POST /community
// Authenticated route

router.post('/community', requireToken, (req, res, next) => {
  req.body.post.owner = req.user.id
  Post.create(req.body.post)
    .then(post => {
      res.status(201).json({ post })
    })
    .catch(next)
})

// display all posts
// GET /community
// Non authenticated route

router.get('/community', (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({ posts })
      console.log(res)
    })
    .catch(next)
})

// show one post
// GET /community/:postId
// authenticated route

router.get('/community/:postId', (req, res, next) => {
  Post.findById(req.params.postId)
    .then(post => {
      res.status(200).json({post})
    })
    .catch(next)
})

// update a post
// PATCH /community/:postId
// authenticated route

router.patch('/community/:postId/edit', requireToken, (req, res, next) => {
  // this makes sure a user doesn't update the owner property of a resource
  delete req.body.post.owner
  Post.findByIdAndUpdate(req.params.postId, req.body.post, {new: true})
    .then(handle404)
    .then(post => requireOwnership(req, post))
    .then(res.sendStatus(200))
    .catch(next)
})

// delete a post
// DELETE /community/:postId
// authenticated route

router.delete('/community/:postId', requireToken, (req, res, next) => {
  Post.findByIdAndDelete(req.params.postId)
    .then(handle404)
    .then(post => requireOwnership(req, post))
    .then(res.sendStatus(204))
    .catch(next)
})
module.exports = router
