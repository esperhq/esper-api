let esperClass = require("./esper-api");
let Esper = new esperClass(true); // enable verbose reporting


Esper.connect()
    .then(()=>{
        //modelling light off
        return Esper.globalModellingLight([0, 0, 0]);
    })


    .then(() => {


        let lightSequence = [
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ],
            [
                {id: 1, intensities: [100, 100, 100], duration: 20},
                {id: 2, intensities: [100, 100, 100], duration: 20},
                {id: 3, intensities: [100, 100, 100], duration: 20},
                {id: 4, intensities: [100, 100, 100], duration: 20},
                {id: 5, intensities: [100, 100, 100], duration: 20},
                {id: 6, intensities: [100, 100, 100], duration: 20},
                {id: 7, intensities: [100, 100, 100], duration: 20},
                {id: 8, intensities: [100, 100, 100], duration: 20},
                {id: 9, intensities: [100, 100, 100], duration: 20},
            ]
        ];
        return Esper.sequence(lightSequence)

    })

    .then(()=>{
        console.log("triggering...");
        Esper.trigger({
            start:0,
            stages:10,
            fps: 10,
            preFocusDelay:400,
            captureMode: 'mv'})
    })

    .then(()=>{
        Esper.disconnect();
    })

    .catch((err)=>{
        Esper.describeErrors(err);
        Esper.disconnect();
    });