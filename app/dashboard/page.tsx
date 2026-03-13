'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Code2, Paintbrush, Database, CheckCircle2, Copy, LogOut, Loader2, Send, MessageSquare, Clock, X, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('knowledge');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [botName, setBotName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [themeColor, setThemeColor] = useState('#2563EB');
  const [status, setStatus] = useState('pending');
  const [apiKey, setApiKey] = useState('');
  const [keyRequested, setKeyRequested] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const DUMMY_CONTEXT = `Example Knowledge Context:
Welcome to Karigari Luxe. We are a premium brand specializing in handmade woolen clothes crafted with traditional techniques. 

Shipping Policy:
- We offer pan-India shipping.
- Delivery typically takes 5-7 business days.

Return Policy:
- Custom orders require a 50% advance payment and are non-refundable.

Contact:
For bulk orders, email us at bulk@karigariluxe.com.`;

  useEffect(() => {
    fetchUserData();
  }, []);

  // Helper to show custom toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Auto hide after 3 seconds
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      const json = await res.json();
      
      if (json.success) {
        setBotName(json.data.bot_name || '');
        setBusinessName(json.data.business_name || '');
        setBusinessDetails(json.data.business_details === 'Pending setup...' ? '' : json.data.business_details);
        setThemeColor(json.data.theme_color || '#2563EB');
        setStatus(json.data.status || 'pending');
        setApiKey(json.data.bot_api_key || '');
        setKeyRequested(json.data.key_requested || false);
      } else {
        if (res.status === 401) window.location.href = '/auth';
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_name: botName,
          business_details: businessDetails || 'Pending setup...',
          theme_color: themeColor
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Data saved successfully!', 'success');
      } else {
        showToast('Failed to save data.', 'error');
      }
    } catch (err) {
      showToast('Network error while saving.', 'error');
    }
    setSaving(false);
  };

  const handleRequestKey = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REQUEST_KEY' })
      });
      const json = await res.json();
      if (json.success) {
        setKeyRequested(true);
        setStatus('reviewing');
        showToast('Request submitted for review.', 'success');
      } else {
        showToast('Failed to request key.', 'error');
      }
    } catch (err) {
      showToast('Network error while requesting key.', 'error');
    }
    setSaving(false);
  };

  const handleCopy = () => {
    const keyToUse = status === 'approved' && apiKey ? apiKey : 'YOUR_API_KEY_WILL_APPEAR_HERE';
    const script = `<script src="https://chat11.cdn.elevenxsolutions.com/widget.js" data-bot-id="${keyToUse}" async></script>`;
    navigator.clipboard.writeText(script);
    setIsCopied(true);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('chat11_session');
      window.location.href = '/auth';
    } catch (err) {
      showToast('Logout failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] font-sans relative">
      
      {/* --- CUSTOM TOAST COMPONENT --- */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border text-sm font-medium ${
            toast.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="border-b border-white/[0.05] bg-[#050505] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="font-bold text-black text-sm">c11</span>
          </div>
          <span className="font-bold tracking-tight hidden sm:block">Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-[#888]">{businessName}</span>
          <button onClick={handleLogout} className="text-[#666] hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto py-8 px-4 sm:px-6 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <MenuButton active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} icon={Database} label="Knowledge Base" />
          <MenuButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon={Paintbrush} label="Appearance" />
          <MenuButton active={activeTab === 'integration'} onClick={() => setActiveTab('integration')} icon={Code2} label="Integration" />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#0A0A0A] border border-white/[0.05] rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* ============================== */}
          {/* TAB 1: KNOWLEDGE BASE */}
          {/* ============================== */}
          {activeTab === 'knowledge' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Train your AI</h2>
                  <p className="text-[#888] text-sm">Paste your business info, FAQs, and policies here.</p>
                </div>
                {/* Status Badge */}
                <div className={`self-start px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2
                  ${status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    keyRequested ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  {keyRequested && status !== 'approved' && <Clock className="w-3 h-3" />}
                  {status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                  Status: {status === 'approved' ? 'Approved' : keyRequested ? 'Reviewing' : 'Pending'}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Bot Name</label>
                  <input 
                    type="text" 
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider">Business Knowledge Context</label>
                    {businessDetails === '' && <span className="text-[10px] text-blue-400 font-mono">Showing Example</span>}
                  </div>
                  <textarea 
                    rows={14}
                    value={businessDetails}
                    onChange={(e) => setBusinessDetails(e.target.value)}
                    placeholder={DUMMY_CONTEXT}
                    className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm leading-relaxed resize-y font-mono placeholder:text-[#555]"
                  />
                </div>
                <button onClick={handleSave} disabled={saving} className="bg-white text-black px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Train Model'}
                </button>
              </div>
            </div>
          )}

          {/* ============================== */}
          {/* TAB 2: APPEARANCE */}
          {/* ============================== */}
          {activeTab === 'appearance' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold mb-2">Widget Appearance</h2>
              <p className="text-[#888] text-sm mb-8 border-b border-white/5 pb-6">Customize how your bot looks on your website.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-3">Primary Brand Color</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-none p-0" 
                    />
                    <input 
                      type="text" 
                      value={themeColor.toUpperCase()}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="bg-[#111] border border-white/10 rounded-lg p-3 text-white w-32 text-sm font-mono" 
                    />
                  </div>
                </div>
                
                {/* Chat Preview */}
                <div className="p-8 border border-white/10 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#050505] flex flex-col items-center gap-8 relative overflow-hidden">
                   <div className="w-[320px] border border-white/20 rounded-2xl overflow-hidden bg-white shadow-2xl relative z-10 flex flex-col">
                     <div style={{ backgroundColor: themeColor }} className="p-4 text-white font-medium text-sm flex items-center gap-2 transition-colors">
                       <Bot className="w-5 h-5" /> {botName || 'Assistant'}
                     </div>
                     <div className="p-5 bg-[#f8f9fa] h-48 flex flex-col gap-3 overflow-y-auto">
                       <div className="flex gap-2">
                         <div style={{ backgroundColor: themeColor }} className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1">
                           <Bot className="w-3.5 h-3.5 text-white" />
                         </div>
                         <div className="bg-gray-200 text-black p-3 rounded-xl rounded-tl-sm text-[13px] self-start max-w-[85%]">
                           Hi there! How can I help you today?
                         </div>
                       </div>
                       <div style={{ backgroundColor: themeColor }} className="text-white p-3 rounded-xl rounded-tr-sm text-[13px] self-end max-w-[85%] transition-colors">
                         I need help tracking my order.
                       </div>
                     </div>
                     <div className="bg-white p-3 border-t border-gray-100 flex items-center gap-2">
                       <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400">Type a message...</div>
                       <div style={{ backgroundColor: themeColor }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                         <Send className="w-3.5 h-3.5 text-white -ml-0.5" />
                       </div>
                     </div>
                   </div>

                   {/* Floating Icon Preview */}
                   <div className="w-full flex justify-end px-4 border-t border-white/10 pt-6 mt-2 relative z-10">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold">Floating Launcher</span>
                       <div style={{ backgroundColor: themeColor, boxShadow: `0 4px 20px ${themeColor}40` }} className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
                         <MessageSquare className="w-6 h-6 text-white" />
                       </div>
                     </div>
                   </div>
                </div>

                <button onClick={handleSave} disabled={saving} className="bg-white text-black px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Appearance'}
                </button>
              </div>
            </div>
          )}

          {/* ============================== */}
          {/* TAB 3: INTEGRATION */}
          {/* ============================== */}
          {activeTab === 'integration' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold mb-2">Deploy your Bot</h2>
              <p className="text-[#888] text-sm mb-8 border-b border-white/5 pb-6">Integrate chat11 into your website in seconds.</p>
              
              <div className="space-y-8">
                
                {/* Step 1: Request Key Logic */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#222] text-xs font-bold flex items-center justify-center text-[#888]">1</div>
                    <h3 className="font-bold text-white">Generate Bot API Key</h3>
                  </div>
                  
                  {/* State 1: NOT REQUESTED YET */}
                  {!keyRequested && status !== 'approved' && (
                    <div className="ml-9">
                      <p className="text-sm text-[#888] mb-4">Before generating a key, ensure your Knowledge Base is filled out. Our team will review it to activate your agent.</p>
                      <button 
                        onClick={handleRequestKey} 
                        disabled={saving || !businessDetails} 
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : ''} Request Bot Key
                      </button>
                    </div>
                  )}

                  {/* State 2: REQUESTED BUT PENDING APPROVAL */}
                  {keyRequested && status !== 'approved' && (
                    <div className="ml-9 flex items-center gap-3 text-sm text-blue-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 w-fit">
                      <Clock className="w-4 h-4" />
                      Request submitted. We are reviewing your context.
                    </div>
                  )}

                  {/* State 3: APPROVED */}
                  {status === 'approved' && apiKey && (
                    <div className="ml-9 flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20 w-fit">
                        <CheckCircle2 className="w-4 h-4" />
                        Bot Verified & Active
                      </div>
                      <p className="text-sm text-[#888] mt-2">Your unique Bot Key: <span className="font-mono text-white tracking-widest bg-[#222] px-2 py-1 rounded ml-1">{apiKey}</span></p>
                    </div>
                  )}
                </div>

                {/* Step 2: The Script */}
                <div className={`bg-[#050505] border border-white/10 rounded-xl p-6 transition-opacity ${status !== 'approved' ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#222] text-xs font-bold flex items-center justify-center text-[#888]">2</div>
                    <h3 className="font-bold text-white">Embed Script</h3>
                  </div>
                  
                  <div className="ml-9">
                    <p className="text-sm text-[#888] mb-4">Copy and paste this snippet right before the closing <code className="bg-[#222] px-1 rounded text-white">&lt;/body&gt;</code> tag of your website.</p>
                    
                    <div className="bg-[#111] rounded-lg border border-white/5 relative group">
                      <button onClick={handleCopy} disabled={status !== 'approved'} className="absolute top-3 right-3 text-[#888] hover:text-white transition-colors bg-[#222] p-1.5 rounded cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <pre className="text-[13px] font-mono text-blue-400 p-4 overflow-x-auto">
                        <code>
                          <span className="text-[#666]">{``}</span>{'\n'}
                          &lt;script{'\n'}
                          {'  '}src=<span className="text-green-400">"https://chat11.cdn.elevenxsolutions.com/widget.js"</span>{'\n'}
                          {'  '}data-bot-id=<span className="text-green-400">"{status === 'approved' && apiKey ? apiKey : 'YOUR_KEY_WILL_APPEAR_HERE'}"</span>{'\n'}
                          {'  '}async{'\n'}
                          &gt;&lt;/script&gt;
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Sidebar Menu Button Component
function MenuButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
        active ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-[#888] hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}