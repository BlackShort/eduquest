import { Code2, Trophy, Shield, BarChart3, Users, BookOpen, CheckCircle, ChevronRightIcon } from 'lucide-react'
import editorImage from "@/assets/screenshot/editor-preview.jpeg";
import contestImage from "@/assets/screenshot/contest-preview.jpeg";
import problemImage from "@/assets/screenshot/problemlist-preview.jpeg";
import { FaJava, FaSwift, FaPython, FaPhp, FaRust, FaJs } from "react-icons/fa";
import { TbBrandCpp, TbSql } from "react-icons/tb";
import { Link } from 'react-router';
import { useContextAPI } from '@/hooks/useContext';
import { useState } from 'react';

export const Home = () => {
  const icons = [TbBrandCpp, TbSql, FaRust, FaSwift, FaPython, FaPhp, FaJava, FaJs];
  const [activeTab, setActiveTab] = useState('For Students');
  const { isLoggedIn } = useContextAPI();

  const features = [
    {
      icon: Code2,
      title: 'Monaco Editor',
      subtitle: 'Live Code Editor',
      description: 'Experience the same powerful editor that powers VS Code. Get intelligent code completion, syntax highlighting, and error detection for 8+ programming languages.',
      mainTitle: 'Professional-Grade Code Editor',
      mainDescription: 'Write code with confidence using our industry-standard Monaco Editor integration. Features include',
      highlight: ' multi-language support, IntelliSense, and real-time syntax validation',
      tagline: '?giving you the tools professionals use.',
      gradientFrom: 'from-neutral-900',
      gradientTo: 'to-neutral-950',
      iconGradient: 'from-neutral-700/70 to-neutral-800/30',
      languages: ['C++', 'Java', 'Python', 'JavaScript', '+4 more'],
      layout: 'left'
    },
    {
      icon: BarChart3,
      title: 'Real-time Execution',
      subtitle: ' Active Execution Engine',
      description: 'Execute code in milliseconds with our optimized cloud infrastructure. Support for custom test cases, stdin/stdout handling, and detailed execution metrics.',
      mainTitle: 'Instant Code Execution',
      mainDescription: 'Test your code instantly with our cloud-based execution engine. Run programs in',
      highlight: ' multiple languages, get detailed output, and receive immediate feedback',
      tagline: ' on your submissions.',
      gradientFrom: 'from-neutral-900',
      gradientTo: 'to-neutral-950',
      iconGradient: 'from-neutral-700/70 to-neutral-800/30',
      dotColor: 'bg-emerald-500',
      features: [
        'Compile-time error detection',
        'Runtime output preview',
        'Test case validation'
      ],
      layout: 'right'
    },
    {
      icon: Shield,
      title: 'Smart Proctoring',
      subtitle: 'AI-Powered Security',
      description: 'Maintain academic integrity with our AI-powered proctoring system. Track suspicious behavior, detect tab switches, and generate comprehensive reports automatically.',
      mainTitle: 'Academic Integrity Monitoring',
      mainDescription: 'Ensure fair assessments with our comprehensive proctoring solution. Monitor student activity,',
      highlight: ' detect plagiarism using Jaccard similarity, and generate detailed behavioral logs',
      tagline: ' for complete transparency.',
      gradientFrom: 'from-neutral-900',
      gradientTo: 'to-neutral-950',
      iconGradient: 'from-neutral-700/70 to-neutral-800/30',
      dotColor: 'bg-purple-500',
      iconColor: 'text-purple-500',
      features: [
        'Real-time behavior tracking',
        'Plagiarism detection engine',
        'Automated violation reports'
      ],
      layout: 'left'
    }
  ];

  const heroImages = [
    { src: problemImage, alt: 'Problem List Preview', scale: 'scale-[0.95]', width: 'w-[90%]', translate: '-translate-y-14', zIndex: 'z-0' },
    { src: contestImage, alt: 'Contest Preview', scale: 'scale-[0.97]', width: 'w-[95%]', translate: '-translate-y-8', zIndex: 'z-10' },
    { src: editorImage, alt: 'Editor Preview', scale: '', width: 'w-full', translate: '', zIndex: 'z-20' }
  ];

  const dashboardStats = [
    { value: '156', label: 'Active Students', gradient: 'from-purple-400 to-purple-300', hoverBorder: 'hover:border-purple-500/50' },
    { value: '12', label: 'Active Tests', gradient: 'from-blue-400 to-blue-300', hoverBorder: 'hover:border-blue-500/50' },
    { value: '89%', label: 'Average Score', gradient: 'from-green-400 to-green-300', hoverBorder: 'hover:border-green-500/50' },
    { value: '45', label: 'Questions', gradient: 'from-orange-400 to-orange-300', hoverBorder: 'hover:border-orange-500/50' }
  ];

  const recentActivities = [
    { color: 'bg-green-500', text: 'Test "Data Structures" completed by 45 students' },
    { color: 'bg-yellow-500', text: '3 plagiarism cases detected' },
    { color: 'bg-blue-500', text: 'New assignment created' }
  ];

  const tabs = [
    { name: 'For Students', icon: Users, color: 'orange' },
    { name: 'For Faculty', icon: Users, color: 'purple' }
  ]

  const footerLinks = ['Terms', 'Privacy', 'Cookies'];

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 bg-linear-to-b from-neutral-900 via-neutral-800 to-black overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="w-full flex flex-col items-center">
            {/* <div className="inline-flex p-px rounded-full bg-linear-to-r from-neutral-500 to-neutral-700 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/60 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-200">
                Code
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                Eat
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                Repeat
              </div>
            </div> */}

            <div className="flex flex-col items-center justify-center my-5">
              <div className="relative flex flex-col items-center text-center gap-4">
                <h1 className="text-7xl font-bold text-neutral-200">Built by Engineers</h1>
                <h1 className="text-7xl font-bold text-neutral-200">for Engineers</h1>
              </div>

              <p className="text-center text-lg text-neutral-400 max-w-xl mt-6 leading-relaxed">
                A platform for coding assessments, real-time proctoring, and performance analytics, designed specifically for engineering education.
              </p>

              <Link to={isLoggedIn ? '/dashboard' : '/auth/login'} className="mt-8">
                <button
                  type="button"
                  className="will-change-transform group flex items-center gap-2 cursor-pointer px-5 py-2 text-lg font-semibold text-neutral-200 bg-linear-to-r from-amber-600 via-orange-600 to-orange-500 hover:from-amber-500 hover:via-orange-500 hover:to-orange-400 rounded-full transition-all duration-400 hover:scale-105 border-2 border-orange-400/30 hover:border-orange-300/50"
                >
                  <span>Get Started</span>
                  <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>


            <div className="my-20 relative h-120 w-full max-w-5xl mx-auto flex items-start justify-center">
              {heroImages.map((image, idx) => (
                <div key={idx} className={`${image.scale} ${image.width} overflow-hidden absolute top-0 transform ${image.translate} rounded-2xl border border-neutral-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,${idx === 0 ? '0.6' : '0.7'})] ${image.zIndex} ${idx === 2 ? 'relative' : ''}`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Honeycomb Background Pattern */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-honeycomb-pattern" />

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {icons.map((Icon, index) => {
            const positions = [
              { top: '10%', left: '8%', animation: 'float', delay: 0 },
              { top: '15%', right: '12%', animation: 'floatReverse', delay: 1 },
              { bottom: '25%', left: '5%', animation: 'floatSlow', delay: 2 },
              { bottom: '15%', right: '8%', animation: 'floatReverse', delay: 1.5 },
              { top: '50%', left: '3%', animation: 'float', delay: 0.5 },
              { top: '35%', right: '4%', animation: 'floatSlow', delay: 2.5 },
              { top: '2%', right: '35%', animation: 'floatReverse', delay: 3 },
              { bottom: '40%', right: '15%', animation: 'float', delay: 1 },
            ];

            const position = positions[index % positions.length];
            const positionStyle: React.CSSProperties = {
              animation: `${position.animation} 15s ease-in-out infinite`,
              animationDelay: `${position.delay}s`,
            };

            if (position.top) positionStyle.top = position.top;
            if (position.bottom) positionStyle.bottom = position.bottom;
            if (position.left) positionStyle.left = position.left;
            if (position.right) positionStyle.right = position.right;

            return (
              <div
                key={index}
                className="absolute"
                style={positionStyle}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-800/70 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-neutral-700/50 shadow-2xl hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-32  px-6 relative flex flex-col gap-32 bg-linear-to-b from-black via-neutral-950 to-black text-neutral-200 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

        <div className="flex flex-col relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 mx-auto">
            Platform Capabilities
          </div>
          <h2 className="text-center text-5xl md:text-6xl font-bold tracking-tight text-neutral-200 mb-6">
            Powerful <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">Features</span>
          </h2>
          <p className="text-lg text-center text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the comprehensive tools engineered to empower both students and faculty throughout their technical journey.
          </p>
        </div>

        {features.map((feature, idx) => (
          <div key={idx} className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center z-10 group/section">
            {/* Conditionally render card on left or right based on layout */}
            {feature.layout === 'left' ? (
              <>
                {/* LEFT SIDE CARD */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-white/10 to-white/0 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative flex flex-col gap-6 bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-[24px] p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.iconGradient} flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <feature.icon className="w-7 h-7 text-neutral-200" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1">{feature.subtitle}</p>
                        <h3 className="text-xl font-medium text-neutral-200">{feature.title}</h3>
                      </div>
                    </div>
                    <p className="text-neutral-400 text-base leading-relaxed tracking-wide font-light">{feature.description}</p>

                    {feature.languages && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {feature.languages.map((lang, lIdx) => (
                          <span key={lIdx} className="px-3 py-1 rounded-md bg-white/3 border border-white/5 text-xs text-neutral-400">{lang}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE CONTENT */}
                <div className="pl-0 lg:pl-8">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-200 leading-tight mb-6">
                    {feature.mainTitle}
                  </h2>
                  <p className="text-lg text-neutral-400 leading-relaxed font-light mb-8">
                    {feature.mainDescription}
                    <span className="text-neutral-200 font-medium drop-shadow-lg"> {feature.highlight}</span>
                  </p>

                  {feature.features && (
                    <ul className="space-y-4 mb-8">
                      {feature.features.map((item, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-neutral-300">
                          <CheckCircle className="w-5 h-5 text-neutral-500" />
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* LEFT SIDE CONTENT */}
                <div className="pr-0 lg:pr-8 md:order-1 order-2">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-200 leading-tight mb-6">
                    {feature.mainTitle}
                  </h2>
                  <p className="text-lg text-neutral-400 leading-relaxed font-light mb-8">
                    {feature.mainDescription}
                    <span className="text-neutral-200 font-medium drop-shadow-lg"> {feature.highlight}</span>
                  </p>

                  {feature.features && (
                    <ul className="space-y-4 mb-8">
                      {feature.features.map((item, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-neutral-300">
                          <CheckCircle className="w-5 h-5 text-neutral-500" />
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* RIGHT SIDE CARD */}
                <div className="relative group md:order-2 order-1">
                  <div className="absolute -inset-1 bg-linear-to-l from-white/10 to-white/0 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative flex flex-col gap-6 bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-[24px] p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.iconGradient} flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <feature.icon className="w-7 h-7 text-neutral-200" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1">{feature.subtitle}</p>
                        <h3 className="text-xl font-medium text-neutral-200">{feature.title}</h3>
                      </div>
                    </div>

                    <p className="text-neutral-400 text-base leading-relaxed tracking-wide font-light">{feature.description}</p>

                    {feature.languages && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {feature.languages.map((lang, lIdx) => (
                          <span key={lIdx} className="px-3 py-1 rounded-md bg-white/3 border border-white/5 text-xs text-neutral-400">{lang}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Combined Role Tabs Section */}
      <section id="roles" className="relative pb-32 px-6 bg-linear-to-b from-black via-neutral-950 to-black overflow-hidden min-h-screen">
        {/* Subtle Background Glow */}
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] transition-all duration-1000 ease-in-out opacity-40 ${activeTab === 'For Students' ? 'from-orange-900/40 via-transparent to-transparent' : 'from-purple-900/40 via-transparent to-transparent'}`} />

        {/* Sleek Tab Navigation */}
        <div className="flex items-center justify-center w-full mb-20 relative z-10">
          <div className="w-max flex flex-row gap-1.5 p-1.5 border border-white/10 backdrop-blur-xl bg-white/2 rounded-full shadow-2xl">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === tab.name;
              let activeClasses = "";
              if (tab.color === 'orange') {
                activeClasses = isActive
                  ? "bg-linear-to-b from-orange-500/20 to-orange-500/5 text-orange-400 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                  : "text-neutral-400 hover:text-neutral-200 border border-transparent hover:bg-white/4";
              } else if (tab.color === 'purple') {
                activeClasses = isActive
                  ? "bg-linear-to-b from-purple-500/20 to-purple-500/5 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                  : "text-neutral-400 hover:text-neutral-200 border border-transparent hover:bg-white/4";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(tab.name)}
                  className={`inline-flex items-center gap-2.5 px-6 py-2 cursor-pointer rounded-full text-sm font-medium transition-all duration-300 ${activeClasses}`}
                >
                  <tab.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-70'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* For Students View */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ease-out ${activeTab === 'For Students'
              ? 'opacity-100 translate-x-0 relative'
              : 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none'
              }`}
          >
            {/* Left - Content */}
            <div className={`transition-all duration-700 delay-100 ${activeTab === 'For Students' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
                <Users className="w-3.5 h-3.5" />
                For Students
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-200 tracking-tight leading-tight">
                Practice, Learn, and <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">Excel</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-light">
                Access a comprehensive platform designed to elevate your coding skills and confidently ace your technical assessments.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Code2, title: 'Live Coding Environment', desc: 'Write, compile, and execute code with immediate outputs.' },
                  { icon: BookOpen, title: 'Structured Question Banks', desc: 'Assess knowledge across multiple technical domains.' },
                  { icon: CheckCircle, title: 'Actionable In-depth Feedback', desc: 'Understand your errors and track your improvement.' },
                  { icon: Trophy, title: 'Global Leaderboards', desc: 'Benchmark your performance against your peers.' }
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 hover:border-orange-500/30 transition-all duration-300">
                    <div className="w-10 h-10 rounded-[10px] bg-neutral-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-orange-500/50 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all duration-300">
                      <item.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-200 text-sm mb-0.5 group-hover:text-orange-300 transition-colors">{item.title}</h4>
                      <p className="text-sm text-neutral-500 font-normal leading-relaxed tracking-wide">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className={`relative group transition-all duration-700 delay-200 ${activeTab === 'For Students' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="absolute -inset-1 bg-linear-to-tr from-orange-600/20 to-amber-400/0 rounded-[32px] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden">
                {/* Mock OS Window Shell */}
                <div className="h-10 bg-white/2 border-b border-white/10 flex items-center px-4 gap-2 backdrop-blur-md">
                  <div className="flex gap-1.5 hover:opacity-100 opacity-60 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-orange-500 to-amber-300 flex items-center justify-center text-black font-bold text-sm">
                        JD
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-200 leading-none">John Doe</h3>
                        <span className="text-xs text-neutral-500">Student � Computer Science</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                      <Trophy className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-orange-400 font-medium">Rank #42</span>
                    </div>
                  </div>

                  {/* Refined Mock Dashboard Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/2 border border-white/5 p-5 rounded-2xl hover:bg-white/4 transition-colors duration-300">
                      <div className="text-4xl font-light tracking-tight mb-1 text-transparent bg-clip-text bg-linear-to-b from-orange-400 to-orange-200">124</div>
                      <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Problems Solved</div>
                    </div>
                    <div className="bg-white/2 border border-white/5 p-5 rounded-2xl hover:bg-white/4 transition-colors duration-300">
                      <div className="text-4xl font-light tracking-tight mb-1 text-transparent bg-clip-text bg-linear-to-b from-emerald-400 to-emerald-200">92%</div>
                      <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Accuracy Rate</div>
                    </div>
                    <div className="col-span-2 bg-white/2 border border-white/5 p-5 rounded-2xl hover:bg-white/4 transition-colors duration-300">
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-3xl font-light tracking-tight text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-200">14</div>
                        <span className="text-xs text-neutral-500 font-medium mb-1.5">Streak (Days)</span>
                      </div>
                      <div className="flex gap-1 h-2">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className={`flex-1 rounded-sm ${i < 5 ? 'bg-orange-500' : 'bg-neutral-800'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sleek Upcoming Tasks */}
                  <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-4">Upcoming Assessments</h4>
                    <div className="space-y-3">
                      {[
                        { title: 'Data Structures Midterm', time: 'Tomorrow, 10:00 AM', status: 'orange' },
                        { title: 'Weekly Coding Contest #45', time: 'Friday, 8:00 PM', status: 'neutral' }
                      ].map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between group/task p-2.5 -mx-2.5 rounded-lg hover:bg-white/2 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'orange' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-neutral-600'}`}></div>
                            <div>
                              <div className="text-sm text-neutral-200 font-medium group-hover/task:text-neutral-200 transition-colors">{task.title}</div>
                              <div className="text-xs text-neutral-500 mt-0.5">{task.time}</div>
                            </div>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 text-neutral-600 group-hover/task:text-neutral-400 opacity-0 group-hover/task:opacity-100 transition-all -translate-x-2 group-hover/task:translate-x-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Faculty View */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ease-out ${activeTab === 'For Faculty'
              ? 'opacity-100 translate-x-0 relative'
              : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'
              }`}
          >
            {/* Left - Visual */}
            <div className={`order-2 lg:order-1 relative group transition-all duration-700 delay-200 ${activeTab === 'For Faculty' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="absolute -inset-1 bg-linear-to-bl from-purple-600/20 to-blue-400/0 rounded-[32px] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden">
                {/* Mock OS Window Shell */}
                <div className="h-10 bg-white/2 border-b border-white/10 flex items-center px-4 gap-2 backdrop-blur-md">
                  <div className="flex gap-1.5 hover:opacity-100 opacity-60 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <h3 className="text-lg font-medium text-neutral-200">Instructor Overview</h3>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                      <span className="text-xs text-neutral-500 font-mono tracking-wider">LIVE</span>
                    </div>
                  </div>

                  {/* Refined Mock Dashboard Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {dashboardStats.map((stat, idx) => (
                      <div key={idx} className="bg-white/2 border border-white/5 p-5 rounded-2xl hover:bg-white/4 transition-colors duration-300">
                        <div className={`text-4xl font-light tracking-tight mb-1 text-transparent bg-clip-text bg-linear-to-b ${stat.gradient}`}>{stat.value}</div>
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Sleek Recent Activity */}
                  <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-5">System Logs</h4>
                    <div className="space-y-4">
                      {recentActivities.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 group/log">
                          <div className={`mt-1.5 w-1.5 h-1.5 ${activity.color} rounded-full`}></div>
                          <span className="text-sm text-neutral-300 font-light group-hover/log:text-neutral-100 transition-colors">{activity.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className={`order-1 lg:order-2 transition-all duration-700 delay-100 ${activeTab === 'For Faculty' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
                <Users className="w-3.5 h-3.5" />
                For Faculty
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-200 tracking-tight leading-tight">
                Manage, Monitor, and <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-300">Analyze</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-light">
                Enterprise-grade tools for orchestrating assessments, tracking class metrics, and enforcing academic policies.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Code2, title: 'Integrated Question Management', desc: 'Curate a centralized technical repository for all assessments.' },
                  { icon: Shield, title: 'AI Proctoring & Session Logs', desc: 'Secure exams with sophisticated behavioral tracking.' },
                  { icon: CheckCircle, title: 'Advanced Plagiarism Detection', desc: 'Find code similarities to maintain academic integerity.' },
                  { icon: BarChart3, title: 'Granular Performance Analytics', desc: 'Drill down into cohort insights and identify gaps.' }
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 hover:border-purple-500/30 transition-all duration-300">
                    <div className="w-10 h-10 rounded-[10px] bg-neutral-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-200 text-sm mb-0.5 group-hover:text-purple-300 transition-colors">{item.title}</h4>
                      <p className="text-sm text-neutral-500 font-normal tracking-wide leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pb-32 px-6 bg-black overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/5 text-neutral-300 border border-white/10 mb-8 backdrop-blur-md">
            Start Excellence Today
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-neutral-200 leading-tight">
            Ready to start your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-amber-400 to-orange-400">
              coding journey?
            </span>
          </h2>

          <p className="text-xl text-neutral-400 mb-12 leading-relaxed font-light max-w-2xl">
            Join thousands of engineering students already improving their technical skills on EduQuest's enterprise-grade platform.
          </p>

          <Link to={'/login'} className="group w-max">
            <div className="relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#fbbf24_50%,#f97316_100%)] transition-colors duration-500" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-8 py-1 text-base font-medium text-neutral-200 backdrop-blur-3xl transition-all duration-300 group-hover:bg-neutral-900 gap-2">
                Launch Platform
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-6 bg-black text-neutral-200 border-t border-neutral-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">Copyright &copy; 2026 EduQuest. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-neutral-400">
            {footerLinks.map((link, idx) => (
              <a key={idx} href="#" className="hover:text-neutral-200 transition-colors hover:underline">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
