import { computed } from 'vue'
import type { Ref } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { fetchMembers, fetchMemberById } from '../api/member.api'

export function useMembersQuery() {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })
}

export function useMemberQuery(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['member', id.value]),
    queryFn: () => fetchMemberById(id.value),
    staleTime: 0,
  })
}
