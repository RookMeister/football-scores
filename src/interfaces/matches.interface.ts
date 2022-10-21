import { IEvent, IStandingParticipant } from '@interfaces/standings.interface';
import { ICompetitionStagesGroups } from '@interfaces/competitions.interface';

export interface IMatchesResponce {
  items: IEvent[];
  seasons: IMatchesSeason[];
  participants: { [key: number]: IStandingParticipant; };
  stages: { [key: number]:ICompetitionStagesGroups; };
  stageGroups: { [key: number]:ICompetitionStagesGroups; };
  reviews?: any;
}
interface IMatchesSeason {
  id: number;
  urn: string;
  toDate: string;
  fromDate: string;
  titleRu: string;
  year: string;
  frontConfig: { '@class': string };
  competition: {
    priority: number;
    prioritySum: number;
    sport: { id: number; urn: string; titleRu: string; priority: number; }
    frontConfig: { '@class': string; logos: { default: string; }; };
    titleRu: string;
    titleRuShort: string;
    urn: string;
  }
}