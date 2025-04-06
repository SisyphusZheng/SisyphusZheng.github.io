import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../data/config.ts";
import { getAllProjects, Project } from "../../utils/projects.ts";

export const handler: Handlers<Project[]> = {
  async GET(_req, ctx) {
    const projects = getAllProjects();
    return ctx.render(projects);
  },
};

export default function Projects({ data }: { data: Project[] }) {
  return (
    <Layout>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8">{siteConfig.projects.title}</h1>
        <p class="text-xl text-gray-600 mb-8">
          {siteConfig.projects.description}
        </p>

        <div class="grid md:grid-cols-2 gap-8">
          {data.map((project) => (
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold mb-4">
                <a
                  href={`/projects/${project.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  class="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {project.title}
                </a>
              </h2>
              <p class="text-gray-600 mb-4">{project.description}</p>
              <div class="flex flex-wrap gap-2">
                {project.technologies.map((tag) => (
                  <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
