const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect()
    .then(()=> {
        return esper.setLoopAtStage(14); // Stages are zero-indexed:
    })
    .then(()=>{
        return esper.setLoopToStage(3);
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

