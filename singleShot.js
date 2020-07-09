const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect()
    .then(()=>{
        return esper.useBackendTerminalCommand("s 1");
    })
    .then(()=>{
        return esper.wait(300);
    })
    .then(()=>{
        return esper.useBackendTerminalCommand("s 0");
    })
    .then(()=>{
        return esper.disconnect();
}).catch((errs)=>{
    console.error("API::caught errors:");
    console.table(errs);
});

