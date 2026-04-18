import type { Member } from '@/entities/member'

export function filterMembersBySkills(members: Member[], activeSkills: string[]): Member[] {
  if (activeSkills.length === 0) return members
  const skillSet = new Set(activeSkills)
  return members.filter((member) => member.skills.some((skill) => skillSet.has(skill)))
}

export function collectUniqueSkills(members: Member[]): string[] {
  const unique = new Set<string>()
  for (const member of members) {
    for (const skill of member.skills) unique.add(skill)
  }
  return [...unique].sort((a, b) => a.localeCompare(b))
}
