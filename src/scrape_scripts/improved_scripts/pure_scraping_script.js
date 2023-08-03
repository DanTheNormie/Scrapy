const test_task = require('./taskChecker')

function replaceUrlParams(task){
    return task.url.replace(/{{(.*?)}}/g, (match, paramName) => {
        
        if (task.params && task.params[paramName]) {
            if(task.params[paramName].value){
                return task.params[paramName].value
            }
          return task.params[paramName].default;
        } else {
          console.error(`Required parameter "${paramName}" not provided for URL: ${task.url}`);
          return null;
        }
    });
}

async function scrapeAllSelectorsTogether(page, selectors_array, parentSelector){
    const pageFunction = (elements, selectors_array) =>{
        return elements.map((e)=>{
            const result = {};
            const error = {};
            for(const selectorInfo of selectors_array){
                const {name, target, selector} = selectorInfo
                result[name] = e.querySelector(selector)
                if(result[name]){
                    if(target !== "innerText" && result[name].hasAttribute(target)){    
                        result[name] = result[name].getAttribute(target)
                    }else{
                        result[name] = result[name].innerText || ''
                    }
    
                    if(!result[name]){
                        error[name] = `No Data found for selector : ${selector}`
                    }
                }
                
                /* todo: add fallbacks if no data found for selector */
            }
            return result;
        })
    }

    return await page.$$eval(parentSelector,pageFunction,selectors_array)
}

async function scrapeSelectorsIndividually(page, selectors_array){
    
    const result = {}
    
    for(const selectorInfo of selectors_array){
        const {name, format, target, selector} = selectorInfo

        if(format === "array"){
            result[name] = await page.$$eval(selector,
                (elements, target)=>elements.map((e)=>{
                    if(e.hasAttribute(target)) return e.getAttribute(target)
                    return e.innerText || ''
                }), target)
        
        }else{
            result[name] = await page.$eval(selector, (e, target)=>{
                if(e.hasAttribute(target)) return e.getAttribute(target)
                return e.innerText || ''
            }, target)
        }
    }

    return result;
}

function getSelectorsFromTaskResult(task){
    return task.selectors.filter((selector)=>task.result.data.includes(selector.name))
}


async function scrape(task, page){
    

    /* Replace url placeholders with values */
    const url = replaceUrlParams(task)

    console.log('Processing URL:', url,'\n\n');

    if(!url) throw new Error("Something went wrong")

    try{
        /* navigate to url and wait for document to load */
        await page.goto(url, {waitUntil : 'domcontentloaded'})
        await page.waitForSelector(task.selectors[0].selector,{timeout:3000})

        /* only process selectors included in task.result.data */
        task.selectors = getSelectorsFromTaskResult(task)

        let result = {}
        if(task.result.format === 'array'){
            await page.waitForSelector(task.result.parentElementSelector,{timeout:3000})
            result = await scrapeAllSelectorsTogether(page, task.selectors, parentElementSelector = task.result.parentElementSelector)
        }else{
            await page.waitForSelector(task.selectors[0].selector,{timeout:3000})
            result = await scrapeSelectorsIndividually(page, task.selectors)
        }

        return result;

    }catch(err){
        console.log(err)
        throw err
    }
}

async function test_scrape(page, task){
    const {success,message} = test_task(task)

    if(success){
        return await scrape(task, page)
    }else{
        return {success, message};
    }
}

module.exports = test_scrape