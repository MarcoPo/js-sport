const express = require('express')
const {
  // eslint-disable-next-line no-unused-vars
  store, show, showNBA, showByParam, update, hardDelete
} = require('../../handlers/V1/todo')
const { postValidation } = require('../../handlers/V1/todo/validation')

const router = express.Router()

router.post('/', postValidation, store)
router.get('/', showNBA)
router.get('/:id', showByParam)
router.put('/:id', update)
router.delete('/:id', hardDelete)

module.exports = router
