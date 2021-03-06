const express = require('express');
const asyncHandler = require('express-async-handler');
const { restoreUser } = require('../../utils/auth');

const router = express.Router();

const { Shelf, Media, ShelfMedia } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const shelfError = (message) => {
    const err = new Error(message);
    err.status = 401;
    err.title = 'failed';
    err.errors = [message];
    return err;
  };

router.get('/', restoreUser, asyncHandler(async(req, res, next) => {
    const {user} = req
    if(!user){
        return next(shelfError('Must be logged in to see your shelves.'))
    }
    const shelves = await Shelf.findAll({
        order: [['updatedAt']],
    })
    return res.json(shelves)
}))


router.get('/:id(\\d+)', restoreUser, asyncHandler(async(req, res, next) => {
    const {user} = req
    if(!user){
        return next(shelfError('Must be logged in to see your shelves.'))
    }
    const shelf = await Shelf.findByPk(req.params.id, {
        include: [{model: Media, through: "ShelfMedia"}],
    })
    return res.json(shelf)
}))


const validateShelf = [
    check('title')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Your shelf must have a title')
      .isLength({ max: 50 })
      .withMessage('Title cannot be more than 50 characters long'),
    handleValidationErrors,
  ];


  router.post('/', restoreUser, validateShelf, asyncHandler(async(req, res, next) => {
      const{title} = req.body
      const{user} = req
      if(!user){
          return next(shelfError('Must be logged in to create a shelf.'))
      }
      const newShelf = await Shelf.create({userId: user.dataValues.id, title})
      return res.json(newShelf)
  }))


  router.put('/:id(\\d+)', restoreUser, validateShelf, asyncHandler(async(req, res, next) => {
      const shelfUpdate = await Shelf.findByPk(req.params.id)
      const {title, mediaId} = req.body
      const {user} = req
      if(!user){
          return next(shelfError('You must be logged in to edit a shelf.'))
      }
      const shelf = {userId: user.dataValues.id, title, mediaId}
      await shelfUpdate.update(shelf)
      return res.json(shelfUpdate)
  }))

  router.delete('/:id(\\d+)', restoreUser, asyncHandler(async(req, res , next) => {
      const {user} = req
      if(!user){
          return next(shelfError('you must be logged in to delete a shelf.'))
      }
      const shelf = await Shelf.findByPk(req.params.id, {
          include: [{model: ShelfMedia}],
          where: "shelfId"
      })
      await shelf.destroy()
      return res.json({message: 'Shelf successfully deleted.'})
  }))


module.exports = router;
