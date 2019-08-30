## Esper API Wrapper

Welcome to the API wrapper for the Esper Control Suite

This promised-based (ES6) wrapper gives you fine-grained control over how your Esper hardware behaves. The intention of this API wrapper is to expose every feature, and all functionality the hardware is capable of.

This wrapper also includes a sandbox for you to test your scripts. You won't need the hardware to be connected to your computer, you don't even need the Control Suite installed.

#
# Installation
~~This package is available through NPM, install it in your project with the command~~
* Currently pre-release - will be available on NPM shortly
```bash
npm install esper-api
```


#
# Requirements
By default, the wrapper uses port 50005 to communicate with the API. It is necessary to allow this port in your firewall settings.
In order to connect to the API in production mode, it is necessary to run the Esper Control Suite whenever you are interacting with the API

This wrapper makes use of promises which are only available in Javascript ES6 (ECMA2015) onwards (Node v10+)

#
## Basic Usage - Connecting and Disconnecting

Instantiate the Esper class:

```javascript
const esperClass = require('esper-api');
const Esper = new esperClass();
```
`esperClass()` can take two optional arguments: 
```javascript
esperClass(verbose = true, endpoint = 'localhost')
```
#
### Async 
Every method on the Esper object returns a promise.
#
#### Sandbox
To use the Sandbox:
```javascript
Esper.sandbox().then(()=>{
     // code to do things
});
```

#### Production
to use the live version of the api, simply change the `Esper.sandbox()` method to `Esper.connect()` like so:
```javascript
Esper.connnect().then(()=>{
    // code to do things
});
```
#### Disconnecting
The wrapper in sandbox mode creates is own socket.io server in order to simulate the behaviour of the real API. The production form of the wrapper will connect to the API's socket.io server. The socket.io connection will be maintained until it is intentionally closed.
```javascript
Esper.disconnect();
```
This should only be called once your final promise has resolved.
For example:

```javascript
const esperClass = require('esper-api');
const Esper = new esperClass();

Esper.connnect().then(()=>{
    
    // code to do things    
    
    //then
    Esper.disconnect();

});
```

#
## Promises and error handling
The `Esper.describeErrors(errors)` method prints a detailed readout of the errors which were raised. The argument for this method is the array of error strings that were raised by the wrapper. This makes it easy to create `.catch` blocks for the promises returned by the wrapper.
For example: 
```javascript
.catch((errors)=>{
    Esper.describeErrors(errors);
    //anything else you want to do with the errors
});
```
An example of what this would yield on the console is:
```
|====================================================
|======|     ERROR - There were 2 error(s)     |=====
|======| Summary of the error(s) is as follows |=====
|====================================================
|
|    #1)    This is an example error message
|    #2)    This is a second error that arose
|====================================================
```

#
# Functionality

### List Available Light Nodes
This returns an array of light node objects each with associated metadata.
Call it like so:
```javascript
Esper.getAvailableLights().then((lights)=>{
    console.log(lights);  
});
```
This will print:
```javascript
[
    {   
        id:1,
        xyz:[0,0,0],
        ledPolarisation:['horizontal','neutral','vertical'],
        line:0,
        address:1,
        maxFlashDuration:50,
        maxModellingLight:0.03,
        maxLightStages:32
    },          
    {   
        id:2,
        xyz:[200,0,0],
        ledPolarisation:['horizontal','neutral','vertical'],
        line:0,
        address:2,
        maxFlashDuration:50,
        maxModellingLight:0.03,
        maxLightStages:32
    },
          
      //...and so on
]
   ```
Once this method has been called, the array of light node objects received is stored in the `Esper.availableLights` attribute.

Each light node object has the following attributes:
```javascript
{   
    id:1,                   //integer - used to uniquely identify a particular light on the rig
    xyz:[0,0,0],            //physical location of that light node relative to the center of the dome in mm
    ledPolarisation:[       //describes the filters on each of the LEDs (i.e led 0 is horisontally polarized)
        'horizontal',
        'neutral',
        'vertical'],     
    line:0,                 //shows the data port on the controller box that this light is chained to
    address:1,              //shows the address on the line that this light responds to
    maxFlashDuration:50,    //maximum duration possible in milliseconds
    maxModellingLight:3,    //maximum modelling light intensity in percentage points (i.e 3%)
    maxLightStages:32       //maximum number of light stages the node can hold (sequence mode)   
},   
```

