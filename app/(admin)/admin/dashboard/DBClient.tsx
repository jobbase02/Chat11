'use client';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Shield, LogOut, ShieldAlert, 
  AlertTriangle, CheckCircle2, Loader2, ChevronDown, ChevronUp, Bot, MailCheck, PowerOff, X
} from 'lucide-react';

export default function DashboardClient({ role = 'manager', name = 'Admin' }: { role?: string, name?: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Custom Toast & Confirm Modal States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void } | null>(null);
  
  // Safe role checking
  const safeRole = String(role || 'manager');
  const isSuperOrAdmin = safeRole === 'super_admin' || safeRole === 'admin';

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' }); 
      window.location.href = '/admin/auth'; // Hard redirect for cache clearing
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // Helper Functions for Toasts & Modals
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  };

  const executeConfirm = () => {
    if (confirmDialog?.onConfirm) confirmDialog.onConfirm();
    setConfirmDialog(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-[#FAFAFA] font-sans relative">
      
      {/* --- GLOBAL TOAST COMPONENT --- */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border text-sm font-medium ${
            toast.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* --- GLOBAL CONFIRM MODAL --- */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirm Action</h3>
            </div>
            <p className="text-[#888] text-sm mb-8 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-3 mt-auto">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#888] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeConfirm}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer shadow-lg shadow-white/10"
              >
                Yes, proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 1. SIDEBAR --- */}
      <aside className="w-64 border-r border-white/10 bg-[#0A0A0A] flex flex-col hidden md:flex shrink-0">
        <div className="h-[73px] border-b border-white/10 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <p className="text-xs font-bold text-[#444] uppercase tracking-widest mb-4 pl-3">Menu</p>
          
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-white/5 text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'clients' ? 'bg-white/5 text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" /> Manage Clients
          </button>

          {isSuperOrAdmin && (
            <button 
              onClick={() => setActiveTab('managers')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'managers' ? 'bg-white/5 text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
            >
              <Shield className={`w-4 h-4 ${activeTab === 'managers' ? 'text-purple-400' : ''}`} /> Manage Admins
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-3">
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Logged in as:</span>
            <p className="text-sm text-blue-400 capitalize font-medium truncate">{name}</p>
            <p className="text-[11px] text-[#888] capitalize">{safeRole.replace('_', ' ')}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* --- 2. MAIN CONTENT AREA (Dynamic Rendering) --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505]">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          
          {activeTab === 'overview' && <OverviewTab showToast={showToast} showConfirm={showConfirm} />}
          {activeTab === 'clients' && <ClientsTab showToast={showToast} showConfirm={showConfirm} />}
          {activeTab === 'managers' && <ManagersTab showToast={showToast} />}

        </div>
      </main>
      
    </div>
  );
}

/* ==========================================
   COMPONENT: OVERVIEW TAB
   ========================================== */
function OverviewTab({ showToast, showConfirm }: any) {
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, suspended: 0 });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setPendingUsers(data.pendingUsers);
      }
    } catch (err) { console.error("Failed to load dashboard data"); }
    setLoading(false);
  };

  const handleApprove = (userId: string) => {
    // Custom Confirmation Modal
    showConfirm('Are you sure you want to approve this bot and generate an API key?', async () => {
      setApprovingId(userId);
      try {
        const res = await fetch('/api/admin/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        
        if (data.success) {
          showToast('Successfully Approved!', 'success');
          fetchDashboardData();
        } else {
          showToast('Failed to approve', 'error');
        }
      } catch (err) { 
        showToast('Network error', 'error');
      }
      setApprovingId(null);
    });
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-[#888]">Monitor your platform's usage and pending requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Clients" value={stats.total} icon={Users} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard title="Pending Approvals" value={stats.pending} icon={AlertTriangle} color="text-yellow-400" bg="bg-yellow-500/10" highlight={stats.pending > 0} />
        <StatCard title="Active Bots" value={stats.active} icon={CheckCircle2} color="text-green-400" bg="bg-green-500/10" />
        <StatCard title="Suspended Accounts" value={stats.suspended} icon={ShieldAlert} color="text-red-400" bg="bg-red-500/10" />
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Action Required: Pending
          </h2>
          <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20">
            {stats.pending} Requests
          </span>
        </div>

        {pendingUsers.length > 0 ? (
          <div className="divide-y divide-white/5">
            {pendingUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{user.business_name}</h3>
                    <div className="text-sm text-[#888] flex items-center gap-3 mt-1">
                      <span>Bot: {user.bot_name}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                      className="text-sm font-medium text-[#888] hover:text-white flex items-center gap-1 transition-colors px-3 py-2 bg-white/5 rounded-lg cursor-pointer"
                    >
                      {expandedId === user.id ? <><ChevronUp className="w-4 h-4"/> Hide Context</> : <><ChevronDown className="w-4 h-4"/> View Context</>}
                    </button>
                    <button 
                      onClick={() => handleApprove(user.id)}
                      disabled={approvingId === user.id}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-500 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {approvingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Approve & Generate Key
                    </button>
                  </div>
                </div>
                {expandedId === user.id && (
                  <div className="mt-4 bg-[#050505] border border-white/10 p-4 rounded-xl text-sm text-[#A1A1AA] font-mono leading-relaxed max-h-60 overflow-y-auto">
                    {user.business_details}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <CheckCircle2 className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">You are all caught up!</h3>
            <p className="text-[#888]">No pending bot approvals at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   COMPONENT: CLIENTS TAB
   ========================================== */
function ClientsTab({ showToast, showConfirm }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error("Failed to load clients");
    }
    setLoading(false);
  };

  const handleToggleSuspend = (userId: string, type: 'bot' | 'account', currentState: boolean) => {
    const actionText = currentState ? 'Unsuspend' : 'Suspend';
    
    // Custom Confirmation Modal
    showConfirm(`Are you sure you want to ${actionText} this ${type}?`, async () => {
      setActionLoading(`${userId}-${type}`);
      try {
        const res = await fetch('/api/admin/clients/suspend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, type, isSuspended: !currentState })
        });
        const data = await res.json();
        
        if (data.success) {
          showToast(`${type} status updated successfully!`, 'success');
          fetchClients(); 
        } else {
          showToast(data.error || 'Failed to update', 'error');
        }
      } catch (err) {
        showToast('Network error occurred.', 'error');
      }
      setActionLoading(null);
    });
  };

  const filteredClients = clients.filter((client) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !client.is_bot_suspended && !client.is_account_suspended;
    if (filter === 'bot_suspended') return client.is_bot_suspended;
    if (filter === 'account_suspended') return client.is_account_suspended;
    if (filter === 'verified') return client.is_email_verified;
    return true;
  });

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-blue-400">Manage Clients</h1>
          <p className="text-[#888]">View and control access for all your approved clients.</p>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-2 flex flex-wrap gap-2 mb-6 shadow-lg">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Clients" count={clients.length} />
        <FilterButton active={filter === 'active'} onClick={() => setFilter('active')} label="Active" count={clients.filter(c => !c.is_bot_suspended && !c.is_account_suspended).length} />
        <FilterButton active={filter === 'bot_suspended'} onClick={() => setFilter('bot_suspended')} label="Bot Suspended" count={clients.filter(c => c.is_bot_suspended).length} />
        <FilterButton active={filter === 'account_suspended'} onClick={() => setFilter('account_suspended')} label="Account Suspended" count={clients.filter(c => c.is_account_suspended).length} />
        <FilterButton active={filter === 'verified'} onClick={() => setFilter('verified')} label="Email Verified" count={clients.filter(c => c.is_email_verified).length} />
      </div>

      {/* --- CLIENTS LIST --- */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {filteredClients.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-5 lg:p-6 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-lg">{client.business_name}</h3>
                    {client.is_email_verified ? (
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-blue-500/20"><MailCheck className="w-3 h-3"/> Verified</span>
                    ) : (
                      <span className="bg-gray-500/10 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-500/20">Unverified</span>
                    )}
                  </div>
                  <div className="text-sm text-[#888] flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-[#555]"/> {client.bot_name}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block"></span>
                    <span>{client.email}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block"></span>
                    <span className="text-xs">Joined: {new Date(client.approved_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge isSuspended={client.is_bot_suspended} type="Bot" />
                  <StatusBadge isSuspended={client.is_account_suspended} type="Account" />
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-4 border-t border-white/5 lg:border-none lg:pt-0">
                  <button 
                    onClick={() => handleToggleSuspend(client.id, 'bot', client.is_bot_suspended)}
                    disabled={actionLoading === `${client.id}-bot` || client.is_account_suspended}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer ${
                      client.is_bot_suspended ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                    }`}
                    title={client.is_account_suspended ? "Cannot modify bot while account is suspended" : ""}
                  >
                    {actionLoading === `${client.id}-bot` ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Bot className="w-3.5 h-3.5"/>}
                    {client.is_bot_suspended ? 'Unsuspend Bot' : 'Suspend Bot'}
                  </button>

                  <button 
                    onClick={() => handleToggleSuspend(client.id, 'account', client.is_account_suspended)}
                    disabled={actionLoading === `${client.id}-account`}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer ${
                      client.is_account_suspended ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    }`}
                  >
                    {actionLoading === `${client.id}-account` ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <PowerOff className="w-3.5 h-3.5"/>}
                    {client.is_account_suspended ? 'Reactivate Account' : 'Suspend Account'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No clients found</h3>
            <p className="text-[#888]">Try changing your filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}

// Sub-component for Filter Buttons
function FilterButton({ active, onClick, label, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
        active ? 'bg-white/10 text-white shadow-sm' : 'text-[#888] hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-blue-500 text-white' : 'bg-[#222] text-[#888]'}`}>
        {count}
      </span>
    </button>
  );
}

// Sub-component for Status Badges
function StatusBadge({ isSuspended, type }: { isSuspended: boolean, type: string }) {
  return (
    <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border text-xs font-bold ${
      isSuspended ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-green-500/5 border-green-500/20 text-green-400'
    }`}>
      <span className="text-[10px] uppercase tracking-widest text-[#666] mb-0.5">{type}</span>
      <span className="flex items-center gap-1">
        {isSuspended ? <ShieldAlert className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3"/>}
        {isSuspended ? 'Suspended' : 'Active'}
      </span>
    </div>
  );
}

/* ==========================================
   COMPONENT: MANAGERS TAB
   ========================================== */
function ManagersTab({ showToast }: any) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'manager'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // Keeping inline message for forms as it looks good contextually

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/managers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setFormData({ name: '', username: '', email: '', password: '', role: 'manager' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create admin' });
      }
    } catch (err) {
      showToast('Network error occurred.', 'error'); // Replaced generic error with toast
    }
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-purple-400">Manage Admins</h1>
        <p className="text-[#888]">Create and assign roles to your internal team members.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-[#111]">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-purple-400" /> Create New Admin
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          
          {message.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Username</label>
              <input 
                type="text" name="username" required
                value={formData.username} onChange={handleChange}
                placeholder="e.g. rahul_s"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                placeholder="e.g. rahul@chat11.com"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Secure Password</label>
              <input 
                type="password" name="password" required minLength={8}
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Assign Role</label>
              <select 
                name="role" required
                value={formData.role} onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm appearance-none cursor-pointer"
              >
                <option value="manager">Manager (Read/Write Clients)</option>
                <option value="admin">Admin (Manage Managers & Clients)</option>
                <option value="super_admin">Super Admin (Full Access)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px] cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ==========================================
   HELPER: STAT CARD
   ========================================== */
function StatCard({ title, value, icon: Icon, color, bg, highlight = false }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/10'} bg-[#111] relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <div>
        <p className="text-[#888] text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
}