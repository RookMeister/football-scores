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
    const standings = await request<ICompetitionsResponce>(`${process.env.FETCH_GET_ALL_COMPETITIONS_URL}`);
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
