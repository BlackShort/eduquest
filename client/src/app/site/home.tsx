import { Link } from "react-router";
import {
  Code2,
  Trophy,
  Shield,
  BarChart3,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Brain,
  Award
} from "lucide-react";

export const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduQuest</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modern e-learning platform designed for engineering students and faculty.
              Master coding, ace assessments, and track your progress with cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2 border-gray-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "10K+", icon: Users },
              { label: "Coding Questions", value: "5K+", icon: Code2 },
              { label: "Tests Conducted", value: "50K+", icon: BookOpen },
              { label: "Success Rate", value: "95%", icon: Trophy }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for Students */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Students</h2>
            <p className="text-xl text-gray-600">Everything you need to excel in your engineering journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Code2,
                title: "Coding Practice",
                description: "Integrated Monaco code editor with real-time execution engine for hands-on coding practice"
              },
              {
                icon: BookOpen,
                title: "Comprehensive Assessments",
                description: "Attempt coding questions, MCQs, and theory questions with instant feedback"
              },
              {
                icon: Shield,
                title: "Secure Proctoring",
                description: "AI-enabled proctoring during tests with tab change detection and face presence checks"
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Detailed analytics and insights to track your progress and identify areas for improvement"
              },
              {
                icon: Trophy,
                title: "Leaderboards & Gamification",
                description: "Earn badges, points, and climb the leaderboard with engaging gamification elements"
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Get immediate feedback on your submissions with auto-evaluation and detailed reports"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="bg-linear-to-br from-blue-100 to-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for Faculty */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Faculty</h2>
            <p className="text-xl text-gray-600">Powerful tools to manage and monitor student progress</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Question Management",
                description: "Create and manage coding, MCQ, and theory questions with ease"
              },
              {
                icon: BookOpen,
                title: "Test Creation",
                description: "Create, schedule, and publish tests with flexible configurations"
              },
              {
                icon: Shield,
                title: "Proctoring Monitoring",
                description: "Monitor proctoring logs and suspicious activities during tests"
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Comprehensive dashboards to analyze student and class performance"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-linear-to-br from-green-100 to-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Advanced Technology</h2>
            <p className="text-xl text-gray-600">Industry-grade features for a world-class learning experience</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: CheckCircle,
                title: "AI-Enabled Proctoring",
                description: "Advanced behavior tracking and monitoring to ensure test integrity"
              },
              {
                icon: CheckCircle,
                title: "Plagiarism Detection",
                description: "Code plagiarism detection using Jaccard similarity and AST comparison"
              },
              {
                icon: CheckCircle,
                title: "Auto-Evaluation Engine",
                description: "Sandbox-based code execution with comprehensive test case evaluation"
              },
              {
                icon: CheckCircle,
                title: "Microservices Architecture",
                description: "Scalable and flexible architecture for optimal performance"
              }
            ].map((capability, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="shrink-0">
                  <capability.icon className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and educators already using EduQuest to achieve their goals.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-10 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Your Journey <Award className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
