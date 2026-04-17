import { describe, it, expect } from 'vitest'
import { memberSchema, membersListSchema } from './member.schemas'

const validMember = {
  id: '1',
  name: 'John Doe',
  role: 'Developer',
  photo: 'https://example.com/photo.jpg',
  skills: ['Vue', 'TypeScript'],
  social: { github: 'https://github.com/john' },
}

describe('memberSchema', () => {
  it('parses a valid member', () => {
    expect(() => memberSchema.parse(validMember)).not.toThrow()
  })

  it('parses member without optional fields', () => {
    const { email: _email, ...withoutEmail } = { ...validMember, email: 'a@b.com' }
    expect(() => memberSchema.parse(withoutEmail)).not.toThrow()
  })

  it('rejects missing required fields', () => {
    expect(() => memberSchema.parse({ id: '1' })).toThrow()
  })

  it('rejects invalid photo url', () => {
    expect(() => memberSchema.parse({ ...validMember, photo: 'not-a-url' })).toThrow()
  })

  it('rejects invalid email', () => {
    expect(() => memberSchema.parse({ ...validMember, email: 'not-email' })).toThrow()
  })
})

describe('membersListSchema', () => {
  it('parses array of valid members', () => {
    expect(() => membersListSchema.parse([validMember])).not.toThrow()
  })

  it('rejects non-array input', () => {
    expect(() => membersListSchema.parse(validMember)).toThrow()
  })
})
