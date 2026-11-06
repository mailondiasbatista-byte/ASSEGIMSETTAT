import React, { useState } from 'react';
import { Student, StudentType, COURSES } from '../types/student';
import { Search, Filter, Grid, List, Phone, Mail, Award, Trash2, ExternalLink, Star, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface StudentDirectoryProps {
  students: Student[];
  onSelectPass: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onRegisterClick: () => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  onSelectPass,
  onDeleteStudent,
  onRegisterClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<StudentType | 'todos'>('todos');
  const [selectedCourse, setSelectedCourse] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredStudents = students.filter(student => {
    // Type filter
    if (selectedType !== 'todos' && student.studentType !== selectedType) {
      return false;
    }
    // Course filter
    if (selectedCourse !== 'todos' && student.course !== selectedCourse) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.fullName.toLowerCase().includes(q);
      const matchNum = student.registrationNumber.toLowerCase().includes(q);
      const matchEmail = student.email.toLowerCase().includes(q);
      const matchCourse = student.course.toLowerCase().includes(q);
      const matchHobby = student.hobbies.some(h => h.toLowerCase().includes(q));
      return matchName || matchNum || matchEmail || matchCourse || matchHobby;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Directory Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Diretório Geral de Estudantes
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {filteredStudents.length} de {students.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consulte, filtre e gira o passe digital de Novatos e Anciãos registados.
          </p>
        </div>

        <button
          onClick={onRegisterClick}
          className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shrink-0 flex items-center gap-2"
        >
          + Cadastrar Estudante
        </button>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, nº estudante, curso ou hobby..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full lg:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedType('todos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'todos' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Todos ({students.length})
            </button>

            <button
              onClick={() => setSelectedType('novato')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                selectedType === 'novato' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Novatos ({students.filter(s => s.studentType === 'novato').length})
            </button>

            <button
              onClick={() => setSelectedType('anciao')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                selectedType === 'anciao' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Anciãos ({students.filter(s => s.studentType === 'anciao').length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="todos">Todos os Cursos</option>
              {COURSES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'
                }`}
                title="Vista em Grelha"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'
                }`}
                title="Vista em Tabela"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Directory Content List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Filter className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhum estudante encontrado
          </h3>
          <p className="text-xs text-slate-500">
            Tente mudar o termo de pesquisa ou os filtros selecionados.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map(student => {
            const isNovato = student.studentType === 'novato';
            const cleanPhone = student.phone.replace(/[^0-9]/g, '');

            return (
              <div 
                key={student.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-5 space-y-4">
                  
                  {/* Top Badge & Student ID */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isNovato 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {isNovato ? <Star className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {isNovato ? 'NOVATO' : 'ANCIÃO'}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      Nº {student.registrationNumber}
                    </span>
                  </div>

                  {/* Student Profile Identity */}
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${student.avatarBgColor || 'bg-indigo-600'} text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-inner`}>
                      {student.fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {student.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                        {student.course}
                      </p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {student.academicYear}
                      </span>
                    </div>
                  </div>

                  {/* Bio quote */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{student.bio}"
                  </p>

                  {/* Hobbies Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {student.hobbies.slice(0, 3).map(h => (
                      <span key={h} className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Mentorship Indicator */}
                  {student.wantsMentorship && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      {isNovato ? 'Procura Mentor' : 'Mentor Disponível'}
                    </div>
                  )}

                </div>

                {/* Footer Action Bar */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* WhatsApp Action */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Contactar via WhatsApp"
                        className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Email Action */}
                    <a
                      href={`mailto:${student.email}`}
                      title="Enviar Email"
                      className="p-2 rounded-lg bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPass(student)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Passe Digital
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remover ${student.fullName} do diretório?`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                      title="Remover Estudante"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Estudante</th>
                <th className="p-4">Estatuto</th>
                <th className="p-4">Nº Matrícula</th>
                <th className="p-4">Curso / Ano</th>
                <th className="p-4">Mentoria</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(student => {
                const isNovato = student.studentType === 'novato';
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${student.avatarBgColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center shrink-0`}>
                        {student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block font-bold">{student.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{student.email}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                        isNovato ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isNovato ? 'NOVATO' : 'ANCIÃO'}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {student.registrationNumber}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{student.course}</span>
                      <span className="text-[10px] text-slate-400">{student.academicYear}</span>
                    </td>

                    <td className="p-4">
                      {student.wantsMentorship ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Sim
                        </span>
                      ) : (
                        <span className="text-slate-400">Não</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectPass(student)}
                        className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 rounded-md"
                      >
                        Passe
                      </button>
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      )}

    </div>
  );
};
