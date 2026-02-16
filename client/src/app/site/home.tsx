import { Code2, Trophy, Shield, BarChart3, Users, BookOpen, CheckCircle } from 'lucide-react'
import editorImage from "@/assets/screenshot/editor-preview.jpeg";
import contestImage from "@/assets/screenshot/contest-preview.jpeg";
import problemImage from "@/assets/screenshot/problemlist-preview.jpeg";
import studentImage from "@/assets/screenshot/studentd-ashboard-preeview.jpeg";
import { FaJava, FaSwift, FaPython, FaPhp, FaRust, FaJs } from "react-icons/fa";
import { TbBrandCpp, TbSql } from "react-icons/tb";

export const Home = () => {
  const icons = [TbBrandCpp, TbSql, FaRust, FaSwift, FaPython, FaPhp, FaJava, FaJs];
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-linear-to-b from-neutral-900 via-neutral-800 to-neutral-950 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="w-full flex flex-col items-center">
            <div className="relative flex flex-col items-center text-center gap-4 mb-20 z-5">
              <h1 className="text-7xl font-bold text-neutral-200">Built by Engineers</h1>
              <h1 className="text-7xl font-bold text-neutral-200">for Engineers</h1>
            </div>

            <div className="my-20 relative h-120 w-full max-w-5xl mx-auto flex items-start justify-center">
              <div className="scale-[0.95] w-[90%] overflow-hidden absolute top-0 transform -translate-y-14 rounded-2xl border border-neutral-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] z-0">
                <img
                  src={problemImage}
                  alt="Back Preview"
                  className="w-full h-full object-cover" />
              </div>

              <div className="scale-[0.97] w-[95%] overflow-hidden absolute top-0 transform -translate-y-8 rounded-2xl border border-neutral-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] z-10">
                <img
                  src={contestImage}
                  alt="Back Preview"
                  className="w-full h-full object-cover" />
              </div>

              <div className="w-full relative overflow-hidden rounded-2xl border border-neutral-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] z-20">
                <img
                  src={editorImage}
                  alt="Back Preview"
                  className="w-full h-full object-cover" />
              </div>
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
              { top: '8%', right: '50%', animation: 'floatReverse', delay: 3 },
              { bottom: '40%', right: '15%', animation: 'float', delay: 1 },
            ];

            const position = positions[index % positions.length];
            const positionStyle: React.CSSProperties = {
              animation: `${position.animation} 7s ease-in-out infinite`,
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

      <section className="relative flex flex-col gap-44 bg-black text-white py-20 px-6 overflow-hidden">

        {/* Background subtle linear */}
        <div className="absolute inset-0 bg-linear-to-b from-neutral-900 via-black to-black opacity-90" />

        <div className="flex flex-col">
          <h2 className="text-center text-5xl font-bold">Our Features</h2>
          <p className="text-lg text-center text-neutral-400 mt-4">Discover the powerful tools that make coding easier and more efficient.</p>
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE CARD */}
          <div className="relative">
            <div className="relative flex items-center gap-6 bg-linear-to-r from-neutral-900/90 to-black/40 backdrop-blur-md border border-neutral-800  rounded-2xl p-8 shadow-2xl">

              {/* Envelope Icon Container */}
              <div className="w-20 h-20 rounded-xl bg-linear-to-b from-neutral-700 to-neutral-900 flex items-center justify-center shadow-inner">

              </div>

              {/* Text Content */}
              <div>
                <p className="text-sm text-neutral-400">
                  Fery newsletter · March 10, 2025
                </p>

                <h3 className="text-xl font-semibold mt-2">
                  Monaco Editor
                </h3>

                <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-sm">
                  We’ve integrated the powerful Monaco Editor into our platform, providing you with a seamless coding experience.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div>
            <h2 className="text-5xl font-bold tracking-tight">
              Weekly insights.
            </h2>

            <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">
              Start each week ahead. Every Monday, get personalized insights on
              your watchlist, portfolio updates, and market-moving stories
              <span className="text-white font-medium">
                {" "}
                directly in your inbox.
              </span>
            </p>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* RIGHT SIDE CONTENT */}
          <div>
            <h2 className="text-5xl font-bold tracking-tight">
              Weekly insights.
            </h2>

            <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">
              Start each week ahead. Every Monday, get personalized insights on
              your watchlist, portfolio updates, and market-moving stories
              <span className="text-white font-medium">
                {" "}
                directly in your inbox.
              </span>
            </p>
          </div>

          {/* LEFT SIDE CARD */}
          <div className="relative">
            <div className="relative flex items-center gap-6 bg-linear-to-r from-neutral-900/90 to-black/40 backdrop-blur-md border border-neutral-800  rounded-2xl p-8 shadow-2xl">

              {/* Envelope Icon Container */}
              <div className="w-20 h-20 rounded-xl bg-linear-to-b from-neutral-700 to-neutral-900 flex items-center justify-center shadow-inner">

              </div>

              {/* Text Content */}
              <div>
                <p className="text-sm text-neutral-400">
                  Fery newsletter · March 10, 2025
                </p>

                <h3 className="text-xl font-semibold mt-2">
                  Monaco Editor
                </h3>

                <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-sm">
                  We’ve integrated the powerful Monaco Editor into our platform, providing you with a seamless coding experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE CARD */}
          <div className="relative">
            <div className="relative flex items-center gap-6 bg-linear-to-r from-neutral-900/90 to-black/40 backdrop-blur-md border border-neutral-800  rounded-2xl p-8 shadow-2xl">

              {/* Envelope Icon Container */}
              <div className="w-20 h-20 rounded-xl bg-linear-to-b from-neutral-700 to-neutral-900 flex items-center justify-center shadow-inner">

              </div>

              {/* Text Content */}
              <div>
                <p className="text-sm text-neutral-400">
                  Fery newsletter · March 10, 2025
                </p>

                <h3 className="text-xl font-semibold mt-2">
                  Monaco Editor
                </h3>

                <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-sm">
                  We’ve integrated the powerful Monaco Editor into our platform, providing you with a seamless coding experience.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div>
            <h2 className="text-5xl font-bold tracking-tight">
              Weekly insights.
            </h2>

            <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">
              Start each week ahead. Every Monday, get personalized insights on
              your watchlist, portfolio updates, and market-moving stories
              <span className="text-white font-medium">
                {" "}
                directly in your inbox.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section id="for-students" className="py-20 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-800">
                <Users className="w-4 h-4" />
                For Students
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Practice, Learn, and Excel
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Access a comprehensive platform designed to enhance your coding skills and ace your assessments
              </p>

              <div className="space-y-4">
                {[
                  { icon: Code2, title: 'Coding Practice', desc: 'Solve problems with real-time execution and instant feedback' },
                  { icon: BookOpen, title: 'MCQs & Theory', desc: 'Test your knowledge with comprehensive question banks' },
                  { icon: CheckCircle, title: 'Instant Feedback', desc: 'Get detailed explanations and performance analytics' },
                  { icon: Trophy, title: 'Leaderboards', desc: 'Compete with peers and track your progress' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-blue-500/50 transition-colors">
                    <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="w-full relative overflow-hidden rounded-2xl border border-neutral-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] z-20">
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
      <section id="for-faculty" className="py-20 px-6 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Visual */}
            <div className="order-2 lg:order-1">
              <div className="bg-neutral-800 rounded-2xl p-8 shadow-xl border border-neutral-700">
                <h3 className="text-xl font-bold text-white mb-6">Faculty Dashboard</h3>

                {/* Mock Dashboard Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-neutral-700 p-4 rounded-lg border border-neutral-600">
                    <div className="text-2xl font-bold text-purple-400">156</div>
                    <div className="text-sm text-gray-400">Active Students</div>
                  </div>
                  <div className="bg-neutral-700 p-4 rounded-lg border border-neutral-600">
                    <div className="text-2xl font-bold text-blue-400">12</div>
                    <div className="text-sm text-gray-400">Active Tests</div>
                  </div>
                  <div className="bg-neutral-700 p-4 rounded-lg border border-neutral-600">
                    <div className="text-2xl font-bold text-green-400">89%</div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </div>
                  <div className="bg-neutral-700 p-4 rounded-lg border border-neutral-600">
                    <div className="text-2xl font-bold text-orange-400">45</div>
                    <div className="text-sm text-gray-400">Questions</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-neutral-700 rounded-lg p-4 border border-neutral-600">
                  <h4 className="text-sm font-semibold text-white mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Test "Data Structures" completed by 45 students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">3 plagiarism cases detected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">New assignment created</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 text-purple-400 rounded-full text-sm font-medium mb-6 border border-purple-800">
                <Users className="w-4 h-4" />
                For Faculty
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Manage, Monitor, and Analyze
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Powerful tools for creating assessments, monitoring student progress, and ensuring academic integrity
              </p>

              <div className="space-y-4">
                {[
                  { icon: Code2, title: 'Question Management', desc: 'Create and organize coding, MCQ, and theory questions' },
                  { icon: Shield, title: 'Proctoring Logs', desc: 'Monitor test-taking behavior with AI-powered insights' },
                  { icon: CheckCircle, title: 'Plagiarism Detection', desc: 'Identify similar code submissions using Jaccard similarity' },
                  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track class performance and identify improvement areas' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-purple-500/50 transition-colors">
                    <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to start your
            <br />
            <span className="text-blue-500">coding journey?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of engineering students already improving their skills on EduQuest
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-neutral-800 text-gray-300 font-semibold rounded-lg hover:bg-neutral-700 transition-all border border-neutral-700">
              Contact Sales
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 px-6 bg-neutral-950 text-white border-t border-neutral-800">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 EduQuest. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
