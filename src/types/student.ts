export type StudentType = 'novato' | 'anciao';

export type Gender = 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_dizer';

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  studentType: StudentType;
  course: string;
  academicYear: string;
  registrationNumber: string;
  gender: Gender;
  avatarUrl?: string;
  avatarBgColor?: string;
  hobbies: string[];
  bio: string;
  wantsMentorship: boolean; // Se Novato: quer mentor; Se Ancião: quer ser mentor
  registeredAt: string;
  verifiedCheckIn?: boolean;
}

export type ViewTab = 'dashboard' | 'register' | 'directory' | 'mentorship' | 'checkin';

export const COURSES = [
  'Engenharia Informática',
  'Medicina & Ciências da Saúde',
  'Direito & Relações Internacionais',
  'Gestão de Empresas & Contabilidade',
  'Arquitetura & Urbanismo',
  'Engenharia Civil',
  'Economia & Finanças',
  'Enfermagem',
  'Psicologia & Ciências Sociais',
  'Comunicação Social & Jornalismo',
  'Engenharia Mecatrónica',
  'Agronomia & Recursos Naturais'
];

export const HOBBIES = [
  'Programação & Tech',
  'Futebol & Desporto',
  'Música & Canto',
  'Leitura & Debates',
  'Fotografia & Vídeo',
  'Voluntariado',
  'Jogos & eSports',
  'Arte & Design',
  'Xadrez & Jogos de Raciocínio',
  'Dança & Cultura'
];
