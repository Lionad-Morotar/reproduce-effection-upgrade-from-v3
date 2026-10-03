# reproduce-effection

复现 Effection v3→v4 升级指南的调度示例，核实官方文档展示的输出顺序是否与真实运行一致。

来源：<https://frontside.com/effection/guides/v4/upgrade>（Announcing Effection 4.0，2025-12-23）

## 运行

```bash
pnpm install
pnpm v4   # effection 4.x（本仓库锁定 4.2.0 实测）
pnpm v3   # effection 3.x（alias 安装，本仓库锁定 3.6.1 实测）
```

## 实测输出（Node 22.22.1, macOS）

v4：

```text
parent: start
parent: middle
parent: before async
child: start
child: end
parent: end
```

v3：

```text
parent: start
child: start
parent: middle
parent: before async
child: end
parent: end
```

## 结论

1. 两版本唯一的行为差异是 `child: start` 的位置：v3 中 `spawn` 立即执行，子任务插在父任务同步代码（`parent: middle` 之前）中间；v4 中父任务永远优先，子任务要等父让位给真正异步操作（`sleep(100)`）才开始跑，出现在 `parent: before async` 之后。升级指南的这条教学点与实测一致。
2. 官方指南展示的 v3 与 v4 输出均把 `child: end` 排在 `parent: end` 之后，与实测不符：子任务自己的 `sleep(10)` 定时器到期（约 10ms）远早于父任务的 `sleep(100)`（约 100ms），`child: end` 在两个版本中都先于 `parent: end` 打印。「父优先」只在同一事件唤起多个任务或父任务仍处同步段时起作用，不会把已挂起子任务的独立事件扣到父完成之后。
3. 排查升级陷阱时的正确依据是本仓库实测：依赖「spawn 返回时子任务已开始执行」的 v3 代码在 v4 下静默失效，补救是显式 `yield* sleep(0)` 让位，或把父子关系改为共享 scope 的兄弟任务。
