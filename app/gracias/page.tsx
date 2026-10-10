import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import texts from '@/content/texts.json';

export const metadata: Metadata = { title: 'Consulta recibida', robots: { index: false, follow: true } };

export default function ThankYouPage() {
  return (
    <section className="thanks-page">
      <div className="thanks-page__inner">
        <p className="eyebrow">Contacto / recibido</p>
        <h1>{texts.contact.successTitle}</h1>
        <p>{texts.contact.successBody}</p>
        <Link className="cta" href="/">{texts.contact.backHome}<ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
