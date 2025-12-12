import { Search, Menu, Plus, Briefcase, ChevronDown } from 'lucide-react';
import AuthPages from './pages/signup';
import { Route, Routes } from 'react-router'

// Header Component
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-neutral-800 font-bold text-lg">EduQuest</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 w-64">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Opportunities"
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">Internships</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Competitions</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Mentorships</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Practice</a>
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
              More <ChevronDown className="w-4 h-4" />
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Unlock</span> Your Career
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-xl">
            Explore opportunities from across the globe to grow, showcase skills, gain
            CV points & get hired by your dream company.
          </p>

          {/* Pro Badge */}
          <div className="inline-flex items-center gap-3 bg-purple-100 rounded-full px-4 py-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">UP</span>
            </div>
            <span className="text-purple-900 font-semibold">Just Went Unstop Pro!</span>
          </div>
        </div>

        {/* Right Grid */}
        <div className="flex-1">
          <OpportunityGrid />
        </div>
      </div>
    </section>
  );
};

// Opportunity Card Component
const OpportunityCard = ({ title, subtitle, description, color, icon }) => {
  return (
    <div className={`${color} rounded-2xl p-6 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-700 font-medium">{subtitle}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="mt-4 flex justify-end">
        <div className="w-16 h-16 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Opportunity Grid Component
const OpportunityGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <OpportunityCard
        title="Internships"
        subtitle="Gain"
        description="Practical Experience"
        color="bg-green-200"
        icon="💡"
      />
      <OpportunityCard
        title="Mentorships"
        subtitle="Guidance"
        description="From Top Mentors"
        color="bg-orange-200"
        icon="👨‍💼"
      />
      <OpportunityCard
        title="Jobs"
        subtitle="Explore"
        description="Diverse Careers"
        color="bg-blue-200"
        icon="💼"
      />
      <OpportunityCard
        title="Practice"
        subtitle="Refine"
        description="Skills Daily"
        color="bg-purple-200"
        icon="⌨️"
      />
      <OpportunityCard
        title="Competitions"
        subtitle="Battle"
        description="For Excellence"
        color="bg-yellow-200"
        icon="🏆"
      />
      <OpportunityCard
        title="More"
        subtitle=""
        description=""
        color="bg-pink-200"
        icon="📱"
      />
    </div>
  );
};

// User Type Card Component
const UserTypeCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">
            <span className="font-semibold">{description.split(':')[0]}:</span>
            {description.split(':')[1]}
          </p>
        </div>
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// Who's Using Section Component
const WhosUsingSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Who's using Unstop?</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <UserTypeCard
          title="Students and Professionals"
          description="Unlock Your Potential: Compete, Build Resume, Grow and get Hired!"
          icon="👨‍🎓"
        />
        <UserTypeCard
          title="Companies and Recruiters"
          description="Discover Right Talent: Hire, Engage, and Brand Like Never Before!"
          icon="👩‍💼"
        />
        <UserTypeCard
          title="Colleges"
          description="Bridge Academia and Industry: Empower Students with Real-World Opportunities!"
          icon="🎓"
        />
      </div>

      {/* Know How Button */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold">
          Know How <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};


const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <WhosUsingSection />
    </>
  )
}

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<AuthPages />} />
      </Routes>
    </div>
  );
};

export default App;