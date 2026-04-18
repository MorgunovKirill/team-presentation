import { describe, it, expect } from 'vitest'
import { server } from '@/shared/api/mocks/server'
import { http, HttpResponse } from 'msw'
import { fetchMembers, fetchMemberById } from './member.api'

describe('fetchMembers', () => {
  it('returns list of members', async () => {
    const members = await fetchMembers()
    expect(members).toHaveLength(30)
    expect(members[0]).toMatchObject({ id: '1', name: 'Алексей Иванов' })
  })
})

describe('fetchMemberById', () => {
  it('returns member with matching id', async () => {
    const member = await fetchMemberById('1')
    expect(member.id).toBe('1')
    expect(member.name).toBe('Алексей Иванов')
  })

  it('throws ApiClientError when member not found', async () => {
    const error = await fetchMemberById('999').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(Error)
    expect((error as { title?: string }).title).toBe('Участник не найден')
  })

  it('throws ApiClientError on network error', async () => {
    server.use(
      http.get('/data/members.json', () => HttpResponse.error()),
    )
    await expect(fetchMemberById('1')).rejects.toMatchObject({ name: 'ApiClientError' })
  })
})
