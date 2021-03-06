const express = require('express');
const asyncHandler = require('express-async-handler');
const { restoreUser } = require('../../utils/auth');

const router = express.Router();

const { Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const media = require('../../db/models/media');


const reviewError = (message) => {
    const err = new Error(message);
    err.status = 401;
    err.title = 'failed';
    err.errors = [message];
    return err;
  };


  const validateReview = [
    check('title')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Your review must have a title')
      .isLength({ max: 50 })
      .withMessage('Title cannot be more than 50 characters long'),
    handleValidationErrors,
  ];

  router.get('/', asyncHandler(async(req, res) => {
    const reviews = await Review.findAll()
    return res.json(reviews)
}))

  router.get('/:id(\\d+)', asyncHandler(async(req, res, next) => {
    const review = await Review.findByPk(req.params.id)
    return res.json(review)
  }))

  router.post('/', restoreUser, validateReview, asyncHandler(async(req, res, next) => {
      const{title, content, mediaId} = req.body
      const{user} = req

      if(!user){
          return next(reviewError('Must be logged in to post a review.'))
      }
      const newReview = await Review.create({userId: user.dataValues.id, title, content, mediaId})
      return res.json(newReview)
  }))

  router.put('/:id(\\d+)', restoreUser, validateReview, asyncHandler(async(req, res, next) => {
    const reviewUpdate = await Review.findByPk(req.params.id);
    const {title, content} = req.body
    const{user} = req
      if(!user){
          return next(reviewError('Must be logged in to edit a review.'))
      }
      const review = {userId: user.dataValues.id, title, content}
      await reviewUpdate.update(review)
      return res.json(reviewUpdate)
  }))

  router.delete('/:id(\\d+)', restoreUser, asyncHandler(async(req, res, next) => {
    const {user} = req
      if(!user){
          return next(reviewError('you must be logged in to delete a review.'))
      }
      const review = await Review.findByPk(req.params.id)
      await review.destroy()
      return res.json({message: 'Review successfully deleted.' })
  }))

  module.exports = router;
