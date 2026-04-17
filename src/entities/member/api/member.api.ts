import { apiClient } from '@/shared/api/api-client'
import { API_ROUTES } from '@/shared/api/api-routes.constants'
import { API_RESPONSE_TIMEOUT } from '@/shared/lib/api.constants'
import { ApiClientError, isApiClientError } from '@/shared/api/api-client-error'
import { membersListSchema, memberSchema } from '../model/member.schemas'
import type { Member } from '../model/member.schemas'

export async function fetchMembers(): Promise<Member[]> {
  try {
    return await apiClient.get(API_ROUTES.MEMBERS.ALL, {
      schema: membersListSchema,
      timeout: API_RESPONSE_TIMEOUT.NORMAL,
    })
  } catch (error) {
    if (isApiClientError(error)) {
      error.title = 'Не удалось получить список команды'
    }
    throw error
  }
}

export async function fetchMemberById(id: string): Promise<Member> {
  try {
    const members = await fetchMembers()
    const member = members.find((m) => m.id === id)
    if (!member) {
      const error = new ApiClientError(new Error(`Member ${id} not found`))
      error.title = 'Участник не найден'
      throw error
    }
    return memberSchema.parse(member)
  } catch (error) {
    if (isApiClientError(error)) throw error
    throw new ApiClientError(error)
  }
}
