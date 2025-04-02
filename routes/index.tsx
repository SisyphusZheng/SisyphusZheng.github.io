// routes/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import Navbar from "../islands/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import Projects from "../components/Projects.tsx";
import Blog from "../components/Blog.tsx";
import ThemeToggle from "../islands/ThemeToggle.tsx";
import Footer from "../components/Footer.tsx";
interface ProfileData {
  name: string;
  title: string;
  educations: Array<{
    school: string;
    degree: string;
    period: string;
    courses?: string[];
  }>;
  contact: {
    email: string;
    phone: string;
    github: string;
    devto: string;
  };
  skills: {
    frontend: string[];
    backend: string[];
    devops: string[];
  };
  experiences: Array<{
    organization: string;
    role: string;
    period: string;
    description: string[];
  }>;
  honors: Array<{
    title: string;
    year: string;
  }>;
}

export const handler: Handlers<ProfileData> = {
  async GET(req, ctx) {
    const profileData: ProfileData = {
      name: "郑治",
      title: "前端工程师 / 软件工程硕士",
      educations: [
        {
          school: "爱尔兰利莫瑞克大学",
          degree: "软件工程硕士",
          period: "2023-2026.01",
          courses: [
            "软件质量",
            "软件进化",
            "HCI(人机交互)",
            "项目管理",
            "软件架构",
          ],
        },
        {
          school: "重庆大学城市科技学院",
          degree: "软件工程本科",
          period: "2018-2022",
          courses: [
            "编程技术92%",
            "算法分析97%",
            "Linux 基础 91%",
            "高级编程技术 91%",
          ],
        },
      ],
      contact: {
        email: "zhizheng@z-js.dev",
        phone: "13370765023",
        github: "SisyphusZheng",
        devto: "SisyphusZheng",
      },
      skills: {
        frontend: [
          "TypeScript",
          "React Hooks",
          "TailwindCSS",
          "Vite",
          "Web Components",
          "StencilJS",
        ],
        backend: [
          "Node.js",
          "Express",
          "MongoDB",
          "RESTful API",
          "JWT",
          "OAuth",
        ],
        devops: [
          "Git",
          "GitHub Actions",
          "Docker",
          "Linux",
          "Nginx",
          "Bash/Fish",
        ],
      },
      experiences: [
        {
          organization: "利莫瑞克⼤学计算机社团",
          role: "成员",
          period: "2023-09 ~ 2025-01",
          description: [
            "欧洲PythonCon会议志愿者",
            "IrlCPC(爱尔兰程序设计)2024集训",
          ],
        },
        {
          organization: "学院软件社团与计算机社团",
          role: "软社社⻓,计社部⻓",
          period: "2020-09 ~ 2021-06",
          description: [
            "协助教研室CCPC&蓝桥杯集训",
            "校内赛WebDev培训",
            "工作室",
          ],
        },
      ],
      honors: [
        { title: "爱尔兰利莫瑞克大学优秀硕士录取奖学金", year: "2023-09" },
        { title: "重庆市优秀毕业生", year: "2022-06" },
        { title: "第九届CCPC重庆市三等奖", year: "2018-06" },
        { title: "重庆城市科技学院优秀毕业生", year: "2022-06" },
        { title: "重庆城市科技学院优秀学共青团干与学干", year: "连续四年" },
        { title: "重庆城市科技学院综测奖学金", year: "连续三年" },
      ],
    };

    return ctx.render(profileData);
  },
};

export default function ProfilePage({ data }: PageProps<ProfileData>) {
  return (
    <>
      <Head>
        <title>{data.name} | 个人主页</title>
        <meta name="description" content="前端工程师，软件工程硕士的个人主页" />
        <link rel="stylesheet" href={asset("/styles.css")} />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
        <script src={asset("/js/animation.js")}></script>
      </Head>
      <div
        id="app"
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="fixed right-5 top-5 z-50">
          <ThemeToggle />
        </div>
        <Navbar />
        <main>
          <Hero data={data} />
          <Projects />
          <Blog />
        </main>
        <Footer data={data} />
      </div>
    </>
  );
}
