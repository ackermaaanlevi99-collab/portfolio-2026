import { ArrowUpRight, Mail, MapPin, Send } from 'lucide-react';
import { getActiveServices } from '@/lib/projects';
import site from '@/content/site.json';

export default function Contact() {
  const form = site.contact.form;
  const services = getActiveServices();

  return (
    <section id="contacto" className="contact-section section-space" aria-labelledby="contact-title">
      <div className="page-container contact-layout">
        <div className="contact-heading">
          <p className="eyebrow">{site.contact.eyebrow}</p>
          <h2 id="contact-title">{site.contact.title}</h2>
          <p className="contact-heading__copy">{site.contact.description}</p>
          <div className="contact-methods">
            <a className="contact-method" href={`mailto:${site.contact.email}`}><Mail size={17} aria-hidden="true" /> {site.contact.email}</a>
            <a className="contact-method" href={site.contact.whatsappUrl} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={17} aria-hidden="true" /> {site.contact.whatsappLabel}</a>
          </div>
          <p className="contact-note"><MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px' }} aria-hidden="true" /> {site.contact.availabilityNote}</p>
        </div>

        <div className="contact-form-wrap">
          <h3 className="contact-form__title">{form.heading}</h3>
          <form name={form.name} method="POST" action="/gracias" data-netlify="true" data-netlify-honeypot="bot-field" className="contact-form">
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
                  {services.map((service) => <option value={service.title} key={service.id}>{service.title}</option>)}
                  <option value="Otro">Otro / todavía no lo sé</option>
                </select>
              </div>
              <div className="form-field form-field--wide">
                <label htmlFor="contacto-mensaje">{form.fields[3].label}</label>
                <textarea id="contacto-mensaje" name={form.fields[3].name} rows={5} maxLength={2400} required />
              </div>
            </div>
            <p className="form-consent">La consulta se enviará a través de Netlify Forms para que Emmanuel pueda revisarla. El formulario solo confirma el envío si el proveedor lo procesa correctamente.</p>
            <button type="submit" className="cta form-submit">
              {form.submit}<Send size={15} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
