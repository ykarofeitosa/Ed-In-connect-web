import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, ArrowLeft, BookOpen, Lightbulb, Heart, ListChecks } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
});

type Msg = { id: number; who: "ai" | "me"; text: string };

const seed: Msg[] = [
  { id: 1, who: "ai", text: "Oi! Eu sou a Edi. Como posso te ajudar hoje?" },
  { id: 2, who: "ai", text: "Posso organizar suas tarefas, simplificar conteúdos ou só te dar um incentivo." },
];

const cannedReplies = [
  "Vamos organizar suas tarefas? Que tal começarmos pelas mais curtas?",
  "Posso simplificar essa atividade. Me conta com qual matéria você está?",
  "Você está indo muito bem hoje! Que tal uma pausa de 5 minutos?",
  "Posso explicar de outro jeito, com exemplos do dia a dia. Quer tentar?",
  "Combinado! Vou montar um plano leve de estudos para hoje.",
];

const suggestions = [
  { icon: ListChecks, text: "Me ajude a organizar minhas tarefas" },
  { icon: BookOpen,   text: "Simplifique meu conteúdo de matemática" },
  { icon: Lightbulb,  text: "Como estudar para a prova de amanhã?" },
  { icon: Heart,      text: "Estou cansada, o que faço?" },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const id = Date.now();
    setMessages(m => [...m, { id, who: "me", text }]);
    setInput("");
    setTyping(true);
    
    setTimeout(() => {
      const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
      setMessages(m => [...m, { id: id + 1, who: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            to="/student" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-blue-600 grid place-items-center text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold">Edi · Assistente IA</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> online
              </div>
            </div>
          </div>
          
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col">
        <div className="flex-1 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}
              >
                {m.who === "ai" && (
                  <span className="w-8 h-8 mr-2 rounded-lg bg-blue-600 grid place-items-center text-white shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </span>
                )}
                
                <div className={`max-w-[78%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  m.who === "ai"
                    ? "bg-white border border-gray-200"
                    : "bg-blue-600 text-white"
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 grid place-items-center text-white shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span 
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Sugestões */}
        {messages.length <= 2 && (
          <div className="grid sm:grid-cols-2 gap-3 my-6">
            {suggestions.map(s => (
              <button 
                key={s.text} 
                onClick={() => send(s.text)}
                className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition flex items-start gap-3"
              >
                <span className="w-9 h-9 rounded-lg bg-gray-100 grid place-items-center text-gray-700 shrink-0">
                  <s.icon className="w-4 h-4" />
                </span>
                <span className="text-sm leading-tight">{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mt-4 flex gap-2 bg-white border border-gray-200 rounded-xl p-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva para a Edi..."
            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm"
          />
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Enviar <Send className="w-4 h-4" />
          </button>
        </form>
      </main>
    </div>
  );
}