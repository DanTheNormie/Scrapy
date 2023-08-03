const isTaskValid = require('./taskChecker')

async function fetchData(page, selector, target ,isArray = false){
    let result;
    try{
        let pageFunction = (e)=>{};

        if(target !== 'innerText') { 
            if(isArray){
                pageFunction = (elements, targ)=>elements.map((e)=>{
                    if(e.hasAttribute(targ)){
                        return e.getAttribute(targ)
                    }
                    return e.innerText
                })
            }else{
                pageFunction = (e, targ)=>{
                    if(e.hasAttribute(targ)){
                        return e.getAttribute(targ)
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
            result = await page.$$eval(selector, pageFunction, target)
        }else{
            result = await page.$eval(selector, pageFunction)
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
                    console.error(' Wrong Selector!!!. no data found for :-\n', '{name : ',name, ', selector :',selector,'}\n\n');
                }
            }
        }
        let finalResults = [];
        if(task.result.format === 'array'){
            let max_len = 0;
            Object.keys(currentResults).forEach((key, idx)=>{
                if(Array.isArray(currentResults[key])){
                    if(max_len < currentResults[key].length) {
                        max_len = currentResults[key].length
                    }
                }
            })
            
            for (let i = 0; i < max_len; i++) {
                finalResults.push({});
            }

            Object.keys(currentResults).forEach((key, idx)=>{
                if(Array.isArray(currentResults[key])){
                    for(let i=0; i<currentResults[key].length; i++){
                        finalResults[i][key] = currentResults[key][i]
                    }
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

async function run_task(page, task){
    if(isTaskValid(task)){
        return await processTask(page, task)
    }
}

module.exports = run_task








