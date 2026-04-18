import { describe, it, expect } from 'vitest'
import type { Member } from '@/entities/member'
import { filterMembersBySkills, collectUniqueSkills } from './filter-members'

function makeMember(id: string, skills: string[]): Member {
  return {
    id,
    name: `Member ${id}`,
    role: 'Developer',
    photo: 'https://example.com/p.jpg',
    skills,
    social: {},
  }
}

describe('filterMembersBySkills', () => {
  const members = [
    makeMember('1', ['Vue 3', 'TypeScript']),
    makeMember('2', ['React', 'TypeScript']),
    makeMember('3', ['Go', 'Docker']),
    makeMember('4', ['Figma']),
  ]

  it('returns all members when no filters are active', () => {
    expect(filterMembersBySkills(members, [])).toHaveLength(4)
  })

  it('returns members containing a single active skill', () => {
    const result = filterMembersBySkills(members, ['TypeScript'])
    expect(result.map((m) => m.id)).toEqual(['1', '2'])
  })

  it('applies OR logic for multiple skills', () => {
    const result = filterMembersBySkills(members, ['Go', 'Figma'])
    expect(result.map((m) => m.id)).toEqual(['3', '4'])
  })

  it('returns empty array when no member matches', () => {
    expect(filterMembersBySkills(members, ['Rust'])).toEqual([])
  })
})

describe('collectUniqueSkills', () => {
  it('returns sorted unique skills across all members', () => {
    const members = [
      makeMember('1', ['Vue 3', 'TypeScript']),
      makeMember('2', ['React', 'TypeScript']),
      makeMember('3', ['Go']),
    ]
    expect(collectUniqueSkills(members)).toEqual(['Go', 'React', 'TypeScript', 'Vue 3'])
  })

  it('returns empty array for empty input', () => {
    expect(collectUniqueSkills([])).toEqual([])
  })
})
