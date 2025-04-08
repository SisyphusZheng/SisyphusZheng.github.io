/**
 * FreshPress项目展示插件
 * 提供项目展示和管理功能
 */

import { Plugin } from "../../core/plugin";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";

/**
 * 项目数据结构
 */
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  demoUrl: string;
  technologies: string[];
  features: string[];
  longDescription: string;
}

/**
 * 项目插件配置
 */
export interface ProjectsPluginConfig {
  /** 项目数据目录 */
  projectsDir: string;
  /** 项目排序方式 */
  sortBy: "title" | "date" | "custom";
  /** 是否启用标签过滤 */
  enableTags: boolean;
  /** 每页项目数 */
  projectsPerPage: number;
}

/**
 * 项目插件默认配置
 */
export const DEFAULT_CONFIG: ProjectsPluginConfig = {
  projectsDir: "docs/projects",
  sortBy: "custom",
  enableTags: true,
  projectsPerPage: 10,
};

/**
 * 项目插件类
 */
export class ProjectsPlugin implements Plugin {
  name = "projects";
  version = "1.0.0";
  description = "Projects management plugin";
  author = "FreshPress";
  initialized = false;

  // 项目目录
  private projectsDir: string;
  private projects: Map<string, Project> = new Map();

  constructor(dataDir: string = "docs/projects") {
    this.projectsDir = dataDir;
  }

  /**
   * 安装插件
   */
  async install(): Promise<void> {
    // 确保数据目录存在
    try {
      await Deno.mkdir(this.projectsDir, { recursive: true });
    } catch (error) {
      if (error instanceof Deno.errors.AlreadyExists) {
        // 目录已存在，忽略错误
      } else {
        throw error;
      }
    }
  }

  /**
   * 卸载插件
   */
  async uninstall(): Promise<void> {
    // 清理缓存
    this.projects.clear();
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    // 加载所有项目数据
    await this.loadProjects();
    this.initialized = true;
  }

  /**
   * 停用插件
   */
  async deactivate(): Promise<void> {
    // 清理缓存
    this.projects.clear();
    this.initialized = false;
  }

  /**
   * 配置插件
   */
  async configure(options: Record<string, any>): Promise<void> {
    if (options.dataDir) {
      this.projectsDir = options.dataDir;
    }
  }

  /**
   * 加载所有项目数据
   */
  private async loadProjects(): Promise<void> {
    try {
      const dirEntries = Array.from(Deno.readDirSync(this.projectsDir));
      for (const entry of dirEntries) {
        if (entry.isFile && entry.name.endsWith(".json")) {
          const filePath = path.join(this.projectsDir, entry.name);
          const content = await Deno.readTextFile(filePath);
          const project = JSON.parse(content) as Project;
          this.projects.set(project.slug, project);
        }
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      throw error;
    }
  }

  /**
   * 获取所有项目
   */
  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  /**
   * 根据 slug 获取项目
   */
  getProjectBySlug(slug: string): Project | undefined {
    return this.projects.get(slug);
  }

  /**
   * 添加项目
   */
  async addProject(project: Project): Promise<void> {
    const filePath = path.join(this.projectsDir, `${project.slug}.json`);
    await Deno.writeTextFile(filePath, JSON.stringify(project, null, 2));
    this.projects.set(project.slug, project);
  }

  /**
   * 更新项目
   */
  async updateProject(slug: string, project: Project): Promise<void> {
    if (!this.projects.has(slug)) {
      throw new Error(`Project ${slug} not found`);
    }
    await this.addProject(project);
  }

  /**
   * 删除项目
   */
  async deleteProject(slug: string): Promise<void> {
    const filePath = path.join(this.projectsDir, `${slug}.json`);
    try {
      await Deno.remove(filePath);
      this.projects.delete(slug);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`Project ${slug} not found`);
      }
      throw error;
    }
  }

  /**
   * 获取所有标签
   */
  getTags(): Map<string, number> {
    const tags = new Map<string, number>();

    for (const project of this.projects.values()) {
      for (const tag of project.technologies) {
        const current = tags.get(tag) || 0;
        tags.set(tag, current + 1);
      }
    }

    return tags;
  }
}

// 创建默认插件实例
const defaultPlugin = new ProjectsPlugin();

// 导出直接使用的函数
export const getProjects = async () => {
  // 确保插件已经加载项目
  if (!defaultPlugin.initialized) {
    await defaultPlugin.activate();
  }
  return defaultPlugin.getAllProjects();
};

export const getProjectById = async (id: string) => {
  // 确保插件已经加载项目
  if (!defaultPlugin.initialized) {
    await defaultPlugin.activate();
  }
  return defaultPlugin.getProjectBySlug(id);
};

export const getTags = async () => {
  // 确保插件已经加载项目
  if (!defaultPlugin.initialized) {
    await defaultPlugin.activate();
  }
  return defaultPlugin.getTags();
};

// 默认导出插件类
export default ProjectsPlugin;
