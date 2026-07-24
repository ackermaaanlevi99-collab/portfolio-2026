export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-white px-6">
      {/* Luz Verde Neón de fondo (Glow 3D) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00FF66]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl text-center">
        {/* Badge / Etiqueta Neón */}
        <span className="inline-block px-4 py-1.5 mb-6 text-xs tracking-widest font-bold uppercase rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
          PORTFOLIO 2026
        </span>

        {/* Título Principal con Estilo 3D */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          ARANGUIBEL <span className="text-neon-3d">STUDIO</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Diseño visual, identidades de marca y experiencias digitales llevadas
          al siguiente nivel.
        </p>

        {/* Botón Neón */}
        <div className="flex justify-center gap-4">
          <a href="#portfolio" className="btn-neon-green px-8 py-3.5 text-base">
            Ver Trabajos
          </a>
        </div>
      </div>
    </section>
  );
}
