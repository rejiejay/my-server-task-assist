# 任务辅助跟进系统-server-part
用于辅助完成任务的系统Server部分;

# 原型

[任务辅助跟进系统（墨刀）](https://free.modao.cc/app/7ea2223846d8dbc3b853a500f06e4e9bc3e02b5c)

# 搭建步骤

- cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

- nestjs
```
cnpm i -g @nestjs/cli
```

```
cnpm install -d
```

# 命令
- 启动
```
npm run start:dev
```

[http://localhost:1932/](http://localhost:1932/)

- 创建 controller 层
nest g controller name
nest g module name

# 发布流程
端口号: src\main.ts:20 ——> 3814  
数据库: src\config\mysql.ts ——> 配置信息在有道云上  

之后操作: 参考有道云

# 额外源码 BUG
Ctrl + P -> node_modules\._express@4.17.1@express\lib\response.js:771  
删除 this.setHeader(field, value);
