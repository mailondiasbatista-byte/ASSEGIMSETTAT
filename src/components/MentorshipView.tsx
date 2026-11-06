import React, { useState } from 'react';
import { Student } from '../types/student';
import { HeartHandshake, Star, ShieldCheck, Sparkles, MessageSquare, Phone, CheckCircle2, UserCheck, ArrowRight, BookOpen } from 'lucide-react';

interface MentorshipViewProps {
  students: Student[];
  onSelectPass: (student: Student) => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({
  students,
  onSelectPass,
}) => {
  const novatosSeeking = students.filter(s => s.studentType === 'novato' && s.wantsMentorship);
  const anciaosAvailable = students.filter(s => s.studentType === 'anciao' && s.wantsMentorship);

  const [selectedNovato, setSelectedNovato] = useState<Student | null>(novatosSeeking[0] || null);

  // Find best matching Anciãos for selected Novato based on Course & Hobbies
  const suggestedMentors = selectedNovato
    ? anciaosAvailable.map(anciao => {
        let matchScore = 0;
        if (anciao.course === selectedNovato.course) matchScore += 50;
        const sharedHobbies = anciao.hobbies.filter(h => selectedNovato.hobbies.includes(h));
        matchScore += sharedHobbies.length * 15;

        return {
          anciao,
          matchScore,
          sharedHobbies,
          isSameCourse: anciao.course === selectedNovato.course
        };
      }).sort((a, b) => b.matchScore - a.matchScore)
    : [];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            Programa de Acolhimento & Integração
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Central de Mentoria: Novatos & Anciãos
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Emparelhamento inteligente entre veteranos e caloiros do mesmo curso para apoio nos exames, orientações académicas e vida académica.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Star className="w-4 h-4 text-indigo-400" />
              <span>{novatosSeeking.length} Novatos à procura de mentor</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{anciaosAvailable.length} Anciãos mentores registados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Split: Novatos Column & Suggested Mentors Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Novatos seeking mentorship */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Novatos (Caloiros)
              </h3>
              <p className="text-xs text-slate-500">Selecione um novato para ver mentores recomendados</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              {novatosSeeking.length}
            </span>
          </div>

          {novatosSeeking.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhum novato a solicitar mentoria no momento.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {novatosSeeking.map(novato => {
                const isSelected = selectedNovato?.id === novato.id;

                return (
                  <button
                    key={novato.id}
                    onClick={() => setSelectedNovato(novato)}
                    className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${novato.avatarBgColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center shrink-0`}>
                        {novato.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white text-sm block truncate">
                          {novato.fullName}
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block truncate">
                          {novato.course}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Suggested Mentors for Selected Novato */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {selectedNovato ? (
            <>
              {/* Selected Novato Card Info */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Estudante Novato Selecionado
                  </span>
                  <button
                    onClick={() => onSelectPass(selectedNovato)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Ver Passe
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${selectedNovato.avatarBgColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center shrink-0`}>
                    {selectedNovato.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {selectedNovato.fullName}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {selectedNovato.course} · {selectedNovato.academicYear}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                  "{selectedNovato.bio}"
                </p>
              </div>

              {/* Mentors list */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                  Anciãos Mentores Recomendados
                  <span className="text-xs text-slate-500 font-normal">Ordenados por compatibilidade</span>
                </h3>

                {suggestedMentors.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Nenhum mentor disponível de momento.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestedMentors.map(({ anciao, matchScore, sharedHobbies, isSameCourse }) => {
                      const cleanPhone = anciao.phone.replace(/[^0-9]/g, '');

                      return (
                        <div
                          key={anciao.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400/60 transition-all shadow-sm space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl ${anciao.avatarBgColor || 'bg-amber-500'} text-slate-950 font-bold text-lg flex items-center justify-center shrink-0 shadow-sm`}>
                                {anciao.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                  {anciao.fullName}
                                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                                  {anciao.course} · {anciao.academicYear}
                                </span>
                              </div>
                            </div>

                            {/* Match Compatibility Badge */}
                            <div className="text-right shrink-0">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                matchScore >= 50 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              }`}>
                                {matchScore}% Compatível
                              </span>
                            </div>
                          </div>

                          {/* Match reasons */}
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            {isSameCourse && (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                Mesmo Curso
                              </span>
                            )}
                            {sharedHobbies.map(h => (
                              <span key={h} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {h}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                            "{anciao.bio}"
                          </p>

                          {/* Connect CTA */}
                          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] text-slate-400">
                              Contacto directo de mentoria
                            </span>

                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}?text=Olá%20${encodeURIComponent(anciao.fullName)},%20sou%20o%20novato%20${encodeURIComponent(selectedNovato.fullName)}%20do%20curso%20de%20${encodeURIComponent(selectedNovato.course)}.%20Gostaria%20de%20te%20contactar%20para%20mentoria!`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Conectar no WhatsApp
                              </a>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400 text-sm">
              Selecione um Novato à esquerda para ver os Anciãos mentores sugeridos.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
