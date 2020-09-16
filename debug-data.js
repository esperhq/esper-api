const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

const TOGGLE_PER = 1000;

esper.connect()
    .then(()=> {
        setInterval(()=>{
            esper.globalModellingLight([0,0.3, 0]);
            setTimeout(()=>{
                esper.globalModellingLight([0,0, 0]);
            }, TOGGLE_PER/2);
        }, TOGGLE_PER);
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

