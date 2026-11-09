import type { Education, Experience, Resume } from '../types';

let nextId = 100;
export const uid = (): string => `id-${Date.now().toString(36)}-${nextId++}`;

export const emptyExperience = (): Experience => ({
  id: uid(),
  role: '',
  company: '',
  start: '',
  end: '',
  current: false,
  bullets: '',
});

export const emptyEducation = (): Education => ({
  id: uid(),
  degree: '',
  school: '',
  start: '',
  end: '',
});

export const sampleResume: Resume = {
  personal: {
    name: 'Alex Rivera',
    title: 'Frontend Developer',
    email: 'alex.rivera@example.com',
    phone: '+355 69 000 0000',
    location: 'Tirana, Albania',
    website: 'alexrivera.dev',
  },
  summary:
    'Frontend developer with 4 years of experience building fast, accessible web apps with React and TypeScript. Comfortable turning complex data into clear interfaces and working closely with design and backend teams.',
  experience: [
    {
      id: 'exp-1',
      role: 'Frontend Developer',
      company: 'Northwind Finance',
      start: '2022-03',
      end: '',
      current: true,
      bullets:
        'Built reporting dashboards used by 200+ analysts\nCreated a shared component library adopted by 3 teams\nCut initial page load time by 35% with code splitting',
    },
    {
      id: 'exp-2',
      role: 'Junior Web Developer',
      company: 'Blue Harbor Studio',
      start: '2020-06',
      end: '2022-02',
      current: false,
      bullets: 'Shipped 12 responsive client websites\nImproved accessibility scores to 95+ on key pages',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. Computer Engineering',
      school: 'Polytechnic University of Tirana',
      start: '2016',
      end: '2020',
    },
  ],
  skills: 'React, TypeScript, JavaScript, HTML5, CSS, REST APIs, Git, Accessibility',
  settings: { accent: '#1F4E79', template: 'classic' },
};

export const blankResume: Resume = {
  personal: { name: '', title: '', email: '', phone: '', location: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: '',
  settings: sampleResume.settings,
};

export const accents: readonly string[] = ['#1F4E79', '#0F766E', '#7C2D5B', '#B45309', '#334155'];
