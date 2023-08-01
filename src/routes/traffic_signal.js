const router = require('express').Router()

router.use('/live', (req,res)=>{res.sendStatus(200)})

router.use('/api',require('./dashboard_route'))

module.exports = router