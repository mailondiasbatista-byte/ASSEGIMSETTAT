import React, { useState } from 'react';
import { Student } from '../types/student';
import { CheckCircle2, QrCode, Search, ShieldCheck, Star, UserCheck, Calendar, Clock, AlertCircle } from 'lucide-react';

interface CheckInScannerProps {
  students: Student[];
  onToggleCheckIn: (studentId: string) => void;
  onSelectPass: (student: Student) => void;
}

export const CheckInScanner: React.FC<CheckInScannerProps> = ({
  students,
  onToggleCheckIn,
  onSelectPass,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const query = inputCode.trim().toLowerCase();
    const match = students.find(s => 
      s.registrationNumber.toLowerCase() === query || 
      s.id.toLowerCase() === query ||
      s.fullName.toLowerCase().includes(query)
    );

    if (match) {
      setFoundStudent(match);
      setNotFound(false);
    } else {
      setFoundStudent(null);
      setNotFound(true);
    }
  };

  const checkedInList = students.filter(s => s.verifiedCheckIn);
  const novatosCheckedIn = checkedInList.filter(s => s.studentType === 'novato');
  const anciaosCheckedIn = checkedInList.filter(s => s.studentType === 'anciao');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Controlo de Presenças em Eventos de Recepção
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ponto de Entrada & Check-in
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Valide o Passe Digital do Estudante inserindo o Número de Matrícula ou ID para confirmar a entrada na festa/receção dos caloiros.
          </p>
        </div>

        {/* Live Attendance Counter */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shrink-0">
          <div className="text-center px-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums block">
              {checkedInList.length}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500">Presentes</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-xs space-y-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold block">
              {novatosCheckedIn.length} Novatos
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold block">
              {anciaosCheckedIn.length} Anciãos
            </span>
          </div>
        </div>
      </div>

      {/* Lookup / Search Controller */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Digitar Nº de Matrícula / Nome do Estudante
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Ex: 20261001 ou 'Mateus Silva'"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <QrCode className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Validar
            </button>
          </div>
        </form>

        {/* Not Found Error Banner */}
        {notFound && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Nenhum estudante encontrado com o código "{inputCode}". Verifique se o cadastro foi efetuado.
          </div>
        )}

        {/* Found Student Result Display Card */}
        {foundStudent && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-indigo-500 space-y-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl ${foundStudent.avatarBgColor || 'bg-indigo-600'} text-white text-2xl font-black flex items-center justify-center shrink-0 shadow-md`}>
                  {foundStudent.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {foundStudent.fullName}
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">
                    {foundStudent.course} · {foundStudent.academicYear}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    Nº Matrícula: {foundStudent.registrationNumber}
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 ${
                foundStudent.studentType === 'novato' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {foundStudent.studentType === 'novato' ? <Star className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {foundStudent.studentType === 'novato' ? 'NOVATO' : 'ANCIÃO'}
              </span>
            </div>

            {/* Check-In Toggle Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => onSelectPass(foundStudent)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver Passe Digital Completo
              </button>

              <button
                onClick={() => {
                  onToggleCheckIn(foundStudent.id);
                  setFoundStudent({
                    ...foundStudent,
                    verifiedCheckIn: !foundStudent.verifiedCheckIn
                  });
                }}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-md ${
                  foundStudent.verifiedCheckIn
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {foundStudent.verifiedCheckIn ? 'Entrada Confirmada (Presente)' : 'Marcar Entrada no Evento'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Attendance List Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
          Lista de Estudantes com Presença Registada
          <span className="text-xs font-normal text-slate-500">
            {checkedInList.length} estudantes presentes
          </span>
        </h3>

        {checkedInList.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Nenhum estudante registou entrada de momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {checkedInList.map(student => (
              <div 
                key={student.id} 
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${student.avatarBgColor || 'bg-indigo-600'} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                    {student.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
                      {student.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {student.course} · {student.studentType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleCheckIn(student.id)}
                  className="text-[10px] font-bold text-rose-500 hover:underline shrink-0"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
