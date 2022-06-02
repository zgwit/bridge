const net = require("net")


function create(localPort, remotePort) {
    let incoming = []
    let mainSocket

    let local = net.createServer(function (sock) {
        //第一个连接做为主连接
        if (!mainSocket) {
            console.log("主连接接入", sock.remoteAddress)
            mainSocket = sock
            sock.on("data", function (data) {
                //ignore
                console.log("主连接数据", data.toString())
            })
            sock.on("error", function (err) {
                console.error(err)
            })
            sock.on("close", function () {
                mainSocket = undefined
            })
            return
        }

        let s = incoming.pop()
        if (s) {
            console.log("连接绑定", sock.remoteAddress, s.remoteAddress)
            sock.pipe(s)
            s.pipe(sock)
        }
    })

    local.on('error', (err) => {
        throw err;
    });

    local.listen(localPort, () => {
        console.log('Local bind');
    });


    let server = net.createServer(function (socket) {
        if (mainSocket) {
            console.log("外部接入", socket.remoteAddress)
            incoming.push(socket)
            mainSocket.write("yield:")
        } else {
            socket.end("none")
        }
    })

    server.on('error', (err) => {
        throw err;
    });

    server.listen(remotePort, () => {
        console.log('Server bind');
    });
}

exports.create = create
