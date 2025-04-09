// i18n初始化脚本
(async function () {
    console.log("[i18n] 初始化翻译功能...");

    // 默认语言
    const defaultLocale = "zh-CN";

    // 支持的语言
    const supportedLocales = ["zh-CN", "en-US"];

    // 尝试从URL获取语言参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");

    // 从localStorage读取语言设置
    const storedLocale = localStorage.getItem("preferred_locale");

    // 从URL参数、localStorage或浏览器设置中确定语言
    let currentLocale = null;

    // 优先使用URL参数
    if (urlLang) {
        // 映射简短的语言代码到完整的locale
        if (urlLang === "zh") {
            currentLocale = "zh-CN";
        } else if (urlLang === "en") {
            currentLocale = "en-US";
        }
    }

    // 其次使用localStorage
    if (!currentLocale && storedLocale && supportedLocales.includes(storedLocale)) {
        currentLocale = storedLocale;
    }

    // 最后使用浏览器语言或默认语言
    if (!currentLocale) {
        const browserLang = navigator.language;
        if (browserLang.startsWith("zh")) {
            currentLocale = "zh-CN";
        } else {
            currentLocale = "en-US";
        }
    }

    console.log(`[i18n] 当前语言: ${currentLocale}`);

    // 设置全局变量
    window.__currentLocale = currentLocale;

    // 创建全局翻译对象
    window.__translations = {};

    // 加载翻译文件
    try {
        const response = await fetch(`/translations/${currentLocale}.json`);
        if (response.ok) {
            const translations = await response.json();
            window.__translations[currentLocale] = translations;
            console.log(`[i18n] 已加载翻译文件: ${currentLocale}`);
        } else {
            console.error(`[i18n] 无法加载翻译文件: ${currentLocale}`);
        }
    } catch (error) {
        console.error(`[i18n] 加载翻译出错:`, error);
    }

    // 定义全局翻译函数
    window.__t = function (key, params = {}, locale) {
        const targetLocale = locale || currentLocale;

        if (!window.__translations[targetLocale]) {
            console.warn(`[i18n] 翻译未加载: ${targetLocale}`);
            return key;
        }

        try {
            // 从键路径获取值 (例如 "nav.home")
            const parts = key.split(".");
            let value = window.__translations[targetLocale];

            for (const part of parts) {
                if (!value) break;
                value = value[part];
            }

            if (value && typeof value === "string") {
                // 替换参数
                if (Object.keys(params).length > 0) {
                    return Object.keys(params).reduce((text, param) => {
                        return text.replace(new RegExp(`{${param}}`, "g"), params[param]);
                    }, value);
                }
                return value;
            }
        } catch (error) {
            console.warn(`[i18n] 翻译错误:`, error);
        }

        return key;
    };

    // 触发语言加载完成事件
    window.dispatchEvent(new CustomEvent("i18n:loaded", {
        detail: { locale: currentLocale }
    }));

    console.log("[i18n] 初始化完成");
})(); 