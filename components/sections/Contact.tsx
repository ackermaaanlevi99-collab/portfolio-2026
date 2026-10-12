import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import ContactForm from '@/components/sections/ContactForm';
import { getActiveServices } from '@/lib/projects';
import site from '@/content/site.json';

export default function Contact() {
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
          <ContactForm services={services.map((service) => service.title)} />
        </div>
      </div>
    </section>
  );
}
