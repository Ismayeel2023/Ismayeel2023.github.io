export const profile = {
  name: 'Maheen Mohamed Ismayeel',
  first: 'Maheen',
  role: 'Software Developer',
  location: 'Tamil Nadu, India',
  timezone: 'Asia/Kolkata',
  email: 'ismayeel2023@gmail.com',
  phone: '+91 63838 75892',
  phoneHref: 'tel:+916383875892',
  github: 'https://github.com/Ismayeel2023',
  githubHandle: '@Ismayeel2023',
  linkedin: 'https://www.linkedin.com/in/maheen-mohamed-ismayeel-29b52a276',
};

export const roles = ['Software Developer', 'Laravel Developer', 'Full Stack Engineer', 'AI & Deep Learning Explorer'];

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export const marqueeTop = ['React', 'Laravel', 'TypeScript', 'PHP', 'MySQL', 'Tailwind CSS'];
export const marqueeBottom = ['TensorFlow', 'Python', 'ClickHouse', 'Java', 'Git', 'REST APIs'];

export const stats = [
  { value: 8.09, decimals: 2, suffix: '', label: 'CGPA in B.E. Computer Science' },
  { value: 9, decimals: 0, suffix: ' mo', label: 'Building software at Pricol' },
  { value: 7, decimals: 0, suffix: '', label: 'Public repositories on GitHub' },
  { value: 2, decimals: 0, suffix: '', label: 'Java OOP certifications' },
];

export type JourneyItem = {
  period: string;
  title: string;
  org: string;
  description?: string;
  points?: string[];
  tags: string[];
};

export const journey: JourneyItem[] = [
  {
    period: 'Jun 2026 — Present',
    title: 'Graduate Engineering Trainee',
    org: 'Pricol Limited · Coimbatore',
    points: [
      'Built a secure document management platform for employee records, using Microsoft Graph and OneDrive, with a REST API for other internal applications.',
      'Synced employee profile photos across Microsoft 365 accounts using the Graph API.',
      'Developed an online assessment portal with timed tests and anti-cheat controls (screenshot and tab-switch detection).',
      'Working on a learning management system, a digital consent and e-signature platform, and approval-workflow apps integrated with SAP.',
    ],
    tags: ['Laravel', 'React', 'Microsoft Graph', 'Linux Server'],
  },
  {
    period: 'May 2026',
    title: 'On-Job Trainee',
    org: 'Pricol Limited',
    points: [
      'Built a CAPEX management system with configurable multi-level approvals, role-based access across multiple companies, and SAP integration.',
      "Worked with Git/GitLab, SQL Server and Adminer in the team's delivery workflow.",
    ],
    tags: ['Laravel', 'React', 'SQL Server', 'GitLab'],
  },
  {
    period: 'Feb — May 2026',
    title: 'Laravel Developer Intern',
    org: 'Pricol Limited',
    points: [
      'Built a travel analytics dashboard (Laravel, React, ClickHouse) with KPI cards, interactive charts and billing reports.',
      'Developed a Python ETL pipeline that syncs report data into SQL Server, with automated validation and a data-quality dashboard.',
      'Built approval-workflow applications with Microsoft SSO, including a vendor quotation comparison tool.',
    ],
    tags: ['Laravel', 'ClickHouse', 'Python', 'Microsoft SSO'],
  },
  {
    period: 'Nov 2022 — Feb 2026',
    title: 'B.E. Computer Science & Engineering',
    org: 'Velalar College of Engineering and Technology',
    description:
      'Graduated with a CGPA of 8.09. Built a strong base in data structures, databases and software engineering, earned Java OOP certifications from Simplilearn and MindLuster, and explored deep learning through a soft tissue tumor detection project on medical images.',
    tags: ['CGPA 8.09', 'Deep Learning', 'Java OOP', 'DBMS'],
  },
  {
    period: 'Oct 2023 — Jan 2024',
    title: 'Digital Marketing Intern',
    org: 'KarmaDev.in',
    description:
      'Analysed user engagement data and ran data-driven social media strategies to grow clients’ online presence, using Canva, Buffer and Notion.',
    tags: ['Marketing Analytics', 'Canva', 'Buffer', 'Notion'],
  },
];

export type SkillGroup = {
  key: 'frontend' | 'backend' | 'data' | 'ai' | 'workflow';
  title: string;
  description: string;
  items: string[];
  span: string;
};

