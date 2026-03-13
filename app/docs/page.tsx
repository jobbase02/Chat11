'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Code2, Database, Paintbrush, 
  ShieldCheck, TerminalSquare, ArrowRight, 
  CheckCircle2, FileText, FileBadge, Globe
} from 'lucide-react';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Rock-solid Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], div[id="introduction"]');
      let currentSection = 'introduction';

      sections.forEach((section) => {
        // 120px offset for the fixed navbar
        const sectionTop = (section as HTMLElement).offsetTop - 120; 
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id') || 'introduction';
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    // Run once on mount to set initial state
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for active link styles
  const getLinkStyle = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    return `flex items-center gap-2 transition-all duration-300 border-l-2 pl-3 py-1 ${
      isActive 
        ? 'text-white border-blue-500 font-medium' 
        : 'text-[#888] border-transparent hover:text-[#ccc]'
    }`;
  };

  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] font-sans selection:bg-blue-500/30 flex flex-col scroll-smooth">
      
      {/* --- 1. FIXED NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/[0.05] h-[73px] flex items-center">
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 max-w-[1200px] mx-auto">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded flex items-center justify-center shrink-0">
              <span className="font-bold text-black text-[12px] sm:text-sm">c11</span>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">chat11</span>
          </Link>
          
          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8 text-[14px] text-[#A1A1AA]">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="text-white transition-colors">Docs</Link>
          </div>

          <Link href="/dashboard" className="bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-[13px] sm:text-[14px] font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shrink-0">
            Start Building <ArrowRight className="hidden sm:block w-4 h-4" />
          </Link>
        </nav>
      </header>

      {/* --- MAIN WRAPPER (Padding top to account for fixed navbar) --- */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full flex pt-[73px]">
        
        {/* --- 2. FIXED DESKTOP SIDEBAR (Hidden on mobile) --- */}
        <aside className="hidden lg:block w-64 border-r border-white/[0.05] sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar shrink-0 py-8 pr-6">
          <div className="mb-8">
            <h4 className="text-xs font-bold text-[#444] uppercase tracking-widest mb-4 pl-3">Getting Started</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a href="#introduction" className={getLinkStyle('introduction')}>
                  <BookOpen className={`w-4 h-4 ${activeSection === 'introduction' ? 'text-blue-400' : ''}`}/> Introduction
                </a>
              </li>
              <li>
                <a href="#account-setup" className={getLinkStyle('account-setup')}>
                  1. Account Setup
                </a>
              </li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h4 className="text-xs font-bold text-[#444] uppercase tracking-widest mb-4 pl-3">Configuration</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a href="#knowledge-base" className={getLinkStyle('knowledge-base')}>
                  <Database className={`w-4 h-4 ${activeSection === 'knowledge-base' ? 'text-white' : ''}`}/> 2. Training Data
                </a>
              </li>
              <li>
                <a href="#appearance" className={getLinkStyle('appearance')}>
                  <Paintbrush className={`w-4 h-4 ${activeSection === 'appearance' ? 'text-white' : ''}`}/> 3. Appearance
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="text-xs font-bold text-[#444] uppercase tracking-widest mb-4 pl-3">Deployment</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a href="#approval" className={getLinkStyle('approval')}>
                  <ShieldCheck className={`w-4 h-4 ${activeSection === 'approval' ? 'text-white' : ''}`}/> 4. Verification
                </a>
              </li>
              <li>
                <a href="#integration" className={getLinkStyle('integration')}>
                  <Code2 className={`w-4 h-4 ${activeSection === 'integration' ? 'text-white' : ''}`}/> 5. Integration
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* --- 3. MAIN CONTENT AREA --- */}
        <main className="flex-1 py-8 sm:py-12 px-4 sm:px-8 lg:px-16 w-full overflow-hidden">
          
          {/* Header */}
          <div id="introduction" className="mb-12 sm:mb-16 scroll-mt-[100px]">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold tracking-tight leading-tight mb-4">Quick Start Guide</h1>
            <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#888] leading-relaxed">
              Welcome to the chat11 documentation. This guide will walk you through the entire process of setting up your account, training your custom AI model, and deploying it to your production website.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            
            {/* Step 1 */}
            <section id="account-setup" className="scroll-mt-[100px]">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#111] border border-white/10 flex items-center justify-center text-sm font-bold text-[#888] shrink-0">1</div>
                <h2 className="text-[20px] sm:text-2xl font-bold">Account & Business Setup</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed mb-6 text-[14px] sm:text-[15px] lg:text-base">
                To begin, navigate to the Dashboard and create an account. You will be prompted to enter basic details about your business. This foundational data helps the AI understand your industry context before deep training begins.
              </p>
              <ul className="space-y-3 text-[#888] text-[13px] sm:text-[14px] lg:text-[15px] bg-[#0A0A0A] border border-white/5 p-4 sm:p-5 lg:p-6 rounded-xl">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#333] shrink-0" /> Register using email and password.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#333] shrink-0" /> Input your Company Name and core operational industry.</li>
              </ul>
            </section>

            {/* Step 2 */}
            <section id="knowledge-base" className="scroll-mt-[100px]">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#111] border border-white/10 flex items-center justify-center text-sm font-bold text-[#888] shrink-0">2</div>
                <h2 className="text-[20px] sm:text-2xl font-bold">Training Your AI</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed mb-6 text-[14px] sm:text-[15px] lg:text-base">
                The intelligence of your chatbot depends entirely on the data you provide. In the "Knowledge Base" tab, you can upload your business context. 
                <span className="block mt-2 text-white font-medium">Currently supported formats:</span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                <div className="bg-[#050505] border border-white/10 p-4 rounded-xl flex sm:flex-col items-center sm:justify-center text-center gap-3 sm:gap-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium">Plain Text</span>
                </div>
                <div className="bg-[#050505] border border-white/10 p-4 rounded-xl flex sm:flex-col items-center sm:justify-center text-center gap-3 sm:gap-2">
                  <FileBadge className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0" />
                  <span className="text-sm font-medium">PDF Documents</span>
                </div>
                <div className="bg-[#050505] border border-white/10 p-4 rounded-xl flex sm:flex-col items-center sm:justify-center text-center gap-3 sm:gap-2 opacity-50">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[#666] shrink-0" />
                  <div className="text-left sm:text-center">
                    <span className="text-sm font-medium text-[#888] block">URL Scraping</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#666]">Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl w-full">
                <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex items-center justify-between text-[11px] sm:text-xs font-mono text-[#666]">
                  <span>Example: Plain Text Training Data</span>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                  <div className="font-mono text-[12px] sm:text-[13px] text-[#A1A1AA] leading-relaxed border-l-2 border-blue-500 pl-4 bg-white/[0.02] py-2 min-w-[280px]">
                    "Welcome to Karigari Luxe. We are a premium brand specializing in handmade woolen clothes crafted with traditional techniques. Our winter collection includes sweaters, scarves, and beanies. We offer pan-India shipping which typically takes 5-7 business days. Custom orders require a 50% advance payment and are non-refundable..."
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section id="appearance" className="scroll-mt-[100px]">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#111] border border-white/10 flex items-center justify-center text-sm font-bold text-[#888] shrink-0">3</div>
                <h2 className="text-[20px] sm:text-2xl font-bold">Customizing Appearance</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed text-[14px] sm:text-[15px] lg:text-base">
                Your chatbot should feel like a native extension of your brand. Navigate to the "Appearance" tab to select your primary brand color using a HEX code. This color will be applied to the chat header, user message bubbles, and the floating launcher icon.
              </p>
            </section>

            {/* Step 4 */}
            <section id="approval" className="scroll-mt-[100px]">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#111] border border-white/10 flex items-center justify-center text-sm font-bold text-[#888] shrink-0">4</div>
                <h2 className="text-[20px] sm:text-2xl font-bold">Verification & Approval</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed mb-6 text-[14px] sm:text-[15px] lg:text-base">
                Once you submit your data, your bot enters the <code className="bg-[#111] px-1.5 py-0.5 rounded text-white">Pending</code> state. To maintain high service quality and prevent abuse, our system runs a quick verification on your submitted context.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 shrink-0 sm:mt-1" />
                <p className="text-[13px] sm:text-[14px] text-blue-100/80 leading-relaxed">
                  Upon approval, a highly secure, unique <strong className="text-white">Bot API Key</strong> is generated exclusively for your account. You will receive instructions in your dashboard immediately.
                </p>
              </div>
            </section>

            {/* Step 5 */}
            <section id="integration" className="scroll-mt-[100px]">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#111] border border-white/10 flex items-center justify-center text-sm font-bold text-[#888] shrink-0">5</div>
                <h2 className="text-[20px] sm:text-2xl font-bold">Widget Integration</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed mb-6 text-[14px] sm:text-[15px] lg:text-base">
                After approval, you can deploy the chatbot to your live environment. Copy the script tag from your dashboard and paste it right before the closing <code className="text-white bg-[#111] px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag of your website.
              </p>
              
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl w-full">
                <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2 sm:mr-4 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono text-[#888] truncate">index.html</span>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                  <pre className="font-mono text-[11px] sm:text-[13px] leading-loose min-w-[300px]">
                    <code className="text-[#666]">
                      &lt;!-- Include this in your HTML --&gt;{'\n'}
                    </code>
                    <code className="text-blue-400">
                      &lt;script{'\n'}
                      <span className="text-purple-400 ml-2 sm:ml-4">src</span>=<span className="text-green-400">"https://chat11.cdn.elevenxsolutions.com/widget.js"</span>{'\n'}
                      <span className="text-purple-400 ml-2 sm:ml-4">data-bot-id</span>=<span className="text-green-400">"YOUR_APPROVED_KEY"</span>{'\n'}
                      <span className="text-purple-400 ml-2 sm:ml-4">async</span>{'\n'}
                      &gt;&lt;/script&gt;
                    </code>
                  </pre>
                </div>
              </div>
              <p className="text-[#888] text-[13px] sm:text-[14px] mt-6 flex items-center gap-2">
                <TerminalSquare className="w-4 h-4 text-[#555] shrink-0"/> That's it. Your autonomous agent is now live.
              </p>
            </section>

          </div>

        </main>
      </div>
          {/* --- 5. FOOTER --- */}
      <footer className="border-t border-white/[0.05] py-12 px-4 sm:px-6 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#666]">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
              <span className="font-bold text-black text-[10px]">c11</span>
            </div>
            chat11 © 2026
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}