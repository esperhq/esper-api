let esperClass = require("./esper-api");
let esp = new esperClass(true); // enable verbose reporting
let chainPayload = [];

for (let i = 1; i <= 6; i++){
    chainPayload.push({
        id: i,
        stage: i-1,
        intensities: [100, 100, 100],
        duration: 29
    });
}

let intraDelayMillis = 1000;

esp.connect()
    .then(()=>{
        return esp.chain(chainPayload)
    })
    .then(()=>{
        //return esp.waitMillis(intraDelayMillis);
    })
    .then(()=>{
        return esp.setCurrentSequencePoint(0);
    })
    .then(()=>{
        return esp.waitMillis(intraDelayMillis);
    })
    .then(()=>{
        return esp.trigger({stages:6, fps:7}); // fps is needed - if unsure of camera fps, err on the slow side.
    })
    .then(()=>{
        return esp.exitChainMode();
    })
    .catch((err) => {
        esp.exitChainMode();
        esp.describeErrors(err);
    });


/*

.then(() => {
        esp.globalModellingLight([0, 0, 0]);
    })
    .then(() => {
        for (let i = 0; i < 6; i++) {
            esp.individualModellingLight({
                id: i + 1,
                intensities: [0.15,0,0]
            });
        }
    })
    .then(() => {
        let seqPayload = [
            [
                {id: 1, intensities: [1,0,0], duration: 1},
                {id: 2, intensities: [1,0,0], duration: 1},
                {id: 3, intensities: [1,0,0], duration: 1},
                {id: 4, intensities: [1,0,0], duration: 1},
                {id: 5, intensities: [1,0,0], duration: 1},
                {id: 6, intensities: [1,0,0], duration: 1}
            ],
            [
                {id: 1, intensities: [1,1,0], duration: 10},
                {id: 2, intensities: [1,1,0], duration: 10},
                {id: 3, intensities: [1,1,0], duration: 10},
                {id: 4, intensities: [1,1,0], duration: 10},
                {id: 5, intensities: [1,1,0], duration: 10},
                {id: 6, intensities: [1,1,0], duration: 10}
            ],
            [
                {id: 1, intensities: [100,100,100], duration: 30},
                {id: 2, intensities: [100,100,100], duration: 30},
                {id: 3, intensities: [100,100,100], duration: 30},
                {id: 4, intensities: [100,100,100], duration: 30},
                {id: 5, intensities: [100,100,100], duration: 30},
                {id: 6, intensities: [100,100,100], duration: 30}
            ]
        ];
        return esp.sequence(seqPayload)
    })
    .then(() => {
        setTimeout(()=>{
            esp.trigger(
                {
                    stages: 3,
                    start: 0,
                    acclimatizationDuration: 3000,
                    acclimatizationIntensity: 3,
                    preFocusDelay: 600,
                    fps: 10,
                    captureMode: 'mv'
                }
            );
        }, 2000)
    })

 */