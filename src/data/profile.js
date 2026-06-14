// ============================================================
// 个人主页数据 — 改这里的 JSON 页面就会自动更新
// ============================================================

export const profile = {
  basic: {
    avatar: '/avatar.png',                // 头像 URL，留空则显示名字首字母
    name: '莉妮娅',
    title: 'ACMer / Developer',
    birthday: '05-09',        // 仅月-日，会显示在头像右下角
    bio: '感谢我年少轻狂，无限接近幻想',
    introduction: `你好！我是一名热爱折腾的计算机科学爱好者。参加过多次 <strong class="text-white">ICPC/CCPC</strong> 等编程竞赛，对数据结构与算法有着极致的追求。<br/><br/>不仅如此，我也热衷于将算法思维融入 <strong class="text-accent">日常开发</strong> 中，致力于用干净的代码解决实际问题。`,
  },

  education: {
    school: '扬州大学',
    degree: '人工智能 · 本科',
    period: '2023 – 2027',
  },

  skills: [
    'C / C++', 'Python',
    'Vue 3', 'Tailwind CSS', 'JavaScript',
    'Linux', 'Docker',
  ],

  // 精选奖项
  awards: [
    { date: '2026.05', name: 'CCPC 中国大学生程序设计竞赛全国邀请赛（南昌站）', medal: '金牌' },
    { date: '2026.05', name: 'ICPC 国际大学生程序设计竞赛全国邀请赛（西安站）', medal: '银牌' },
    { date: '2024.11', name: 'ICPC 国际大学生程序设计竞赛亚洲区域赛（南京站）', medal: '铜牌' },
    { date: '2026.05', name: '广西大学生程序设计竞赛暨中国-东盟国际大学生程序设计竞赛', medal: '金牌' },
    { date: '2026.05', name: '中国高校计算机大赛 - 团体程序设计天梯赛', medal: '国一' },
    { date: '2025.08', name: '码蹄杯程序设计大赛本科院校赛道', medal: '金牌' },
    { date: '2025.08', name: '睿抗机器人开发者大赛（RAICOM）编程技能赛', medal: '国一' },
  ],

  // ACM/ICPC 全生涯（时间轴用）
  allAwards: [
    { date: '2026.05', name: '广西大学生程序设计竞赛暨中国-东盟国际大学生程序设计竞赛', medal: '金牌' },
    { date: '2026.05', name: 'CCPC 中国大学生程序设计竞赛全国邀请赛（南昌站）', medal: '金牌' },
    { date: '2026.05', name: 'ICPC 国际大学生程序设计竞赛全国邀请赛（南昌站）', medal: '铜牌' },
    { date: '2026.05', name: 'ICPC 国际大学生程序设计竞赛全国邀请赛（西安站）', medal: '银牌' },
    { date: '2026.04', name: 'ICPC 国际大学生程序设计竞赛全国邀请赛（深圳站）', medal: '铜牌' },
    { date: '2025.11', name: 'ICPC 国际大学生程序设计竞赛亚洲区域赛（南京站）', medal: '铁牌' },
    { date: '2025.10', name: 'ICPC 国际大学生程序设计竞赛亚洲区域赛（西安站）', medal: '铁牌' },
    { date: '2025.06', name: 'JSCPC 江苏省程序设计大赛', medal: '银牌' },
    { date: '2025.05', name: 'ICPC 国际大学生程序设计竞赛全国邀请赛（西安站）', medal: '银牌' },
    { date: '2025.04', name: 'ICPC 国际大学生程序设计竞赛全国邀请赛（武汉站）', medal: '铜牌' },
    { date: '2024.11', name: 'ICPC 国际大学生程序设计竞赛亚洲区域赛（南京站）', medal: '铜牌' },
    { date: '2024.10', name: 'CCPC 中国大学生程序设计竞赛国赛（哈尔滨站）', medal: '铁牌' },
    { date: '2024.06', name: 'JSCPC 江苏省程序设计大赛', medal: '铜牌' },
  ],

  projects: [
    {
      icon: '🎵',
      name: 'SPlayer',
      desc: '一款基于 Vue3 的高颜值流媒体播放器，支持多端数据同步与极速解码。',
      tags: ['Vue 3', 'Vite', 'TypeScript'],
      link: '#',
    },
    {
      icon: '🔥',
      name: 'DailyHot',
      desc: '全网热搜榜单聚合 API 服务，每分钟抓取全网热点，提供高并发接口。',
      tags: ['Node.js', 'Redis', 'Cheerio'],
      link: '#',
    },
    {
      icon: '🚀',
      name: 'ACM-Lynia',
      desc: '个人 ACM 竞赛模板库，包含常用算法与数据结果的高度封装模板。',
      tags: ['C++', 'ACM', 'Algorithms'],
      link: 'https://github.com/yxz2333/ACM-Lynia',
    },
  ],
}
