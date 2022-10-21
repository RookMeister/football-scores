import { useFetch } from '@vueuse/core';
import { IMatchesResponce } from '@interfaces/matches.interface';

function getMatches (date: string) {
  const url = `/api/matches/${date}/`;
  const { isFetching, error, data } = useFetch(url, { method: 'GET' }).json<IMatchesResponce>();
  return { isFetching, error, data };
}

export { getMatches }