import * as matchesController from '@api/controllers/matches';
import { RouteOptions } from 'fastify';
// import { GetTopMatchesSchema } from '@api/routes/documentation/matchesApi';

const getListMatchesRoute: RouteOptions = {
	method: 'GET',
	url: '/api/matches/:date/',
	handler: matchesController.getListMatches,
	// schema: GetTopMatchesSchema,
};

const getMatchDetailRoute: RouteOptions = {
	method: 'GET',
	url: '/api/match/:urn/',
	handler: matchesController.getMatchDetail,
	// schema: GetTopMatchesSchema,
};

const routes = [getListMatchesRoute, getMatchDetailRoute];

export default routes;
