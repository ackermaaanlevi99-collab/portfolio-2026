'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

// Experimento "Composición": un lienzo de formas simples que se arrastran, se recolocan
// con cuadrícula y se exportan como SVG. Todo ocurre en el navegador; no se guarda nada.

type Kind = 'rect' | 'circle' | 'line';

interface Item {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

const W = 800;
const H = 600;
const GRID = 20;
const BG = '#0A0A0A';
// Colores tomados de la paleta oscura del sitio: verde de acento, texto claro y línea.
const COLORS = [
  { label: 'Verde', value: '#4BFF2E' },
  { label: 'Claro', value: '#F2F2EE' },
  { label: 'Gris', value: '#3A3F3A' },
];
const KIND_LABEL: Record<Kind, string> = { rect: 'Rectángulo', circle: 'Círculo', line: 'Línea' };
const DEFAULT_SIZE: Record<Kind, { w: number; h: number }> = {
  rect: { w: 160, h: 100 },
  circle: { w: 120, h: 120 },
  line: { w: 200, h: 0 },
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function bounds(it: Item) {
  const x1 = Math.min(it.x, it.x + it.w);
  const y1 = Math.min(it.y, it.y + it.h);
  return { x: x1 - 8, y: y1 - 8, w: Math.abs(it.w) + 16, h: Math.abs(it.h) + 16 };
}

function toSvgString(items: Item[]): string {
  const body = items
    .map((it) => {
      if (it.kind === 'rect') {
        return `<rect x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}" fill="${it.color}"/>`;
      }
      if (it.kind === 'circle') {
        const r = Math.min(it.w, it.h) / 2;
        return `<circle cx="${it.x + it.w / 2}" cy="${it.y + it.h / 2}" r="${r}" fill="${it.color}"/>`;
      }
      return `<line x1="${it.x}" y1="${it.y}" x2="${it.x + it.w}" y2="${it.y + it.h}" stroke="${it.color}" stroke-width="4" stroke-linecap="round"/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${BG}"/>${body}</svg>`;
}

export default function CompositionExperiment() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [snap, setSnap] = useState(true);
  const [color, setColor] = useState(COLORS[0].value);
  const nextId = useRef(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);

  const selectedItem = items.find((it) => it.id === selected) ?? null;

  function toSvgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const p = pt.matrixTransform(matrix.inverse());
    return { x: p.x, y: p.y };
  }

  function quantize(v: number) {
    return snap ? Math.round(v / GRID) * GRID : Math.round(v);
  }

  function addItem(kind: Kind) {
    const id = nextId.current++;
    const size = DEFAULT_SIZE[kind];
    const offset = ((id - 1) * GRID * 2) % 160;
    const item: Item = {
      id,
      kind,
      x: quantize(W / 2 - size.w / 2 + offset - 80),
      y: quantize(H / 2 - size.h / 2 + offset / 2 - 40),
      w: size.w,
      h: size.h,
      color,
    };
    setItems((prev) => [...prev, item]);
    setSelected(id);
  }

  function deleteSelected() {
    if (selected === null) return;
    setItems((prev) => prev.filter((it) => it.id !== selected));
    setSelected(null);
  }

  function changeColor(value: string) {
    setColor(value);
    if (selected !== null) {
      setItems((prev) => prev.map((it) => (it.id === selected ? { ...it, color: value } : it)));
    }
  }

  function nudge(dx: number, dy: number) {
    if (selected === null) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== selected) return it;
        return {
          ...it,
          x: clamp(it.x + dx, 0, W - Math.max(it.w, 0)),
          y: clamp(it.y + dy, 0, H - Math.max(it.h, 0)),
        };
      }),
    );
  }

  function onShapePointerDown(event: ReactPointerEvent<SVGElement>, it: Item) {
    event.stopPropagation();
    setSelected(it.id);
    const p = toSvgPoint(event.clientX, event.clientY);
    drag.current = { id: it.id, dx: p.x - it.x, dy: p.y - it.y };
    svgRef.current?.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const current = drag.current;
    if (!current) return;
    const p = toSvgPoint(event.clientX, event.clientY);
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== current.id) return it;
        return {
          ...it,
          x: clamp(quantize(p.x - current.dx), 0, W - Math.max(it.w, 0)),
          y: clamp(quantize(p.y - current.dy), 0, H - Math.max(it.h, 0)),
        };
      }),
    );
  }

  function endDrag() {
    drag.current = null;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? GRID : 2;
    if (event.key === 'ArrowLeft') nudge(-step, 0);
    else if (event.key === 'ArrowRight') nudge(step, 0);
    else if (event.key === 'ArrowUp') nudge(0, -step);
    else if (event.key === 'ArrowDown') nudge(0, step);
    else if (event.key === 'Delete' || event.key === 'Backspace') deleteSelected();
    else return;
    event.preventDefault();
  }

  function exportSvg() {
    const blob = new Blob([toSvgString(items)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'composicion.svg';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="playground-composition">
      <div className="playground__toolbar" role="toolbar" aria-label="Herramientas de composición">
        {(Object.keys(KIND_LABEL) as Kind[]).map((kind) => (
          <button key={kind} type="button" className="playground__button" onClick={() => addItem(kind)}>
            Añadir {KIND_LABEL[kind].toLowerCase()}
          </button>
        ))}
        <div className="playground__group" role="group" aria-label="Color">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              className="playground__swatch"
              style={{ background: c.value }}
              aria-label={`Color ${c.label}`}
              aria-pressed={(selectedItem?.color ?? color) === c.value}
              onClick={() => changeColor(c.value)}
            />
          ))}
        </div>
        <button type="button" className="playground__button" aria-pressed={snap} onClick={() => setSnap((v) => !v)}>
          Cuadrícula {snap ? 'activa' : 'inactiva'}
        </button>
        <button type="button" className="playground__button" onClick={deleteSelected} disabled={selected === null}>
          Eliminar seleccionado
        </button>
        <button
          type="button"
          className="playground__button"
          onClick={() => {
            setItems([]);
            setSelected(null);
          }}
          disabled={items.length === 0}
        >
          Limpiar
        </button>
        <button type="button" className="playground__button playground__button--primary" onClick={exportSvg} disabled={items.length === 0}>
          Descargar SVG
        </button>
      </div>

      <div
        className="playground__stage playground__stage--composition"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Lienzo de composición. Flechas mueven la forma seleccionada; Suprimir la elimina."
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="playground__canvas"
          role="group"
          aria-label={`${items.length} formas en el lienzo`}
          onPointerDown={() => setSelected(null)}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            <pattern id="composition-grid" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
              <path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="#1B1F1B" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill={BG} />
          {snap && <rect width={W} height={H} fill="url(#composition-grid)" pointerEvents="none" />}

          {items.map((it) => {
            const common = {
              onPointerDown: (event: ReactPointerEvent<SVGElement>) => onShapePointerDown(event, it),
              style: { cursor: 'grab' as const },
            };
            if (it.kind === 'rect') {
              return <rect key={it.id} x={it.x} y={it.y} width={it.w} height={it.h} fill={it.color} {...common} />;
            }
            if (it.kind === 'circle') {
              return (
                <circle key={it.id} cx={it.x + it.w / 2} cy={it.y + it.h / 2} r={Math.min(it.w, it.h) / 2} fill={it.color} {...common} />
              );
            }
            return (
              <line
                key={it.id}
                x1={it.x}
                y1={it.y}
                x2={it.x + it.w}
                y2={it.y + it.h}
                stroke={it.color}
                strokeWidth={4}
                strokeLinecap="round"
                {...common}
                style={{ cursor: 'grab', strokeLinecap: 'round' }}
              />
            );
          })}

          {selectedItem && (
            <rect
              {...bounds(selectedItem)}
              fill="none"
              stroke="#4BFF2E"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              pointerEvents="none"
            />
          )}
        </svg>
      </div>

      <p className="playground__status">
        {selectedItem
          ? `Seleccionado: ${KIND_LABEL[selectedItem.kind]}. Arrastra o usa las flechas (Mayús para saltos de cuadrícula).`
          : 'Añade una forma para empezar. Arrastra cada forma para moverla.'}
      </p>
    </div>
  );
}
