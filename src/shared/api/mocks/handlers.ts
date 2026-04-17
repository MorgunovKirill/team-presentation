import { http, HttpResponse } from 'msw'

const membersData = [
  {
    id: '1',
    name: 'Алексей Иванов',
    role: 'Frontend Developer',
    photo: 'https://i.pravatar.cc/150?img=1',
    skills: ['Vue 3', 'TypeScript'],
    social: { github: 'https://github.com' },
    email: 'alexey@example.com',
  },
  {
    id: '2',
    name: 'Мария Петрова',
    role: 'Backend Developer',
    photo: 'https://i.pravatar.cc/150?img=2',
    skills: ['Node.js', 'Go'],
    social: { linkedin: 'https://linkedin.com' },
    email: 'maria@example.com',
  },
]

export const handlers = [
  http.get('/data/members.json', () => HttpResponse.json(membersData)),
]
