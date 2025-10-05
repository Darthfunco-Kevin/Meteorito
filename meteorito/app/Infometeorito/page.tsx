import {
  Rocket,
  GraduationCap,
  Shield,
  Compass,
  Telescope,
} from "lucide-react";

const iconMap = {
  Rocket,
  GraduationCap,
  Shield,
  Compass,
  Telescope,
};

const colorClasses = {
  amber: "bg-gradient-to-br from-amber-400 to-orange-500",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  green: "bg-gradient-to-br from-emerald-400 to-green-600",
  violet: "bg-gradient-to-br from-violet-400 to-purple-600",
  pink: "bg-gradient-to-br from-pink-400 to-rose-600",
  indigo: "bg-gradient-to-br from-indigo-400 to-blue-600",
};

type Participant = {
  id: number;
  name: string;
  role: string;
  description: string;
  icon: keyof typeof iconMap;
  color: keyof typeof colorClasses;
};

function ParticipantCard({ participant }: { participant: Participant }) {
  const IconComponent = iconMap[participant.icon];
  const colorClass = colorClasses[participant.color];

  return (
    <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 border border-slate-700/50">
      <div className="flex justify-center mb-6">
        <div
          className={`${colorClass} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}
        >
          <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 text-center">
        {participant.name}
      </h3>

      <p
        className={`text-sm font-medium mb-4 text-center ${
          participant.color === "green"
            ? "text-emerald-400"
            : participant.color === "blue"
            ? "text-blue-400"
            : participant.color === "pink"
            ? "text-pink-400"
            : participant.color === "indigo"
            ? "text-indigo-400"
            : "text-slate-400"
        }`}
      >
        {participant.role}
      </p>

      <p className="text-slate-300 text-center text-sm leading-relaxed">
        {participant.description}
      </p>
    </div>
  );
}

const participants: Participant[] = [
  {
    id: 1,
    name: "Kevin Andreé González Martínez",
    role: "Software Engineering Student",
    description:
      "Up with JavaScript and up with C++, we capybaras are experts in vibe coding and C++ only.",
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
    name: "Samuel Abraham Hernandez Garcia",
    role: "Software Engineering Student",
    description: "I enjoy programming.",
    icon: "Shield",
    color: "green",
  },
  {
    id: 4,
    name: "Andrik Gael González Martínez",
    role: "Software Engineering Student",
    description:
      "Experto en la composición de acondritas. Busca trazas de vida en fragmentos espaciales.",
    icon: "Rocket",
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
    description:
      "I am passionate about helping others and committed to daily self-improvement.",
    icon: "Telescope",
    color: "indigo",
  },
];

export default function ParticipantsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <header className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
          Planetary Defense Competition 🌠
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 font-light tracking-wide">
          Meet the 6 members of this team and learn a little about them.
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {participants.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
