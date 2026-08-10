'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  DollarSign,
  LogOut,
  Loader2,
  FolderKanban,
  Wrench,
  Sparkles,
  User,
  Navigation as NavIcon,
  Mail,
  Image as ImageIcon,
  Settings,
  Home as HomeIcon,
  MessageSquare,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/adminApi';

const NAV_GROUPS = [
  {
    label: 'General',
    items: [{ href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard }]
  },
  {
    label: 'Private',
    items: [{ href: '/admin/dashboard/finance', label: 'Finance', icon: DollarSign }]
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/dashboard/home', label: 'Home Page', icon: HomeIcon },
      { href: '/admin/dashboard/projects', label: 'Projects', icon: FolderKanban },
      { href: '/admin/dashboard/services', label: 'Services', icon: Wrench },
      { href: '/admin/dashboard/skills', label: 'Skills', icon: Sparkles },
      { href: '/admin/dashboard/about', label: 'About', icon: User },
      { href: '/admin/dashboard/contact', label: 'Contact Page', icon: MessageSquare },
      { href: '/admin/dashboard/navigation', label: 'Navigation', icon: NavIcon }
    ]
  },
  {
    label: 'System',
    items: [
      { href: '/admin/dashboard/messages', label: 'Messages', icon: Mail },
      { href: '/admin/dashboard/media', label: 'Media Library', icon: ImageIcon },
      { href: '/admin/dashboard/settings', label: 'Site Settings', icon: Settings }
    ]
  }
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    api
      .get('/api/auth/me')
      .then((res) => {
        setAdminEmail(res.admin?.email || '');
        setChecking(false);
      })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  const handleLogout = async () => {
    await api.post('/auth/logout');
    router.replace('/admin/login');
  };

  const currentItem = ALL_ITEMS.find((i) => i.href === pathname);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-scope">
        <Loader2 className="animate-spin text-[#9096a6]" size={20} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex admin-scope">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/[0.06] flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/[0.06]">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #35E5C9)' }}
          >
            <span className="font-display font-bold text-xs text-[#08090d]">V</span>
          </div>
          <div>
            <div className="font-display font-semibold text-sm leading-tight">VERSA</div>
            <div className="text-[10px] font-mono text-[#9096a6] tracking-wide">ADMIN</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="text-[10px] font-mono tracking-[1.5px] text-[#5b5f6e] px-3 mb-2">
                {group.label.toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
                      style={{ color: active ? '#f4f5f7' : '#9096a6' }}
                    >
                      {active && (
                        <motion.div
                          layoutId="admin-active-nav"
                          className="absolute inset-0 rounded-lg"
                          style={{ background: 'rgba(124,92,252,0.14)', border: '1px solid rgba(124,92,252,0.25)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon size={15} className="relative shrink-0" style={{ color: active ? '#7C5CFC' : undefined }} />
                      <span className="relative">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3 flex flex-col gap-1">
          <a
            href="/en"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#9096a6] hover:text-[#f4f5f7] transition-colors"
          >
            <ExternalLink size={15} /> View live site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#9096a6] hover:text-red-300 transition-colors text-left"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-white/[0.06] flex items-center justify-between px-8 sticky top-0 z-10 admin-glass">
          <div className="flex items-center gap-1.5 text-sm text-[#9096a6]">
            <span>Admin</span>
            <ChevronRight size={13} />
            <span className="text-[#f4f5f7] font-medium">{currentItem?.label || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{ background: 'linear-gradient(135deg, #7C5CFC, #35E5C9)', color: '#08090d' }}
            >
              {adminEmail.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
