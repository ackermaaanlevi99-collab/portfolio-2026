import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { navigation } from '@/config/navigation';
import site from '@/content/site.json';
import texts from '@/content/texts.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <h2>{site.brand}</h2>
            <p>Diseño gráfico, identidad de marca, textil e imagen desde Caracas, Venezuela.</p>
            <a className="text-link" href={`mailto:${site.contact.email}`}>Hablemos de tu proyecto <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="site-footer__groups">
            <div className="site-footer__group">
              <h3>Navegación</h3>
              <ul>
                {navigation.links.map((link) => (
                  <li key={link.href}><Link href={`/${link.href}`}>{link.label}</Link></li>
                ))}
                <li><Link href="/proyectos">Archivo completo</Link></li>
              </ul>
            </div>
            <div className="site-footer__group">
              <h3>Encuéntrame</h3>
              <ul>
                <li><a href={site.social.behance} target="_blank" rel="noopener noreferrer">Behance ↗</a></li>
                <li><a href={site.social.beacons} target="_blank" rel="noopener noreferrer">Beacons ↗</a></li>
                <li><a href={site.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></li>
                <li><a href={`mailto:${site.contact.email}`}>Correo electrónico</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {currentYear} {texts.brand.name}. Todos los derechos reservados.</span>
          <Link href="/#inicio">Caracas, Venezuela · Volver arriba ↑</Link>
        </div>
      </div>
    </footer>
  );
}
