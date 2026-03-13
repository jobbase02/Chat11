import Link from 'next/link';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* --- 1. FIXED NAVBAR --- */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/[0.05]">
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 max-w-[1200px] mx-auto">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded flex items-center justify-center shrink-0">
              <span className="font-bold text-black text-[12px] sm:text-sm">c11</span>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">chat11</span>
          </Link>
          
          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8 text-[14px] text-[#A1A1AA]">
            <Link href="/pricing" className="text-white font-medium transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </div>

          <Link href="/dashboard" className="bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-[13px] sm:text-[14px] font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shrink-0">
            Start Building <ArrowRight className="hidden sm:block w-4 h-4" />
          </Link>
        </nav>
      </div>

      {/* --- 2. HEADER --- */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <h1 className="text-[40px] md:text-[64px] font-bold tracking-tight leading-[1.05] mb-6">
            Built for scale.
          </h1>
          <p className="text-[16px] md:text-[20px] text-[#888888] font-light leading-relaxed">
            Get unlimited access to our core AI engine, custom training, and simple integration. Custom built for businesses that demand high performance.
          </p>
        </div>

        {/* --- 3. SINGLE PRICING CARD --- */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-b from-[#111827] to-[#0A0A0A] border border-blue-500/30 rounded-2xl p-8 md:p-12 relative flex flex-col shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Enterprise Grade
            </div>
            
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-3">Custom Deployment</h3>
              <p className="text-[#888] text-base">Tailored infrastructure and dedicated support for your growing traffic.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">Core Features</p>
                <ul className="space-y-4 text-sm text-[#A1A1AA]">
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-white font-medium">Unlimited AI Responses</span>
                  </li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Unlimited Custom Bots</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Text & PDF Knowledge Base</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">Premium Perks</p>
                <ul className="space-y-4 text-sm text-[#A1A1AA]">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Remove "chat11" Branding</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Advanced Analytics & Logs</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> 24/7 Dedicated Support</li>
                </ul>
              </div>
            </div>

            <Link href="mailto:sales@cdn.elevenxsolutions.com" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* --- 4. FAQ SECTION --- */}
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">What counts as an "AI Response"?</h4>
              <p className="text-[#888] text-sm leading-relaxed">Every time a user asks a question in your chat widget and the AI generates an answer, it counts as one response. Greeting messages do not count towards your quota.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">How long does custom deployment take?</h4>
              <p className="text-[#888] text-sm leading-relaxed">Once you contact our sales team and provide your initial knowledge base, we can have your custom, white-labeled widget ready for production within 24-48 hours.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Can I update my bot's knowledge later?</h4>
              <p className="text-[#888] text-sm leading-relaxed">Yes, you have full access to your dashboard to update text, upload new PDFs, or change the widget's appearance at any time. Changes reflect instantly.</p>
            </div>
          </div>
        </div>
      </main>

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