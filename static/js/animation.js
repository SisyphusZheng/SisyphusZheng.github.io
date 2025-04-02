// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 检查GSAP是否已加载
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // 注册ScrollTrigger插件
        gsap.registerPlugin(ScrollTrigger);

        // Hero动画
        const heroTl = gsap.timeline();

        heroTl.from('.gsap-hero-content', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        heroTl.from('.gsap-hero-image', {
            opacity: 0,
            x: 50,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5');

        // 技能徽章动画
        gsap.from('.gsap-skill-badge', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.5');

        // 按钮动画
        gsap.from('.gsap-btn-primary, .gsap-btn-secondary', {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.5,
            ease: 'back.out'
        }, '-=0.3');

        // About部分动画
        gsap.from('.gsap-about', {
            scrollTrigger: {
                trigger: '.gsap-about',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        // 章节标题动画
        gsap.utils.toArray('.gsap-section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                },
                opacity: 0,
                x: -50,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // 项目卡片动画
        gsap.utils.toArray('.gsap-project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });

        // 博客卡片动画
        gsap.utils.toArray('.gsap-blog-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });
    } else {
        console.error('GSAP or ScrollTrigger not loaded');
    }
});