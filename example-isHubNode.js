const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect()
    .then(()=>{
        return esper.globalModellingLight([0,0,0]);
    })
    .then(()=> {
        return esper.getAvailableLights();
    })
    .then((availableLights)=>{
        for (let light of availableLights) {
            if (light.isHubNode){
                esper.individualModellingLight({
                        intensities: [1,1,1],
                        id: light.id
                    }
                ).catch((err) => {
                    console.log(err)
                });
            }
        }
    })
    .then(()=>{
        esper.disconnect();
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

