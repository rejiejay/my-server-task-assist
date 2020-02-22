# 映射关系

原因: 为某些字段单独创建值, 浪费工作量; 所以使用到键值对key value的方式解决;

## 有哪些key值
INSERT INTO `task_assist`.`task_assis_map` (`id`, `key`) VALUES (1, 'allTarget');
INSERT INTO `task_assist`.`task_assis_map` (`id`, `key`) VALUES (2, 'processTarget');
INSERT INTO `task_assist`.`task_assis_map` (`id`, `key`) VALUES (3, 'processTask');

## API

- get:/map/get
[获取映射关系](http://localhost:1932/map/get?key=target)

- post:/map/set
[设置映射关系](http://localhost:1932/map/get?key=target&value=[{key:value}])

- clear:/map/clear
[清空映射关系](http://localhost:1932/map/clear?key=target)


