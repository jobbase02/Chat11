'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Mail, Lock, KeyRound, ArrowLeft, 
  ShieldCheck, Check, Eye, EyeOff 
} from 'lucide-react';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'SIGNUP_OTP' | 'FORGOT_EMAIL' | 'FORGOT_OTP' | 'RESET_PASSWORD';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [humanAnswer, setHumanAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const clearMessages = () => { setError(''); setSuccessMsg(''); };

  // --- GENERATE MATH PROBLEM ---
  useEffect(() => {
    if (mode === 'SIGNUP') {
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setHumanAnswer('');
      setIsHuman(false);
    }
  }, [mode]);

  // --- RESEND TIMER ---
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // --- 1. SIGNUP SUBMIT ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) return setError('All fields are required.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!isHuman || parseInt(humanAnswer) !== num1 + num2) return setError('Please complete the human verification correctly.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (data.success) {
        setMode('SIGNUP_OTP');
        setTimeLeft(60);
        setSuccessMsg('Code sent to your email.');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  // --- 2. VERIFY SIGNUP OTP ---
  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (otp.length !== 5) return setError('OTP must be 5 digits.');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, action: 'VERIFY' })
      });
      const data = await res.json();

      if (data.success) {
        // SET LOCAL STORAGE SESSION
        localStorage.setItem('chat11_session', JSON.stringify({
          email,
          isLoggedIn: true,
          timestamp: Date.now()
        }));
        
        setSuccessMsg('Verification successful! Redirecting to dashboard...');
        
        // Use a short delay to ensure state and localStorage are completely flushed
        setTimeout(() => {
          try {
            router.push('/dashboard');
          } catch (e) {
            // Fallback if Next.js router fails
            window.location.href = '/dashboard';
          }
        }, 500);
        
        return; // CRITICAL: Do not set loading false here. Keep the spinner active.
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Verification failed.');
    }
    setLoading(false);
  };

  // --- 3. LOGIN SUBMIT ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email || !password) return setError('Email and password are required.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        // SET LOCAL STORAGE SESSION
        localStorage.setItem('chat11_session', JSON.stringify({
          email,
          isLoggedIn: true,
          timestamp: Date.now()
        }));
        
        setSuccessMsg('Login successful! Redirecting to dashboard...');
        
        // Use a short delay to ensure state and localStorage are completely flushed
        setTimeout(() => {
          try {
             router.push('/dashboard');
          } catch (e) {
             // Fallback if Next.js router fails
             window.location.href = '/dashboard';
          }
        }, 500);
        
        return; // CRITICAL: Do not set loading false here. Keep the spinner active.
      } else {
        // Handle Unverified Email specifically
        if (data.error && data.error.includes('verify your email')) {
          setError('Email not verified. Please check your inbox or sign up again to resend OTP.');
        } else {
          setError(data.error);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  // --- 4. FORGOT PASSWORD (SEND OTP) ---
  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email) return setError('Please enter your email.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        setMode('FORGOT_OTP');
        setOtp('');
        setSuccessMsg('Recovery code sent to your email.');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to send reset code.');
    }
    setLoading(false);
  };

  // --- 5. VERIFY OTP & RESET PASSWORD ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    if (otp.length !== 5) return setError('Enter the 5-digit code.');
    if (!newPassword || newPassword !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Password reset successful! Please log in.');
        setMode('LOGIN');
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to reset password.');
    }
    setLoading(false);
  };

  // --- RESEND OTP HELPER ---
  const handleResend = async () => {
    if (timeLeft > 0) return;
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'RESEND' })
      });
      const data = await res.json();
      if (data.success) {
        setTimeLeft(60);
        setSuccessMsg('New code sent to your email.');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to resend code.');
    }
    setLoading(false);
  };

  // --- UI SWITCHER HELPERS ---
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-[#FAFAFA] selection:bg-blue-500/30">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center mx-auto mb-4">
            <span className="font-bold text-black text-xs">c11</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {mode === 'LOGIN' && 'Welcome back'}
            {mode === 'SIGNUP' && 'Create an account'}
            {(mode === 'SIGNUP_OTP' || mode === 'FORGOT_OTP') && 'Check your email'}
            {mode === 'FORGOT_EMAIL' && 'Reset Password'}
            {mode === 'RESET_PASSWORD' && 'Set New Password'}
          </h1>
          <p className="text-[#888] text-sm">
            {mode === 'LOGIN' && 'Log in to manage your AI agent.'}
            {mode === 'SIGNUP' && 'Start building your autonomous AI widget.'}
            {mode === 'FORGOT_EMAIL' && 'Enter your email to receive a recovery code.'}
            {(mode === 'SIGNUP_OTP' || mode === 'FORGOT_OTP') && `We sent a 5-digit code to ${email}`}
            {mode === 'RESET_PASSWORD' && 'Please create a strong new password.'}
          </p>
        </div>

        {/* Messaging */}
        {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center relative z-10">{error}</div>}
        {successMsg && <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg text-center relative z-10">{successMsg}</div>}

        {/* ------------------------------------------- */}
        {/* 1. LOGIN FORM */}
        {/* ------------------------------------------- */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#666] uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => switchMode('FORGOT_EMAIL')} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input 
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-white text-black mt-2 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
            </button>
            
            <p className="text-center text-xs text-[#666] mt-4">
              Don't have an account? <span onClick={() => switchMode('SIGNUP')} className="text-blue-400 hover:underline cursor-pointer">Sign up</span>
            </p>
          </form>
        )}

        {/* ------------------------------------------- */}
        {/* 2. SIGNUP FORM */}
        {/* ------------------------------------------- */}
        {mode === 'SIGNUP' && (
          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Business / Full Name</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Email Address</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-3 pr-8 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Confirm</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-3 pr-8 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Checkbox Human Verification */}
            <div className="bg-[#111] border border-white/5 p-4 rounded-lg mt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" required checked={isHuman} onChange={(e) => setIsHuman(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-[#555] rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                  />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <div className="flex items-center gap-2 text-sm text-[#888] group-hover:text-[#ccc] transition-colors select-none">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> I am human
                </div>
              </label>
              {isHuman && (
                <div className="flex items-center justify-between border-t border-white/5 pt-3 animate-in fade-in">
                  <span className="text-xs text-[#666]">What is {num1} + {num2}?</span>
                  <input 
                    type="number" required value={humanAnswer} onChange={(e) => setHumanAnswer(e.target.value)}
                    className="w-16 bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white text-center text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <button disabled={loading} className="w-full bg-white text-black mt-4 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
            <p className="text-center text-xs text-[#666] mt-4">
              Already have an account? <span onClick={() => switchMode('LOGIN')} className="text-blue-400 hover:underline cursor-pointer">Log in</span>
            </p>
          </form>
        )}

        {/* ------------------------------------------- */}
        {/* 3. SIGNUP OTP FORM */}
        {/* ------------------------------------------- */}
        {mode === 'SIGNUP_OTP' && (
          <form onSubmit={handleVerifySignup} className="space-y-6 relative z-10">
            <div>
              <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block text-center">Enter 5-Digit Code</label>
              <input 
                type="text" maxLength={5} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-blue-500 text-2xl tracking-[1em] text-center font-mono"
              />
            </div>
            <button disabled={loading || otp.length !== 5} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-500 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Activate'}
            </button>
            <div className="text-center space-y-2 flex flex-col items-center">
              <button type="button" onClick={handleResend} disabled={timeLeft > 0 || loading} className="text-sm text-[#888] hover:text-white disabled:opacity-50 disabled:hover:text-[#888] transition-colors cursor-pointer">
                {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Didn't receive a code? Resend"}
              </button>
              <button type="button" onClick={() => switchMode('SIGNUP')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                 <ArrowLeft className="w-3 h-3"/> Change Email
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------- */}
        {/* 4. FORGOT EMAIL FORM */}
        {/* ------------------------------------------- */}
        {mode === 'FORGOT_EMAIL' && (
          <form onSubmit={handleForgotEmail} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Registered Email</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-500 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Code'}
            </button>
            <button type="button" onClick={() => switchMode('LOGIN')} className="w-full text-[#888] text-sm flex items-center justify-center gap-2 hover:text-white mt-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </form>
        )}

        {/* ------------------------------------------- */}
        {/* 5. FORGOT OTP & 6. RESET PASSWORD FORM */}
        {/* ------------------------------------------- */}
        {(mode === 'FORGOT_OTP' || mode === 'RESET_PASSWORD') && (
          <form onSubmit={handleResetPassword} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block text-center">Enter 5-Digit Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input 
                  type="text" maxLength={5} required value={otp} 
                  onChange={(e) => { 
                    setOtp(e.target.value.replace(/\D/g, '')); 
                    if(e.target.value.length === 5 && mode === 'FORGOT_OTP') setMode('RESET_PASSWORD'); 
                  }}
                  className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xl tracking-[0.5em] text-center font-mono"
                />
              </div>
            </div>

            {mode === 'RESET_PASSWORD' && (
              <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full bg-[#111] border border-white/10 rounded-lg pl-3 pr-10 py-3 text-white text-sm focus:outline-none focus:border-blue-500" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2 block">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full bg-[#111] border border-white/10 rounded-lg pl-3 pr-10 py-3 text-white text-sm focus:outline-none focus:border-blue-500" 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-500 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
                </button>
              </div>
            )}
            
            {mode === 'FORGOT_OTP' && (
              <div className="text-center space-y-2 flex flex-col items-center">
                <button type="button" onClick={handleResend} disabled={timeLeft > 0 || loading} className="text-sm text-[#888] hover:text-white disabled:opacity-50 disabled:hover:text-[#888] transition-colors cursor-pointer mt-2">
                  {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Didn't receive a code? Resend"}
                </button>
                <button type="button" onClick={() => switchMode('FORGOT_EMAIL')} className="w-full text-[#888] text-sm flex items-center justify-center gap-2 hover:text-white mt-4 cursor-pointer">
                  <ArrowLeft className="w-4 h-4" /> Change Email
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}