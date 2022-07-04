import config from '@helpers/config';
import request from '@helpers/request';

export async function getMatches(date: string): Promise<any | null>  {
  const data = await request<any>(`${config.API_URL}/api/matches/${date}/`);
  return data;
}