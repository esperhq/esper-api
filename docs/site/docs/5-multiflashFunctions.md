# Multiflash Functions

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
        maxFlashDuration:30,
        maxModellingLight:0.03,
        maxLightStages:32
    },          
    {   
        id:2,
        xyz:[200,0,0],
        ledPolarisation:['horizontal','neutral','vertical'],
        line:0,
        address:2,
        maxFlashDuration:30,
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
Esper.globalModellingLight([1, 3, 0.5]);
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
