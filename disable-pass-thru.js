const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect()
    .then(()=> {
        console.log("Disabling pass through mode...");
        esper.useBackendTerminalCommand("PT 0");
        setTimeout(()=>{
            esper.disconnect()
        }, 1000);
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

