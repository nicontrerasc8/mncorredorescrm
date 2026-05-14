"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "admin" | "jefe" | "ejecutivo";
type LeadState =
  | "Nuevo"
  | "Contactado"
  | "En evaluacion"
  | "Propuesta enviada"
  | "Negociacion"
  | "Ganado"
  | "Perdido";
type Priority = "Alta" | "Media" | "Baja";
type ActivityStatus = "Pendiente" | "En proceso" | "Completada" | "Vencida" | "Reprogramada";
type CustomerType = "Cliente actual" | "Prospecto";
type SourceType = "conocido" | "nuevo";

type Executive = {
  name: string;
  role: string;
  leads: number;
  managed: number;
  won: number;
  lost: number;
  conversion: number;
  pipeline: number;
  avatar: string;
};

type Customer = {
  name: string;
  type: CustomerType;
  executive: string;
  contact: string;
  phone: string;
  email: string;
  lastTouch: string;
  segment: string;
};

type Lead = {
  company: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
  state: LeadState;
  value: number;
  owner: string;
  age: string;
  note: string;
  source: string;
  sourceType: SourceType;
};

type Activity = {
  task: string;
  type: "Llamada" | "Reunion" | "Correo" | "Seguimiento";
  owner: string;
  deadline: string;
  priority: Priority;
  status: ActivityStatus;
};

type User = {
  name: string;
  role: "Administrador" | "Jefe" | "Ejecutivo";
  email: string;
  status: "Activo" | "Inactivo";
  lastLogin: string;
};

type HistoricalMonth = {
  month: string;
  executiveClosures: Record<string, number>;
  currentCustomers: {
    manager: string;
    won: number;
    lost: number;
    pipeline: number;
  };
  prospects: {
    manager: string;
    won: number;
    lost: number;
    pipeline: number;
  };
};

type Tone = { bg: string; text: string; dot?: string };
type DemoData = {
  executives: Executive[];
  customers: Customer[];
  leads: Lead[];
  activities: Activity[];
  users: User[];
  history: HistoricalMonth[];
};

type DemoDataContextValue = {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
};

const initialExecutives: Executive[] = [
  { name: "Camila Rojas", role: "Ejecutiva comercial", leads: 18, managed: 15, won: 7, lost: 3, conversion: 38.9, pipeline: 186000, avatar: "CR" },
  { name: "Diego Salazar", role: "Ejecutivo comercial", leads: 16, managed: 14, won: 5, lost: 4, conversion: 31.3, pipeline: 142500, avatar: "DS" },
  { name: "Lucia Morales", role: "Ejecutiva comercial", leads: 21, managed: 19, won: 9, lost: 2, conversion: 42.9, pipeline: 231400, avatar: "LM" },
];

const initialCustomers: Customer[] = [
  { name: "Constructora Andina SAC", type: "Cliente actual", executive: "Camila Rojas", contact: "Rafael Paredes", phone: "+51 987 441 120", email: "rparedes@andina.pe", lastTouch: "Renovacion de poliza corporativa", segment: "Corporativo" },
  { name: "Textiles Prado", type: "Prospecto", executive: "Diego Salazar", contact: "Maria Elena Prado", phone: "+51 944 820 611", email: "mprado@textilesprado.pe", lastTouch: "Solicitud de cotizacion para EPS", segment: "Mediana empresa" },
  { name: "Logistica Sur Peru", type: "Prospecto", executive: "Lucia Morales", contact: "Hector Villanueva", phone: "+51 955 119 883", email: "hvillanueva@lsp.pe", lastTouch: "Reunion de diagnostico completada", segment: "Corporativo" },
  { name: "Clinica Santa Clara", type: "Cliente actual", executive: "Lucia Morales", contact: "Andrea Vidal", phone: "+51 912 605 300", email: "avidal@santaclara.pe", lastTouch: "Seguimiento post venta", segment: "Salud" },
  { name: "Grupo Constructivo Norte", type: "Cliente actual", executive: "Diego Salazar", contact: "Luis Espinoza", phone: "+51 931 200 410", email: "lespinoza@gcnorte.pe", lastTouch: "Renovacion SCTR", segment: "Construccion" },
  { name: "Agro Norte SAC", type: "Prospecto", executive: "Camila Rojas", contact: "Roberto Quispe", phone: "+51 912 334 500", email: "rquispe@agronorte.pe", lastTouch: "Lead por referido - primer contacto", segment: "Agroindustria" },
];

const initialLeads: Lead[] = [
  { company: "Agro Norte", contactName: "Roberto Quispe", contactRole: "Gerente general", contactPhone: "+51 912 334 500", contactEmail: "rquispe@agronorte.pe", state: "Nuevo", value: 42000, owner: "Camila Rojas", age: "Hoy", note: "Lead ingresado por referido.", source: "Referido", sourceType: "conocido" },
  { company: "Grupo Malpartida", contactName: "Sofia Malpartida", contactRole: "Jefa de administracion", contactPhone: "+51 940 201 118", contactEmail: "smalpartida@grupomalpartida.pe", state: "Contactado", value: 28500, owner: "Diego Salazar", age: "1 dia", note: "Pidio llamada con gerencia.", source: "Prospeccion directa", sourceType: "nuevo" },
  { company: "Inversiones Altamar", contactName: "Bruno Echevarria", contactRole: "Director financiero", contactPhone: "+51 955 802 443", contactEmail: "bechevarria@altamar.pe", state: "En evaluacion", value: 71000, owner: "Lucia Morales", age: "3 dias", note: "Pendiente documentacion.", source: "Referido", sourceType: "conocido" },
  { company: "Servicios Mineros Qori", contactName: "Mariana Huaman", contactRole: "Compras corporativas", contactPhone: "+51 988 330 901", contactEmail: "mhuaman@qorimineros.pe", state: "Propuesta enviada", value: 96000, owner: "Camila Rojas", age: "5 dias", note: "Propuesta enviada con tres opciones.", source: "Web/RRSS", sourceType: "nuevo" },
  { company: "Alimentos Valles", contactName: "Carlos Alarcon", contactRole: "Gerente de operaciones", contactPhone: "+51 933 710 042", contactEmail: "calarcon@alimentosvalles.pe", state: "Negociacion", value: 53400, owner: "Diego Salazar", age: "7 dias", note: "Solicita ajuste de deducibles.", source: "Cartera existente", sourceType: "conocido" },
  { company: "Corporacion Sol", contactName: "Gabriela Solis", contactRole: "Gerente general", contactPhone: "+51 977 421 650", contactEmail: "gsolis@corporacionsol.pe", state: "Ganado", value: 118000, owner: "Lucia Morales", age: "12 dias", note: "Cierre aprobado por directorio.", source: "Referido", sourceType: "conocido" },
  { company: "Retail Lima Centro", contactName: "Martin Reategui", contactRole: "Administrador", contactPhone: "+51 965 884 220", contactEmail: "mreategui@retaillimacentro.pe", state: "Perdido", value: 31000, owner: "Diego Salazar", age: "18 dias", note: "Eligio proveedor actual.", source: "Prospeccion directa", sourceType: "nuevo" },
];

