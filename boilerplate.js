const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect()
    .then(()=> {
               
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