### Modelling Light
The modelling light can be set in two different manners: Globally or Individually

#### Global Modelling Light
To set the modelling light globally (each light illuminated the same), choose what brightnesses you want for each LED, then pass this as an array to `Esper.globalModellingLight()`.
For example:
```javascript
let globalModellingLightPayload = [1, 3, 0.5]; 
Esper.globalModellingLight(globalModellingLightPayload);
``` 
This would result in 1% brightness for the Horizontally polarised LED, 3% brightness for the Neutral LED and 0.5% brightness for the vertically polarised LED. The array indexes are the same as the `ledPolarisation` attribute on the light node object.
 
 #### Individual modelling light
 It is possible to set individual modelling light brightnesses on each light node. 

```javascript
let modellingLightPayload = {id:1,intensities:[3,0,0]};

Esper.individualModellingLight(modellingLightPayload)
```
calling `Esper.individualModellingLight()` only affects the light in question, allowing for very precise control over the static illumination of the rig

 #### Modelling light off
 To turn the modelling light off regardless of current configuration, use the command

 ```javascript
 Esper.modellingLightOff();
```
 
 
 
 
### Bullseye
The bullseye method indicates to the subject where to look inside the dome. It achieves this by turning off the modelling light in a ring around the light node the subject should look at.
```javascript
Esper.bullseyeOn();

Esper.bullseyeOff();
```
Both of these methods return a promise so it would be possible to turn the bullseye on for 1 second with the following example
```javascript
Esper.bullseyeOn().then(()=>{

    setTimeout(()=>{
    
        Esper.bullseyeOff();
        
    },1000);
    
});
``` 


#### Chain Mode
Chain mode offers the user the ability to have fine-grained, multi-step directional lighting for the subject. Each light node can only flash once per take. In its longest form, this could be one light at a time, one after the other. 
It is possible to have more than one light illuminate per step giving a large number of creative options. `Esper.chain()` takes an array as an argument. Each element in this array details what a particular light should do.
An example of a single element is:
```javascript
{
    id:1,                       //ID of the light node 
    stage:2,                    //the step on which this light is to flash. (this example, light #1 will flash on the second exposure)
    intensities:[0.99,0.5,0],   //Flash Illumination intensities for each of the LEDs on the light node. (0-100 %)
    duration:1.99               // Flash duration in ms. 0 < flashDuration <= 30 ms
}
```
Specifying multiple light node behaviours creates a chain mode payload:
```javascript
let chainPayload = [
    {
        id:1,
        stage:1,
        intensities:[100,0,0],
        duration:5,
    },
    {
        id:2,
        stage:2,
        intensities:[0,100,0],
        duration:5,
    },
    {
        id:3,
        stage:2,
        intensities:[0,0,100],
        duration:5,
    },
    {
        id:4,
        stage:3,https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#klinecandlestick-datahttps://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#klinecandlestick-data
        intensities:[100,100,100],
        duration:10,
    },
];

Esper.chain(chainPayload)
    .then(()=>{
        console.log("Chain mode data uploaded to the Light Nodes");
        //ready to trigger    
    })
    .catch((err)=>{
        Esper.describeErrors(err);
    });
```
This example result in a lighting profile with 3 stages. In the first stage, only light node 1 flashes, on the second stage light nodes 2 and 3 flash, and the third and final stage is where light 4 flashes all three of its LEDs.


#### Sequencer Mode
Sequencer mode allows you to create complex lighting stages. Each light stage is independant from the one that came before it, so unlike chain mode, each light can flash on as many light stages as you like. There is a maximum of 32 light stages.

The payload sent to the `Esper.sequence(payload)` method is an array of lighting stages.

Each light stage has the following attributes:
```javascript
[
    {id:1,intensities:[0,0,75.00],duration:5.5},
    {id:2,intensities:[100,0,0]https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#klinecandlestick-data,duration:5},
    {id:3,intensities:[100,0,0],duration:5},
    {id:4,intensities:[0,100,0],duration:3},
    //...
    {id:156,intensities:[0,100,0],duration:10.55},
]
```
The ID parameter is the ID of the light, the intensities are the brighnesses you want each LED to flash at and the duration is the flash duration for that light in ms.


