import React, { useState } from 'react';
import { Student, StudentType, Gender, COURSES, HOBBIES } from '../types/student';
import confetti from 'canvas-confetti';
import { UserPlus, Sparkles, CheckCircle2, Shield, Star, BookOpen, Hash, Phone, Mail, User, Info, ArrowRight } from 'lucide-react';

interface RegistrationFormProps {
  onRegisterStudent: (newStudent: Student) => void;
  onCancel: () => void;
}

const AVATAR_COLORS = [
  { label: 'Índigo', bgClass: 'bg-indigo-500' },
  { label: 'Âmbar', bgClass: 'bg-amber-500' },
  { label: 'Esmeralda', bgClass: 'bg-emerald-500' },
  { label: 'Púrpura', bgClass: 'bg-purple-500' },
  { label: 'Azul', bgClass: 'bg-blue-500' },
  { label: 'Rosa', bgClass: 'bg-rose-500' },
  { label: 'Laranja', bgClass: 'bg-orange-500' },
  { label: 'Teal', bgClass: 'bg-teal-500' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegisterStudent,
  onCancel,
}) => {
  const [studentType, setStudentType] = useState<StudentType>('novato');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(COURSES[0]);
  const [customCourse, setCustomCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('1º Ano');
  const [registrationNumber, setRegistrationNumber] = useState(() => {
    return `2026${Math.floor(1000 + Math.random() * 9000)}`;
  });
  const [gender, setGender] = useState<Gender>('masculino');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(['Programação & Tech']);
  const [bio, setBio] = useState('');
  const [wantsMentorship, setWantsMentorship] = useState(true);
  const [avatarBgColor, setAvatarBgColor] = useState('bg-indigo-500');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredStudentId, setRegisteredStudentId] = useState<string | null>(null);

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== hobby));
    } else {
      if (selectedHobbies.length < 5) {
        setSelectedHobbies([...selectedHobbies, hobby]);
      }
    }
  };

  const handleGenerateNewId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setRegistrationNumber(`${year}${randomNum}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      alert('Por favor preencha o Nome Completo e o Email.');
      return;
    }

    const finalCourse = course === 'Outro' ? (customCourse.trim() || 'Curso Geral') : course;
    const newId = `std-${Date.now()}`;

    const newStudent: Student = {
      id: newId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+244 900 000 000',
      studentType,
      course: finalCourse,
      academicYear,
      registrationNumber,
      gender,
      avatarBgColor,
      hobbies: selectedHobbies,
      bio: bio.trim() || (studentType === 'novato' 
        ? 'Estudante Novato pronto para iniciar a jornada universitária!' 
        : 'Estudante Ancião disponível para orientar a nova comunidade.'),
      wantsMentorship,
      registeredAt: new Date().toISOString(),
      verifiedCheckIn: true
    };

    onRegisterStudent(newStudent);
    setRegisteredStudentId(newId);
    setIsSuccess(true);

    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback if confetti canvas fails
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Registo Efetuado com Sucesso!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Bem-vindo à AcademiaConnect, {fullName}!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {studentType === 'novato' 
              ? 'O teu cadastro como Novato (Caloiro) foi registado. Já podes aceder à tua credencial e encontrar um mentor.'
              : 'O teu registo como Ancião (Veterano) foi confirmado. Obrigado por apoiares a nova geração de estudantes!'}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500">Número de Estudante:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estatuto:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{studentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Curso:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{course === 'Outro' ? customCourse : course}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            Ver Diretório de Estudantes
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              setIsSuccess(false);
              setFullName('');
              setEmail('');
              setPhone('');
              setBio('');
            }}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cadastrar Outro Estudante
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Form Title */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            <UserPlus className="w-3.5 h-3.5" />
            Formulário de Registo Académico
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Registo de Estudante
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Indica os teus dados e escolhe se és Novato (Caloiro) ou Ancião (Veterano).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* STEP 1: Student Category / Role Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              1. Qual é o teu Estatuto Académico? <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option: Novato */}
              <button
                type="button"
                onClick={() => {
                  setStudentType('novato');
                  setAcademicYear('1º Ano');
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative flex items-start gap-4 ${
                  studentType === 'novato'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  studentType === 'novato' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Star className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      Novato (Caloiro)
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      1º Ano
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Recém-admitido na universidade. Procura orientação, colegas de curso e mentoria.
                  </p>
                </div>
              </button>

              {/* Option: Ancião */}
              <button
                type="button"
                onClick={() => {
                  setStudentType('anciao');
                  setAcademicYear('3º Ano');
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative flex items-start gap-4 ${
                  studentType === 'anciao'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  studentType === 'anciao' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      Ancião (Veterano)
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      2º - 5º Ano
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Estudante experiente na faculdade. Disponível para orientar e acolher os novos caloiros.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* STEP 2: Personal Identification */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              2. Dados Pessoais
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome Completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Mateus Domingos Silva"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Universitário / Pessoal <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: estudante@univ.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Telefone / WhatsApp (Para Mentoria)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Género
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_dizer">Prefiro não dizer</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: Academic Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              3. Dados Académicos
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Curso / Faculdade <span className="text-rose-500">*</span>
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Outro">Outro Curso...</option>
                </select>
              </div>

              {course === 'Outro' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Especifique o Curso
                  </label>
                  <input
                    type="text"
                    value={customCourse}
                    onChange={(e) => setCustomCourse(e.target.value)}
                    placeholder="Nome do curso"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ano Académico
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {studentType === 'novato' ? (
                    <option value="1º Ano">1º Ano (Novato / Caloiro)</option>
                  ) : (
                    <>
                      <option value="2º Ano">2º Ano</option>
                      <option value="3º Ano">3º Ano</option>
                      <option value="4º Ano">4º Ano</option>
                      <option value="5º Ano">5º Ano (Finalista)</option>
                      <option value="Mestrado">Mestrado / Pós-Graduação</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Número de Estudante / Matrícula</span>
                  <button
                    type="button"
                    onClick={handleGenerateNewId}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Gerar Novo
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

            </div>
          </div>

          {/* STEP 4: Personalization & Hobbies */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              4. Perfil, Interesses e Mentoria
            </label>

            {/* Avatar Badge Color Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Cor do Distintivo de Estudante
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map(c => (
                  <button
                    type="button"
                    key={c.bgClass}
                    onClick={() => setAvatarBgColor(c.bgClass)}
                    className={`w-9 h-9 rounded-xl ${c.bgClass} flex items-center justify-center text-white text-xs font-bold transition-transform ${
                      avatarBgColor === c.bgClass ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {fullName ? fullName.charAt(0).toUpperCase() : 'E'}
                  </button>
                ))}
              </div>
            </div>

            {/* Hobbies Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hobbies e Interesses (Até 5 escolhas)
              </label>
              <div className="flex flex-wrap gap-2">
                {HOBBIES.map(hobby => {
                  const isSelected = selectedHobbies.includes(hobby);
                  return (
                    <button
                      type="button"
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {hobby}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio / Intro Quote */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pequena Apresentação / Biografia
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={studentType === 'novato' 
                  ? 'Ex: Sou caloiro de TI e gostaria de ajuda na cadeira de Programação!' 
                  : 'Ex: Sou do 4º Ano e posso ajudar com dicas de estudo e preparação de exames.'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mentorship Option Checkbox */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
              <input
                type="checkbox"
                id="wantsMentorship"
                checked={wantsMentorship}
                onChange={(e) => setWantsMentorship(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="wantsMentorship" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
                <span className="font-bold block text-slate-900 dark:text-white text-sm">
                  {studentType === 'novato' ? 'Ativar Pedido de Mentoria' : 'Disponibilizar-se como Mentor de Caloiros'}
                </span>
                {studentType === 'novato' 
                  ? 'Gostaria de ser associado a um Ancião (Veterano) do teu curso para orientação universitária.'
                  : 'Aparecer na lista de Mentores disponíveis para ajudar novos estudantes.'}
              </label>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar e Cadastrar Estudante
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
