'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import site from '@/content/site.json';

type ContactFormProps = {
  services: string[];
};

type SubmissionState = 'idle' | 'sending' | 'error';

export default function ContactForm({ services }: ContactFormProps) {
  const form = site.contact.form;
  const router = useRouter();
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const body = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });

    setSubmissionState('sending');

    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) throw new Error('Netlify Forms did not accept the submission.');
      router.push('/gracias');
    } catch {
      setSubmissionState('error');
    }
  }

  return (
    <>
      <h3 className="contact-form__title">{form.heading}</h3>
      <form
        name={form.name}
        method="POST"
        action="/__forms.html"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className="contact-form"
        aria-busy={submissionState === 'sending'}
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value={form.name} />
        <div aria-hidden="true" style={{ display: 'none' }}>
          <label>Deja este campo vacío<input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="contacto-nombre">{form.fields[0].label}</label>
            <input id="contacto-nombre" name={form.fields[0].name} type="text" autoComplete="name" maxLength={100} required />
          </div>
          <div className="form-field">
            <label htmlFor="contacto-email">{form.fields[1].label}</label>
            <input id="contacto-email" name={form.fields[1].name} type="email" autoComplete="email" maxLength={254} required />
          </div>
          <div className="form-field form-field--wide">
            <label htmlFor="contacto-servicio">{form.fields[2].label}</label>
            <select id="contacto-servicio" name={form.fields[2].name} defaultValue="" required>
              <option value="" disabled>Selecciona una opción</option>
              {services.map((service) => <option value={service} key={service}>{service}</option>)}
              <option value="Otro">Otro / todavía no lo sé</option>
            </select>
          </div>
          <div className="form-field form-field--wide">
            <label htmlFor="contacto-mensaje">{form.fields[3].label}</label>
            <textarea id="contacto-mensaje" name={form.fields[3].name} rows={5} maxLength={2400} required />
          </div>
        </div>
        <p className="form-consent">La consulta se enviará a través de Netlify Forms para que Emmanuel pueda revisarla. El formulario solo confirma el envío si el proveedor lo procesa correctamente.</p>
        <button type="submit" className="cta form-submit" disabled={submissionState === 'sending'}>
          {submissionState === 'sending' ? 'ENVIANDO…' : form.submit}<Send size={15} aria-hidden="true" />
        </button>
      </form>
      {submissionState === 'sending' && (
        <p className="contact-form__status" role="status" aria-live="polite">Enviando tu consulta…</p>
      )}
      {submissionState === 'error' && (
        <p className="contact-form__error" role="alert">
          No se pudo confirmar el envío. Inténtalo de nuevo o escríbeme directamente a{' '}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      )}
    </>
  );
}
