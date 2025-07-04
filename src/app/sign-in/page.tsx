"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListTodoIcon, User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemoCredentials = () => {
    setUsername('example_user');
    setPassword('User123');
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading('Signing in...');
      const res = await fetch('https://ai-task-management-backend.vercel.app/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign in failed');
        toast.error(data.error || 'Sign in failed', { id: toastId });
      } else {
        localStorage.setItem('token', data.token);
        toast.success('Signed in successfully!', { id: toastId });
        router.push('/dashboard');
      }
    } catch {
      setError('Sign in failed. Please try again.');
      toast.error('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#f1f5f9] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#1e293b]">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="flex items-center gap-3 mb-2">
            <ListTodoIcon className="w-9 h-9 text-primary drop-shadow-lg" />
            <span className="text-4xl font-extrabold tracking-tight text-primary font-sans" style={{letterSpacing: '-0.04em'}}>Taskify</span>
          </div>
          <div className="text-muted-foreground text-center text-base font-medium max-w-xs font-sans">
            Smart, simple, and AI-powered task management for your busy life.
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/30 via-indigo-400/20 to-transparent blur-lg opacity-70 animate-gradient-move z-0" />
          <form onSubmit={handleSubmit} className="relative z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full flex flex-col gap-7 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-2 text-center font-sans tracking-tight">Sign In to your account</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
                className="pl-12 h-12 text-base rounded-xl bg-zinc-100/60 dark:bg-zinc-800/60 border-none focus:ring-2 focus:ring-primary/30"
            />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            <Input
                type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
                className="pl-12 pr-12 h-12 text-base rounded-xl bg-zinc-100/60 dark:bg-zinc-800/60 border-none focus:ring-2 focus:ring-primary/30"
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            {/* Demo User Button */}
            <Button 
              type="button" 
              onClick={fillDemoCredentials}
              className="w-full h-10 text-sm font-medium rounded-xl bg-primary/20 hover:bg-primary/30  text-primary transition-colors"
            >
              Use Demo Credentials
            </Button>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl shadow-md bg-gradient-to-r from-primary/90 to-emerald-500/90 hover:from-primary hover:to-emerald-500" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-primary font-semibold">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 