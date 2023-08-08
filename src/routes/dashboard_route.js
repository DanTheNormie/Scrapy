const router = require('express').Router()

const {
    get_title, 
    custom_scrape, 
    getDomains, 
    getDataFrom1337x,
    getDataFromPirateBay,
    getDataFromBingeWatch
} = require('../controllers/dashboard-controller')

router.get('/getTitle', get_title)

router.get('/getDomains', getDomains)

router.post('/customscrape', custom_scrape)

router.get('/getDataFromPirateBay', getDataFromPirateBay)

router.get('/getDataFrom1337x', getDataFrom1337x)

router.get('/getDataFromBingeWatch', getDataFromBingeWatch)



module.exports = router