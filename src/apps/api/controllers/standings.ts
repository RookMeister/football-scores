import request from '@helpers/request';
import { RouteHandlerMethod } from 'fastify';
import { ICompetitionsResponce, ICompetitionResponce } from '@interfaces/competitions.interface';
import { ICompetitionStandingLeagueResponce,  ICompetitionStandingCupResponce } from '@interfaces/standings.interface';

type TLEAGUEORCUP = ICompetitionStandingLeagueResponce | ICompetitionStandingCupResponce;

export const getStanding: RouteHandlerMethod = async (req, reply): Promise<TLEAGUEORCUP> => {
	try {
    const { id } = (req.params as  { id: string });
    const standing = await request<TLEAGUEORCUP>(`${process.env.FETCH_GET_STANDING_URL}${id}`);
		return standing;
	} catch (err) {
		// throw boom.boomify(err as Error);
		throw err;
	}
};

export const getAllCompetitions: RouteHandlerMethod = async (req, reply): Promise<ICompetitionsResponce> => {
	try {
		const topStanding = ['Российская Премьер-Лига', 'Английская Премьер-лига', 'Ла Лига', 'Серия A', 'Бундеслига', 'Лига 1', 'Эредивизи', 'MLS'];
    const standings = await request<ICompetitionsResponce>(`${process.env.FETCH_GET_ALL_COMPETITIONS_URL}`);
		standings.items.sort((a, b) => {
			const find1 = topStanding.find(s => s === a.title);
			const find2 = topStanding.find(s => s === b.title);
			if (find1 && find2) {
				return 1;
			} else if (find1) {
				return -1;
			} else if (find2) {
				return 1;
			} else if (a.title.includes('Кубок')) {
				return -1;
			} if (b.title.includes('Кубок')) {
				return 1;
			}
			return a.title.localeCompare(b.title)
		})
		return standings;
	} catch (err) {
		// throw boom.boomify(err as Error);
		throw err;
	}
};
export const getCompetition: RouteHandlerMethod = async (req, reply): Promise<ICompetitionResponce> => {
	try {
    const { urn, seasonUrn = '' } = (req.params as  { urn: string, seasonUrn?: string });
    const season = seasonUrn ? `seasonUrn=${seasonUrn}` : '';
    const standings = await request<ICompetitionResponce>(`${process.env.FETCH_GET_COMPETITION_URL}${urn}/review?materialsLimit=0&newsLimit=0&${season}`);
		return standings;
	} catch (err) {
		// throw boom.boomify(err as Error);
		throw err;
	}
};
