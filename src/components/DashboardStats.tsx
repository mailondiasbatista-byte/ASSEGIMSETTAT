import React from 'react';
import { Student, ViewTab } from '../types/student';
import { Users, UserCheck, ShieldCheck, HeartHandshake, PlusCircle, Download, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
  onNavigate: (tab: ViewTab) => void;
  onAddMockData: () => void;
  onResetData: () => void;
  onExportCSV: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  onNavigate,
  onAddMockData,
  onResetData,
  onExportCSV,
}) => {
  const total = students.length;
  const novatos = students.filter(s => s.studentType === 'novato');
  const anciaos = students.filter(s => s.studentType === 'anciao');
  
  const novatosCount = novatos.length;
  const anciaosCount = anciaos.length;

  const novatosPercentage = total > 0 ? Math.round((novatosCount / total) * 100) : 0;
  const anciaosPercentage = total > 0 ? Math.round((anciaosCount / total) * 100) : 0;

  // Mentorship stats
  const novatosNeedingMentor = novatos.filter(s => s.wantsMentorship).length;
  const anciaosAvailable = anciaos.filter(s => s.wantsMentorship).length;

  // Course distribution
  const courseCounts = students.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCourses = Object.entries(courseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const ratioText = anciaosCount > 0 
    ? `1 Ancião para ${(novatosCount / anciaosCount).toFixed(1)} Novatos`
    : 'Sem Anciãos registados';

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="/src/assets/images/student_orientation_group_1793637750327.jpg" 
            alt="Estudantes Universitários" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            Plataforma central para controlo da comunidade académica, integração de caloiros, acompanhamento de mentoria e verificação de presenças em eventos.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('register')}
              className="px-5 py-3 text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow-lg transition-all flex items-center gap-2 group"
            >
              <PlusCircle className="w-5 h-5 text-slate-900" />
              Cadastrar Novo Estudante
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('directory')}
              className="px-5 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 rounded-xl transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Ver Lista Completa
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total de Estudantes
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {total}
            </span>
            <span className="text-xs text-slate-500">registados</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Comunidade académica total
          </p>
        </div>

        {/* Novatos (Caloiros) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Novatos (Caloiros)
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {novatosCount}
            </span>
            <span className="text-xs font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              {novatosPercentage}% do total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {novatosNeedingMentor} a solicitar mentoria
          </p>
        </div>

        {/* Anciãos (Veteranos) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Anciãos (Veteranos)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              {anciaosCount}
            </span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
              {anciaosPercentage}% do total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {anciaosAvailable} mentores disponíveis
          </p>
        </div>

        {/* Mentorship Ratio */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Rácio de Integração
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {ratioText}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {anciaosCount >= novatosCount ? 'Balanço ideal de mentores' : 'Necessita de mais Anciãos mentores'}
          </p>
        </div>

      </div>

      {/* Distribution Bars & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Novatos vs Anciãos Visual Proportion Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
            Proporção: Novatos vs Anciãos
            <span className="text-xs text-slate-500 font-normal">Visualização percentual</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Comparação da estrutura de estudantes inscritos na comunidade.
          </p>

          {total === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Sem dados de estudantes para exibir. Cadastre alguns estudantes!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stacked Percentage Bar */}
              <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex p-1 gap-1">
                <div 
                  style={{ width: `${novatosPercentage}%` }}
                  className="bg-indigo-600 h-full rounded-lg transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
                  title={`Novatos: ${novatosCount} (${novatosPercentage}%)`}
                >
                  {novatosPercentage > 10 && `${novatosPercentage}%`}
                </div>
                <div 
                  style={{ width: `${anciaosPercentage}%` }}
                  className="bg-amber-500 h-full rounded-lg transition-all duration-500 flex items-center justify-center text-slate-950 text-xs font-bold"
                  title={`Anciãos: ${anciaosCount} (${anciaosPercentage}%)`}
                >
                  {anciaosPercentage > 10 && `${anciaosPercentage}%`}
                </div>
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 mt-1 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                      Novatos (Caloiros)
                    </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {novatosCount} estudantes
                    </span>
                    <span className="text-xs text-slate-500 block">
                      1º Ano de Ingresso
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                      Anciãos (Veteranos)
                    </span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {anciaosCount} estudantes
                    </span>
                    <span className="text-xs text-slate-500 block">
                      2º ao 5º Ano / Finalistas
                    </span>
                  </div>
                </div>
              </div>

              {/* Mentorship Health Status */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Estado do Programa de Mentoria
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {novatosNeedingMentor} Novatos procuram mentor · {anciaosAvailable} Anciãos disponíveis
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('mentorship')}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Ver Emparelhamento
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Top Courses Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
            Cursos com Mais Registos
            <span className="text-xs text-slate-500 font-normal">Distribuição por Faculdade</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Estatísticas dos cursos com maior representação de estudantes.
          </p>

          {sortedCourses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Nenhum curso registado de momento.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCourses.map(([courseName, count]) => {
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={courseName} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 truncate">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        {courseName}
                      </span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400 tabular-nums shrink-0 ml-2">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Control Actions & Data Management */}
      <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Ações Rápidas de Controlo
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gere dados de teste para demonstração, exporte a lista em CSV ou limpe a base de dados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onAddMockData}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-indigo-500" />
            + Carregar 8 Estudantes Exemplo
          </button>

          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            Exportar CSV
          </button>

          <button
            onClick={onResetData}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Limpar Base de Dados
          </button>
        </div>
      </div>
    </div>
  );
};
