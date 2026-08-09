'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { api } from '@/lib/adminApi';

const STATUS_COLORS: Record<string, string> = {
  new: '#7C5CFC',
  read: '#9096a6',
  replied: '#35E5C9',
  archived: '#5b5f6e'
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get(`/contact-messages${filter ? `?status=${filter}` : ''}`);
    setMessages(res.messages);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const openMessage = async (msg: any) => {
    setSelected(msg);
    if (msg.status === 'new') {
      await api.put(`/contact-messages/${msg._id}/status`, { status: 'read' });
      load();
    }
  };

  const setStatus = async (id: string, status: string) => {
    await api.put(`/contact-messages/${id}/status`, { status });
    load();
    setSelected(null);
  };

  const remove = async (id: string) => {
    await api.delete(`/contact-messages/${id}`);
    load();
    setSelected(null);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6">
      <div>
        <h1 className="font-semibold text-2xl mb-4">Messages</h1>
        <div className="flex gap-2 mb-4">
          {['', 'new', 'read', 'replied', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="text-xs px-3 py-1.5 rounded-full border"
              style={{
                borderColor: filter === s ? '#7C5CFC' : 'rgba(244,245,247,0.09)',
                color: filter === s ? '#7C5CFC' : '#9096a6'
              }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-sm" style={{ color: '#9096a6' }}>Loading...</div>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
            {messages.length === 0 && (
              <div className="p-6 text-sm text-center" style={{ color: '#9096a6' }}>No messages.</div>
            )}
            {messages.map((m) => (
              <button
                key={m._id}
                onClick={() => openMessage(m)}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0"
                style={{ borderColor: 'rgba(244,245,247,0.09)', background: selected?._id === m._id ? 'rgba(255,255,255,0.03)' : 'transparent' }}
              >
                {m.status === 'new' ? <Mail size={14} style={{ color: '#7C5CFC' }} /> : <MailOpen size={14} style={{ color: '#9096a6' }} />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.fullName}</div>
                  <div className="text-xs truncate" style={{ color: '#9096a6' }}>
                    {m.projectType || 'General inquiry'}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-full shrink-0" style={{ color: STATUS_COLORS[m.status] }}>
                  {m.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {selected ? (
          <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-semibold text-lg">{selected.fullName}</h3>
                <p className="text-xs" style={{ color: '#9096a6' }}>{selected.email} {selected.phone && `· ${selected.phone}`}</p>
              </div>
              <button onClick={() => remove(selected._id)} style={{ color: '#9096a6' }}>
                <Trash2 size={15} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <Field label="Company" value={selected.company} />
              <Field label="Project Type" value={selected.projectType} />
              <Field label="Budget" value={selected.budget} />
              <Field label="Timeline" value={selected.timeline} />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#9096a6' }}>{selected.description}</p>
            <div className="flex gap-2">
              {['new', 'read', 'replied', 'archived'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(selected._id, s)}
                  className="text-xs px-3 py-2 rounded-lg border"
                  style={{
                    borderColor: selected.status === s ? '#7C5CFC' : 'rgba(244,245,247,0.09)',
                    color: selected.status === s ? '#7C5CFC' : '#9096a6'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-sm text-center" style={{ borderColor: 'rgba(244,245,247,0.09)', color: '#9096a6' }}>
            Select a message to view details.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ color: '#9096a6' }}>{label}</div>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
