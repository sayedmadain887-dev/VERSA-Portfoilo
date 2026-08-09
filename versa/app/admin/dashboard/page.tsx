'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Wrench, Mail, Image as ImageIcon, Plus, ArrowRight } from 'lucide-react';
import { api } from '@/lib/adminApi';
import StatCard from '@/components/admin/StatCard';

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({ projects: 0, services: 0, newMessages: 0, media: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [projects, services, messages, media] = await Promise.all([
        api.get('/admin/projects'),
        api.get('/admin/services'),
        api.get('/contact-messages?limit=5'),
        api.get('/admin/media')
      ]);
      setCounts({
        projects: projects.items.length,
        services: services.items.length,
        newMessages: messages.unreadCount,
        media: media.items.length
      });
      setRecentMessages(messages.messages.slice(0, 5));
      setRecentProjects(projects.items.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-1">Overview</h1>
      <p className="text-sm mb-6" style={{ color: '#9096a6' }}>
        Everything happening on the site, at a glance.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projects" value={loading ? '—' : String(counts.projects)} />
        <StatCard label="Services" value={loading ? '—' : String(counts.services)} />
        <StatCard label="New Messages" value={loading ? '—' : String(counts.newMessages)} accent={counts.newMessages > 0 ? '#7C5CFC' : undefined} />
        <StatCard label="Media Files" value={loading ? '—' : String(counts.media)} />
      </div>

      <div className="flex gap-3 flex-wrap mb-10">
        <QuickAction href="/admin/dashboard/projects" icon={Plus} label="Add Project" />
        <QuickAction href="/admin/dashboard/services" icon={Plus} label="Add Service" />
        <QuickAction href="/admin/dashboard/messages" icon={Mail} label="View Messages" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-glass rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Mail size={14} /> Recent Messages
            </h3>
            <Link href="/admin/dashboard/messages" className="text-xs flex items-center gap-1" style={{ color: '#9096a6' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-xs" style={{ color: '#9096a6' }}>No messages yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentMessages.map((m) => (
                <div key={m._id} className="text-xs">
                  <span className="font-medium">{m.fullName}</span>{' '}
                  <span style={{ color: '#9096a6' }}>— {m.projectType || 'General inquiry'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-glass rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <FolderKanban size={14} /> Recent Projects
            </h3>
            <Link href="/admin/dashboard/projects" className="text-xs flex items-center gap-1" style={{ color: '#9096a6' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-xs" style={{ color: '#9096a6' }}>No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentProjects.map((p) => (
                <div key={p._id} className="text-xs">
                  <span className="font-medium">{p.title}</span>{' '}
                  <span style={{ color: '#9096a6' }}>— {p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-[#7C5CFC]/40 hover:bg-[#7C5CFC]/[0.08] transition-colors"
    >
      <Icon size={14} /> {label}
    </Link>
  );
}
