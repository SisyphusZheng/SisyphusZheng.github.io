#!/usr/bin/env -S deno run -A

/**
 * FreshPress 统一预加载调度器
 * 作为一个中央调度空间，按顺序执行必要的预加载任务
 * 不重新实现功能，而是调用现有的独立任务
 */

// 记录开始时间
const startTime = performance.now();

console.log("🚀 FreshPress 系统预加载开始...");

/**
 * 执行Deno任务
 * @param taskName 任务名称
 * @returns 执行结果
 */
async function runTask(taskName: string): Promise<boolean> {
  try {
    console.log(`\n📋 执行任务: ${taskName}`);

    // 先检查任务是否存在
    try {
      const checkProcess = new Deno.Command("deno", {
        args: ["task", "--help"],
        stdout: "piped",
        stderr: "piped",
      });

      const { stdout } = await checkProcess.output();
      const output = new TextDecoder().decode(stdout);

      // 如果输出中没有包含这个任务名称，说明任务不存在
      if (!output.includes(taskName)) {
        console.warn(`⚠️ 任务 ${taskName} 不存在，跳过`);
        return true; // 返回true以继续执行后续任务
      }
    } catch (e) {
      // 检查失败，继续尝试执行任务
      console.warn(`⚠️ 检查任务 ${taskName} 是否存在时出错，将尝试执行`);
    }

    const process = new Deno.Command("deno", {
      args: ["task", taskName],
      stdout: "inherit",
      stderr: "inherit",
    });

    const { code } = await process.output();

    if (code === 0) {
      console.log(`✅ 任务 ${taskName} 成功完成`);
      return true;
    } else {
      console.error(`❌ 任务 ${taskName} 执行失败，退出码: ${code}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 执行任务 ${taskName} 时出错:`, error);
    return false;
  }
}

/**
 * 主预加载函数 - 按顺序调度各个预加载任务
 */
async function preload() {
  try {
    // 1. 初始化目录结构
    console.log("\n📁 步骤1/3: 初始化目录结构...");
    const initResult = await runTask("init");

    // 2. 生成客户端配置
    console.log("\n⚙️ 步骤2/3: 生成客户端配置...");
    const configResult = await runTask("gen-config");

    // 3. 构建搜索索引
    console.log("\n🔍 步骤3/3: 构建搜索索引...");
    const indexResult = await runTask("search:index");

    // 计算总耗时
    const endTime = performance.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n✅ 预加载完成！总耗时: ${totalTime}秒`);

    // 成功状态
    const success = initResult && configResult && indexResult;
    if (success) {
      console.log("🎉 系统已全部准备就绪！");
    } else {
      console.log("⚠️ 系统已启动，但部分任务未能成功完成");
    }

    return success;
  } catch (error) {
    console.error("❌ 预加载过程中发生错误:", error);
    return false;
  }
}

// 如果直接运行此脚本
if (import.meta.url === Deno.mainModule) {
  const success = await preload();
  // 使用适当的退出码
  Deno.exit(success ? 0 : 1);
}

// 导出预加载函数供其他模块使用
export { preload };
