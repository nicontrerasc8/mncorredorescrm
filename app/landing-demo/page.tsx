const products = [
  {
    name: "Seguro de Vida",
    price: 18,
    badge: "Más popular",
    mark: "SV",
    accent: "bg-[#f4c35f] text-[#3a2b08]",
    summary: "Tu familia recibe una indemnización en caso de fallecimiento, sin importar la causa.",
    benefits: ["Cobertura desde S/ 50,000", "Sin examen médico hasta cierto monto", "Pago directo a beneficiarios"],
  },
  {
    name: "Accidentes Personales",
    price: 12,
    mark: "AP",
    accent: "bg-slate-100 text-slate-700",
    summary: "Cobertura ante accidentes dentro y fuera del trabajo, las 24 horas del día.",
    benefits: ["Muerte e invalidez accidental", "Gastos médicos por accidente", "Renta diaria por hospitalización"],
  },
  {
    name: "Salud Complementaria",
    price: 45,
    mark: "SC",
    accent: "bg-[#ffe8e2] text-[#9f2f1f]",
    summary: "Complementa tu cobertura EPS con atención en clínicas privadas y especialistas.",
    benefits: ["Hospitalización en clínicas", "Consultas con especialistas", "Cobertura para familia"],
  },
  {
    name: "Cobertura Oncológica",
    price: 25,
    mark: "CO",
    accent: "bg-[#fff4bd] text-[#745900]",
    summary: "Protección financiera ante un diagnóstico de cáncer y tratamientos relacionados.",
    benefits: ["Hasta S/ 1,000,000 de cobertura", "Tratamientos en clínicas top", "Sin copagos en muchos casos"],
  },
  {
    name: "SOAT Familiar",
    price: 15,
    mark: "SF",
    accent: "bg-[#e5f3ff] text-[#075985]",
    summary: "SOAT para todos los vehículos de tu familia, gestionado en un solo lugar.",
    benefits: ["Renovación automática", "Recordatorios de vencimiento", "Cobertura nacional"],
  },
  {
    name: "Protección de Tarjetas",
    price: 8,
    mark: "PT",
    accent: "bg-[#eee8dd] text-[#5b4630]",
    summary: "Cobertura ante uso fraudulento de tus tarjetas de crédito o débito.",
    benefits: ["Reembolso por consumos no autorizados", "Cobertura 24/7", "Atención inmediata"],
  },
];

export default function LandingDemoPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <header className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-950 text-sm font-bold text-sky-300">MN</div>
            <div>
              <p className="text-sm font-bold leading-none">MN Corredores</p>
              <p className="mt-1 text-xs text-slate-500">Seguros personales</p>
            </div>
          </div>
          <a className="rounded-md bg-[#184a7a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12385d]" href="#contacto">
            Solicitar información
          </a>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:py-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#184a7a]">Cotización rápida</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Elige una cobertura y recibe una propuesta en tu correo.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Una landing simple para captar interesados: correo, teléfono opcional y precios referenciales visibles desde el primer vistazo.
            </p>
          </div>

          <form id="contacto" className="rounded-md border border-slate-200 bg-[#f8fafc] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-5">
            <p className="text-sm font-bold text-slate-950">Recibir cotización</p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Correo</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#184a7a] focus:ring-2 focus:ring-[#184a7a]/15"
                  placeholder="tu@correo.com"
                  type="email"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#184a7a] focus:ring-2 focus:ring-[#184a7a]/15"
                  placeholder="+51 9XX XXX XXX"
                  type="tel"
                />
              </label>
              <button className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-[#184a7a]" type="button">
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Planes disponibles</h2>
            <p className="mt-1 text-sm text-slate-500">Precios mensuales referenciales para mostrar el rango de cada producto.</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Desde S/ 8 al mes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              className="relative rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
              key={product.name}
            >
              {product.badge ? (
                <span className="absolute right-4 top-4 rounded bg-[#f4c35f] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3a2b08]">
                  {product.badge}
                </span>
              ) : null}
              <div className={`flex h-9 w-9 items-center justify-center rounded text-xs font-black ${product.accent}`}>{product.mark}</div>
              <h3 className="mt-5 text-base font-semibold text-slate-950">{product.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.summary}</p>
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {product.benefits.map((benefit) => (
                  <li className="flex gap-2 text-xs leading-5 text-slate-600" key={benefit}>
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-end gap-1">
                <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">desde</span>
                <span className="text-sm font-bold text-[#184a7a]">S/</span>
                <span className="text-3xl font-semibold tracking-normal text-slate-950">{product.price}</span>
                <span className="mb-1 text-xs font-semibold text-slate-500">/mes</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
