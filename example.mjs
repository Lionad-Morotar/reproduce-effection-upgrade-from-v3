// 升级指南原文示例（v4）：验证调度优先级变化下的真实输出顺序
// 来源：https://frontside.com/effection/guides/v4/upgrade
import { run, spawn, sleep } from "effection";

await run(function* example() {
  console.log("parent: start");
  yield* spawn(function* () {
    console.log("child: start");
    yield* sleep(10);
    console.log("child: end");
  });
  console.log("parent: middle");
  for (let i = 0; i < 1000; i++) {
    // 大段纯同步工作：v4 期间子任务不会插入执行
    JSON.parse('{"a":1}');
  }
  console.log("parent: before async");
  yield* sleep(100);
  console.log("parent: end");
});
