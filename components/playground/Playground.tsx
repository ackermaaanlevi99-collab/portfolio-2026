'use client';

import dynamic from 'next/dynamic';
import { useId, useState, type KeyboardEvent } from 'react';
import CompositionExperiment from '@/components/playground/CompositionExperiment';
import ImageExperiment from '@/components/playground/ImageExperiment';
import type { ProjectItem } from '@/types/content';

// Three.js solo se descarga cuando se abre el experimento de forma.
const FormExperiment = dynamic(() => import('@/components/playground/FormExperiment'), {
  ssr: false,
  loading: () => <p className="playground__status">Cargando experimento…</p>,
});

type TabId = 'form' | 'image' | 'composition';

const TABS: { id: TabId; label: string }[] = [
  { id: 'form', label: 'Forma' },
  { id: 'image', label: 'Imagen' },
  { id: 'composition', label: 'Composición' },
];

export default function Playground({ projects }: { projects: ProjectItem[] }) {
  const [tab, setTab] = useState<TabId>('form');
  const baseId = useId();

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // La flecha parte de la pestaña que tiene el foco, no de la seleccionada.
    const index = TABS.findIndex((t) => `${baseId}-tab-${t.id}` === (event.target as HTMLElement).id);
    if (index < 0) return;
    let next: TabId;
    if (event.key === 'ArrowRight') next = TABS[(index + 1) % TABS.length].id;
    else if (event.key === 'ArrowLeft') next = TABS[(index - 1 + TABS.length) % TABS.length].id;
    else return;
    event.preventDefault();
    setTab(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <div className="playground">
      <div className="playground__tabs" role="tablist" aria-label="Experimentos" onKeyDown={onTabKeyDown}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`${baseId}-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className="playground__tab"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.map((t) => (
        <div
          key={t.id}
          id={`${baseId}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={tab !== t.id}
          className="playground__panel"
        >
          {tab === t.id && t.id === 'form' && <FormExperiment />}
          {tab === t.id && t.id === 'image' && <ImageExperiment projects={projects} />}
          {tab === t.id && t.id === 'composition' && <CompositionExperiment />}
        </div>
      ))}
    </div>
  );
}
