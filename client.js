const net = require("net")

function open(bridgeHost, bridgePort, localHost, localPort) {
    let timer;


    let sock = net.createConnection({host: bridgeHost, port: bridgePort}, function () {
        console.log("Bridge connected")
        timer = setInterval(function (){
            sock.write("heartbeat:")
        }, 30000)
    })

    function handle(command) {
        if (command === "yield") {
            let sock1 = net.createConnection({host: bridgeHost, port: bridgePort}, function () {
                console.log("sock1 connected")
                let sock2 = net.createConnection({host: localHost, port: localPort}, function () {
                    console.log("sock2 connected")
                    sock1.pipe(sock2)
                    sock2.pipe(sock1)
                })
                sock2.on("error", function (err) {
                    console.log("sock2", err)
                })
                sock2.on("close", function (){
                    console.log("sock2 close")
                })
            })
            sock1.on("error", function (err) {
                console.log("sock1", err)
            })
            sock1.on("close", function (){
                console.log("sock1 close")
            })
        }
    }

    sock.on("data", function (data) {
        let text = data.toString()
        console.log("Bridge data", text)
        let commands = text.split(":")
        commands.forEach(handle)
    })

    sock.on("error", console.error)

    sock.on("close", function () {
        //重新连接
        //clearInterval(timer)
        //open(bridgeHost, bridgePort, localHost, localPort)
        sock.connect({host: bridgeHost, port: bridgePort})
    })
}

exports.open = open



