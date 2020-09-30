const EsperFactory = require('./esper-api');
let esper = new EsperFactory();
esper.connect()
    .then(()=> {
//      return esper.setLightingMode("table"); // Gradient
        return esper.setLightingMode("chain"); // OLAT
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

