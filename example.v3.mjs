// 同一示例跑在 v3 上：spawn 立即执行，与 v4 的输出差异就是 child: start 的位置
// 来源：https://frontside.com/effection/guides/v4/upgrade
import { run, spawn, sleep } from "effection-v3";

await run(function* example() {
  console.log("parent: start");
  yield* spawn(function* () {
    console.log("child: start");
    yield* sleep(10);
    console.log("child: end");
  });
  console.log("parent: middle");
  for (let i = 0; i < 1000; i++) {
    JSON.parse('{"a":1}');
  }
  console.log("parent: before async");
  yield* sleep(100);
  console.log("parent: end");
});