const initialActivities: Activity[] = [
  { task: "Llamar a Constructora Andina", type: "Llamada", owner: "Camila Rojas", deadline: "13 May, 10:30", priority: "Alta", status: "Pendiente" },
  { task: "Enviar propuesta EPS a Textiles Prado", type: "Correo", owner: "Diego Salazar", deadline: "13 May, 16:00", priority: "Media", status: "En proceso" },
  { task: "Reunion con Logistica Sur Peru", type: "Reunion", owner: "Lucia Morales", deadline: "14 May, 09:00", priority: "Alta", status: "Reprogramada" },
  { task: "Seguimiento a Alimentos Valles", type: "Seguimiento", owner: "Diego Salazar", deadline: "12 May, 17:30", priority: "Alta", status: "Vencida" },
  { task: "Registrar cierre de Corporacion Sol", type: "Correo", owner: "Lucia Morales", deadline: "11 May, 12:00", priority: "Baja", status: "Completada" },
  { task: "Llamada de bienvenida Agro Norte", type: "Llamada", owner: "Camila Rojas", deadline: "15 May, 11:00", priority: "Media", status: "Pendiente" },
];

const initialHistory: HistoricalMonth[] = [
  {
    month: "Ene",
    executiveClosures: { "Camila Rojas": 5, "Diego Salazar": 4, "Lucia Morales": 6 },
    currentCustomers: { manager: "Jefe Clientes Actuales", won: 9, lost: 2, pipeline: 162000 },
    prospects: { manager: "Jefe Prospectos", won: 6, lost: 4, pipeline: 128000 },
  },
  {
    month: "Feb",
    executiveClosures: { "Camila Rojas": 6, "Diego Salazar": 5, "Lucia Morales": 7 },
    currentCustomers: { manager: "Jefe Clientes Actuales", won: 10, lost: 3, pipeline: 174000 },
    prospects: { manager: "Jefe Prospectos", won: 8, lost: 4, pipeline: 151000 },
  },
  {
    month: "Mar",
    executiveClosures: { "Camila Rojas": 7, "Diego Salazar": 5, "Lucia Morales": 8 },
    currentCustomers: { manager: "Jefe Clientes Actuales", won: 12, lost: 2, pipeline: 198000 },
    prospects: { manager: "Jefe Prospectos", won: 8, lost: 5, pipeline: 169000 },
  },
  {
    month: "Abr",
    executiveClosures: { "Camila Rojas": 8, "Diego Salazar": 6, "Lucia Morales": 9 },
    currentCustomers: { manager: "Jefe Clientes Actuales", won: 14, lost: 3, pipeline: 221000 },
    prospects: { manager: "Jefe Prospectos", won: 9, lost: 4, pipeline: 183000 },
  },
  {
    month: "May",
    executiveClosures: { "Camila Rojas": 9, "Diego Salazar": 7, "Lucia Morales": 11 },
    currentCustomers: { manager: "Jefe Clientes Actuales", won: 16, lost: 2, pipeline: 248000 },
    prospects: { manager: "Jefe Prospectos", won: 11, lost: 4, pipeline: 213000 },
  },
  {
    month: "Jun",
    executiveClosures: { "Camila Rojas": 10, "Diego Salazar": 7, "Lucia Morales": 12 },
    currentCustomers: { manager: "Jefe Clientes Actuales", won: 17, lost: 3, pipeline: 266000 },
    prospects: { manager: "Jefe Prospectos", won: 12, lost: 5, pipeline: 226000 },
  },
];

const initialUsers: User[] = [
  { name: "Patricia Mendoza", role: "Administrador", email: "pmendoza@mncorredores.pe", status: "Activo", lastLogin: "Hoy, 08:15" },
  { name: "Carlos Vega", role: "Jefe", email: "cvega@mncorredores.pe", status: "Activo", lastLogin: "Hoy, 09:02" },
  { name: "Camila Rojas", role: "Ejecutivo", email: "crojas@mncorredores.pe", status: "Activo", lastLogin: "Hoy, 08:47" },
  { name: "Diego Salazar", role: "Ejecutivo", email: "dsalazar@mncorredores.pe", status: "Activo", lastLogin: "Ayer, 18:30" },
  { name: "Lucia Morales", role: "Ejecutivo", email: "lmorales@mncorredores.pe", status: "Activo", lastLogin: "Hoy, 09:10" },
  { name: "Fernando Rios", role: "Ejecutivo", email: "frios@mncorredores.pe", status: "Inactivo", lastLogin: "Hace 5 dias" },
];

const initialDemoData: DemoData = {
  executives: initialExecutives,
  customers: initialCustomers,
  leads: initialLeads,
  activities: initialActivities,
  users: initialUsers,
  history: initialHistory,
};

const storageKey = "mn-corredores-crm-demo-data";
const DemoDataContext = createContext<DemoDataContextValue | null>(null);

