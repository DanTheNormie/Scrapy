const router = require('express').Router()

const {get_domains, get_title} = require('../controllers/dashboard-controller')

router.get('/testpb', get_domains)
router.get('/getTitle', get_title)

router.post('/customscrape,')

module.exports = router