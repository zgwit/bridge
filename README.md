# bridge
网络桥接服务，在没有固定IP的情况下，通过云主机，把内网服务映射到公网


如果已经有了固定IP，可以使用NAT

如果有客户端，使用P2P速度更快


大致架构图：

```mermaid
  graph;
      APP<-->bridge云主机;
      bridge云主机-->client内网主机;
      client内网主机-->服务;
```

测试代码
```javascript
const {open} = require("./client");
const {create} = require("./bridge");

create("8000", "8081")

open("localhost", "8000", "localhost", "8080")
```
