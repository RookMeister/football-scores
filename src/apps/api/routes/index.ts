import matchesRoutes from '@api/routes/matches';
import reviewsRoutes from '@api/routes/reviews';
import standingsRoutes from '@api/routes/standings';

const routes = [...matchesRoutes, ...reviewsRoutes, ...standingsRoutes];

export default routes;