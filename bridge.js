const net = require("net")


function create(mainPort, outerPort) {
    let incoming = []
    let mainSocket

    let mainServer = net.createServer(function (sock) {
        //第一个连接做为主连接
        if (!mainSocket) {
            console.log("Main online", sock.remoteAddress)

            mainSocket = sock
            sock.on("data", function (data) {
                //ignore
                //console.log("Main data", data.toString())
            })
            sock.on("error", console.error)
            sock.on("close", function () {
                mainSocket = undefined
            })
            return
        }

        console.log("Main incoming", sock.remoteAddress)

        let s = incoming.pop()
        if (s) {
            console.log("Bind", sock.remoteAddress, s.remoteAddress)
            sock.pipe(s)
            s.pipe(sock)
        }
    })

    mainServer.on('error', (err) => {
        throw err;
    });

    mainServer.listen(mainPort, () => {
        console.log('Main bind', mainPort);
    });


    let outerServer = net.createServer(function (socket) {
        if (mainSocket) {
            console.log("Outer incoming", socket.remoteAddress)
            incoming.push(socket)
            mainSocket.write("yield:")
            socket.on("error", console.error)
        } else {
            socket.end("none")
        }
    })

    outerServer.on('error', (err) => {
        throw err;
    });

    outerServer.listen(outerPort, () => {
        console.log('Outer server bind', outerPort);
    });
}

exports.create = create