export const skillGroups: SkillGroup[] = [
  {
    key: 'frontend',
    title: 'Frontend',
    description: 'Responsive, accessible interfaces with clean component architecture and smooth interactions.',
    items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'],
    span: 'md:col-span-2',
  },
  {
    key: 'backend',
    title: 'Backend',
    description: 'Robust server-side apps, REST APIs, auth and business logic.',
    items: ['Laravel', 'PHP', 'Java', 'REST APIs'],
    span: 'md:col-span-1',
  },
  {
    key: 'data',
    title: 'Databases',
    description: 'Relational design and analytical workloads.',
    items: ['MySQL', 'SQL Server', 'ClickHouse'],
    span: 'md:col-span-1',
  },
  {
    key: 'ai',
    title: 'Deep Learning',
    description: 'Computer-vision models for real problems — like detecting soft tissue tumors in medical images.',
    items: ['Python', 'TensorFlow', 'CNN', 'ResNet50'],
    span: 'md:col-span-2',
  },
  {
    key: 'workflow',
    title: 'Workflow',
    description: 'Version control and collaboration that keeps codebases healthy.',
    items: ['Git', 'GitHub', 'GitLab', 'Linux Server', 'Adminer', 'VS Code'],
    span: 'md:col-span-3',
  },
];

export type Project = {
  title: string;
  year: string;
  category: string;
  description: string;
  tech: string[];
  repo: string;
  file: string;
  code: string[];
  glow: string;
};

export const featuredProjects: Project[] = [
  {
    title: 'Money Flow',
    year: '2026',
    category: 'Web & Android App · AI',
    description:
      'A personal finance tracker that shows exactly where your money flows. Log income and expenses, import statements, and get AI-powered spending insights from Google Gemini — shipped to Android with Capacitor.',
    tech: ['React', 'TypeScript', 'Tailwind', 'Gemini API', 'Capacitor'],
    repo: 'https://github.com/Ismayeel2023/Money-Flow',
    file: 'insights.ts',
    code: [
      'const balance = transactions',
      '  .reduce((sum, t) => sum + t.amount, 0);',
      '',
      'const insight = await ai.models.generateContent({',
      '  model: "gemini",',
      '  contents: summarize(spending),',
      '});',
    ],
    glow: '#C6F432',
  },
  {
    title: 'Student Management',
    year: '2026',
    category: 'Web App · Laravel',
    description:
      'A clean student management system with authentication, full CRUD, validation with flash messages and a hand-crafted UI with a light / dark mode toggle — no CSS framework.',
    tech: ['Laravel', 'PHP', 'Blade', 'MySQL', 'Breeze'],
    repo: 'https://github.com/Ismayeel2023/student-management',
    file: 'StudentController.php',
    code: [
      'public function store(StoreStudentRequest $request)',
      '{',
      '    Student::create($request->validated());',
      '',
      '    return redirect()->route("students.index")',
      '        ->with("success", "Student added");',
      '}',
    ],
    glow: '#F87171',
  },
  {
    title: 'Soft Tissue Tumor Detection',
    year: '2026',
    category: 'Deep Learning · Research',
    description:
      'A deep learning system for early-stage soft tissue tumor detection from medical images — covering image pre-processing, CNN-based models and evaluation to support clinical decision-making. Currently being prepared for academic publication.',
    tech: ['Python', 'TensorFlow', 'CNN', 'ResNet50'],
    repo: 'https://github.com/Ismayeel2023',
    file: 'model.py',
    code: [
      'base = ResNet50(weights="imagenet", include_top=False)',
      'x = GlobalAveragePooling2D()(base.output)',
      'x = Dropout(0.3)(x)',
      'out = Dense(num_classes, activation="softmax")(x)',
      '',
      'model = Model(base.input, out)',
    ],
    glow: '#8B7CF6',
  },
  {
    title: 'Smart File Organizer',
    year: '2026',
    category: 'Automation · Python',
    description:
      'A Python utility that tidies a cluttered folder in seconds — sorting files by type, date or custom rules into a clean structure.',
    tech: ['Python', 'pathlib', 'shutil'],
    repo: 'https://github.com/Ismayeel2023/smart_file_organizer',
    file: 'organize.py',
    code: [
      'for file in Path(source).iterdir():',
      '    folder = CATEGORIES.get(file.suffix, "Other")',
      '    target = destination / folder',
      '    target.mkdir(exist_ok=True)',
      '    shutil.move(file, target / file.name)',
    ],
    glow: '#38BDF8',
  },
];

export const otherProjects = [
  { title: 'CGPA Calculator', year: '2025', tech: 'Java', repo: 'https://github.com/Ismayeel2023/CGPA_CALCULATOR' },
  { title: 'ATM Interface', year: '2025', tech: 'Java · OOP', repo: 'https://github.com/Ismayeel2023/ATM_Interface' },
  { title: 'Portfolio v1', year: '2026', tech: 'HTML · CSS · JS', repo: 'https://github.com/Ismayeel2023/portfolio_' },
];