function normalizeLead(lead: Partial<Lead>, index: number): Lead {
  const fallback = initialDemoData.leads[index] ?? initialDemoData.leads[0];
  return {
    company: lead.company ?? fallback.company,
    contactName: lead.contactName ?? fallback.contactName,
    contactRole: lead.contactRole ?? fallback.contactRole,
    contactPhone: lead.contactPhone ?? fallback.contactPhone,
    contactEmail: lead.contactEmail ?? fallback.contactEmail,
    state: lead.state ?? fallback.state,
    value: typeof lead.value === "number" ? lead.value : fallback.value,
    owner: lead.owner ?? fallback.owner,
    age: lead.age ?? fallback.age,
    note: lead.note ?? fallback.note,
    source: lead.source ?? fallback.source,
    sourceType: lead.sourceType ?? fallback.sourceType,
  };
}

function normalizeDemoData(value: Partial<DemoData> | null | undefined): DemoData {
  return {
    executives: Array.isArray(value?.executives) ? value.executives : initialDemoData.executives,
    customers: Array.isArray(value?.customers) ? value.customers : initialDemoData.customers,
    leads: Array.isArray(value?.leads) ? value.leads.map((lead, index) => normalizeLead(lead, index)) : initialDemoData.leads,
    activities: Array.isArray(value?.activities) ? value.activities : initialDemoData.activities,
    users: Array.isArray(value?.users) ? value.users : initialDemoData.users,
    history: Array.isArray(value?.history) ? value.history : initialDemoData.history,
  };
}

function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used inside DemoDataContext.Provider");
  }
  return context;
}

const states: LeadState[] = ["Nuevo", "Contactado", "En evaluacion", "Propuesta enviada", "Negociacion", "Ganado", "Perdido"];

