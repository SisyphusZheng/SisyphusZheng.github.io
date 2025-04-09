/**
 * Resume Plugin for FreshPress
 * 用于读取和渲染简历数据
 */

import { Plugin } from "../../core/plugin.ts";
import { join } from "$std/path/mod.ts";

export interface ResumePluginOptions {
  /**
   * 简历数据文件路径，相对于项目根目录
   */
  dataPath?: string;
  /**
   * 简历页面路径
   */
  pagePath?: string;
  /**
   * 是否在导航中显示简历链接
   */
  showInNav?: boolean;
  /**
   * 导航中的显示文本
   */
  navText?: string;
}

export class ResumePlugin implements Plugin {
  name = "resume";
  version = "0.1.0";
  description = "A plugin for rendering resume data";
  author = "FreshPress Team";
  options: ResumePluginOptions;
  resumeData: any = null;

  constructor(options: ResumePluginOptions = {}) {
    this.options = {
      dataPath: "./docs/resume.json",
      pagePath: "/resume",
      showInNav: true,
      navText: "简历",
      ...options,
    };
  }

  /**
   * 初始化插件
   */
  async init() {
    console.log("初始化 Resume 插件");
    try {
      // 读取简历数据
      const dataPath = this.options.dataPath || "./docs/resume.json";
      const rootDir = Deno.cwd();
      const resumeJsonPath = join(rootDir, dataPath);

      const resumeText = await Deno.readTextFile(resumeJsonPath);
      this.resumeData = JSON.parse(resumeText);
      console.log("简历数据加载成功");
    } catch (error) {
      console.error("加载简历数据失败:", error);
      // 设置默认空数据
      this.resumeData = {
        basics: { name: "未找到简历数据" },
        work: [],
        education: [],
        skills: [],
        languages: [],
        projects: [],
      };
    }
  }

  /**
   * 安装插件
   */
  async install() {
    console.log("安装 Resume 插件");
    return true;
  }

  /**
   * 卸载插件
   */
  async uninstall() {
    console.log("卸载 Resume 插件");
    return true;
  }

  /**
   * 激活插件
   */
  async activate() {
    console.log("激活 Resume 插件");
    return true;
  }

  /**
   * 停用插件
   */
  async deactivate() {
    console.log("停用 Resume 插件");
    return true;
  }

  /**
   * 获取简历数据
   */
  getResumeData() {
    return this.resumeData;
  }

  /**
   * 构建前的处理
   */
  async beforeBuild(context: any) {
    // 确保简历数据已加载
    if (!this.resumeData) {
      await this.init();
    }

    // 向构建上下文添加简历数据
    context.resumeData = this.resumeData;

    // 如果配置为在导航中显示，添加导航项
    if (this.options.showInNav) {
      if (!context.navItems) {
        context.navItems = [];
      }

      context.navItems.push({
        path: this.options.pagePath,
        text: this.options.navText,
      });
    }
  }

  /**
   * 构建后的处理
   */
  async afterBuild(context: any) {
    // 构建后的处理逻辑
    return true;
  }

