'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '@/lib/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('api/auth/login', { email, password });
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden admin-grid-bg">
      {/* Ambient gradient glow, consistent with the public site's hero treatment */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(600px circle at 15% 15%, rgba(124,92,252,0.16), transparent 60%), radial-gradient(500px circle at 85% 75%, rgba(53,229,201,0.12), transparent 60%)'
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px]"
      >
        <div className="admin-glass rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.25), rgba(53,229,201,0.15))' }}
            >
              <Lock size={19} className="text-[#7C5CFC]" />
            </div>
            <h1 className="font-display font-semibold text-xl tracking-tight">Admin Access</h1>
            <p className="text-xs mt-1.5 text-[#9096a6] font-mono tracking-wide">PRIVATE — AUTHORIZED USE ONLY</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs mb-1.5 block text-[#9096a6]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm outline-none transition-colors focus:border-[#7C5CFC]"
              />
            </div>
            <div>
              <label className="text-xs mb-1.5 block text-[#9096a6]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm outline-none transition-colors focus:border-[#7C5CFC]"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs rounded-xl px-3.5 py-2.5 bg-red-500/10 text-red-300"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #7C5CFC, #35E5C9)', color: '#08090d' }}
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] font-mono mt-6 text-[#5b5f6e]">VERSA CMS · Protected by JWT session</p>
      </motion.div>
    </div>
  );
}
