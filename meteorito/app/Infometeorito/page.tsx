// app/participants/page.jsx
import ParticipantCard from "../Components/ParticipantCard";

export const metadata = {
  title: 'Contestants | Planetary Defense',
  description: 'Meet the participants and learn about their projects on meteorites and space security.',
};


const participants = [
  {
    id: 1,
    name: "Dr. Elena Rojas",
    role: "Astrofísica y Cazadora de Meteoritos",
    description: "Especialista en condritas y meteoritos primitivos. Su lema: 'La respuesta está en el polvo estelar'.",
    icon: "Rocket",
    color: "amber",
  },
  {
    id: 2,
    name: "Javier Ríos",
    role: "Estudiante de Geología Espacial",
    description: "Apasionado por los impactos históricos. Su proyecto se centra en el cráter Chicxulub.",
    icon: "GraduationCap",
    color: "blue",
  },
  {
    id: 3,
    name: "Sofía Martínez",
    role: "Ingeniera de Defensa Planetaria",
    description: "Trabaja en modelos de desviación de NEOs. Enfoque en el impacto cinético (Misión DART).",
    icon: "Shield",
    color: "green",
  },
  {
    id: 4,
    name: "Ricardo Peña",
    role: "Químico Analítico",
    description: "Experto en la composición de acondritas. Busca trazas de vida en fragmentos espaciales.",
    icon: "Flask",
    color: "violet",
  },
  {
    id: 5,
    name: "Luisa Méndez",
    role: "Diseñadora de Misiones Espaciales",
    description: "Crea rutas orbitales para la búsqueda de nuevos NEOs. Precisión y órbitas estables.",
    icon: "Compass",
    color: "pink",
  },
  {
    id: 6,
    name: "Carlos Gómez",
    role: "Astrónomo Aficionado con Telescopio",
    description: "Monitoriza asteroides cercanos con su observatorio personal. Contribuye a la IAWN.",
    icon: "Telescope",
    color: "indigo",
  },
];
// ----------------------------------------------------

export default function ParticipantsPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Encabezado Principal */}
      <header className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-extrabold text-cyan-400 mb-4">
          Planetary Defense Competition 🌠
        </h1>
        <p className="text-xl text-gray-400">
          Meet the 6 members of this team and learn a little about them.
        </p>
      </header>

      {/* Contenedor Grid (La cuadrícula 3x2) */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {participants.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      </div>
      
    </div>
  );
}