const stateColors: Record<LeadState, Tone> = {
  Nuevo: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
  Contactado: { bg: "bg-sky-50", text: "text-sky-800", dot: "bg-sky-600" },
  "En evaluacion": { bg: "bg-stone-100", text: "text-stone-800", dot: "bg-stone-500" },
  "Propuesta enviada": { bg: "bg-zinc-100", text: "text-zinc-800", dot: "bg-zinc-500" },
  Negociacion: { bg: "bg-blue-50", text: "text-blue-800", dot: "bg-blue-700" },
  Ganado: { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-700" },
  Perdido: { bg: "bg-rose-50", text: "text-rose-800", dot: "bg-rose-700" },
};

const priorityColors: Record<Priority, Tone> = {
  Alta: { bg: "bg-rose-50", text: "text-rose-800" },
  Media: { bg: "bg-stone-100", text: "text-stone-800" },
  Baja: { bg: "bg-emerald-50", text: "text-emerald-800" },
};

const activityStatusColors: Record<ActivityStatus, Tone> = {
  Pendiente: { bg: "bg-slate-100", text: "text-slate-700" },
  "En proceso": { bg: "bg-stone-100", text: "text-stone-800" },
  Completada: { bg: "bg-emerald-50", text: "text-emerald-800" },
  Vencida: { bg: "bg-rose-50", text: "text-rose-800" },
  Reprogramada: { bg: "bg-blue-50", text: "text-blue-800" },
};

const formatMoney = (n: number) => `S/ ${n.toLocaleString("es-PE")}`;

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function Avatar({ value }: { value: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
      {value}
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  return (
    <span className={`inline-flex rounded border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide border-slate-200 ${tone.bg} ${tone.text}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-md border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5 ${className}`}>{children}</div>;
}

function KpiCard({ label, value, sub }: { label: string; value: React.ReactNode; sub: string }) {
  return (
    <Card>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{sub}</p>
    </Card>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">{title}</h2>
      <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">{sub}</p>
    </div>
  );
}

function SideNav<T extends string>({
  items,
  active,
  onChange,
  footer,
  tone,
}: {
  items: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  footer: React.ReactNode;
  tone: "black" | "slate" | "sky";
}) {
  const colors = {
    black: "bg-[#090d14]",
    slate: "bg-[#111827]",
    sky: "bg-[#0b2435]",
  };

  return (
    <aside className={`flex w-full shrink-0 gap-2 overflow-x-auto border-b border-white/10 p-3 text-white md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4 ${colors[tone]}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`shrink-0 border-b-2 px-3 py-2 text-left text-sm font-semibold transition md:border-b-0 md:border-l-2 md:py-2.5 ${
            active === item.id ? "border-sky-400 bg-white/10 text-white" : "border-transparent text-slate-400 hover:border-slate-500 hover:bg-white/5 hover:text-slate-100"
          }`}
          type="button"
        >
          {item.label}
        </button>
      ))}
      <div className="mt-auto hidden border border-white/10 bg-white/5 p-3 text-sm md:block">{footer}</div>
    </aside>
  );
}

function LeadCard({ lead, onStateChange }: { lead: Lead; onStateChange?: (state: LeadState) => void }) {
  const tone = stateColors[lead.state];

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone={tone}>{lead.state}</Badge>
        <Badge tone={lead.sourceType === "conocido" ? stateColors.Nuevo : stateColors.Negociacion}>
          {lead.sourceType === "conocido" ? "Conocido" : "Nuevo"}
        </Badge>
      </div>
      <h3 className="mt-4 font-semibold text-slate-950">{lead.company}</h3>
      <p className="mt-1 text-lg font-semibold text-sky-700">{formatMoney(lead.value)}</p>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <p className="text-sm font-semibold text-slate-800">{lead.contactName}</p>
        <p className="text-xs text-slate-500">{lead.contactRole}</p>
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          <p>{lead.contactPhone}</p>
          <p className="break-all">{lead.contactEmail}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Responsable: {lead.owner}</p>
      <p className="text-xs text-slate-500">
        {lead.source} - {lead.age}
      </p>
      <p className="mt-3 text-sm leading-5 text-slate-600">{lead.note}</p>
      {onStateChange && (
        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Categorizar</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-slate-700"
            onChange={(event) => onStateChange(event.target.value as LeadState)}
            value={lead.state}
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
      )}
    </Card>
  );
}

function LeadsKanban({
  leads,
  onLeadStateChange,
}: {
  leads: Lead[];
  onLeadStateChange: (company: string, state: LeadState) => void;
}) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex min-w-max gap-3 sm:gap-4">
        {states.map((state) => {
          const columnLeads = leads.filter((lead) => lead.state === state);
          const columnValue = columnLeads.reduce((acc, lead) => acc + lead.value, 0);

          return (
            <section key={state} className="flex h-[520px] w-[82vw] shrink-0 flex-col rounded-md border border-slate-200 bg-[#f8fafc] sm:w-80">
              <div className="border-b border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${stateColors[state].dot}`} />
                    <h3 className="truncate font-semibold text-slate-950">{state}</h3>
                  </div>
                  <Badge tone={stateColors[state]}>{columnLeads.length}</Badge>
                </div>
                <p className="mt-2 text-xs font-bold text-slate-500">{formatMoney(columnValue)}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {columnLeads.length === 0 ? (
                  <div className="border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                    Sin leads en esta etapa.
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <LeadCard
                      key={lead.company}
                      lead={lead}
                      onStateChange={(nextState) => onLeadStateChange(lead.company, nextState)}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{activity.type}</p>
          <h3 className="mt-1 font-semibold text-slate-950">{activity.task}</h3>
        </div>
        <Badge tone={activityStatusColors[activity.status]}>{activity.status}</Badge>
      </div>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Deadline</p>
          <p className="font-bold text-slate-800">{activity.deadline}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Prioridad</p>
          <Badge tone={priorityColors[activity.priority]}>{activity.priority}</Badge>
        </div>
        <div>
          <p className="text-xs text-slate-500">Responsable</p>
          <p className="font-bold text-slate-800">{activity.owner.split(" ")[0]}</p>
        </div>
      </div>
    </Card>
  );
}

function SuperTimeline({ executives, history }: { executives: Executive[]; history: HistoricalMonth[] }) {
  const executiveTotals = executives
    .map((executive) => ({
      ...executive,
      closed: history.reduce((acc, month) => acc + (month.executiveClosures[executive.name] ?? 0), 0),
    }))
    .sort((a, b) => b.closed - a.closed);
  const maxClosed = Math.max(...executiveTotals.map((executive) => executive.closed), 1);
  const currentTotals = history.reduce(
    (acc, month) => ({
      won: acc.won + month.currentCustomers.won,
      lost: acc.lost + month.currentCustomers.lost,
      pipeline: acc.pipeline + month.currentCustomers.pipeline,
    }),
    { won: 0, lost: 0, pipeline: 0 },
  );
  const prospectTotals = history.reduce(
    (acc, month) => ({
      won: acc.won + month.prospects.won,
      lost: acc.lost + month.prospects.lost,
      pipeline: acc.pipeline + month.prospects.pipeline,
    }),
    { won: 0, lost: 0, pipeline: 0 },
  );
  const bestArea = currentTotals.won >= prospectTotals.won ? "Clientes actuales" : "Prospectos";
  const bestAreaWon = Math.max(currentTotals.won, prospectTotals.won);
  const maxMonthlyWon = Math.max(
    ...history.map((month) => month.currentCustomers.won + month.prospects.won),
    1,
  );

  return (
    <Card className="mt-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Super timeline comercial</h3>
          <p className="mt-1 text-sm text-slate-500">
            Historico simulado de cierres por ejecutivo y comparativa de jefaturas: clientes actuales vs prospectos.
          </p>
        </div>
        <div className="rounded-md bg-sky-50 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Area mejor posicionada</p>
          <p className="font-semibold text-sky-950">
            {bestArea} ({bestAreaWon} cierres)
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="font-semibold text-slate-950">Cierres acumulados por ejecutivo</h4>
            <div className="mt-4 space-y-4">
              {executiveTotals.map((executive) => (
                <div key={executive.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar value={executive.avatar} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{executive.name}</p>
                        <p className="text-xs text-slate-500">Meta simulada: {executive.leads} leads</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-sky-700">{executive.closed}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${(executive.closed / maxClosed) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="font-semibold text-slate-950">Comparativa de areas</h4>
            {[
              { label: "Clientes actuales", manager: "Jefe Clientes Actuales", totals: currentTotals, tone: "bg-black" },
              { label: "Prospectos", manager: "Jefe Prospectos", totals: prospectTotals, tone: "bg-sky-500" },
            ].map((area) => {
              const total = area.totals.won + area.totals.lost;
              const conversion = total === 0 ? 0 : Math.round((area.totals.won / total) * 100);
              return (
                <div key={area.label} className="mt-4 rounded-md bg-slate-50 p-3">
                  <div className="mb-2 flex justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{area.label}</p>
                      <p className="text-xs text-slate-500">{area.manager}</p>
                    </div>
                    <p className="text-right text-sm font-semibold text-slate-900">{conversion}% conversion</p>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Ganados</p>
                      <p className="font-semibold text-emerald-700">{area.totals.won}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Perdidos</p>
                      <p className="font-semibold text-rose-700">{area.totals.lost}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Pipeline</p>
                      <p className="font-semibold text-sky-700">{formatMoney(area.totals.pipeline)}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div className={`h-full rounded-full ${area.tone}`} style={{ width: `${conversion}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {history.map((month) => {
              const monthWon = month.currentCustomers.won + month.prospects.won;
              return (
                <div key={month.month} className="w-[78vw] shrink-0 rounded-md border border-slate-200 bg-white p-4 sm:w-64">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-950">{month.month}</h4>
                    <Badge tone={stateColors.Ganado}>{monthWon} cierres</Badge>
                  </div>
                  <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${(monthWon / maxMonthlyWon) * 100}%` }} />
                  </div>
                  <div className="space-y-2">
                    {executives.map((executive) => (
                      <div key={executive.name} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-slate-600">{executive.name}</span>
                        <span className="font-semibold text-slate-950">{month.executiveClosures[executive.name] ?? 0}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                    <div className="rounded-md bg-slate-50 p-2">
                      <p className="font-bold text-slate-500">Actuales</p>
                      <p className="text-lg font-semibold text-slate-950">{month.currentCustomers.won}</p>
                    </div>
                    <div className="rounded-md bg-sky-50 p-2">
                      <p className="font-bold text-sky-700">Prospectos</p>
                      <p className="text-lg font-semibold text-sky-950">{month.prospects.won}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

function LeadStatusSummary({ leads, executives }: { leads: Lead[]; executives: Executive[] }) {
  const totalLeads = Math.max(leads.length, 1);

  return (
    <Card className="mt-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Estado de leads del equipo</h3>
          <p className="mt-1 text-sm text-slate-500">Distribucion por etapa y por ejecutivo para seguimiento rapido del jefe.</p>
        </div>
        <Badge tone={stateColors.Contactado}>{leads.length} leads activos</Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {states.map((state) => {
            const count = leads.filter((lead) => lead.state === state).length;
            const pct = Math.round((count / totalLeads) * 100);
            const value = leads.filter((lead) => lead.state === state).reduce((acc, lead) => acc + lead.value, 0);

            return (
              <div key={state} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${stateColors[state].dot}`} />
                    <p className="font-semibold text-slate-900">{state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">{count} leads</p>
                    <p className="text-xs text-slate-500">{formatMoney(value)}</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className={`h-full rounded-full ${stateColors[state].dot}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3">Ejecutivo</th>
                {states.map((state) => (
                  <th key={state} className="px-2 py-3 text-center">
                    {state}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {executives.map((executive) => (
                <tr key={executive.name} className="border-b border-slate-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar value={executive.avatar} />
                      <span className="font-semibold text-slate-950">{executive.name}</span>
                    </div>
                  </td>
                  {states.map((state) => {
                    const count = leads.filter((lead) => lead.owner === executive.name && lead.state === state).length;
                    return (
                      <td key={state} className="px-2 py-3 text-center">
                        <span className={`inline-flex min-w-8 justify-center rounded-full px-2 py-1 text-xs font-semibold ${count > 0 ? `${stateColors[state].bg} ${stateColors[state].text}` : "bg-slate-100 text-slate-400"}`}>
                          {count}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

function AdminView() {
  type Section = "dashboard" | "usuarios" | "leads" | "reportes" | "data";
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const { data, setData } = useDemoData();
  const { executives, leads, users, history } = data;
  const totalPipeline = executives.reduce((acc, item) => acc + item.pipeline, 0);
  const totalWon = executives.reduce((acc, item) => acc + item.won, 0);
  const totalLost = executives.reduce((acc, item) => acc + item.lost, 0);
  const totalAssigned = executives.reduce((acc, item) => acc + item.leads, 0);
  const globalConversion = ((totalWon / totalAssigned) * 100).toFixed(1);

  return (
    <div className="flex min-h-[720px] flex-col md:flex-row">
      <SideNav
        active={activeSection}
        footer={
          <>
            <p className="text-xs uppercase tracking-wider text-sky-200">Sesion</p>
            <p className="mt-1 font-bold">Patricia Mendoza</p>
            <p className="text-xs text-slate-400">Administrador</p>
          </>
        }
        items={[
          { id: "dashboard", label: "Dashboard" },
          { id: "usuarios", label: "Usuarios" },
          { id: "leads", label: "Leads" },
          { id: "reportes", label: "Reportes" },
          { id: "data", label: "Data local" },
        ]}
        onChange={setActiveSection}
        tone="black"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:max-h-[calc(100vh-65px)]">
        {activeSection === "dashboard" && (
          <>
            <SectionHeader title="Panel administrativo" sub="Vista global del CRM, todos los ejecutivos y metricas de negocio." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Pipeline total" value={formatMoney(totalPipeline)} sub="Suma de oportunidades activas" />
              <KpiCard label="Leads ganados" value={totalWon} sub={`Tasa global: ${globalConversion}%`} />
              <KpiCard label="Leads perdidos" value={totalLost} sub="Periodo actual" />
              <KpiCard label="Ejecutivos activos" value={executives.length} sub="Equipo comercial" />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <Card>
                <h3 className="font-semibold text-slate-950">Fuentes de leads</h3>
                {[
                  { label: "Referidos / cartera conocida", pct: 62, count: 34, color: "bg-sky-500" },
                  { label: "Prospeccion directa / nuevos", pct: 38, count: 21, color: "bg-violet-500" },
                ].map((item) => (
                  <div key={item.label} className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-slate-900">
                        {item.count} leads ({item.pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </Card>

              <Card>
                <h3 className="font-semibold text-slate-950">Evolucion mensual</h3>
                {history.map((item) => {
                  const won = item.currentCustomers.won + item.prospects.won;
                  const lost = item.currentCustomers.lost + item.prospects.lost;
                  return (
                  <div key={item.month} className="mt-4 grid grid-cols-[48px_1fr_64px] items-center gap-3">
                    <span className="text-sm font-bold text-slate-500">{item.month}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${(won / 30) * 100}%` }} />
                    </div>
                    <span className="text-right text-sm font-semibold text-slate-900">
                      {won} / -{lost}
                    </span>
                  </div>
                );
                })}
              </Card>
            </div>

            <SuperTimeline executives={executives} history={history} />

            <Card className="mt-6 overflow-x-auto">
              <h3 className="mb-4 font-semibold text-slate-950">Rendimiento por ejecutivo</h3>
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="py-3">Ejecutivo</th>
                    <th className="py-3 text-center">Asignados</th>
                    <th className="py-3 text-center">Gestionados</th>
                    <th className="py-3 text-center">Ganados</th>
                    <th className="py-3 text-center">Perdidos</th>
                    <th className="py-3 text-center">Conversion</th>
                    <th className="py-3 text-right">Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {executives.map((executive) => (
                    <tr key={executive.name} className="border-b border-slate-100">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar value={executive.avatar} />
                          <div>
                            <p className="font-semibold text-slate-950">{executive.name}</p>
                            <p className="text-xs text-slate-500">{executive.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-semibold">{executive.leads}</td>
                      <td className="py-3 text-center font-semibold">{executive.managed}</td>
                      <td className="py-3 text-center font-semibold text-emerald-700">{executive.won}</td>
                      <td className="py-3 text-center font-semibold text-rose-700">{executive.lost}</td>
                      <td className="py-3 text-center">
                        <Badge tone={executive.conversion > 40 ? activityStatusColors.Completada : priorityColors.Media}>
                          {executive.conversion}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-semibold text-sky-700">{formatMoney(executive.pipeline)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {activeSection === "usuarios" && (
          <>
            <SectionHeader title="Gestion de usuarios" sub="Control de accesos y roles del sistema." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Administrador", "Acceso total al sistema y configuracion general.", 1],
                ["Jefe", "Supervision de ejecutivos, asignacion y desempeno.", 1],
                ["Ejecutivo", "Clientes, leads y actividades propios.", 4],
              ].map(([role, desc, count]) => (
                <Card key={String(role)}>
                  <h3 className="font-semibold text-slate-950">{role}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                  <p className="mt-4 text-sm font-bold text-sky-700">{count} usuarios</p>
                </Card>
              ))}
            </div>
            <Card className="mt-6">
              <div className="grid gap-3">
                {users.map((user) => (
                  <div key={user.email} className="grid items-center gap-3 rounded-md border border-slate-100 p-3 md:grid-cols-[1fr_130px_150px_110px_80px]">
                    <div className="flex items-center gap-3">
                      <Avatar value={initials(user.name)} />
                      <div>
                        <p className="font-semibold text-slate-950">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <Badge tone={user.role === "Administrador" ? stateColors.Negociacion : stateColors.Nuevo}>{user.role}</Badge>
                    <span className="text-sm text-slate-500">{user.lastLogin}</span>
                    <Badge tone={user.status === "Activo" ? activityStatusColors.Completada : { bg: "bg-slate-100", text: "text-slate-600" }}>{user.status}</Badge>
                    <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700" type="button">
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeSection === "leads" && (
          <>
            <SectionHeader title="Todos los leads" sub="Vista global de oportunidades con estado, fuente y responsable." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {leads.map((lead) => (
                <LeadCard key={lead.company} lead={lead} />
              ))}
            </div>
          </>
        )}

        {activeSection === "reportes" && (
          <>
            <SectionHeader title="Modulo de reportes" sub="Exportacion dummy a Excel con filtros por fecha, ejecutivo y estado." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Reporte de leads", "Fecha, ejecutivo, estado, fuente", 67],
                ["Reporte de actividades", "Deadline, responsable, prioridad, tipo", 124],
                ["Reporte de KPIs", "Mes, ejecutivo, conversion, pipeline", 18],
              ].map(([name, filters, rows]) => (
                <Card key={String(name)}>
                  <h3 className="font-semibold text-slate-950">{name}</h3>
                  <p className="mt-2 text-sm text-slate-600">Filtros: {filters}</p>
                  <p className="mt-5 text-4xl font-semibold text-sky-700">{rows}</p>
                  <button className="mt-5 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 hover:text-black" type="button">
                    Exportar Excel
                  </button>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeSection === "data" && <DataEditor data={data} setData={setData} />}
      </div>
    </div>
  );
}

function DataEditor({
  data,
  setData,
}: {
  data: DemoData;
  setData: React.Dispatch<React.SetStateAction<DemoData>>;
}) {
  const [draft, setDraft] = useState(() => JSON.stringify(data, null, 2));
  const [message, setMessage] = useState("Edita el JSON y guarda para persistir en localStorage.");

  function saveDraft() {
    try {
      const parsed = JSON.parse(draft) as DemoData;
      if (!Array.isArray(parsed.executives) || !Array.isArray(parsed.customers) || !Array.isArray(parsed.leads) || !Array.isArray(parsed.activities) || !Array.isArray(parsed.users)) {
        setMessage("El JSON debe incluir executives, customers, leads, activities y users como arreglos.");
        return;
      }
      setData(normalizeDemoData(parsed));
      setMessage("Data guardada en localStorage.");
    } catch {
      setMessage("JSON invalido. Corrige la sintaxis antes de guardar.");
    }
  }

  function resetData() {
    setData(initialDemoData);
    setDraft(JSON.stringify(initialDemoData, null, 2));
    setMessage("Data restaurada a la demo inicial.");
  }

  return (
    <>
      <SectionHeader title="Data local editable" sub="Toda la demo se guarda en localStorage por ahora. Puedes editar leads, clientes, usuarios, ejecutivos y actividades desde este JSON." />
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-600">{message}</p>
          <div className="flex gap-2">
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" onClick={resetData} type="button">
              Reset demo
            </button>
            <button className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 hover:text-black" onClick={saveDraft} type="button">
              Guardar data
            </button>
          </div>
        </div>
        <textarea
          className="h-[500px] w-full resize-y rounded-md border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-50 outline-none"
          onChange={(event) => setDraft(event.target.value)}
          spellCheck={false}
          value={draft}
        />
      </Card>
    </>
  );
}

function JefeView() {
  type Section = "dashboard" | "leads" | "actividades" | "alertas";
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const { data, setData } = useDemoData();
  const { executives, leads, activities, history } = data;

  function updateLeadState(company: string, state: LeadState) {
    setData((current) => ({
      ...current,
      leads: current.leads.map((lead) => (lead.company === company ? { ...lead, state } : lead)),
    }));
  }

  return (
    <div className="flex min-h-[720px] flex-col md:flex-row">
      <SideNav
        active={activeSection}
        footer={
          <>
            <p className="text-xs uppercase tracking-wider text-sky-200">Jefe comercial</p>
            <p className="mt-1 font-bold">Carlos Vega</p>
          </>
        }
        items={[
          { id: "dashboard", label: "Equipo" },
          { id: "leads", label: "Leads" },
          { id: "actividades", label: "Actividades" },
          { id: "alertas", label: "Alertas" },
        ]}
        onChange={setActiveSection}
        tone="slate"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:max-h-[calc(100vh-65px)]">
        {activeSection === "dashboard" && (
          <>
            <SectionHeader title="Supervision del equipo" sub="Desempeno individual y asignacion de leads por ejecutivo." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {executives.map((executive) => (
                <Card key={executive.name}>
                  <div className="flex items-center gap-3">
                    <Avatar value={executive.avatar} />
                    <div>
                      <h3 className="font-semibold text-slate-950">{executive.name}</h3>
                      <Badge tone={executive.conversion > 40 ? activityStatusColors.Completada : priorityColors.Media}>
                        Conversion {executive.conversion}%
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <KpiMini label="Asignados" value={executive.leads} />
                    <KpiMini label="Gestionados" value={executive.managed} />
                    <KpiMini label="Ganados" value={executive.won} valueClass="text-emerald-700" />
                    <KpiMini label="Perdidos" value={executive.lost} valueClass="text-rose-700" />
                  </div>
                  <p className="mt-4 rounded-md bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">Pipeline: {formatMoney(executive.pipeline)}</p>
                </Card>
              ))}
            </div>
            <LeadStatusSummary executives={executives} leads={leads} />
            <SuperTimeline executives={executives} history={history} />
          </>
        )}

        {activeSection === "leads" && (
          <>
            <SectionHeader title="Pipeline completo" sub="Tablero por columnas. Desplazate horizontalmente y cambia la categoria desde cada tarjeta." />
            <LeadStatusSummary executives={executives} leads={leads} />
            <div className="mt-6" />
            <LeadsKanban leads={leads} onLeadStateChange={updateLeadState} />
          </>
        )}

        {activeSection === "actividades" && (
          <>
            <SectionHeader title="Actividades del equipo" sub="Seguimiento de tareas con deadline y responsable." />
            <div className="grid gap-4 lg:grid-cols-2">
              {activities.map((activity) => (
                <ActivityCard key={activity.task} activity={activity} />
              ))}
            </div>
          </>
        )}

        {activeSection === "alertas" && (
          <>
            <SectionHeader title="Sistema de alertas" sub="Actividades criticas y leads sin seguimiento reciente." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Actividades vencidas", count: 1, tone: activityStatusColors.Vencida },
                { label: "Proximas a vencer", count: 4, tone: priorityColors.Media },
                { label: "Actividades hoy", count: 3, tone: stateColors.Contactado },
                { label: "Leads sin seguimiento", count: 2, tone: stateColors.Negociacion },
              ].map(({ label, count, tone }) => (
                <Card key={label} className={tone.bg}>
                  <p className={`text-sm font-bold ${tone.text}`}>{label}</p>
                  <p className={`mt-3 text-4xl font-semibold ${tone.text}`}>{count}</p>
                </Card>
              ))}
            </div>
            <Card className="mt-6">
              {[
                "Seguimiento a Alimentos Valles vencido - Diego Salazar - 12 May 17:30",
                "Llamada a Constructora Andina - Camila Rojas - vence hoy 10:30",
                "Propuesta EPS a Textiles Prado - Diego Salazar - vence hoy 16:00",
                "Inversiones Altamar sin actividad registrada en 3 dias",
                "Servicios Mineros Qori - propuesta enviada hace 5 dias sin respuesta",
              ].map((alert) => (
                <div key={alert} className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-b-0">
                  <span className="text-sm text-slate-700">{alert}</span>
                  <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700" type="button">
                    Ver
                  </button>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function KpiMini({ label, value, valueClass = "text-slate-900" }: { label: string; value: number; valueClass?: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function EjecutivoView() {
  type Section = "mis-leads" | "clientes" | "actividades" | "nuevo-lead";
  const [activeSection, setActiveSection] = useState<Section>("mis-leads");
  const { data, setData } = useDemoData();
  const { executives, customers, leads, activities } = data;
  const [selectedExec, setSelectedExec] = useState(executives[0]?.name ?? "");
  const effectiveSelectedExec = executives.some((item) => item.name === selectedExec) ? selectedExec : executives[0]?.name ?? "";
  const executive = executives.find((item) => item.name === effectiveSelectedExec) ?? executives[0];

  const myLeads = useMemo(() => leads.filter((lead) => lead.owner === effectiveSelectedExec), [effectiveSelectedExec, leads]);
  const myCustomers = useMemo(() => customers.filter((customer) => customer.executive === effectiveSelectedExec), [customers, effectiveSelectedExec]);
  const myActivities = useMemo(() => activities.filter((activity) => activity.owner === effectiveSelectedExec), [activities, effectiveSelectedExec]);

  function updateLeadState(company: string, state: LeadState) {
    setData((current) => ({
      ...current,
      leads: current.leads.map((lead) => (lead.company === company ? { ...lead, state } : lead)),
    }));
  }

  return (
    <div className="flex min-h-[720px] flex-col md:flex-row">
      <SideNav
        active={activeSection}
        footer={
          <>
            <p className="text-xs uppercase tracking-wider text-sky-200">Mi perfil</p>
            <p className="mt-1 font-bold">{effectiveSelectedExec}</p>
            <p className="text-xs text-sky-200">Ejecutivo comercial</p>
          </>
        }
        items={[
          { id: "mis-leads", label: "Mis leads" },
          { id: "clientes", label: "Mis clientes" },
          { id: "actividades", label: "Mis actividades" },
          { id: "nuevo-lead", label: "Nuevo lead" },
        ]}
        onChange={setActiveSection}
        tone="sky"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:max-h-[calc(100vh-65px)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 sm:w-auto"
            onChange={(event) => setSelectedExec(event.target.value)}
            value={effectiveSelectedExec}
          >
            {executives.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Mis leads" value={executive?.leads ?? 0} sub="Asignados este periodo" />
          <KpiCard label="Ganados" value={executive?.won ?? 0} sub={`Conversion ${executive?.conversion ?? 0}%`} />
          <KpiCard label="Mi pipeline" value={formatMoney(executive?.pipeline ?? 0)} sub="Oportunidades activas" />
          <KpiCard label="Actividades hoy" value={myActivities.filter((item) => item.deadline.includes("13 May")).length} sub="Pendientes para hoy" />
        </div>

        {activeSection === "mis-leads" && (
          <>
            <SectionHeader title="Mis oportunidades" sub="Tablero personal por columnas. Desplazate horizontalmente y recategoriza cada lead desde su tarjeta." />
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone={stateColors.Nuevo}>Conocidos / referidos: {myLeads.filter((lead) => lead.sourceType === "conocido").length}</Badge>
              <Badge tone={stateColors.Negociacion}>Nuevos / prospeccion: {myLeads.filter((lead) => lead.sourceType === "nuevo").length}</Badge>
            </div>
            <LeadsKanban leads={myLeads} onLeadStateChange={updateLeadState} />
          </>
        )}

        {activeSection === "clientes" && (
          <>
            <SectionHeader title="Mis clientes y prospectos" sub="Cartera personal con historial de interacciones." />
            <div className="grid gap-3">
              {myCustomers.map((customer) => (
                <Card key={customer.name}>
                  <div className="grid gap-4 lg:grid-cols-[1fr_150px_180px_1fr] lg:items-center">
                    <div>
                      <h3 className="font-semibold text-slate-950">{customer.name}</h3>
                      <p className="text-sm text-slate-500">{customer.email}</p>
                      <p className="text-sm text-slate-500">{customer.phone}</p>
                    </div>
                    <Badge tone={customer.type === "Cliente actual" ? activityStatusColors.Completada : stateColors.Nuevo}>{customer.type}</Badge>
                    <div>
                      <p className="text-xs text-slate-500">Contacto</p>
                      <p className="font-bold text-slate-800">{customer.contact}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Ultima interaccion</p>
                      <p className="text-sm text-slate-700">{customer.lastTouch}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeSection === "actividades" && (
          <>
            <SectionHeader title="Mis actividades" sub="Agenda personal de llamadas, reuniones, correos y seguimientos." />
            <div className="grid gap-4">
              {myActivities.map((activity) => (
                <ActivityCard key={activity.task} activity={activity} />
              ))}
            </div>
          </>
        )}

        {activeSection === "nuevo-lead" && (
          <>
            <SectionHeader title="Registrar nuevo lead" sub="Formulario dummy para ingresar un prospecto nuevo." />
            <Card className="max-w-2xl">
              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <button className="rounded-md border-2 border-sky-500 bg-sky-50 p-4 text-left" type="button">
                  <p className="font-semibold text-sky-800">Referido / conocido</p>
                  <p className="mt-1 text-sm text-sky-700">Cartera existente o referido directo</p>
                </button>
                <button className="rounded-md border border-slate-200 bg-slate-50 p-4 text-left" type="button">
                  <p className="font-semibold text-violet-800">Nuevo / prospeccion</p>
                  <p className="mt-1 text-sm text-violet-700">Web, redes sociales o contacto directo</p>
                </button>
              </div>
              {[
                ["Empresa", "Nombre de la empresa"],
                ["Contacto", "Nombre del contacto principal"],
                ["Telefono", "+51 9XX XXX XXX"],
                ["Email", "correo@empresa.pe"],
                ["Valor estimado (S/)", "0.00"],
              ].map(([label, placeholder]) => (
                <label key={label} className="mb-4 block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
                  <input className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" placeholder={placeholder} />
                </label>
              ))}
              <label className="mb-4 block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nota inicial</span>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" placeholder="Contexto del primer contacto, necesidades detectadas..." rows={3} />
              </label>
              <button className="w-full rounded-md bg-sky-950 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700" type="button">
                Registrar lead
              </button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("admin");
  const [data, setData] = useState<DemoData>(() => {
    if (typeof window === "undefined") return initialDemoData;
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? normalizeDemoData(JSON.parse(stored) as Partial<DemoData>) : initialDemoData;
    } catch {
      return initialDemoData;
    }
  });
  const roleItems: { id: Role; label: string; color: string }[] = [
    { id: "admin", label: "Administrador", color: "text-black" },
    { id: "jefe", label: "Jefe comercial", color: "text-slate-900" },
    { id: "ejecutivo", label: "Ejecutivo", color: "text-sky-950" },
  ];

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  return (
    <DemoDataContext.Provider value={{ data, setData }}>
      <main className="min-h-screen bg-[#f4f6f8]">
      <header className="flex min-h-16 flex-col items-stretch gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#090d14] text-sm font-semibold tracking-wide text-sky-300">MN</div>
          <div>
            <p className="font-semibold leading-none text-slate-950">MN Corredores</p>
            <p className="text-xs text-slate-500">CRM comercial</p>
          </div>
        </div>
        <div className="flex w-full gap-1 overflow-x-auto border border-slate-200 bg-slate-50 p-1 lg:ml-auto lg:w-auto lg:flex-wrap lg:overflow-visible">
          {roleItems.map((item) => (
            <button
              className={`shrink-0 px-4 py-2 text-sm font-semibold transition ${
                role === item.id ? `bg-white shadow-sm ${item.color}` : "text-slate-500 hover:text-slate-900"
              }`}
              key={item.id}
              onClick={() => setRole(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-2 text-sm font-bold text-slate-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Entorno demo
        </div>
      </header>

      <section className="p-0">
        <div className="overflow-hidden border-t border-slate-200 bg-white">
          {role === "admin" && <AdminView />}
          {role === "jefe" && <JefeView />}
          {role === "ejecutivo" && <EjecutivoView />}
        </div>
      </section>
      </main>
    </DemoDataContext.Provider>
  );
}
