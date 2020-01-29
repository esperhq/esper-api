const readline = require('readline');
const EsperFactory = require("./esper-api.js");
let Esper = new EsperFactory(true, "192.168.1.50");
Esper.connect();
readline.emitKeypressEvents(process.stdin);

let previousCommands = [];
let previousCommandIndex = -1;

try{
    process.stdin.setRawMode(true);
    process.stdout.cursorTo(0,0, ()=>{
        process.stdout.clearScreenDown(()=>{});
    })
}
catch(err){
    console.log("Can't run setRawMode from IDE.");
    process.exit(-1);
}

let thisLine = "";
process.stdin.on('keypress', (str, key) => {
    //console.log(key);
    if (key.sequence === "\b"){
        if (thisLine.length > 0){
            thisLine = thisLine.substring(0, thisLine.length-1)
        }
    }
    else if (str !== undefined){
        thisLine+=str;
    }
    if (key.name === "up"){
        previousCommandIndex++;
        if (previousCommands[previousCommandIndex]){
            thisLine = previousCommands[previousCommandIndex];
        }
    }

    process.stdout.cursorTo(0, 0, ()=>{
        process.stdout.clearLine();
        process.stdout.write(">>> " + thisLine.trimStart().trim() + "\n", ()=> {
            if (thisLine.length > 0){
                Esper.testBackendTerminalCommand(thisLine.split(" ")[0], (commands)=>{
                    process.stdout.cursorTo(0,1, ()=>{
                        process.stdout.clearScreenDown(()=>{
                            for (let command of commands){
                                process.stdout.write(" * " +  command + "\n");
                            }
                            setTimeout(()=>{
                                process.stdout.cursorTo(thisLine.length + 4, 0)
                            }, 50);
                        })
                    })
                });
            }
        });
    });

    if (str === "\r"){
        console.log("command:" + thisLine);
        Esper.useBackendTerminalCommand(thisLine);
        previousCommands.push(thisLine);
        thisLine = "";
    }


    if(key.sequence === '\u0003') {
        process.stdout.cursorTo(0,0, ()=>{
            process.stdout.clearScreenDown(()=> {
                process.exit();
            });
        });
    }
});

