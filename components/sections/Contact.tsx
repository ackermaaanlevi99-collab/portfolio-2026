'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import { FaWhatsapp, FaBehance } from 'react-icons/fa6';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import contact from '@/content/contact.json';
import texts from '@/content/texts.json';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: contact.formOptions.services[0],
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('sent');
      setForm({ name: '', email: '', service: contact.formOptions.services[0], message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contacto" className="relative px-6 py-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Contacto" title={contact.heading} subtitle={contact.subheading} />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-5">
          <AnimatedSection direction="left" className="lg:col-span-2">
            <div className="space-y-5">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary"
                data-cursor-hover
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                  <Mail size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Correo</p>
                  <p className="truncate text-sm">{contact.email}</p>
                </div>
              </a>

              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary"
                data-cursor-hover
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                  <FaWhatsapp size={18} />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">WhatsApp</p>
                  <p className="text-sm">{contact.phone}</p>
                </div>
              </a>

              <a
                href={contact.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary"
                data-cursor-hover
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                  <FaBehance size={18} />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Behance</p>
                  <p className="text-sm">Ver portfolio completo</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Ubicación</p>
                  <p className="text-sm">{contact.location}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-border bg-surface p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                    Nombre
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                    Correo
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                  Servicio
                </label>
                <select
                  id="service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  {contact.formOptions.services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-mono text-xs uppercase tracking-widest text-white transition hover:bg-primaryDark disabled:opacity-60"
              >
                {status === 'sending' ? texts.buttons.sending : status === 'sent' ? texts.buttons.sent : texts.buttons.sendMessage}
                {status !== 'sending' && <Send size={15} />}
              </motion.button>

              {status === 'error' && (
                <p className="text-center text-sm text-error">Algo salió mal. Intenta de nuevo o escribe por WhatsApp.</p>
              )}
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
