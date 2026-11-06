import React, { useEffect, useState } from 'react';
import { Student } from '../types/student';
import { generateStudentQRCode, formatDatePortuguese } from '../utils/qrCode';
import { X, Printer, CheckCircle, ShieldCheck, Star, QrCode, Building, Award } from 'lucide-react';

interface StudentPassModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentPassModal: React.FC<StudentPassModalProps> = ({
  student,
  onClose,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (student) {
      const payload = JSON.stringify({
        id: student.id,
        num: student.registrationNumber,
        name: student.fullName,
        type: student.studentType,
        course: student.course,
      });
      generateStudentQRCode(payload).then(setQrCodeUrl);
    }
  }, [student]);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const isNovato = student.studentType === 'novato';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 space-y-0">
        
        {/* Modal Top Control Bar */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <Award className="w-4 h-4 text-indigo-500" />
            Cartão Digital do Estudante
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 sm:p-8 space-y-6">
          <div 
            id="printable-student-pass"
            className={`rounded-2xl border-2 p-6 shadow-xl relative overflow-hidden text-slate-900 ${
              isNovato 
                ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border-indigo-500/50' 
                : 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white border-amber-500/50'
            }`}
          >
            {/* Background watermark icon */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Building className="w-56 h-56 text-white" />
            </div>

            {/* Card Header */}
            <div className="flex justify-between items-start border-b border-white/15 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 opacity-80 block">
                  REPÚBLICA ACADÉMICA · UNIVERSIDADE
                </span>
                <h3 className="text-lg font-black tracking-tight text-white uppercase">
                  Passe do Estudante
                </h3>
              </div>

              <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                isNovato ? 'bg-indigo-500 text-white' : 'bg-amber-400 text-slate-950'
              }`}>
                {isNovato ? <Star className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {isNovato ? 'NOVATO' : 'ANCIÃO'}
              </div>
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              
              {/* Photo / Avatar */}
              <div className="flex flex-col items-center justify-center">
                <div className={`w-24 h-24 rounded-2xl ${student.avatarBgColor || 'bg-indigo-600'} flex items-center justify-center text-white text-3xl font-extrabold shadow-inner border-2 border-white/30`}>
                  {student.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-mono opacity-60 mt-1">
                  ID: {student.registrationNumber}
                </span>
              </div>

              {/* Info columns */}
              <div className="sm:col-span-2 space-y-2 text-left">
                <div>
                  <span className="text-[10px] uppercase text-slate-300 font-semibold block">Nome Completo</span>
                  <p className="text-base font-bold text-white leading-tight">
                    {student.fullName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-300 font-semibold block">Curso</span>
                    <p className="font-semibold text-indigo-200 truncate">{student.course}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-300 font-semibold block">Ano Lectivo</span>
                    <p className="font-semibold text-white">{student.academicYear}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-300 font-semibold block">Contacto Mentoria</span>
                  <p className="text-xs font-mono text-slate-200">{student.phone}</p>
                </div>
              </div>

            </div>

            {/* Card Footer with QR Code */}
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  CADASTRO ATIVO
                </div>
                <span className="text-[9px] text-slate-400 block font-mono">
                  Inscrição: {formatDatePortuguese(student.registeredAt)}
                </span>
              </div>

              {/* QR Code display */}
              {qrCodeUrl ? (
                <div className="bg-white p-1.5 rounded-lg shadow-md shrink-0">
                  <img src={qrCodeUrl} alt="QR Code Estudante" className="w-14 h-14" />
                </div>
              ) : (
                <QrCode className="w-10 h-10 text-white/50" />
              )}
            </div>

          </div>

          {/* Action buttons inside Modal */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-indigo-500" />
              Imprimir Passe
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
