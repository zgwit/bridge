# bridge
网络桥接服务，在没有固定IP的情况下，把内网服务映射到公网

有固定IP，使用NAT
有客户端，使用P2P


大致架构图：

[APP] <==> [bridge云主机] <===> [client内网主机] <===> [服务]


const {open} = require("./client");
const {create} = require("./bridge");

create("8000", "8081")

open("localhost", "8000", "localhost", "8080")

