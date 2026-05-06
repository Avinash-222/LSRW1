import React, { useState, useEffect } from 'react';
import { useTest } from '../context/TestContext';
import { 
  Mic, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Zap, 
  BarChart3, 
  Play, 
  CheckCircle2,
  Brain,
  Star,
  Twitter,
  Linkedin,
  Github,
  Clock,
  Target,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
  Lock,
  User,
  Lightbulb,
  Puzzle,
  Settings,
  Globe,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Landing = ({ onEnter }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const { isLoadingQuestions, loginUser } = useTest();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    if (onEnter) onEnter();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const renderContent = () => {
    switch(activePage) {
      case 'About': return <RedesignedAboutUs fadeInUp={fadeInUp} staggerContainer={staggerContainer} />;
      case 'Instructions': return <InstructionsPage fadeInUp={fadeInUp} staggerContainer={staggerContainer} />;
      case 'Contact Us': return <ContactPage fadeInUp={fadeInUp} />;
      case 'Login': return <LoginPage onLogin={handleStart} loginUser={loginUser} fadeInUp={fadeInUp} setActivePage={setActivePage} />;
      case 'Sign Up': return <SignUpPage onSignUp={handleStart} loginUser={loginUser} fadeInUp={fadeInUp} setActivePage={setActivePage} />;
      case 'Home':
      default: return <HomeContent handleStart={handleStart} isLoadingQuestions={isLoadingQuestions} fadeInUp={fadeInUp} staggerContainer={staggerContainer} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="font-sans text-[#5B6D7D] bg-white selection:bg-[#5B6D7D]/30 min-h-screen flex flex-col">
      
      {/* 1. NAVBAR */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || activePage !== 'Home' 
            ? 'bg-white/95 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.05)] text-[#5B6D7D] border-b border-gray-100' 
            : 'bg-transparent py-6 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 font-bold text-2xl tracking-tighter z-50 cursor-pointer"
            onClick={() => setActivePage('Home')}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${scrolled || activePage !== 'Home' ? 'bg-[#5B6D7D] shadow-lg shadow-[#5B6D7D]/20' : 'bg-white'}`}>
               <Zap className={`w-5 h-5 ${scrolled || activePage !== 'Home' ? 'text-white fill-white' : 'text-[#5B6D7D] fill-[#5B6D7D]'}`} />
            </div>
            <span className="flex items-baseline">
              LSRW
            </span>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-10 text-[15px] font-semibold tracking-tight">
            {['Home', 'About', 'Instructions', 'Contact Us'].map(link => (
              <button 
                key={link} 
                onClick={() => setActivePage(link)}
                className={`relative py-2 transition-all hover:text-[#5B6D7D] ${
                  activePage === link 
                    ? 'text-[#5B6D7D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#5B6D7D] after:rounded-full' 
                    : (scrolled || activePage !== 'Home' ? 'text-gray-500' : 'text-gray-100/90')
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[15px] font-bold">
            <button 
              onClick={() => setActivePage('Login')}
              className={`transition-all hover:opacity-70 ${activePage === 'Login' ? 'text-[#5B6D7D]' : (scrolled || activePage !== 'Home' ? 'text-gray-600' : 'text-white')}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActivePage('Sign Up')}
              className={`px-7 py-2.5 rounded-xl transition-all font-bold tracking-tight ${
                scrolled || activePage !== 'Home' 
                  ? 'bg-[#5B6D7D] text-white hover:bg-[#4A5A69] shadow-lg shadow-[#5B6D7D]/20' 
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
              }`}
            >
              Sign Up
            </button>
          </div>

        </div>
      </nav>

      <div className={`${activePage !== 'Home' ? 'pt-24 flex-1' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

/* --- INNER PAGES --- */

const HomeContent = ({ handleStart, isLoadingQuestions, fadeInUp, staggerContainer, setActivePage }) => (
  <>
    {/* HERO SECTION */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.png')" }} />
      <div className="absolute inset-0 z-0 bg-black/40" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-20">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white !text-white leading-tight">
            Master Your Communication Skills With AI.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Evaluate your Listening, Speaking, Reading, and Writing abilities with real-time AI analysis and personalized performance insights.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-4">
            {/* Start Assessment and Watch Demo removed from Hero per request */}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* CORE FEATURES SECTION */}
    <section className="py-24 px-6 bg-white text-center">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mb-16">
          <motion.span variants={fadeInUp} className="text-cyan-500 font-bold text-xs tracking-widest uppercase block mb-3">
            Features To Build Better
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Our Core Features
          </motion.h2>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Listening Assessment", desc: "Evaluate comprehension with AI-driven audio tests and listening accuracy scoring.", icon: <Headphones className="w-8 h-8 text-cyan-500" /> },
            { title: "Speaking Evaluation", desc: "AI analyzes pronunciation, fluency, confidence, and speech clarity in real-time.", icon: <Mic className="w-8 h-8 text-cyan-500" /> },
            { title: "Reading Analysis", desc: "Measure reading comprehension, vocabulary recognition, and reading speed.", icon: <BookOpen className="w-8 h-8 text-cyan-500" /> },
            { title: "Writing Evaluation", desc: "AI checks grammar, coherence, vocabulary richness, and writing clarity.", icon: <PenTool className="w-8 h-8 text-cyan-500" /> }
          ].map((f, i) => (
            <motion.div key={i} variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,188,212,0.15)] transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* HOW IT WORKS SECTION */}
    <section className="py-24 px-6 bg-gray-50 text-center">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-16">
          <span className="text-cyan-500 font-bold text-xs tracking-widest uppercase block mb-3">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How The Platform Works</h2>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] w-[75%] h-0.5 bg-gray-200 z-0" />
          {[
            { step: "01", title: "Sign Up", desc: "Create your free account.", icon: <Play className="w-5 h-5 text-cyan-600" /> },
            { step: "02", title: "Complete Tests", desc: "Finish all LSRW modules.", icon: <Target className="w-5 h-5 text-cyan-600" /> },
            { step: "03", title: "AI Evaluates", desc: "Deep neural analysis runs.", icon: <Brain className="w-5 h-5 text-cyan-600" /> },
            { step: "04", title: "Receive Report", desc: "Get detailed performance metrics.", icon: <BarChart3 className="w-5 h-5 text-cyan-600" /> }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-6 relative">
                <div className="absolute top-0 right-0 w-6 h-6 bg-cyan-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm max-w-[180px]">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* FINAL CALL TO ACTION */}
    <section className="py-24 px-6 relative text-center bg-cyan-600 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-4xl lg:text-5xl font-extrabold text-white">
          Start Improving Your Communication Skills Today
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" variants={fadeInUp} className="text-cyan-100 text-lg max-w-2xl mx-auto">
          Take your first step towards mastery. Get accurate, AI-driven insights in minutes.
        </motion.p>
        <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} className="pt-4">
          <button 
            onClick={() => setActivePage('Sign Up')}
            className="px-10 py-4 bg-white text-cyan-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl disabled:opacity-50"
          >
            Create Your Free Account
          </button>
        </motion.div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="bg-gray-900 text-gray-400 py-16 px-6 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-6">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
               <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-white">LSRW</span>
          </div>
          <p className="max-w-sm text-gray-500 leading-relaxed">
            The premier AI-driven communication evaluation platform. Measure, analyze, and master language skills.
          </p>
          <div className="flex gap-4 pt-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-gray-600 flex flex-col justify-center items-center gap-4">
        <p>© 2026 LSRW Platform. Powered by Advanced Neural Networks.</p>
      </div>
    </footer>
  </>
);

const AboutPage = ({ fadeInUp, staggerContainer }) => (
  <div className="max-w-5xl mx-auto py-20 px-6">
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-sans text-center">
        About LSRW Evaluation
      </motion.h1>
      <motion.div variants={fadeInUp} className="h-1 w-20 bg-cyan-500 mb-12 rounded-full mx-auto" />
      
      <motion.div variants={fadeInUp} className="space-y-6 text-gray-600 leading-relaxed text-lg text-center max-w-3xl mx-auto mb-16">
        <p>
          Welcome to LSRW, the world's most advanced automated platform for assessing language and communication skills. 
          Our platform harnesses the power of cutting-edge neural networks to provide granular, unbiased, and actionable feedback 
          across four core domains: Listening, Speaking, Reading, and Writing.
        </p>
        <p>
          Designed for students, professionals, and institutions, our platform mimics the depth of human evaluation without the wait. 
          We believe that accurate communication assessment should be accessible to everyone aiming to elevate their global profile.
        </p>
      </motion.div>
        
      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div variants={fadeInUp} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,188,212,0.1)] transition-shadow">
          <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-cyan-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-gray-600">To democratize high-quality language evaluation through artificial intelligence, providing every learner with a precise, accessible roadmap to communication fluency.</p>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,188,212,0.1)] transition-shadow">
          <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-cyan-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600">A world where communication barriers are dissolved by accessible learning tools, objective feedback systems, and a universal standard for language assessment.</p>
        </motion.div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-cyan-600 rounded-3xl p-12 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-8">Why Choose LSRW?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Deep Neural Tech</h4>
              <p className="text-cyan-100 text-sm">Powered by state-of-the-art Natural Language Processing and speech recognition.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Instant Feedback</h4>
              <p className="text-cyan-100 text-sm">Say goodbye to waiting weeks for human graders. Get your scores immediately.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Granular Analytics</h4>
              <p className="text-cyan-100 text-sm">Detailed reports that highlight your exact strengths and pinpoint areas for improvement.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const InstructionsPage = ({ setActivePage }) => {
  const steps = [
    {
      step: "01",
      title: "SYSTEM CHECK",
      desc: "Ensure a stable 5Mbps+ connection and use high-quality headphones. Clear your browser cache before initiating the session for maximum AI evaluation accuracy.",
      icon: <Activity className="w-12 h-12" />,
      color: "bg-[#00AEEF]",
      darkColor: "text-[#0089bd]"
    },
    {
      step: "02",
      title: "LISTENING",
      desc: "Audio tracks play only once. Focus on key details and overall context. Our neural engine maps your comprehension depth in real-time as you respond.",
      icon: <Headphones className="w-12 h-12" />,
      color: "bg-[#0095DA]",
      darkColor: "text-[#0074aa]"
    },
    {
      step: "03",
      title: "SPEAKING",
      desc: "Speak naturally and clearly into your microphone. Avoid background noise. AI evaluates your pronunciation, fluency, and emotional tone during the speech segments.",
      icon: <Mic className="w-12 h-12" />,
      color: "bg-[#007BB5]",
      darkColor: "text-[#00608e]"
    },
    {
      step: "04",
      title: "READING",
      desc: "Analyze passages thoroughly within the time limit. Semantic tracking monitors your engagement speed. Ensure you submit answers before the timer expires.",
      icon: <BookOpen className="w-12 h-12" />,
      color: "bg-[#006192]",
      darkColor: "text-[#004a6f]"
    },
    {
      step: "05",
      title: "WRITING",
      desc: "Construct logical and coherent essays following the word count guidelines. Our advanced NLP checks for grammatical precision and vocabulary richness.",
      icon: <PenTool className="w-12 h-12" />,
      color: "bg-[#004A6F]",
      darkColor: "text-[#00344e]"
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden font-sans">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className={`relative flex-1 flex flex-col ${s.color} min-h-[400px] md:min-h-screen border-r border-black/10 group overflow-hidden`}
        >
          {/* Centered Content Section (Step + Title + Description) */}
          <div className="flex-1 flex flex-col justify-center items-center px-10 text-center relative z-10 space-y-12">
            {/* Step Indicator */}
            <div className="flex flex-col items-center">
              <span className="text-white/50 font-bold text-[10px] tracking-[0.5em] mb-4">STEP</span>
              <h2 className="text-white text-[120px] font-black tracking-tighter leading-[0.8] tabular-nums">
                {s.step}
              </h2>
            </div>
            
            {/* Main Information */}
            <div className="space-y-6 max-w-[320px]">
              <h3 className="text-white text-3xl font-extrabold tracking-tight uppercase border-b-2 border-white/10 pb-4 inline-block">
                {s.title}
              </h3>
              <p className="text-white/80 text-[17px] leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          </div>

          {/* Bottom Icon Section (Fixed at bottom) */}
          <div className="h-40 flex justify-center items-center relative z-10 bg-black/10">
            <div className="text-white transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
              {s.icon}
            </div>
          </div>

          {/* Background Decorative Number (Hidden on Mobile) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 text-[28rem] font-bold select-none pointer-events-none hidden lg:block">
            {s.step}
          </div>
        </motion.div>
      ))}

      {/* Persistent Acknowledge Button (Repositioned Further Upwards) */}
      <div className="fixed bottom-40 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white text-[#004A6F] px-14 py-5 rounded-full font-black text-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group border-4 border-white/20"
        >
          I ACKNOWLEDGE ALL TERMS
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const ContactPage = ({ fadeInUp }) => (
  <div className="min-h-screen grid place-items-center relative overflow-hidden font-sans px-4 py-8">
    {/* Subtle Page-Wide Botanical Background */}
    <div className="absolute inset-0 z-0 bg-[#F8FAFB]">
      <img 
        src="/botanical_leaf_pattern_1775113742034.png" 
        alt="Background" 
        className="w-full h-full object-cover opacity-[0.06] blur-[2px]"
      />
    </div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-[1100px] bg-white/95 backdrop-blur-sm rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 grid md:grid-cols-[1.1fr_1fr] min-h-[750px]"
    >
      {/* Left Side: Botanical Imagery */}
      <div className="hidden md:block relative h-full overflow-hidden">
        <img 
          src="/botanical_leaf_pattern_1775113742034.png" 
          alt="Design Sidebar" 
          className="absolute inset-0 w-full h-full object-cover scale-150 object-center" 
        />
      </div>

      {/* Right Side: Contact Form */}
      <div className="p-10 md:pl-12 md:pr-16 py-12 flex flex-col justify-center h-full">
        <div className="mb-10 text-left">
          <h1 className="text-[48px] font-bold text-[#5B6D7D] tracking-tighter leading-[1.1]">
            Get In,<br />
            <span className="font-light text-[#A4B1BD]">Touch!</span>
          </h1>
          <p className="mt-4 text-[#8A9BA8] text-sm font-medium leading-relaxed">
            Reach out to our experts and we'll get back to you shortly.
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
              <input type="text" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="First Name" />
            </div>
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
              <input type="text" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="Last Name" />
            </div>
          </div>
          
          <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
            <input type="email" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="Email Address" />
          </div>

          <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
            <textarea rows="3" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium resize-none" placeholder="Your Message"></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-[#526a7e] hover:bg-[#435768] text-white rounded-2xl py-5 font-black text-lg transition-all shadow-[0_15px_30px_-10px_rgba(82,106,126,0.4)] active:scale-[0.98]">
              Send Message
            </button>
          </div>
        </form>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#DCE3E8]">
           <div className="flex flex-col items-start gap-1">
             <div className="flex items-center gap-2 mb-1">
                <Phone size={14} className="text-[#5B6D7D]" />
                <span className="text-[10px] font-black text-[#5B6D7D] uppercase tracking-[0.2em]">Phone</span>
             </div>
             <span className="text-[13px] font-medium text-[#A4B1BD]">+1 (800) 123-4567</span>
           </div>
           <div className="flex flex-col items-start gap-1">
             <div className="flex items-center gap-2 mb-1">
                <Mail size={14} className="text-[#5B6D7D]" />
                <span className="text-[10px] font-black text-[#5B6D7D] uppercase tracking-[0.2em]">Email</span>
             </div>
             <span className="text-[13px] font-medium text-[#A4B1BD]">support@lsrw.ai</span>
           </div>
           <div className="flex flex-col items-start gap-1">
             <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-[#5B6D7D]" />
                <span className="text-[10px] font-black text-[#5B6D7D] uppercase tracking-[0.2em]">Office</span>
             </div>
             <span className="text-[13px] font-medium text-[#A4B1BD]">Tech Valley, CA</span>
           </div>
        </div>
      </div>
    </motion.div>
  </div>
);

const LoginPage = ({ onLogin, loginUser, fadeInUp, setActivePage }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      const result = await res.json();
      if (res.ok) {
        loginUser(result.user);
        onLogin(); 
      } else {
        setErrorMsg(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Cannot connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden font-sans px-4 py-8">
      {/* Subtle Page-Wide Botanical Background */}
      <div className="absolute inset-0 z-0 bg-[#F8FAFB]">
        <img 
          src="/botanical_leaf_pattern_1775113742034.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-[0.06] blur-[2px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[1040px] bg-white/95 backdrop-blur-sm rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 grid md:grid-cols-[1.1fr_1fr] min-h-[700px]"
      >
        {/* Left Side: Botanical Imagery (Now filling edge-to-edge) */}
        <div className="hidden md:block relative h-full overflow-hidden">
          <img 
            src="/botanical_leaf_pattern_1775113742034.png" 
            alt="Design Sidebar" 
            className="absolute inset-0 w-full h-full object-cover scale-150 object-center"
          />
        </div>

        {/* Right Side: Identity Form */}
        <div className="p-12 md:pl-16 md:pr-20 flex flex-col justify-center text-left h-full">
          <div className="mb-12">
            <h1 className="text-[48px] font-bold text-[#5B6D7D] tracking-tighter leading-[1.1]">
              Hello,<br />
              <span className="font-light text-[#A4B1BD]">Guyss!</span>
            </h1>
            
            <div className="flex gap-12 mt-10 mb-2">
              <button 
                className="text-xl font-bold text-[#5B6D7D] border-b-[3px] border-[#5B6D7D] pb-2 cursor-pointer"
                onClick={() => setActivePage('Login')}
              >
                Login
              </button>
              <button 
                className="text-xl font-medium text-[#C4CDD6] hover:text-[#5B6D7D] pb-2 cursor-pointer transition-all"
                onClick={() => setActivePage('Sign Up')}
              >
                SignUp
              </button>
            </div>
          </div>

          <form className="space-y-12" onSubmit={handleLoginSubmit}>
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
              <input 
                name="email" type="email" required
                className="w-full bg-transparent py-4 text-xl text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
              <input 
                name="password" type={showPassword ? "text" : "password"} required
                className="w-full bg-transparent py-4 text-xl text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium pr-12"
                placeholder="Enter Password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#C7D1DA] hover:text-[#5B6D7D] transition-colors"
              >
                {showPassword ? <EyeOff size={24} className="opacity-70" /> : <Eye size={24} className="opacity-70" />}
              </button>
            </div>

            <div className="pt-6">
              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-[#526a7e] hover:bg-[#435768] text-white rounded-2xl py-6 font-black text-xl transition-all shadow-[0_15px_30px_-10px_rgba(82,106,126,0.4)] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Login Now'}
              </button>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

const SignUpPage = ({ onSignUp, loginUser, fadeInUp, setActivePage }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          collegeName: data.collegeName,
          year: data.year,
          password: data.password
        })
      });
      const result = await res.json();
      if (res.ok) { 
        loginUser(result.user);
        onSignUp(); 
      } else { 
        setErrorMsg(result.error || "Failed to sign up"); 
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Cannot connect to server.");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden font-sans px-4 py-8">
      {/* Subtle Page-Wide Botanical Background */}
      <div className="absolute inset-0 z-0 bg-[#F8FAFB]">
        <img 
          src="/botanical_leaf_pattern_1775113742034.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-[0.06] blur-[2px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[1100px] bg-white/95 backdrop-blur-sm rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 grid md:grid-cols-[1.1fr_1fr] min-h-[720px]"
      >
        <div className="hidden md:block relative h-full overflow-hidden">
          <img 
            src="/botanical_leaf_pattern_1775113742034.png" 
            alt="Design Sidebar" 
            className="absolute inset-0 w-full h-full object-cover scale-150 object-center" 
          />
        </div>
        <div className="p-12 md:pl-12 md:pr-16 py-12 flex flex-col justify-center h-full">
          <div className="mb-12 text-left">
            <h1 className="text-[48px] font-bold text-[#5B6D7D] tracking-tighter leading-[1.1]">
              Hello,<br />
              <span className="font-light text-[#A4B1BD]">Friend!</span>
            </h1>
            <div className="flex gap-12 mt-10 mb-2">
              <button className="text-xl font-medium text-[#C4CDD6] hover:text-[#5B6D7D] pb-2 cursor-pointer transition-all" onClick={() => setActivePage('Login')}>Login</button>
              <button className="text-xl font-bold text-[#5B6D7D] border-b-[3px] border-[#5B6D7D] pb-2 cursor-pointer">SignUp</button>
            </div>
          </div>
          {errorMsg && <div className="mb-8 p-5 bg-red-50 text-red-500 rounded-2xl text-xs font-bold border border-red-100 italic select-none">* {errorMsg}</div>}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12" onSubmit={handleSignupSubmit}>
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1"><input name="firstName" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="First Name" /></div>
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1"><input name="lastName" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="Last Name" /></div>
            <div className="md:col-span-2 border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1"><input name="email" type="email" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="Email Address" /></div>
            <div className="md:col-span-2 border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1"><input name="collegeName" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="College Name" /></div>
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1">
              <select name="year" required defaultValue="" className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] outline-none font-medium appearance-none cursor-pointer"><option value="" disabled>Year</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select>
            </div>
            <div className="border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1"><input name="password" type="password" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="Password" /></div>
            <div className="md:col-span-2 border-b-2 border-[#DCE3E8] focus-within:border-[#5B6D7D] transition-all pb-1"><input name="confirmPassword" type="password" required className="w-full bg-transparent py-3 text-lg text-[#5B6D7D] placeholder:text-[#C7D1DA] outline-none font-medium" placeholder="Confirm Password" /></div>
            <div className="md:col-span-2 pt-6"><button type="submit" disabled={isLoading} className="w-full bg-[#526a7e] hover:bg-[#435768] text-white rounded-2xl py-6 font-black text-lg transition-all shadow-[0_15px_30px_-10px_rgba(82,106,126,0.4)] active:scale-[0.98] disabled:opacity-50">{isLoading ? 'Creating...' : 'Register Account'}</button></div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const RedesignedAboutUs = ({ fadeInUp, staggerContainer }) => (
  <div className="relative min-h-screen font-sans">
    {/* Global Fixed Background */}
    <div 
      className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-[1.15]" 
      style={{ backgroundImage: "url('/about-hero-bg.jpg')" }} 
    />
    {/* Lightened Overlay for maximum image visibility */}
    <div className="fixed inset-0 z-10 bg-black/25 backdrop-blur-[0.5px]" />

    <div className="relative z-20">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto text-center space-y-10">
          <motion.h1 
            variants={fadeInUp} 
            className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Empowering <br />
            <span className="text-white">Communication</span><br />
            Global Scale
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp} 
            className="text-gray-200 text-xl md:text-3xl max-w-4xl mx-auto font-light leading-relaxed tracking-wide"
          >
            Our platform helps students improve <span className="text-white font-bold">Listening, Speaking, Reading, and Writing</span> using neural AI evaluation.
          </motion.p>
          

        </motion.div>
      </section>

      {/* 2. ABOUT OUR PLATFORM */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-24 shadow-2xl grid lg:grid-cols-2 gap-20 items-center overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-20 -mt-20" />
            
            <div className="relative z-10 space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 text-white rounded-full text-xs font-black tracking-[0.4em] uppercase border border-white/20">
                <Zap className="w-4 h-4" /> The LSRW Protocol
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase">
                Revolutionizing <br /> Mastery with AI
              </h2>
               <p className="text-gray-300 text-xl leading-relaxed font-light">
                LSRW is a state-of-the-art communication evaluation platform designed to bridge the gap between learning and professional mastery. 
                By combining advanced Natural Language Processing with cognitive science, we provide granular, actionable feedback.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                Our ecosystem is built on the philosophy that true communication is not just about vocabulary, but about the seamless integration of receptive (Listening and Reading) and productive (Speaking and Writing) skills. 
                We use proprietary neural models to simulate real-world interaction scenarios, ensuring that users are prepared for global professional environments.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                {[
                  { color: "green", text: "Real-time Analysis" },
                  { color: "blue", text: "Neural Grading" },
                  { color: "purple", text: "Global Standards" },
                  { color: "orange", text: "Personalized Insights" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-3.5 h-3.5 rounded-full bg-${item.color}-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]`} />
                    <span className="text-sm font-black text-gray-200 uppercase tracking-[0.2em]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-10 relative">
                <div className="absolute inset-0 bg-blue-400/5 blur-3xl rounded-full" />
                {[
                  { icon: "🎧", label: "Listening" },
                  { icon: "🎤", label: "Speaking" },
                  { icon: "📖", label: "Reading" },
                  { icon: "✍️", label: "Writing" }
                ].map((skill, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 1 : -1 }} className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] flex flex-col items-center gap-6 backdrop-blur-3xl shadow-xl transition-shadow hover:shadow-blue-500/10 h-full">
                      <span className="text-7xl">{skill.icon}</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">{skill.label}</span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* 2.5 METHODOLOGY CONTENT */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-32">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Diagnostic Mastery</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Every session begins with a deep-scan diagnostic that identifies hidden phoneme irregularities and structural grammar gaps often missed by traditional testing.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Cognitive Fluency</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                We measure the 'Latency of Thought'—how quickly a learner can process auditory input and generate a coherent, grammatically fluid response in real-time.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Global Benchmarking</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Our results are mapped directly to international standards, providing users with a definitive global ranking of their communicative competency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.6 THE LSRW JOURNEY */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-tighter">THE EVOLUTIONARY PATH</h2>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-left">
            {[
              { phase: "01. Analyze", desc: "Baseline assessment of all four communication quadrants using neural mapping." },
              { phase: "02. Adapt", desc: "Personalized content generation based on specific cognitive and linguistic weak points." },
              { phase: "03. Accelerate", desc: "Iterative feedback loops that reduce error rates and improve fluency speed." },
              { phase: "04. Peak", desc: "Certification-ready proficiency validated against global professional standards." }
            ].map((step, i) => (
              <div key={i} className="flex-1 space-y-4">
                <div className="text-blue-400 font-black text-xl">{step.phase}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-24">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="h-2 w-40 bg-white mx-auto rounded-full mb-12 shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">OUR MISSION</h2>
              <span className="text-white font-black text-xs tracking-[0.6em] uppercase">Forging the future of communication</span>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-20">
              {[
                  { icon: <Target className="w-12 h-12 text-white" />, title: "Precision", text: "Accurate, data-driven skill assessments at millisecond speeds." },
                  { icon: <Brain className="w-12 h-12 text-white" />, title: "Innovation", text: "Pushing the boundaries of neural networks in education." },
                  { icon: <Star className="w-12 h-12 text-white" />, title: "Confidence", text: "Empowering every student to speak with absolute authority." }
              ].map((m, i) => (
                  <div key={i} className="space-y-8 flex flex-col items-center group">
                      <div className="w-28 h-28 bg-white/10 rounded-[2.5rem] border border-white/20 flex items-center justify-center shadow-2xl transition-all group-hover:bg-white group-hover:border-white">
                          <div className="group-hover:text-black transition-colors">{m.icon}</div>
                      </div>
                      <div className="space-y-4">
                          <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{m.title}</h4>
                          <p className="text-gray-400 text-base leading-relaxed font-light">{m.text}</p>
                      </div>
                  </div>
              ))}
          </div>

          <p className="text-3xl md:text-5xl font-extralight text-blue-50 leading-tight italic border-t border-white/10 pt-24 tracking-tight max-w-5xl mx-auto">
            "To redefine how the world evaluates communication skills, making high-quality, professional feedback accessible to every learner."
          </p>
        </div>
      </section>

      {/* 4. CORE FEATURES */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32 space-y-8">
            <span className="text-white font-black text-xs tracking-[0.5em] uppercase">Core Capabilities</span>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">TECHNICAL SUITE</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Listening", icon: "🎧", lucide: <Headphones className="w-8 h-8" />, desc: "Deep comprehension analysis using neural audio processing and acoustic modeling." },
              { title: "Speaking", icon: "🎤", lucide: <Mic className="w-8 h-8" />, desc: "Real-time phoneme evaluation for native-level fluency, stress, and pronunciation." },
              { title: "Reading", icon: "📖", lucide: <BookOpen className="w-8 h-8" />, desc: "In-depth contextual understanding, inference tracking, and vocabulary diversity." },
              { title: "Writing", icon: "✍️", lucide: <PenTool className="w-8 h-8" />, desc: "Advanced semantic grammar, stylistic coherence, and structural assessment." }
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -20 }} className="bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 hover:border-blue-500/50 transition-all group h-full flex flex-col items-center text-center shadow-2xl">
                <div className="w-24 h-24 bg-white/10 text-white rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:bg-white group-hover:text-black transition-all shadow-xl">
                  {feature.lucide}
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{feature.icon}</span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE */}
      <section className="py-40 px-6 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white text-center mb-32 uppercase tracking-tighter">THE LSRW ADVANTAGE</h2>
            <div className="grid md:grid-cols-4 gap-10">
                {[
                    { title: "AI-Powered", text: "Unbiased, neural-network driven grading synchronized with global language standards." },
                    { title: "Real-time", text: "Instantaneous results and granular actionable insights for rapid skill elevation." },
                    { title: "Personalized", text: "Tailored neural reports that pivot your learning strategy toward core weaknesses." },
                    { title: "Skill Mastery", text: "A comprehensive structural roadmap to becoming a world-class communicator." }
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] hover:bg-white/10 transition-all border-l-4 border-l-white">
                        <div className="text-5xl font-black text-white/20 mb-10">0{i+1}</div>
                        <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{item.title}</h4>
                        <p className="text-gray-400 text-base leading-relaxed font-light">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 6. OUR VISION */}
      <section className="py-56 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
          
          <div className="max-w-5xl mx-auto text-center space-y-20 relative z-10">
              <motion.div whileInView={{ scale: [0.9, 1.1, 1] }} className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-12 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                  <Zap className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] uppercase">OUR VISION</h2>
              <p className="text-3xl md:text-4xl text-blue-100 font-extralight leading-relaxed max-w-4xl mx-auto tracking-tight">
                  To set the <span className="text-white font-bold">universal standard</span> for automated evaluation, enabling every linguistic identity to reach its full global profile.
              </p>
              
              <div className="pt-32 flex flex-wrap justify-center gap-24">
                  {[
                      { val: "10M+", label: "Users Targeted" },
                      { val: "50+", label: "Native Zones" },
                      { val: "99%", label: "Grader Accuracy" }
                  ].map((s, i) => (
                      <div key={i} className="text-center group">
                          <div className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter group-hover:text-white/80 transition-colors">{s.val}</div>
                          <div className="text-xs font-black text-white uppercase tracking-[0.6em] ml-4">{s.label}</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Design Polish: Bottom Spacing */}
      <div className="h-40" />
    </div>
  </div>
);

export default Landing;
