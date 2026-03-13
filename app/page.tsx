import Link from 'next/link';
import { Terminal, Database, Sparkles, MessageSquare, ArrowRight, Code2 } from 'lucide-react';

export default function Chat11Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-[#FAFAFA] font-sans selection:bg-blue-500/30">
      
      {/* --- 1. FIXED NAVBAR (From Docs) --- */}
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
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </div>

          <Link href="/dashboard" className="bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-[13px] sm:text-[14px] font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shrink-0">
            Start Building <ArrowRight className="hidden sm:block w-4 h-4" />
          </Link>
        </nav>
      </header>

      {/* --- MAIN CONTENT (Padding top added to clear fixed navbar) --- */}
      <div className="flex-1 w-full pt-[73px]">
        
        {/* --- 2. HERO SECTION --- */}
        <main className="pt-16 md:pt-24 pb-16 px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#0A0A0A] text-[#A1A1AA] text-xs font-medium uppercase tracking-widest mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            AI Chatbots for Modern Websites
          </div>

          <h1 className="text-[48px] md:text-[80px] font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Your website needs an AI. <br className="hidden md:block" />
            <span className="text-[#666666]">We made it copy-paste simple.</span>
          </h1>

          <p className="text-[18px] md:text-[20px] text-[#888888] font-light max-w-2xl mx-auto leading-relaxed mb-10">
            chat11 ingests your FAQs, docs, and website content. In seconds, it generates a custom AI widget you can embed anywhere with one line of code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/dashboard" className="h-14 px-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition-colors">
              Deploy your bot for free
            </Link>
            <Link href="/docs" className="h-14 px-8 bg-[#0A0A0A] border border-white/10 text-white rounded-lg flex items-center justify-center font-medium text-lg hover:bg-[#111] transition-colors">
              Read Docs
            </Link>
          </div>
        </main>

        {/* --- 3. THE "AHA" MOMENT --- */}
        <section className="px-6 pb-24 max-w-[1200px] mx-auto">
          <div className="rounded-2xl bg-[#050505] border border-white/[0.08] p-8 md:p-12 overflow-hidden relative flex flex-col md:flex-row items-center gap-12">
            
            {/* Step 1: Knowledge Base */}
            <div className="flex-1 w-full space-y-4">
              <div className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-6">1. Add your data</div>
              <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-400" />
                <div className="text-sm text-white font-mono">https://yourwebsite.com/faqs</div>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl flex items-center gap-3">
                <Database className="w-5 h-5 text-purple-400" />
                <div className="text-sm text-white font-mono">product-catalog-2026.pdf</div>
              </div>
            </div>

            <ArrowRight className="hidden md:block w-8 h-8 text-[#333]" />

            {/* Step 2: The Bot is Ready */}
            <div className="flex-1 w-full">
               <div className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-6">2. Your Bot Answers Users</div>
               <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 relative shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                   <div className="w-8 h-8 rounded bg-white flex items-center justify-center"><MessageSquare className="w-4 h-4 text-black"/></div>
                   <div>
                     <div className="text-sm font-bold text-white">chat11 Assistant</div>
                     <div className="text-xs text-green-400">Online</div>
                   </div>
                 </div>
                 <div className="space-y-3 text-[13px]">
                   <div className="bg-[#111] border border-white/5 p-3 rounded-lg text-[#ccc] self-start w-[85%]">
                     Do you offer refunds on annual plans?
                   </div>
                   <div className="bg-white text-black p-3 rounded-lg self-end w-[85%] ml-auto font-medium">
                     Yes! According to our FAQ policy, you can request a full refund within the first 14 days of any annual subscription.
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </section>

        {/* --- 4. EXPLICIT FEATURES --- */}
        <section id="features" className="px-6 py-12 max-w-[1200px] mx-auto border-t border-white/[0.05] pt-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Everything you need. <br/><span className="text-[#666]">Nothing you don't.</span></h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Database}
              title="Train on anything"
              desc="Upload PDFs, paste plain text, or just give us your website URL. We instantly convert it into AI knowledge."
            />
            <FeatureCard 
              icon={Code2}
              title="One-Line Install"
              desc="No NPM packages or complex routing. Just copy a single <script> tag and paste it into your HTML."
            />
            <FeatureCard 
              icon={Terminal}
              title="Full Chat Logs"
              desc="See exactly what your users are asking. Read chat transcripts in real-time to improve your actual product."
            />
          </div>
        </section>

        {/* --- 5. THE CODE SNIPPET --- */}
        <section className="px-6 py-24 max-w-[1200px] mx-auto">
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-4">Ready in 2 minutes.</h3>
              <p className="text-[#888] text-lg mb-8">Once your bot is trained, embedding it is as simple as adding Google Analytics to your site.</p>
              <Link href="/dashboard" className="bg-white text-black px-6 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                Generate Your Key <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="w-full md:w-auto bg-[#000] border border-white/10 p-6 rounded-xl font-mono text-[13px] leading-loose flex-1 overflow-x-auto shadow-2xl">
              <span className="text-[#666]">{``}</span><br/>
              <span className="text-blue-400">&lt;script</span><br/>
              <span className="text-purple-400 ml-4">src=</span><span className="text-green-400">"https://chat11.cdn.elevenxsolutions.com/widget.js"</span><br/>
              <span className="text-purple-400 ml-4">data-bot-id=</span><span className="text-green-400">"c11_live_a8f92z"</span><br/>
              <span className="text-blue-400">&gt;&lt;/script&gt;</span>
            </div>
          </div>
        </section>
      </div>

      {/* --- 6. FOOTER (From Docs) --- */}
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

// Reusable Feature Card Component
function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-8 hover:bg-[#111] transition-colors">
      <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mb-6">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-[#888888] leading-relaxed text-[15px]">{desc}</p>
    </div>
  );
}