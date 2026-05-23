import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Home, Sparkles, Accessibility, ArrowRight,
  Calendar, ListChecks, HeartHandshake, Brain, ShieldCheck, Smile
} from "lucide-react";
import { SiteNav, SiteFooter } from "../components/SiteNav";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" /> Plataforma de inclusão educacional
            </span>
            
            <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Educação que acolhe, conecta e inclui.
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              EdInConnect aproxima estudantes, professores e famílias com uma plataforma
              simples, acessível e humana.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Conhecer plataforma
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#features" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Ver funcionalidades
              </a>
            </div>
          </div>

          <div className="relative">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* PROBLEMAS */}
      <section id="problemas" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-blue-600">Problemas que resolvemos</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Desafios reais da educação, soluções simples.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ListChecks, title: "Desorganização escolar", desc: "Tarefas, prazos e materiais espalhados." },
            { icon: Accessibility, title: "Falta de inclusão", desc: "Conteúdos que ignoram diferentes formas de aprender." },
            { icon: Home, title: "Família distante da escola", desc: "Pais sem visibilidade sobre o dia a dia dos filhos." },
            { icon: Brain, title: "Dificuldades de aprendizagem", desc: "Pouco suporte individualizado." },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition"
            >
              <div className="w-11 h-11 rounded-lg bg-gray-100 grid place-items-center">
                <p.icon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-gray-600">Funcionalidades principais</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Uma plataforma, três experiências.
          </h2>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={BookOpen}
            title="Dashboard do Estudante"
            items={["Tarefas e metas", "Calendário", "Progresso semanal", "Modo inclusivo"]}
          />
          <FeatureCard
            icon={Users}
            title="Painel do Professor"
            items={["Gestão de turmas", "Atividades", "Relatórios", "Progresso dos alunos"]}
          />
          <FeatureCard
            icon={Home}
            title="Painel da Família"
            items={["Frequência", "Tarefas pendentes", "Avisos", "Progresso do filho"]}
          />
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-lg bg-blue-100 grid place-items-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </span>
              <h3 className="text-xl font-bold">Assistente Virtual IA</h3>
            </div>
            <p className="mt-4 text-gray-600">
              Um companheiro que ajuda a organizar tarefas, simplificar conteúdos e celebrar conquistas.
            </p>
            <Link 
              to="/assistant" 
              className="inline-flex items-center gap-2 mt-6 text-blue-600 font-medium hover:gap-3 transition"
            >
              Conversar com o assistente <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-lg bg-blue-100 grid place-items-center">
                <Accessibility className="w-5 h-5 text-blue-600" />
              </span>
              <h3 className="text-xl font-bold">Modo Inclusivo</h3>
            </div>
            <p className="mt-4 text-gray-600">
              Interface mais simples, com alto contraste e menos distrações.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Alto contraste", "Texto ampliado", "Leitura em áudio", "Menos animações"].map(t => (
                <span key={t} className="px-4 py-2 text-xs bg-gray-100 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section id="impacto" className="mx-auto max-w-7xl px-6 py-24">
        <div className="bg-blue-600 text-white rounded-2xl p-10 md:p-16">
          <Smile className="w-10 h-10 mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Impacto social que começa em uma sala de aula.
          </h2>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl">
            Cada estudante incluído é uma família mais próxima, um professor mais ouvido
            e uma escola mais humana.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-8 max-w-lg">
            {[
              ["+ 10k", "estudantes"],
              ["+ 500", "escolas"],
              ["98%", "satisfação"]
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-4xl font-bold">{n}</div>
                <div className="text-sm text-blue-200 mt-1">{l}</div>
              </div>
            ))}
          </div>

          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 mt-10 px-6 py-3.5 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
          >
            Entrar na plataforma <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  items,
}: { 
  icon: any; 
  title: string; 
  items: string[] 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-7 hover:border-gray-300 transition"
    >
      <div className="w-12 h-12 rounded-lg bg-blue-600 grid place-items-center text-white">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-6 text-xl font-bold">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-gray-600">
        {items.map(i => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />{i}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative aspect-square max-w-lg ml-auto bg-white border border-gray-200 rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600" />
          <div>
            <div className="text-sm font-medium">Olá, Ana!</div>
            <div className="text-xs text-gray-500">Vamos estudar hoje?</div>
          </div>
        </div>
      </div>

      <div className="h-3 bg-gray-200 rounded-full mb-1">
        <div className="h-3 w-[72%] bg-blue-600 rounded-full" />
      </div>
      <div className="text-xs text-gray-500 mb-6">Progresso semanal · 72%</div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { t: "Matemática", v: "3 tarefas" },
          { t: "Português", v: "Concluído" },
          { t: "Ciências", v: "Em pausa" },
          { t: "Inglês", v: "Hoje 14h" },
        ].map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <Calendar className="w-4 h-4 mb-2 text-gray-400" />
            <div className="text-sm font-medium">{c.t}</div>
            <div className="text-xs text-gray-500">{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}