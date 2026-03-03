// ── Shared Project Data ─────────────────────────────────────────────────────
// Gunakan file ini sebagai single source of truth untuk semua data proyek.

export interface TechItem {
  name: string;
  icon: string;
}

export interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  image: string;
  techStack: TechItem[];
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  year: string;
  highlights: string[];
  challenges: string;
  outcome: string;
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: 'Cataract Detection System',
    tagline: 'AI-powered eye disease detection using Computer Vision',
    description: 'A Computer Vision system using YOLOv8 for automated cataract detection. Built with full pipeline from data preprocessing, model fine-tuning, to web deployment with real-time inference.',
    fullDescription: 'This project tackles the challenge of early cataract detection using state-of-the-art deep learning. The system processes fundus eye images through a fine-tuned YOLOv8 model capable of detecting and localizing cataracts in real time. The complete ML pipeline includes data collection, augmentation, model training, and evaluation. The final model is served via a Flask API and wrapped in a simple web UI for clinical use.',
    image: '/projects/cataract.jpg',
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'Flask', icon: 'flask' },
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'Docker', icon: 'docker' },
    ],
    tags: ['AI / ML', 'Computer Vision'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: true,
    year: '2024',
    highlights: [
      'Fine-tuned YOLOv8 on a custom medical imaging dataset',
      'Achieved 92%+ detection accuracy on validation set',
      'Built real-time inference API with Flask & Docker',
      'Implemented full data preprocessing pipeline with augmentation',
    ],
    challenges: 'The biggest challenge was collecting and annotating sufficient medical imaging data. We solved this through data augmentation techniques and transfer learning from pre-trained YOLO weights.',
    outcome: 'A deployable web application that assists clinicians in early cataract screening, reducing diagnosis time significantly.',
  },
  {
    id: 2,
    title: 'RAG-Based Chatbot',
    tagline: 'Intelligent chatbot powered by LLMs and Retrieval-Augmented Generation',
    description: 'An intelligent chatbot integrated with LLM APIs using Retrieval-Augmented Generation to deliver context-aware and accurate responses based on a custom knowledge base.',
    fullDescription: 'This project builds a production-grade chatbot that goes beyond standard LLM responses by grounding answers in a verified custom knowledge base. Using the RAG architecture, the system embeds documents into a vector store and retrieves the most relevant chunks before generating answers — dramatically reducing hallucinations and improving accuracy.',
    image: '/projects/chatbot.jpg',
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'OpenAI', icon: 'openai' },
      { name: 'HuggingFace', icon: 'huggingface' },
    ],
    tags: ['AI / ML', 'LLM'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: true,
    year: '2024',
    highlights: [
      'Integrated OpenAI GPT with a custom vector knowledge base',
      'Implemented semantic search using embedding similarity',
      'Designed a conversational memory for multi-turn dialogue',
      'Reduced hallucination rate by 60% compared to vanilla LLM',
    ],
    challenges: 'Ensuring the retrieval step always surfaced the most relevant documents was critical. We experimented with multiple chunking strategies and embedding models before settling on a hybrid approach.',
    outcome: 'A reliable, domain-specific chatbot that can be plugged into any knowledge base and deployed as a standalone service or integrated into existing systems.',
  },
  {
    id: 3,
    title: 'Portfolio Dashboard',
    tagline: 'Full-stack personal portfolio with a dynamic admin CMS',
    description: 'A full-stack personal portfolio with an admin dashboard for managing projects, skills, and experiences dynamically. Built with Next.js, Prisma, and PostgreSQL.',
    fullDescription: 'This is the very website you are viewing right now. It\'s a full-stack Next.js application with a custom admin dashboard that allows dynamic management of all portfolio content — projects, skills, experience, and more — without touching the codebase. The backend uses Prisma ORM with PostgreSQL, and the frontend is styled with Tailwind CSS and Framer Motion for smooth animations.',
    image: '/projects/portfolio.jpg',
    techStack: [
      { name: 'Next.js', icon: 'nextjs2' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Prisma', icon: 'prisma' },
    ],
    tags: ['Web', 'Fullstack'],
    liveUrl: 'https://alvin.dev',
    githubUrl: 'https://github.com/',
    featured: false,
    year: '2025',
    highlights: [
      'Built admin CMS for managing all portfolio content dynamically',
      'Implemented NextAuth for secure admin authentication',
      'Designed responsive UI with Framer Motion animations',
      'Used Prisma ORM with PostgreSQL for type-safe database access',
    ],
    challenges: 'Architecting a system that felt both like a polished public portfolio and a fully functional admin tool required careful separation of concerns between the public and admin routes.',
    outcome: 'A fully self-managed portfolio platform where all content can be updated in real time from the admin dashboard, without any code changes.',
  },
  {
    id: 4,
    title: 'E-Commerce Web App',
    tagline: 'Full-featured online store with order management',
    description: 'A full-featured e-commerce platform built with Laravel including product management, cart, checkout, and order tracking system.',
    fullDescription: 'A robust e-commerce platform developed using the Laravel framework. The system includes a complete storefront with product browsing, shopping cart, and checkout flow, as well as an admin panel for managing products, categories, orders, and customers. Order tracking lets customers follow their purchase from placement to delivery.',
    image: '/projects/ecommerce.jpg',
    techStack: [
      { name: 'Laravel', icon: 'laravel' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Tailwind', icon: 'tailwindcss' },
      { name: 'JavaScript', icon: 'js' },
    ],
    tags: ['Web', 'Backend'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: true,
    year: '2023',
    highlights: [
      'Built complete CRUD for products, categories, and orders',
      'Implemented cart session management and checkout flow',
      'Designed admin dashboard for inventory and order management',
      'Added real-time order status tracking for customers',
    ],
    challenges: 'Managing cart state across sessions and ensuring stock consistency during concurrent checkouts required careful transaction management in MySQL.',
    outcome: 'A production-ready e-commerce solution that serves as a scalable foundation for a real online store.',
  },
  {
    id: 5,
    title: 'Data Analysis Dashboard',
    tagline: 'Interactive data visualization for student performance metrics',
    description: 'Interactive data visualization dashboard for analyzing student performance metrics using Python and Jupyter Notebook with pandas and matplotlib.',
    fullDescription: 'This project provides educators with a clear, visual understanding of student performance trends. Built with Python, pandas, and matplotlib/seaborn, the dashboard processes raw academic data and generates interactive charts covering grade distributions, attendance patterns, and subject-specific performance. Reports can be exported for further analysis.',
    image: '/projects/dashboard.jpg',
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'Colab', icon: 'colab' },
      { name: 'Git', icon: 'git' },
    ],
    tags: ['Data', 'AI / ML'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: false,
    year: '2023',
    highlights: [
      'Analyzed performance data for 500+ students across multiple subjects',
      'Created interactive charts for grade distributions and trends',
      'Automated data cleaning and preprocessing pipeline',
      'Generated exportable PDF reports for educators',
    ],
    challenges: 'Raw academic data was inconsistent and had many missing values. Robust data cleaning logic was implemented to normalize and fill gaps intelligently.',
    outcome: 'An actionable analytics tool that helps educators identify at-risk students early and make data-driven decisions to improve learning outcomes.',
  },
  {
    id: 6,
    title: 'Event Management System',
    tagline: 'Web-based platform for organizing technology events',
    description: 'A web-based event management system for organizing technology events, handling registrations, schedules, and participant management.',
    fullDescription: 'A comprehensive event management platform tailored for technology events and seminars. The system streamlines every phase of event organization — from creating event pages and managing registration forms, to generating attendee lists and sending automated confirmation emails. Organizers get a real-time dashboard showing registration stats and attendance.',
    image: '/projects/event.jpg',
    techStack: [
      { name: 'Laravel', icon: 'laravel' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Bootstrap', icon: 'bootstrap5' },
    ],
    tags: ['Web', 'Backend'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: false,
    year: '2023',
    highlights: [
      'Built event registration with automated confirmation emails',
      'Created organizer dashboard with real-time attendance tracking',
      'Implemented QR code-based check-in system',
      'Supported multiple simultaneous events with separate management panels',
    ],
    challenges: 'Handling concurrent registrations and preventing double submissions required careful use of database transactions and unique constraints.',
    outcome: 'Successfully deployed for a university-level technology seminar with 200+ registered participants, replacing the previous manual registration process entirely.',
  },
];
