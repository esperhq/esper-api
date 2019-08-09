##Esper API Wrapper

Welcome to the API wrapper for the Esper Control Suite

This promised-based wrapper gives you fine-grained control over how your Esper hardware behaves. The intention of this API wrapper is to expose every feature and functionality the hardware is capable of.

This wrapper also includes a sandbox for you to test your scripts. You won't need the hardware to be connected to your pc and you can even test on computer that doesn't have the Control Suite installed.

#
#Installation
This package is available through NPM, install it in your project with the command

`npm install esper-api`


#
#Requirements
By default, the wrapper uses port 50005 to communicate with the API. It is necessary to allow this port in your firewall settings.

#
##Basic Usage - Connecting and Disconnecting

Instantiate the Esper class;

```
const esperClass = require('esper-api');
const Esper = new esperClass();
```


Every method on the Esper object returns a promise
####Sandbox
To use the Sandbox:
```$xslt
Esper.sandbox().then(()=>{
    ## code to do things
});
```

#### Production
to use the live version of the api, simply change the `Esper.sandbox()` method to `Esper.connect()` like so
```$xslt
Esper.connnect().then(()=>{
    ## code to do things
});
```
#### Disconnecting
The wrapper in sandbox mode creates is own socket.io server in order to simulate the behaviour of the real API. The production form of the wrapper will connect to the API's socket.io server. The socket.io connection will be maintained until it is intentionally closed.
```$xslt
Esper.disconnect();
```
This should only be called once your final promise has resolved.
for example

```$xslt
const esperClass = require('esper-api');
const Esper = new esperClass();

Esper.connnect().then(()=>{

    ## code to do things
    
    .then(()=>{
        Esper.disconnect();
    });
});
```

#
## Promises and error handling
The `Esper.describeErrors(errors)` method prints a detailed readout of the errors which were raised. The argument for this method is the array of error strings that were raised by the wrapper. This makes it easy to create `.catch` blocks for the promises returned by the wrapper.
for example: 
```$xslt
.catch((errors)=>{
    Esper.describeErrors(errors);
    //anything else you want to do with the errors
});
```
An example of what this would yield on the console is:
```$xslt
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
#Functionality

###List Available Light Nodes
This returns an array of light node objects each with associated metadata.
call it like so;
```$xslt
Esper.getAvailableLights().then((lights)=>{
    console.log(lights) ;  
;});
```
This will print
```
[
    {   
        id:1,
        xyz:[0,0,0],
        ledPolarisation:['horisonal','neutral','vertical'],
        line:0,
        address:1,
        maxFlashDuration:50,
        maxModellingLight:0.03,
        maxLightStages:32
    },          
    {   
        id:2,
        xyz:[200,0,0],
        ledPolarisation:['horisonal','neutral','vertical'],
        line:0,
        address:2,
        maxFlashDuration:50,
        maxModellingLight:0.03,
        maxLightStages:32
    },
          
      ...and so on
]
   ```
Once this method has been called, the array of light node objects received is stored in the `Esper.availableLights` attribute

Each light node object has the following attributes;
```$xslt
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

###Modelling Light
The modelling light can be set in two different manners: Globally or Individually

####Global Modelling Light
To set the modelling light globally (each light illuminated the same), choose what brightnesses you want for each LED, then pass this as an array to `Esper.modellingLight()`
For example 
```
Esper.modellingLight([1, 3, 0.5]);
``` 
would result in 1% brightness for the Horizontally polarised LED, 3% brightness for the Neutral LED and 0.5% brightness for the vertically polarised LED. The array indexes are the same as the `ledPolarisation` attribute on the light node object.
 
###Bullseye
The bullseye method indicates where to look to the subject inside the dome. It achieves this by turning off the modelling light in a ring around the light node the subject should look at.
```$xslt
Esper.bullseyeOn()

Esper.bullseyeOff()
```
Both of these methods return a promise so it would be possible to turn the bullseye on for 1 second with the following example
```$xslt
Esper.bullseyeOn().then(()=>{

    setTimeout(()=>{
    
        Esper.bullseyeOff();
        
    },1000);
    
});
``` 


####Chain Mode
Chain mode offers the user the ability to have fine-grained, multi-step directional lighting for the subject. Each light node can only flash once per take. In its longest form, this could be one light at a time, one after the other. 
It is possible to have more than one light illuminate per step giving a large number of creative options. `Esper.chain()` takes an array as an argument. Each element in this array details what a particular light should do.
An example of a single element is;
```$xslt
{
    id:1,                       //ID of the light node 
    stage:2,                    //the step on which this light is to flash. (this example, light #1 will flash on the second exposure)
    intensities:[0.99,0.5,0],   //Flash Illumination intensities for each of the LEDs on the light node. (0-100 %)
    duration:1.99               // Flash duration in ms. 0 < flashDuration <= 30 ms
}
```
Specifying multiple light node behaviours creates a chain mode payload
```$xslt
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
        stage:3,
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
This example result in a lighting profile with 3 stages. In the first stage, only light node 1 flashes, on the second stage light nodes 2 and 3 flash, and the third and final stage is where light 4 flashes all three LEDs.


####Sequencer Mode


