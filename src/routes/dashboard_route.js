const router = require('express').Router()

const {get_title, custom_scrape, getDomains, getDataFrom1337x} = require('../controllers/dashboard-controller')

router.get('/getTitle', get_title)

router.get('/getDomains', getDomains)

router.post('/customscrape', custom_scrape)

router.post('/getDataFrom1337x', getDataFrom1337x)

module.exports = router