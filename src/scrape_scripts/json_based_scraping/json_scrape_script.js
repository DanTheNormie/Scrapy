/* const { param } = require('../../routes/dashboard_route');
const taskIsValid = require('./taskChecker');
const data = require('./newTask.json')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const useProxy = require('puppeteer-page-proxy');
puppeteer.use(StealthPlugin())
let browser;
let page; */

async function fetchData(page, selector, target ,isArray = false){
    let result;
    try{
        let pageFunction = (e)=>{};

        if(target !== 'innerText') { 
            if(isArray){
                page = (elements)=>elements.map((e)=>{
                    if(e.hasAttribute(target)){
                        return e.getAttribute(target)
                    }
                    return e.innerText
                })
            }else{
                pageFunction = (e)=>{
                    if(e.hasAttribute(target)){
                        return e.getAttribute(target)
                    }
                    return e.innerText
                }
            } 
        }else{
            if(isArray){
                pageFunction = (elements)=>elements.map((e)=>e.innerText)
            }else{
                pageFunction = (e)=>e.innerText
            }
            
        }
        

        if(isArray){
            result = page.$$eval(selector, pageFunction)
        }else{
            result = page.$eval(selector,pageFunction)
        }
    }catch(err){
        console.error(err);
    }   
    return result
}

async function processTask(page, task){
    console.log('Processing URL:', task.url);

    const url = task.url.replace(/{{(.*?)}}/g, (match, paramName) => {
        
        if (task.params && task.params[paramName]) {
            if(task.params[paramName].value){
                return task.params[paramName].value
            }
          return task.params[paramName].default;
        } else {
          console.error(`Required parameter "${paramName}" not provided for URL: ${task.url}`);
          return match;
        }
    
    });

    try{
        
        await page.goto(url, {waitUntil : 'domcontentloaded'})
        await page.waitForSelector(task.selectors[0].selector)
        const currentResults = {};
        for(const selectorInfo of task.selectors){
            const {name, selector, format, target} = selectorInfo;
            if(!task.result.data.includes(name)){
                console.error('selector - format mismatch');
            }else{
                if(format === 'array'){
                    currentResults[name] = await fetchData(page, selector, target, isArray=true)
                }else{
                    currentResults[name] = await fetchData(page, selector, target)
                }

                if(!currentResults[name]) {
                    console.error(' Wrong Selector!!!. no data found for :-\n', '{name : ',name, ', selector : ',selector,'}\n\n');
                }
            }
        }
        let finalResults = [];
        if(task.result.format === 'array'){
            let max_len = 0;
            Object.keys(currentResults).forEach((key, idx)=>{
                if(max_len < currentResults[key].length) {
                    max_len = currentResults[key].length
                }
            })
            
            for (let i = 0; i < max_len; i++) {
                finalResults.push({});
            }

            Object.keys(currentResults).forEach((key, idx)=>{
                for(let i=0; i<currentResults[key].length; i++){
                    finalResults[i][key] = currentResults[key][i]
                }
            })
        }else{
            finalResults = currentResults
        }

        return finalResults

    }catch(err){
        console.error(err);
    }
}


module.exports = processTask


/* 
async function processTasks(page, data){
    try{
        if( !data || 
            !Array.isArray(data.tasks) ||
            data.tasks.length === 0
        ){
            throw new Error ('Invalid Json format or no tasks found.')
        }

        const finalResults = [];
        for(const task of data.tasks){
            if(taskIsValid(task)){
                const result = await processTask(page, task)
                finalResults.push(result)
            }
        }
        console.log('Final Results : ',finalResults);
        return finalResults

    }catch(err){
        console.error('Error reading or parsing JSON file:', error);
    }
}
 *//* 
async function check_tasks(data){
    
    browser = await puppeteer.launch({headless:'new'});
    page = await browser.newPage()

    await processTasks(page,data)

    await browser.close()
    
}
 */





