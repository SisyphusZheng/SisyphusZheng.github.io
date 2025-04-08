import { Handlers } from "$fresh/server.ts";
import { ResumePlugin } from "../../../plugins/resume/mod.ts";
import * as puppeteer from "puppeteer";

export const handler: Handlers = {
  async GET(req) {
    const resumePlugin = new ResumePlugin();
    const resumeData = await resumePlugin.getResumeData();

    if (!resumeData) {
      return new Response(JSON.stringify({ error: "Resume data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // 启动浏览器
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // 获取当前请求的URL并构建简历页面的URL
      const url = new URL(req.url);
      const origin = url.origin;
      const resumeUrl = `${origin}/resume`;

      // 导航到简历页面
      await page.goto(resumeUrl, { waitUntil: "networkidle0" });

      // 生成PDF
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      });

      // 关闭浏览器
      await browser.close();

      // 返回PDF文件
      return new Response(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="resume.pdf"`,
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 原来返回JSON的代码（已注释）
    // return new Response(JSON.stringify(resumeData), {
    //   headers: { "Content-Type": "application/json" },
    // });
  },
};
