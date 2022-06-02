# bridge
网络桥接服务，在没有固定IP的情况下，把内网服务映射到公网


大致架构图：

[APP] <==> [bridge云主机] <===> [client内网主机] <===> [服务]

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
