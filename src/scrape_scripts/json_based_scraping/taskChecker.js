function taskIsValid(task) {
    if (!task || typeof task !== 'object') {
        console.error('Invalid task object:', task);
        return false;
    }

    if (!task.url || typeof task.url !== typeof '') {
        console.error('Invalid or missing "url" in task:', task);
        return false;
    }

    const requiredParams = task.url.match(/{{(.*?)}}/g) || [];
    for (const requiredParam of requiredParams) {
        const paramName = requiredParam.replace(/{{|}}/g, '');
        if (!task.params || !task.params[paramName]) {
            console.error(`Required parameter "${paramName}" not provided for URL: ${task.url}`);
            return false;
        }
    }

    for (const paramName in task.params) {
        if (task.params.hasOwnProperty(paramName)) {
          if (!requiredParams.includes(`{{${paramName}}}`)) {
            console.error(`Parameter "${paramName}" in "params" is not used in the URL: ${task.url}`);
            return false;
          }
        }
    }

    if (!Array.isArray(task.selectors) || task.selectors.length === 0) {
        console.error('Invalid or missing "selectors" in task:', task);
        return false;
    }

    if (!task.result || typeof task.result !== 'object') {
        console.error('Invalid or missing "format" in task:', task);
        return false;
    }

    for (const selectorInfo of task.selectors) {
        if (
            !selectorInfo ||
            typeof selectorInfo !== 'object' ||
            !selectorInfo.name ||
            !selectorInfo.selector ||
            typeof selectorInfo.name !== 'string' ||
            typeof selectorInfo.selector !== 'string'
        ) {
            console.error('Invalid or missing selector information in task:', task);
            return false;
        }
    }
    outerloop:
    for(const data of task.result.data){
        
        for(const selectorInfo of task.selectors){
            if(selectorInfo.name === data){
                break outerloop
            }
        }
        console.error('Invalid or missing selector information in task:', task);
        return false;
    }

    if (!task.result.data) {
        console.error('Invalid or missing "format.data" :', task);
        return false;
    }

    if(task.result.format === 'array'){
        for(const selectorInfo of task.selectors){
            if(selectorInfo.format === 'single') {
                console.error('Invalid "format.result", one or many selectors have format of type "single" ')
                return false
            }
        }
    }


    if (task.result.format !== 'single' && task.result.format !== 'array') {
        console.error('Invalid "result" in task format:', task);
        return false;
    }

    if (task.result.format === 'array' && (!task.result.data)) {
        console.error('Invalid or missing "data" in task format for "array" result:', task);
        return false;
    }

    return true;
}

module.exports = taskIsValid