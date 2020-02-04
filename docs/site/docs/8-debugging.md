# Debugging


### Reading MultiFlash IDs
When the ControllerBox is detected, it will issue a command to any connected MultiFlashes to read their pre-programmed IDs. The MultiFlash status LED shows a solid green light when it has correctly read an ID from memory. It is possible to manually tell the MultiFlashes to read their ID 
```javascript
Esper.loadLightNodeIDs();
``` 


 ***
## First startup - Initial Configuration
>Initial setup will be carried out for you during installation and commissioning of your rig, however the information regarding the process of setting up a rig is documented here in the event you need to change your setup for any reason.

The very first time an Esper MultiFlash starts up, it does not have an ID and needs to be assigned one. Each ID is unique to that particular MultiFlash and is the way you identify each MultiFlash when using the API. Each ID infers positional information of that light. IDs for a LightCage are assigned top to bottom in an anticlockwise fashion. 

We need to tell each MultiFlash to save its assigned ID into its EEPROM memory. Once this has happened, the lights will remember their ID when they start up every subsequent time. 

___
When the Esper Control Suite is opened, it goes through this process. If the ControllerBox is not found during this startup, you can request the software attempt to find the ControllerBox 
```javascript
Esper.findControllerBox();
```




~~In order to do this, we need to construct a NodeChain. This is the source of all information regarding the MultiFlashes that are connected to the ControllerBox. We need to tell the software what order the MultiFlashes are daisy-chained together.~~


#### Assigning MultiFlash IDs

Now the application knows how many MultiFlashes are connected and in what order, it can assign IDs. You can do this with the following function.

```javascript
Esper.writeEEPROMAddresses();
/* Beware, if this function errors out, your rig may behave unpredictably 
or not respond at all until it successfully runs.
 Assigning IDs to lights is not something that is done often. */
```
___
