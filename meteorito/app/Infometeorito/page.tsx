// app/participants/page.jsx
import ParticipantCard from "../Components/ParticipantCard";

export const metadata = {
  title: 'Contestants | Planetary Defense',
  description: 'Meet the participants and learn about their projects on meteorites and space security.',
};


const participants = [
  {
    id: 1,
    name: "Kevin Andreé González Martínez",
    role: "Software Engineering Student",
    description: "Up with JavaScript and up with C++, we capybaras are experts in vibe coding and C++ only.",
    icon: "Rocket",
    color: "amber",
  },
  {
    id: 2,
    name: "Ruben Obed Marta Gallegos",
    role: "Software Engineering Student",
    description: "A huge fan of learning new things.",
    icon: "GraduationCap",
    color: "blue",
  },
  {
    id: 3,
    name: "Samuel AbrSamuel Abraham Hernandez Garcia",
    role: "Software Engineering Student",
    description: "I enjoy programming.",
    icon: "Shield",
    color: "green",
  },
  {
    id: 4,
    name: "Andrik Gael González Martínez",
    role: "Software Engineering Student",
    description: "Experto en la composición de acondritas. Busca trazas de vida en fragmentos espaciales.",
    icon: "Flask",
    color: "violet",
  },
  {
    id: 5,
    name: "Diego Alexis Rubio Mota",
    role: "Software Engineering Student",
    description: "Always striving for improvement and learning.",
    icon: "Compass",
    color: "pink",
  },
  {
    id: 6,
    name: "Miguel Angel Orta Lira",
    role: "Software Engineering Student",
    description: "I am passionate about helping others and committed to daily self-improvement.",
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