const { Router } = require('express')
const CellphonesCtrl = require('./cellphones.controller')

const router = new Router()

router.route('/phones').get(CellphonesCtrl.apiGetPhones)

module.exports = router