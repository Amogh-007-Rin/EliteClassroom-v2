import { Link } from 'react-router-dom';
import { Search, BookOpen, Star, Users, ShieldCheck, ArrowRight, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 transform -skew-y-3 origin-top-left -translate-y-20 z-0 h-[110%]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-500/30 px-3 py-1 rounded-full text-blue-50 mb-6 backdrop-blur-sm border border-blue-400/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-50"></span>
                </span>
                <span className="text-sm font-medium">Over 1,000 active students this month</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                Master Your Future with <span className="text-blue-100">Expert Mentors</span>
              </h1>
              
              <p className="text-xl text-blue-50 mb-10 leading-relaxed max-w-xl opacity-90">
                The world's most personalized learning platform. Connect with top-tier tutors for 1-on-1 sessions tailored to your unique learning style.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <Link 
                  to="/tutors" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1 flex items-center group"
                >
                  <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
                  <span>Find Your Tutor</span>
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-700/40 text-white border-2 border-blue-400/30 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700/60 backdrop-blur-md transition-all flex items-center"
                >
                  <span>Join as Tutor</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative hidden lg:block">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                <div className="flex gap-4 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-white/30 rounded w-3/4"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-32 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-white/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-4 animate-bounce">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold">Verified Expert</p>
                  <p className="text-gray-500 text-sm">Background Checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 font-semibold uppercase tracking-widest text-sm mb-10">Trusted by students from</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            <div className="text-2xl font-black text-gray-900">OXFORD</div>
            <div className="text-2xl font-black text-gray-900">STANFORD</div>
            <div className="text-2xl font-black text-gray-900">MIT</div>
            <div className="text-2xl font-black text-gray-900">HARVARD</div>
            <div className="text-2xl font-black text-gray-900">CAMBRIDGE</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Everything you need to <span className="text-blue-600">excel</span> in your studies
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We've combined expert instruction with powerful technology to create the ultimate learning experience.
              </p>
            </div>
            <Link to="/tutors" className="text-blue-600 font-bold flex items-center hover:translate-x-1 transition">
              Learn more about our process <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                color: 'blue', 
                title: 'Strict Verification', 
                desc: 'Only the top 3% of applicants are accepted onto our platform.' 
              },
              { 
                icon: Users, 
                color: 'indigo', 
                title: 'Tailored Learning', 
                desc: 'One-on-one sessions customized to your specific curriculum and goals.' 
              },
              { 
                icon: BookOpen, 
                color: 'green', 
                title: 'Interactive Tools', 
                desc: 'Our virtual classroom is built for seamless, collaborative learning.' 
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center text-${feature.color}-600 mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
          <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 max-w-3xl leading-tight">
              Ready to meet your perfect mentor?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
              Join thousands of students who have already transformed their academic performance with EliteClassroom.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-blue-700 transition shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
              >
                Get Started Now
              </Link>
              <Link 
                to="/tutors" 
                className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl text-xl font-black hover:bg-white/20 transition backdrop-blur-sm"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 bg-gray-50/30 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <BookOpen className="text-blue-600 w-6 h-6" />
            <span className="text-xl font-black text-gray-900">EliteClassroom</span>
          </div>
          <p className="text-gray-500 font-medium">© 2026 EliteClassroom Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
