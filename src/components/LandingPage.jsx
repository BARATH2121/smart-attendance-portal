import { BarChart3, Shield, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage({ onGetStarted }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-black text-white">SmartAttend</h1>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
          >
            Portal Login
          </button>
        </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Intelligent Attendance & Academic Management
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Streamline attendance tracking, academic records, and institutional management with our cloud-based portal. Designed for schools and colleges.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button className="border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                Learn More
              </button>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Real-time Attendance Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Secure Document Storage</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Instant Analytics & Reports</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-3xl p-12">
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-indigo-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold">Today's Attendance</h4>
                    <span className="text-emerald-400 text-2xl font-black">92%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-indigo-500/30">
                    <p className="text-slate-400 text-sm mb-2">Present</p>
                    <p className="text-white text-2xl font-black">234</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-indigo-500/30">
                    <p className="text-slate-400 text-sm mb-2">Absent</p>
                    <p className="text-white text-2xl font-black">20</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-indigo-500/30">
                  <p className="text-slate-400 text-sm mb-3">Recent Documents</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle size={16} />
                      <span className="text-sm">Marksheet Uploaded</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle size={16} />
                      <span className="text-sm">Certificate Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-black text-white text-center mb-16">
          Powerful Features for Modern Education
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Real-Time Analytics"
            description="Instant attendance charts, performance metrics, and institutional insights at your fingertips."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure & Reliable"
            description="Enterprise-grade security with encrypted data storage and role-based access control."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Multi-Role Access"
            description="Admin, Teacher, and Student dashboards with tailored features for each role."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Performance Tracking"
            description="Monitor attendance trends and academic progress with detailed visualizations."
          />
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8" />}
            title="Document Management"
            description="Upload, store, and manage academic documents securely in the cloud."
          />
          <FeatureCard
            icon={<ArrowRight className="w-8 h-8" />}
            title="Quick Reports"
            description="Generate and export attendance reports in seconds with one click."
          />
        </div>
      </section>

      {/* User Roles Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-black text-white text-center mb-16">
          Designed for Every User
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RoleCard
            title="Administrators"
            features={['Register Teachers', 'Edit Faculty Records', 'Manage System Settings', 'View All Analytics']}
            color="from-blue-600 to-blue-700"
          />
          <RoleCard
            title="Teachers"
            features={['Mark Attendance', 'Add New Students', 'View Student Records', 'Generate Reports']}
            color="from-indigo-600 to-indigo-700"
          />
          <RoleCard
            title="Students"
            features={['View Attendance', 'Upload Documents', 'Track Performance', 'Download Reports']}
            color="from-emerald-600 to-emerald-700"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl">
        <div className="text-center space-y-8">
          <h3 className="text-4xl font-black text-white">Ready to Modernize Your Institution?</h3>
          <p className="text-xl text-indigo-100">Join hundreds of schools using SmartAttend for efficient attendance management.</p>
          <button
            onClick={onGetStarted}
            className="bg-white text-indigo-600 hover:bg-slate-100 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 inline-block"
          >
            Login to Your Portal
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 mt-20 py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">SmartAttend</h4>
              <p className="text-slate-400 text-sm">Intelligent Attendance Management System</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Features</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-indigo-400">Attendance Tracking</a></li>
                <li><a href="#" className="hover:text-indigo-400">Analytics</a></li>
                <li><a href="#" className="hover:text-indigo-400">Reports</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-indigo-400">About</a></li>
                <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-indigo-400">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-400">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-400">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-indigo-500/20 pt-8 text-center text-slate-400">
            <p>&copy; 2025 SmartAttend. All rights reserved. Built with modern technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800/50 border border-indigo-500/30 rounded-2xl p-8 hover:border-indigo-400/60 transition-all group">
      <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/40 transition-all text-indigo-400">
        {icon}
      </div>
      <h4 className="text-white font-bold text-lg mb-3">{title}</h4>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function RoleCard({ title, features, color }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all`}></div>
      <div className="relative bg-slate-800/80 border border-indigo-500/30 rounded-2xl p-8">
        <h4 className={`text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent mb-6`}>
          {title}
        </h4>
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
