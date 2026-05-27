import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, CursorState, CaseStudy, TimelineEvent, PlaygroundItem } from '../types';

interface PortfolioContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  showBrief: boolean;
  setShowBrief: (show: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  cases: CaseStudy[];
  timelineEvents: TimelineEvent[];
  playgroundItems: PlaygroundItem[];
  t: (key: string) => string;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('RU');
  const [theme, setTheme] = useState<Theme>('light');
  const [cursorState, setCursorState] = useState<CursorState>({ type: 'default' });
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle system theme matching
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Static translations database (Medtech / Healthcare IT Focus)
  const translations: Record<Language, Record<string, string>> = {
    RU: {
      'nav.home': 'Главная',
      'nav.projects': 'Кейсы',
      'nav.about': 'Экспертиза',
      'nav.playground': 'R&D Лаб',
      'nav.brief': 'Начать проект',
      'hero.badge': 'IT-разработка в сфере здравоохранения • Q3 2026',
      'hero.badge.short': 'Медицинские IT • Q3 2026',
      'hero.title.part1': 'Создаем',
      'hero.title.accent': 'цифровой дзен',
      'hero.title.part2': 'для технологичных продуктов',
      'hero.desc': 'Проектирование и разработка медицинских информационных систем и защищенных телемедицинских платформ в ритме спокойной ясности.',
      'hero.cta': 'Запустить бриф',
      'hero.scroll': 'Прокрутите вниз',
      'projects.title': 'Цифровые решения',
      'projects.subtitle': 'Мы разрабатываем умные, отказоустойчивые и безопасные системы для практикующих врачей и пациентов',
      'projects.filter.all': 'Все направления',
      'projects.filter.saas': 'Клиники & SaaS',
      'projects.filter.mobile': 'Пациенты & Mobile',
      'projects.filter.websites': 'Порталы & EHR',
      'projects.filter.playground': 'R&D Лаб',
      'about.title': 'Наш опыт в MedTech',
      'about.subtitle': 'Как наши компетенции в разработке медицинского софта помогают спасать жизни и оцифровывать клиники',
      'about.downloadCv': 'Медицинская презентация',
      'about.downloadCv.loading': 'Загрузка презентации...',
      'about.downloadCv.success': 'Презентация загружена',
      'playground.title': 'R&D Лаборатория',
      'playground.subtitle': 'Экспериментальные виджеты мед-приборов, прототипы МРТ-рендеринга и интеграции со сложных медицинским IoT',
      'brief.title': 'Медицинский MedTech-Бриф',
      'brief.subtitle': 'Разработайте спецификацию клиники или приложения вместе с нашими архитекторами',
      'brief.step1': 'Какова специализация вашей системы?',
      'brief.step2': 'Инвестиционный бюджет разработки',
      'brief.step3': 'Контакты и ключевое ТЗ проекта',
      'brief.next': 'Далее',
      'brief.prev': 'Назад',
      'brief.submit': 'Отправить бриф',
      'brief.success.title': 'Бриф принят!',
      'brief.success.desc': 'Наши ведущие системные архитекторы ознакомятся с вашей задачей и представят защищенный протокол интеграции в течение 24 часов.',
      'brief.success.close': 'Закрыть',
      'case.liveProject': 'Боевой сервер',
      'case.client': 'Заказчик',
      'case.role': 'Роль разработки',
      'case.duration': 'Сроки спринтов',
      'case.nextProject': 'Следующий MedTech кейс',
      'case.prevProject': 'Предыдущий MedTech кейс',
      'case.launchEmbed': 'Открыть тестовый модуль',
      'case.embedActive': 'Тестовый симулятор запущен. Протестируйте графики!',
      'case.close': 'Закрыть',
      'case.before': 'До оптимизации',
      'case.after': 'После внедрения',
      'form.err.required': 'Необходимо заполнить поле',
      'form.err.email': 'Введите корректный медицинский email',
      'form.name': 'Ваше имя / Должность',
      'form.email': 'Рабочий Email',
      'form.website': 'Сайт вашей организации (опционально)',
      'form.desc': 'Опишите клинические задачи или технические требования...',
      'cursor.view': 'Ознакомиться',
      'cursor.play': 'Запуск'
    },
    EN: {
      'nav.home': 'Home',
      'nav.projects': 'Cases',
      'nav.about': 'Expertise',
      'nav.playground': 'R&D Lab',
      'nav.brief': 'Start Project',
      'hero.badge': 'High-End Healthcare IT Dev • Q3 2026',
      'hero.badge.short': 'MedTech IT • Q3 2026',
      'hero.title.part1': 'Designing',
      'hero.title.accent': 'digital zen',
      'hero.title.part2': 'for high-tech products',
      'hero.desc': 'Designing and developing unified medical information systems and secure telemedicine ecosystems with ultimate precision.',
      'hero.cta': 'Launch Brief Wizard',
      'hero.scroll': 'Scroll down',
      'projects.title': 'Digital Solutions',
      'projects.subtitle': 'We build resilient, secure, and intuitive software architecture for clinicians and patients',
      'projects.filter.all': 'All Sectors',
      'projects.filter.saas': 'Clinics & SaaS',
      'projects.filter.mobile': 'Patients & Mobile',
      'projects.filter.websites': 'Portals & EHR',
      'projects.filter.playground': 'R&D Lab',
      'about.title': 'MedTech Experience',
      'about.subtitle': 'How our healthcare software competencies digitalize clinics and medical research',
      'about.downloadCv': 'Medical Pitch Deck',
      'about.downloadCv.loading': 'Downloading presentation...',
      'about.downloadCv.success': 'Pitch Deck Downloaded',
      'playground.title': 'R&D Laboratory',
      'playground.subtitle': 'Experimental medical widget layouts, MRI rendering tests, and telemetry integrations with bio-hardware',
      'brief.title': 'Interactive MedTech Brief',
      'brief.subtitle': 'Specify your clinic needs or patient app together with our chief software architects',
      'brief.step1': 'What is your system specialty?',
      'brief.step2': 'Estimated investment budget',
      'brief.step3': 'Contact details & primary requirements',
      'brief.next': 'Next',
      'brief.prev': 'Back',
      'brief.submit': 'Submit Brief',
      'brief.success.title': 'Brief Submitted!',
      'brief.success.desc': 'Our chief healthcare solutions architects will review your request and suggest a secure medical integration protocol within 24 hours.',
      'brief.success.close': 'Close Window',
      'case.liveProject': 'Live Hospital System',
      'case.client': 'Hospital / Company',
      'case.role': 'Our Dev Role',
      'case.duration': 'Sprint Timeline',
      'case.nextProject': 'Next MedTech Case',
      'case.prevProject': 'Previous MedTech Case',
      'case.launchEmbed': 'Open Live Simulator',
      'case.embedActive': 'Telemetry interface simulator active. Try moving elements!',
      'case.close': 'Close',
      'case.before': 'Legacy Workflow',
      'case.after': 'Optimized Platform',
      'form.err.required': 'This field is required',
      'form.err.email': 'Please enter a valid work email',
      'form.name': 'Your name / Title',
      'form.email': 'Work Email',
      'form.website': 'Hospital or company website (optional)',
      'form.desc': 'Describe clinical workflows or system specifications...',
      'cursor.view': 'Examine',
      'cursor.play': 'Run'
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // High-fidelity MedTech/Healthcare cases
  const cases: CaseStudy[] = [
    {
      id: 'cardiopulse-saas',
      titleRu: 'CardioPulse AI',
      titleEn: 'CardioPulse AI',
      subtitleRu: 'B2B SaaS-система предиктивной кардиологии для клиник',
      subtitleEn: 'Next-gen B2B SaaS cardiac diagnostic automated engine',
      category: 'SaaS',
      year: '2025',
      accentColor: '#10b981', // emerald-500 (#00FF00 / green-tech)
      textColor: '#064e3b',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      video: 'https://cdn.pixabay.com/video/2019/11/17/29032-373302636_large.mp4',
      blocks: [
        {
          type: 'hero',
          client: 'Geneva Cardiology Center, Switzerland',
          roleRu: 'Архитектура данных, интеграция ИИ-моделей анализа ЭКГ, проектирование врачебного UI',
          roleEn: 'Data Engineering, AI ECG Model Integration, Clinical Dashboard UX Mapping',
          durationRu: '5 месяцев разработки',
          durationEn: '5-month agile cycle',
          liveUrl: 'https://cardiopulse-clinical.net',
          coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
        },
        {
          type: 'beforeAfter',
          beforeImage: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80',
          afterImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          titleRu: 'Рефакторинг клинического интерфейса: от хаоса ЭКГ-сводных таблиц к чистым наглядным виджетам кардиограмм',
          titleEn: 'Clinical Interface Overhaul: translating archaic ECG data sheets into clean reactive telemetry widgets'
        },
        {
          type: 'gridTemplates',
          layout: 'half',
          items: [
            {
              titleRu: 'Интерактивный пульс-дашборд',
              titleEn: 'Interactive Pulse Dashboard',
              descriptionRu: 'Все графики и зубцы ЭКГ рендерятся модульно с аппаратной частотой дискретизации, сохраняя оптимальный контраст для экстренных ситуаций.',
              descriptionEn: 'All ECG wave patterns render dynamically using hardware sampling rates, preserving high contrast visual safety under extreme clinical stress.',
              image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80'
            },
            {
              titleRu: 'Математический темный режим для ночных смен',
              titleEn: 'Advanced Dark Mode for Night Shifts',
              descriptionRu: 'Калиброванный баланс контрастности по стандартам медицинского интерфейса предотвращает переутомление глаз врачей во время ночных дежурств.',
              descriptionEn: 'Precisely calibrated luminance balancing conforming to ISO clinical software safety standards reduces night shift diagnostic fatigue.',
              image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        {
          type: 'embed',
          previewImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
          embedUrl: 'https://embed.figma.com/proto/mock-pulse-protocol?embed_host=share',
          titleRu: 'Симулятор анализа аритмии у докторов на тестовом макете',
          titleEn: 'Diagnostic Telemetry interface sandboxed prototype'
        }
      ]
    },
    {
      id: 'medaura-mobile',
      titleRu: 'MedAura Health',
      titleEn: 'MedAura Health',
      subtitleRu: 'Умный трекер здоровья и показателей глюкозы для пациентов c диабетом',
      subtitleEn: 'Smart mobile system for diabetes healthcare & continuous glucose monitoring',
      category: 'Mobile',
      year: '2026',
      accentColor: '#8b5cf6', // violet-500
      textColor: '#2e1065',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      video: 'https://cdn.pixabay.com/video/2021/08/16/85188-588388484_large.mp4',
      blocks: [
        {
          type: 'hero',
          client: 'MedAura Technologies, London',
          roleRu: 'Калибровка графиков глюкозы, интеграция Bluetooth CGM сканеров и мобильный дизайн',
          roleEn: 'Continuous Glucose Monitor (CGM) API Mapping, Bluetooth Sync UI & Mobile Accessibility Design',
          durationRu: '3 месяца спринтов',
          durationEn: '3-month design sprint',
          liveUrl: 'https://medaura-diabetic-care.co.uk',
          coverImage: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=1200&q=80'
        },
        {
          type: 'beforeAfter',
          beforeImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          afterImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
          titleRu: 'Плавный интуитивный график баланса: от сухих запутанных цифр к физически понятным цветовым зонам безопасности',
          titleEn: 'Seamless intuitive glucose curve: translating rigid biochemical metrics into simple, age-friendly color zones'
        },
        {
          type: 'gridTemplates',
          layout: 'third',
          items: [
            {
              image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
              titleRu: 'Шаг 1: Сбор телеметрии',
              titleEn: 'Step 1: Bio-telemetry Sync'
            },
            {
              image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
              titleRu: 'Шаг 2: Расчет инсулина ИИ',
              titleEn: 'Step 2: AI Insulin Modeling'
            },
            {
              image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80',
              titleRu: 'Шаг 3: Полная стабильность',
              titleEn: 'Step 3: Clinical Support'
            }
          ]
        },
        {
          type: 'embed',
          previewImage: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=1200&q=80',
          embedUrl: 'https://embed.figma.com/proto/mock-aura-figma?embed_host=share',
          titleRu: 'Экран оперативного замера глюкозы в динамике',
          titleEn: 'Dynamic quick-dose bio-tracker workflow screen'
        }
      ]
    },
    {
      id: 'lumina-web',
      titleRu: 'Lumina Clinique Portal',
      titleEn: 'Lumina Clinique Portal',
      subtitleRu: 'Многостраничный портал и единая EHR-система медицинского холдинга',
      subtitleEn: 'High-end unified electronic health records platform for multi-profile clinical system',
      category: 'Web-sites',
      year: '2025',
      accentColor: '#ec4899', // pink-500
      textColor: '#50072b',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      video: 'https://cdn.pixabay.com/video/2021/09/14/88549-605869403_large.mp4',
      blocks: [
        {
          type: 'hero',
          client: 'Lumina Clinique Center, Zurich',
          roleRu: 'Дизайн медицинских карт, интеграция с базами данных ЕГИСЗ/HL7 FHIR и верстка портала врача',
          roleEn: 'Digital Electronic Charts, Secure Medical API Integrations & Live Doctor Portal Core Dev',
          durationRu: '2 месяца спринтов',
          durationEn: '2-month deployment phase',
          liveUrl: 'https://lumina-clinical.org',
          coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
        },
        {
          type: 'beforeAfter',
          beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
          afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          titleRu: 'Проектирование координации палат и занятости реанимаций: замена бумажных журналов на интерактивную интерактивную сетку клиники',
          titleEn: 'Clinical coordination layout redesign: replacing paper logbooks and manual dispatching with a smart unified hospital grid'
        },
        {
          type: 'gridTemplates',
          layout: 'full',
          items: [
            {
              titleRu: 'Комплексный профиль пациента',
              titleEn: 'Cinematic Patient Demographic Spread',
              descriptionRu: 'Глубокая сквозная аналитика истории заболеваний с автозаполнением рецептов убирает бюрократический барьер между врачом и больным.',
              descriptionEn: 'The medical record layout groups anamnesis, vital curves, and labs into a simple 3-column view, saving hundreds of hours of clinical search.',
              image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
            }
          ]
        }
      ]
    }
  ];

  // Timeline Experience Data (MedTech / Healthcare Engineering background)
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'lead',
      year: '2024 — Наст.',
      company: 'ДЗЕН IT • MedTech Systems',
      roleRu: 'Основатель и Lead Architect',
      roleEn: 'Founder & Chief Solutions Architect',
      descRu: 'Проектируем и развиваем надежные медицинские SaaS-системы, мобильные приложения для клиник и интеграционные телемедицинские шины. Стандартизировали протоколы безопасности HL7 FHIR.',
      descEn: 'Architecting clinical SaaS portals, telemetry monitoring wellness engines, and reliable EHR software suites. Standardizing safety and speed via local medical security protocols.'
    },
    {
      id: 'senior',
      year: '2022 — 2024',
      company: 'Aura Medical Technologies',
      roleRu: 'Senior MedTech Product Specialist',
      roleEn: 'Senior Product Architect',
      descRu: 'Отвечал за интеграцию Bluetooth-датчиков замера гликемии в мобильное ядро MedAura Health. Оптимизировал паттерны доступности для пожилых пациентов, конверсия онбординга выросла на 42%.',
      descEn: 'Led deep bluetooth sensor pairing and diagnostic visualization flows for MedAura health tracker. Redesigned medical accessibility standards for elderly patients, increasing onboarding by 42%.'
    },
    {
      id: 'middle',
      year: '2020 — 2022',
      company: 'Clinical Data Metric Labs',
      roleRu: 'UI/UX & Systems Engineer',
      roleEn: 'Clinical Systems Engineer',
      descRu: 'Проектировал интерактивные панели биохимического анализа крови и кардиомониторинга. Создал 30+ независимых виджетов для медицинских дашбордов.',
      descEn: 'Structured real-time analytics dashboards for blood biochemistry labs and oncology databases. Authored over 30 diagnostic widgets operating on ultra-fine raster charts.'
    }
  ];

  // Medical-themed R&D Playground items
  const playgroundItems: PlaygroundItem[] = [
    {
      id: 'lab-1',
      titleRu: 'WebGL Кардио-симулятор ЭКГ',
      titleEn: 'WebGL Cardiac ECG Wave Simulator',
      category: 'Interactive Physics',
      aspect: 'aspect-square',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'lab-2',
      titleRu: 'Генеративная модель спиралей ДНК',
      titleEn: 'Generative DNA Ribbon Synthesizer',
      category: 'Bioinformatics',
      aspect: 'aspect-[4/5]',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
      color: 'from-amber-500/20 to-orange-500/20'
    },
    {
      id: 'lab-3',
      titleRu: 'Интерактивный пульсоксиметр UI',
      titleEn: 'Pulse Oximeter Real-time Widget',
      category: 'Device Hardware UI',
      aspect: 'aspect-[16/9]',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      id: 'lab-4',
      titleRu: '3D МРТ Анализ снимков нейросетью',
      titleEn: 'MRI Visual Brain Slice Neural Engine',
      category: 'AI Diagnostics',
      aspect: 'aspect-[3/4]',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      color: 'from-blue-500/20 to-indigo-500/20'
    },
    {
      id: 'lab-5',
      titleRu: 'Голографические био-сенсоры',
      titleEn: 'Holographic Bio-Hardware Cards',
      category: 'Medical IoT',
      aspect: 'aspect-square',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
      color: 'from-rose-500/20 to-purple-500/20'
    }
  ];

  return (
    <PortfolioContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        cursorState,
        setCursorState,
        selectedCaseId,
        setSelectedCaseId,
        showBrief,
        setShowBrief,
        activeSection,
        setActiveSection,
        cases,
        timelineEvents,
        playgroundItems,
        t,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
