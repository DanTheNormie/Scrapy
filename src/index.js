const express = require('express');
const path = require('path')
const cors = require('cors')
const app = express()

/* puppeteer config */
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const useProxy = require('puppeteer-page-proxy');
puppeteer.use(StealthPlugin())
let browser;

async function init_puppeteer(){
    browser = await puppeteer.launch({headless:'new'});
    
    console.log('puppeteer running...')
}

async function attachPuppeteer(req, res, next){
    if(!req.puppeteer){
        req.puppeteer = {browser}
    }
    next()
}

const PORT = process.env.PORT || 3000

/* config */
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(attachPuppeteer)

/* Traffic Signal */
app.use(require('./routes/traffic_signal'))

async function start_server(){
    
    app.listen(PORT, async()=>{
        await init_puppeteer()
        console.log(`Express server running on port ${PORT}`);
    })
}

start_server()

