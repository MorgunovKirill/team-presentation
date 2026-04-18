import { http, HttpResponse } from 'msw'
import membersFixture from '../../../../public/data/members.json'

export const handlers = [
  http.get('/data/members.json', () => HttpResponse.json(membersFixture)),
]
