import ReviewsModel from '@api/models/Review';
import request from '@helpers/request';
import { RouteHandlerMethod } from 'fastify';
import { IMatchesResponce } from '@interfaces/matches.interface';
import { IMatchResponce } from '@interfaces/match.interface';

export const getListMatches: RouteHandlerMethod = async (req, reply): Promise<IMatchesResponce> => {
	try {
    // &competitionUrn=primera-division
    const { date } = (req.params as  { date: string });
    const matches = await request<IMatchesResponce>(`${process.env.FETCH_GET_MATCHES_URL}?sportUrn=football&publishMatchbar=true&onDate=${date}`);
    const data = await updateMatches(matches, date);
		return data;
	} catch (err) {
		// throw boom.boomify(err as Error);
		throw err;
	}
};

export const getMatchDetail: RouteHandlerMethod = async (req, reply): Promise<IMatchResponce> => {
  try {
    const { urn } = (req.params as  { urn: string });
    const match = await request<IMatchResponce>(`${process.env.FETCH_GET_MATCH_URL}/${urn}/review?materialsLimit=0`);
    match.header.competitors.sort((a: any, b: any) => a.priority - b.priority);
    return match;
  } catch (err) {
    // throw boom.boomify(err as Error);
    throw err;
  }
};

const updateMatches = async (matches: IMatchesResponce, date: string): Promise<IMatchesResponce> => {
  const reviews = await ReviewsModel.findReviewsToday(date);
  matches.seasons = Object.values(matches.seasons).sort((a, b) => a.competition.priority - b.competition.priority);
  matches.items.forEach((match) => {
    const team1 = matches.participants[match.competitors[0].participantId].titleRu;
    const team2 = matches.participants[match.competitors[1].participantId].titleRu;
    const title = new RegExp(`${team1}|${team2}`);
    const review = reviews.find(r => r.title.match(title));
    match.reviewUrl = review ? review.url : '';
    match.competitors = match.competitors.sort((a, b) => a.priority - b.priority);
  });
  return matches;
}