  /**
   * 渲染简历数据
   */
  renderResume() {
    if (!this.resumeData) {
      return `<div class="error">简历数据未加载</div>`;
    }

    // 从resume字段中获取数据
    const resumeData = this.resumeData.resume || this.resumeData;
    const { basics, work, education, skills, languages, projects } = resumeData;

    // 获取UI文本（如果存在）
    const sections = this.resumeData.sections || {
      workExperience: "工作经历",
      education: "教育背景",
      skills: "技能",
      languages: "语言",
      projects: "项目经验",
    };

    return `
      <div class="resume">
        <div class="resume-header">
          <div class="resume-name">${basics.name || ""}</div>
          <div class="resume-title">${basics.label || ""}</div>
          <div class="resume-contact">
            ${
              basics.email
                ? `<div class="resume-email"><i class="icon-mail"></i> ${basics.email}</div>`
                : ""
            }
            ${
              basics.phone
                ? `<div class="resume-phone"><i class="icon-phone"></i> ${basics.phone}</div>`
                : ""
            }
            ${
              basics.website
                ? `<div class="resume-website"><i class="icon-globe"></i> <a href="${basics.website}" target="_blank">${basics.website}</a></div>`
                : ""
            }
          </div>
          ${
            basics.profiles && basics.profiles.length > 0
              ? `
          <div class="resume-social">
            ${basics.profiles
              .map(
                (profile: any) => `
              <a href="${
                profile.url
              }" target="_blank" class="resume-social-link">
                <i class="icon-${profile.network.toLowerCase()}"></i> ${
                  profile.network
                }
              </a>
            `
              )
              .join("")}
          </div>
          `
              : ""
          }
          ${
            basics.summary
              ? `<div class="resume-summary">${basics.summary}</div>`
              : ""
          }
        </div>
        
        ${
          work && work.length > 0
            ? `
        <div class="resume-section">
          <h2 class="resume-section-title">${sections.workExperience}</h2>
          ${work
            .map(
              (job: any) => `
            <div class="resume-item">
              <div class="resume-item-header">
                <div class="resume-item-title">${job.position}</div>
                <div class="resume-item-subtitle">
                  <a href="${job.website}" target="_blank">${job.company}</a>
                </div>
                <div class="resume-item-date">${job.startDate} - ${
                job.endDate
              }</div>
              </div>
              <div class="resume-item-content">
                <div class="resume-item-summary">${job.summary}</div>
                ${
                  job.highlights && job.highlights.length > 0
                    ? `
                <ul class="resume-item-highlights">
                  ${job.highlights
                    .map((highlight: string) => `<li>${highlight}</li>`)
                    .join("")}
                </ul>
                `
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        ${
          education && education.length > 0
            ? `
        <div class="resume-section">
          <h2 class="resume-section-title">${sections.education}</h2>
          ${education
            .map(
              (edu: any) => `
            <div class="resume-item">
              <div class="resume-item-header">
                <div class="resume-item-title">${edu.studyType} ${
                edu.area
              }</div>
                <div class="resume-item-subtitle">${edu.institution}</div>
                <div class="resume-item-date">${edu.startDate} - ${
                edu.endDate
              }</div>
              </div>
              <div class="resume-item-content">
                ${
                  edu.gpa
                    ? `<div class="resume-item-gpa">GPA: ${edu.gpa}</div>`
                    : ""
                }
                ${
                  edu.courses && edu.courses.length > 0
                    ? `
                <div class="resume-item-courses">
                  <span class="resume-item-courses-title">相关课程：</span>
                  ${edu.courses.join(", ")}
                </div>
                `
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        ${
          skills && skills.length > 0
            ? `
        <div class="resume-section">
          <h2 class="resume-section-title">${sections.skills}</h2>
          <div class="resume-skills">
            ${skills
              .map(
                (skill: any) => `
              <div class="resume-skill">
                <div class="resume-skill-name">${skill.name}</div>
                <div class="resume-skill-level">${skill.level}</div>
                ${
                  skill.keywords && skill.keywords.length > 0
                    ? `<div class="resume-skill-keywords">${skill.keywords.join(
                        ", "
                      )}</div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        
        ${
          languages && languages.length > 0
            ? `
        <div class="resume-section">
          <h2 class="resume-section-title">${sections.languages}</h2>
          <div class="resume-languages">
            ${languages
              .map(
                (lang: any) => `
              <div class="resume-language">
                <span class="resume-language-name">${lang.language}</span>
                <span class="resume-language-fluency">${lang.fluency}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        
        ${
          projects && projects.length > 0
            ? `
        <div class="resume-section">
          <h2 class="resume-section-title">${sections.projects}</h2>
          ${projects
            .map(
              (project: any) => `
            <div class="resume-item">
              <div class="resume-item-header">
                <div class="resume-item-title">${project.name}</div>
                <div class="resume-item-subtitle">${project.entity || ""} 
                  ${
                    project.url
                      ? `<a href="${project.url}" target="_blank">(链接)</a>`
                      : ""
                  }
                </div>
                <div class="resume-item-date">${project.startDate} - ${
                project.endDate
              }</div>
              </div>
              <div class="resume-item-content">
                <div class="resume-item-summary">${project.description}</div>
                ${
                  project.highlights && project.highlights.length > 0
                    ? `
                <ul class="resume-item-highlights">
                  ${project.highlights
                    .map((highlight: string) => `<li>${highlight}</li>`)
                    .join("")}
                </ul>
                `
                    : ""
                }
                ${
                  project.keywords && project.keywords.length > 0
                    ? `<div class="resume-item-keywords">${project.keywords.join(
                        ", "
                      )}</div>`
                    : ""
                }
                ${
                  project.roles && project.roles.length > 0
                    ? `<div class="resume-item-roles">角色: ${project.roles.join(
                        ", "
                      )}</div>`
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
      </div>
    `;
  }

  /**
   * 获取简历样式
   */
  getResumeStyles() {
    return `
      .resume {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .resume-header {
        margin-bottom: 2rem;
        text-align: center;
      }
      
      .resume-name {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }
      
      .resume-title {
        font-size: 1.5rem;
        color: #666;
        margin-bottom: 1rem;
      }
      
      .resume-contact {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      .resume-social {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      .resume-social-link {
        color: #3498db;
        text-decoration: none;
      }
      
      .resume-summary {
        max-width: 600px;
        margin: 0 auto;
        font-size: 1.1rem;
      }
      
      .resume-section {
        margin-bottom: 2rem;
      }
      
      .resume-section-title {
        font-size: 1.8rem;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .resume-item {
        margin-bottom: 1.5rem;
      }
      
      .resume-item-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.5rem;
      }
      
      .resume-item-title {
        font-size: 1.3rem;
        font-weight: bold;
      }
      
      .resume-item-subtitle {
        font-size: 1.1rem;
        color: #555;
      }
      
      .resume-item-date {
        font-size: 0.9rem;
        color: #777;
      }
      
      .resume-item-highlights {
        padding-left: 1.5rem;
        margin-top: 0.5rem;
      }
      
      .resume-skills {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .resume-skill-name {
        font-weight: bold;
      }
      
      .resume-skill-level {
        font-weight: normal;
        color: #666;
      }
      
      .resume-skill-keywords {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.3rem;
      }
      
      .resume-skill-keyword {
        background: #f0f0f0;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
      }
      
      .resume-item-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      
      .resume-item-technology {
        background: #e8f4fd;
        color: #2980b9;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
      }
      
      .resume-languages {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
      }
      
      .resume-language-name {
        font-weight: bold;
        margin-right: 0.5rem;
      }
      
      .resume-language-fluency {
        color: #666;
      }
      
      @media print {
        .resume {
          padding: 0;
        }
        
        body * {
          visibility: hidden;
        }
        
        .resume, .resume * {
          visibility: visible;
        }
        
        .resume {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
      
      @media (max-width: 600px) {
        .resume-item-header {
          flex-direction: column;
        }
        
        .resume-contact {
          flex-direction: column;
          align-items: center;
        }
      }
    `;
  }
}
