import { Code2, Trophy, Shield, BarChart3, Users, BookOpen, CheckCircle } from 'lucide-react'
import editorImage from "@/assets/screenshot/editor-preview.jpeg";
import contestImage from "@/assets/screenshot/contest-preview.jpeg";
import problemImage from "@/assets/screenshot/problemlist-preview.jpeg";
import studentImage from "@/assets/screenshot/studentd-ashboard-preeview.jpeg";
import { FaJava, FaSwift, FaPython, FaPhp, FaRust, FaJs } from "react-icons/fa";
import { TbBrandCpp, TbSql } from "react-icons/tb";

export const Home = () => {
  const icons = [TbBrandCpp, TbSql, FaRust, FaSwift, FaPython, FaPhp, FaJava, FaJs];

  const features = [
    {
      icon: Code2,
      title: 'Monaco Editor',
      subtitle: 'Editor � Live Now',
      description: 'Experience the same powerful editor that powers VS Code. Get intelligent code completion, syntax highlighting, and error detection for 8+ programming languages.',
      mainTitle: 'Professional-Grade Code Editor',
      mainDescription: 'Write code with confidence using our industry-standard Monaco Editor integration. Features include',
      highlight: ' multi-language support, IntelliSense, and real-time syntax validation',
      tagline: '�giving you the tools professionals use.',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-purple-600',
      iconGradient: 'from-blue-600 to-blue-700',
      languages: ['C++', 'Java', 'Python', 'JavaScript', '+4 more'],
      layout: 'left'
    },
    {
      icon: BarChart3,
      title: 'Real-time Execution',
      subtitle: 'Execution Engine � Active',
      description: 'Execute code in milliseconds with our optimized cloud infrastructure. Support for custom test cases, stdin/stdout handling, and detailed execution metrics.',
      mainTitle: 'Instant Code Execution',
      mainDescription: 'Test your code instantly with our cloud-based execution engine. Run programs in',
      highlight: ' multiple languages, get detailed output, and receive immediate feedback',
      tagline: ' on your submissions.',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-emerald-600',
      iconGradient: 'from-emerald-600 to-green-700',
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
      subtitle: 'Security � AI-Powered',
      description: 'Maintain academic integrity with our AI-powered proctoring system. Track suspicious behavior, detect tab switches, and generate comprehensive reports automatically.',
      mainTitle: 'Academic Integrity Monitoring',
      mainDescription: 'Ensure fair assessments with our comprehensive proctoring solution. Monitor student activity,',
      highlight: ' detect plagiarism using Jaccard similarity, and generate detailed behavioral logs',
      tagline: ' for complete transparency.',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-pink-600',
      iconGradient: 'from-purple-600 to-pink-600',
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

  const trustIndicators = [
    'Free to start',
    'No credit card required',
    '24/7 Support'
  ];

  const footerLinks = ['Terms', 'Privacy', 'Cookies'];

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 bg-linear-to-b from-neutral-900 via-neutral-800 to-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex p-px rounded-full bg-linear-to-r from-neutral-500 to-neutral-700 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/60 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-200">
                Code
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                Eat
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                Repeat
              </div>
            </div>

            <div className="flex flex-col justify-center my-5 ">
              <div className="relative flex flex-col items-center text-center gap-4 z-5">
                <h1 className="text-7xl font-bold text-neutral-200">Built by Engineers</h1>
                <h1 className="text-7xl font-bold text-neutral-200">for Engineers</h1>
              </div>

              <p className="text-center text-xl text-neutral-400 max-w-3xl mt-6 leading-relaxed">
                A comprehensive platform for coding assessments, real-time proctoring, and performance analytics designed specifically for engineering education.
              </p>
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

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

      <section className="relative flex flex-col gap-32 bg-linear-to-b from-black via-neutral-950 to-black text-white py-24 px-6 overflow-hidden">

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

        <div className="flex flex-col relative z-10">
          <h2 className="text-center text-6xl font-bold bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Powerful Features</h2>
          <p className="text-xl text-center text-neutral-400 mt-6 max-w-3xl mx-auto">Discover the comprehensive tools that empower students and faculty in their coding journey.</p>
        </div>

        {features.map((feature, idx) => (
          <div key={idx} className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center z-10">
            {/* Conditionally render card on left or right based on layout */}
            {feature.layout === 'left' ? (
              <>
                {/* LEFT SIDE CARD */}
                <div className="relative group">
                  <div className={`relative flex items-center gap-6 bg-linear-to-r ${feature.gradientFrom} ${feature.gradientTo} backdrop-blur-md border border-neutral-800 hover:border-neutral-700 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
                    <div className={`w-20 h-20 rounded-xl bg-linear-to-b ${feature.iconGradient} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">{feature.subtitle}</p>
                      <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
                      <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
                {/* RIGHT SIDE CONTENT */}
                <div>
                  <h2 className="text-5xl font-bold tracking-tight bg-linear-to-r from-white to-neutral-300 bg-clip-text text-transparent">{feature.mainTitle}</h2>
                  <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">{feature.mainDescription}<span className="text-white font-medium"> {feature.highlight}</span></p>
                  <div className="mt-4 text-sm text-neutral-500 italic">{feature.tagline}</div>
                </div>
              </>
            ) : (
              <>
                {/* LEFT SIDE CONTENT */}
                <div>
                  <h2 className="text-5xl font-bold tracking-tight bg-linear-to-r from-white to-neutral-300 bg-clip-text text-transparent">{feature.mainTitle}</h2>
                  <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">{feature.mainDescription}<span className="text-white font-medium"> {feature.highlight}</span></p>
                  <div className="mt-4 text-sm text-neutral-500 italic">{feature.tagline}</div>
                </div>
                {/* RIGHT SIDE CARD */}
                <div className="relative group">
                  <div className={`relative flex items-center gap-6 bg-linear-to-r ${feature.gradientFrom} ${feature.gradientTo} backdrop-blur-md border border-neutral-800 hover:border-neutral-700 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
                    <div className={`w-20 h-20 rounded-xl bg-linear-to-b ${feature.iconGradient} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">{feature.subtitle}</p>
                      <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
                      <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* For Students Section */}
      <section id="for-students" className="relative py-24 px-6 bg-linear-to-b from-black via-neutral-950 to-neutral-900 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 backdrop-blur-sm text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-800/50">
                <Users className="w-4 h-4" />
                For Students
              </div>
              <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Practice, Learn, and Excel
              </h2>
              <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
                Access a comprehensive platform designed to enhance your coding skills and ace your assessments
              </p>

              <div className="space-y-4">
                {[
                  { icon: Code2, title: 'Coding Practice', desc: 'Solve problems with real-time execution and instant feedback' },
                  { icon: BookOpen, title: 'MCQs & Theory', desc: 'Test your knowledge with comprehensive question banks' },
                  { icon: CheckCircle, title: 'Instant Feedback', desc: 'Get detailed explanations and performance analytics' },
                  { icon: Trophy, title: 'Leaderboards', desc: 'Compete with peers and track your progress' }
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-start gap-4 p-5 bg-linear-to-br from-neutral-800/80 to-neutral-900/50 rounded-xl border border-neutral-700 hover:border-blue-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2 text-lg">{item.title}</h4>
                      <p className="text-sm text-neutral-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="w-full relative overflow-hidden rounded-2xl border border-neutral-600 shadow-[0_40px_80px_-20px_rgba(59,130,246,0.3)] group-hover:border-blue-500/50 transition-all duration-300">
                <img
                  src={studentImage}
                  alt="Student Preview"
                  className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Faculty Section */}
      <section id="for-faculty" className="relative py-24 px-6 bg-linear-to-b from-neutral-900 via-neutral-950 to-black overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute -inset-2 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 shadow-2xl border border-neutral-700 group-hover:border-purple-500/50 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">Faculty Dashboard</h3>

                {/* Mock Dashboard Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {dashboardStats.map((stat, idx) => (
                    <div key={idx} className={`bg-linear-to-br from-neutral-700 to-neutral-800 p-5 rounded-xl border border-neutral-600 ${stat.hoverBorder} transition-all duration-300`}>
                      <div className={`text-3xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</div>
                      <div className="text-sm text-neutral-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-linear-to-br from-neutral-700 to-neutral-800 rounded-xl p-5 border border-neutral-600">
                  <h4 className="text-sm font-semibold text-white mb-4">Recent Activity</h4>
                  <div className="space-y-4">
                    {recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 ${activity.color} rounded-full animate-pulse`}></div>
                        <span className="text-sm text-neutral-300">{activity.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 backdrop-blur-sm text-purple-400 rounded-full text-sm font-medium mb-6 border border-purple-800/50">
                <Users className="w-4 h-4" />
                For Faculty
              </div>
              <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Manage, Monitor, and Analyze
              </h2>
              <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
                Powerful tools for creating assessments, monitoring student progress, and ensuring academic integrity
              </p>

              <div className="space-y-4">
                {[
                  { icon: Code2, title: 'Question Management', desc: 'Create and organize coding, MCQ, and theory questions' },
                  { icon: Shield, title: 'Proctoring Logs', desc: 'Monitor test-taking behavior with AI-powered insights' },
                  { icon: CheckCircle, title: 'Plagiarism Detection', desc: 'Identify similar code submissions using Jaccard similarity' },
                  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track class performance and identify improvement areas' }
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-start gap-4 p-5 bg-linear-to-br from-neutral-800/80 to-neutral-900/50 rounded-xl border border-neutral-700 hover:border-purple-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2 text-lg">{item.title}</h4>
                      <p className="text-sm text-neutral-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 bg-linear-to-b from-black via-neutral-950 to-black overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Ready to start your</span>
            <br />
            <span className="bg-linear-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">coding journey?</span>
          </h2>
          <p className="text-xl text-neutral-300 mb-12 leading-relaxed">
            Join thousands of engineering students already improving their skills on EduQuest
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button className="px-6 py-2.5 text-lg bg-linear-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg transform-content transition-all duration-300 hover:scale-105">
              Get Started Free
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex items-center justify-center gap-12 text-base text-neutral-400 flex-wrap">
            {trustIndicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-6 bg-black text-white border-t border-neutral-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">Copyright &copy; 2026 EduQuest. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-neutral-400">
            {footerLinks.map((link, idx) => (
              <a key={idx} href="#" className="hover:text-white transition-colors hover:underline">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