Multiple light stages are then assembled into a full payload :
```javascript
let sequencePayload =[
    [   // Stage 1
        {id:1,intensities:[100,0,0],duration:5.5},
        {id:2,intensities:[100,0,0],duration:5},
        {id:3,intensities:[100,0,0],duration:5},
        {id:4,intensities:[100,0,0],duration:3},
        ...
        {id:156,intensities:[100,0,0],duration:5.5}, 
    ],
    [   // Stage 2
        {id:1,intensities:[0,100,0],duration:5.5},
        {id:2,intensities:[0,100,0],duration:5},
        {id:3,intensities:[0,100,0],duration:5},
        {id:4,intensities:[0,100,0],duration:3},
        ...
        {id:156,intensities:[0,100,0],duration:10.55},
    ],
    //... so on up to a maximum of 32 stages
]



Esper.sequence( sequencePayload )
    .then(()=>{        
        console.log("Sequencer payload uploaded");
        //then do other things
        
    })
    .catch((errs)=>{
        Esper.describeErrors(errs);
    });
```


### Triggering
It is possible to start the capture process by calling `Esper.trigger()` without any arguments 
```javascript
Esper.trigger();
```
This will trigger the capture with default parameters listed below:

```javascript
let triggerArgs = {
    stages: 5,                      //how many stages to capture - defaults to  0 - triggering all stages
    start: 3,                       //stage on which to start (i.e start capture from the 4th stage onwards (zero indexed)) 
                                        // defaults to start from the first stage
    acclimatizationDuration: 3000,  //length of time for acclimatization in ms - max 10000 - default 0
    acclimatizationIntensity: 3,    //acclimatization intensity in percent - max 10%    - default 0 
    preFocusDelay: 400,             //how long to assert focus on the cameras before capture - max 1000 - default 500
    captureMode: 'dslr'             //triggering mode  - options "dslr", "mv" and "video"       - default "dslr"
}

Esper.trigger( triggerArgs )
    .then(()=>{
        console.log("Capture Complete!");
    })
    .catch((errs)=>{
        Esper.describeErrors(errs);
    });
```
# Examples

Let's create a worked example of a mini rig with 6 lights. We will connect to the Esper API, upload a lighting profile to the rig, turn the modelling light on for 10 seconds, then turn it off before triggering the cameras.
Order of operation:
1. Connect to Esper API
2. Upload a sequence payload consisting of 3 stages
3. Turn on the modelling light
4. Wait 10 seconds
5. Turn the modelling light off
6. Perform a full capture

```javascript
const esperClass = require('esper-api');
const Esper = new esperClass();

//define our very simple lighting profile
let payload = [
    // stage 1
    [
        {id:1,intensities:[0,100,0],duration:5},
        {id:2,intensities:[0,100,0],duration:5},
        {id:3,intensities:[0,100,0],duration:5},
        {id:4,intensities:[0,100,0],duration:5},
        {id:5,intensities:[0,100,0],duration:5},
        {id:6,intensities:[0,100,0],duration:5}
    ],
    // stage 2
    [
        {id:1,intensities:[0,0,100],duration:5},
        {id:2,intensities:[0,0,100],duration:5},
        {id:3,intensities:[0,0,100],duration:5},
        {id:4,intensities:[0,0,100],duration:5},
        {id:5,intensities:[0,0,100],duration:5},
        {id:6,intensities:[0,0,100],duration:5}
    ],
    // stage 3 - final
    [
        {id:1,intensities:[100,0,0],duration:5},
        {id:2,intensities:[100,0,0],duration:5},
        {id:3,intensities:[100,0,0],duration:5},
        {id:4,intensities:[100,0,0],duration:5},
        {id:5,intensities:[100,0,0],duration:5},
        {id:6,intensities:[100,0,0],duration:5}
    ]
];

// Deal with the API
Esper.connect()
    .then(()=>{
        return Esper.sequence(payload);
    })
    .then(()=>{
        return Esper.globalModellingLight([0,1.5,0]);
    })
    .then(()=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                Esper.modellingLightOff()
                    .then(resolve);
            },10000);
        });
    })
    .then(()=>{
        return Esper.trigger(); //simple trigger with no args
    })
    .catch((errors)=>{
        Esper.describeErrors(errors);
    })
```