import { Search, Users, TrendingUp, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const mockProjects = [
  {
    id: 1,
    title: "EcoTrack - App de Sostenibilidad Urbana",
    description: "Plataforma móvil que ayuda a ciudadanos a rastrear y reducir su huella de carbono con gamificación y recompensas.",
    status: "completed",
    revenue: "$12,500",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
    collaborators: [
      { name: "María González", role: "Computer Science", avatar: "MG", color: "bg-purple-500" },
      { name: "Carlos Ruiz", role: "Diseño UX/UI", avatar: "CR", color: "bg-purple-500" },
      { name: "Ana Torres", role: "Marketing", avatar: "AT", color: "bg-purple-400" },
    ],
    equity: { "Computer Science": "40%", "Diseño UX/UI": "35%", "Marketing": "25%" },
    duration: "3 meses",
    tags: ["Móvil", "Sostenibilidad", "React Native"]
  },
  {
    id: 2,
    title: "ArchiViz - Visualizador 3D para Arquitectos",
    description: "Herramienta web que permite a arquitectos crear renders interactivos en tiempo real para presentar a clientes.",
    status: "completed",
    revenue: "$18,200",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
    collaborators: [
      { name: "Diego Martínez", role: "Arquitectura", avatar: "DM", color: "bg-orange-500" },
      { name: "Laura Chen", role: "Computer Science", avatar: "LC", color: "bg-purple-500" },
      { name: "Roberto Silva", role: "Diseño 3D", avatar: "RS", color: "bg-slate-500" },
    ],
    equity: { "Arquitectura": "35%", "Computer Science": "40%", "Diseño 3D": "25%" },
    duration: "4 meses",
    tags: ["Web", "3D", "Three.js", "WebGL"]
  },
  {
    id: 3,
    title: "FitConnect - Red Social Fitness",
    description: "App que conecta entrenadores personales con clientes, incluye planes de entrenamiento y seguimiento nutricional.",
    status: "in-progress",
    revenue: "En desarrollo",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    collaborators: [
      { name: "Patricia Vega", role: "Nutrición", avatar: "PV", color: "bg-purple-400" },
      { name: "Miguel Ángel", role: "Computer Science", avatar: "MA", color: "bg-purple-500" },
      { name: "Sofia Ramírez", role: "Diseño UX/UI", avatar: "SR", color: "bg-purple-500" },
      { name: "Juan López", role: "Administración", avatar: "JL", color: "bg-slate-600" },
    ],
    equity: { "Nutrición": "25%", "Computer Science": "35%", "Diseño UX/UI": "25%", "Administración": "15%" },
    duration: "2 meses (en curso)",
    tags: ["Móvil", "Salud", "Flutter"]
  },
  {
    id: 4,
    title: "LegalBot - Asistente Legal con IA",
    description: "Chatbot inteligente que ayuda a pequeñas empresas con consultas legales básicas y generación de contratos.",
    status: "completed",
    revenue: "$25,800",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    collaborators: [
      { name: "Alejandra Mora", role: "Derecho", avatar: "AM", color: "bg-purple-700" },
      { name: "Fernando Castro", role: "Computer Science", avatar: "FC", color: "bg-purple-500" },
      { name: "Isabel Navarro", role: "Lingüística", avatar: "IN", color: "bg-purple-600" },
    ],
    equity: { "Derecho": "40%", "Computer Science": "40%", "Lingüística": "20%" },
    duration: "5 meses",
    tags: ["IA", "NLP", "SaaS", "Python"]
  },
  {
    id: 5,
    title: "CulinaryHub - Marketplace para Chefs",
    description: "Plataforma que conecta chefs caseros con clientes locales para eventos y catering personalizado.",
    status: "completed",
    revenue: "$15,600",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    collaborators: [
      { name: "Gabriela Soto", role: "Gastronomía", avatar: "GS", color: "bg-purple-400" },
      { name: "Ricardo Paz", role: "Computer Science", avatar: "RP", color: "bg-purple-500" },
      { name: "Daniela Cruz", role: "Diseño Gráfico", avatar: "DC", color: "bg-purple-300" },
      { name: "Luis Herrera", role: "Administración", avatar: "LH", color: "bg-slate-600" },
    ],
    equity: { "Gastronomía": "30%", "Computer Science": "35%", "Diseño Gráfico": "20%", "Administración": "15%" },
    duration: "3 meses",
    tags: ["Marketplace", "E-commerce", "Next.js"]
  },
  {
    id: 6,
    title: "EduStream - Plataforma de Cursos en Vivo",
    description: "Sistema de streaming educativo con pizarra interactiva y herramientas de colaboración en tiempo real.",
    status: "in-progress",
    revenue: "En desarrollo",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
    collaborators: [
      { name: "Andrés Jiménez", role: "Pedagogía", avatar: "AJ", color: "bg-purple-400" },
      { name: "Valeria Ortiz", role: "Computer Science", avatar: "VO", color: "bg-purple-500" },
      { name: "Tomás Reyes", role: "Diseño UX/UI", avatar: "TR", color: "bg-purple-500" },
    ],
    equity: { "Pedagogía": "30%", "Computer Science": "45%", "Diseño UX/UI": "25%" },
    duration: "4 meses (en curso)",
    tags: ["EdTech", "Streaming", "WebRTC"]
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
            Proyectos Colaborativos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            En CoopWork, emprendedores de distintas carreras se unen para ejecutar proyectos reales. 
            Cada proyecto tiene roles claros, reparto de ganancias transparente y equipos multidisciplinarios.
          </p>
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-sm text-gray-600">Transparencia en reparto de ganancias</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">+15</div>
              <p className="text-sm text-gray-600">Carreras diferentes colaborando</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">Real</div>
              <p className="text-sm text-gray-600">Proyectos con impacto y ganancias</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar proyectos por tecnología, carrera o industria..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Proyectos Completados</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Colaboradores Activos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">$180K+</p>
                <p className="text-sm text-gray-600">Ganancias Generadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  {project.status === 'completed' ? (
                    <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Completado
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      En Progreso
                    </span>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Collaborators */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Equipo Colaborativo:</p>
                  <div className="space-y-2">
                    {project.collaborators.map((collab, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${collab.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                            {collab.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{collab.name}</p>
                            <p className="text-xs text-gray-500">{collab.role}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-purple-600">
                          {project.equity[collab.role]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Duración</p>
                    <p className="text-sm font-semibold text-gray-900">{project.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ganancias</p>
                    <p className="text-sm font-semibold text-green-600">{project.revenue}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium text-sm group-hover:gap-3">
                    Ver más
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">¿Tienes una idea de proyecto?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a CoopWork y encuentra el equipo perfecto para hacerla realidad
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
