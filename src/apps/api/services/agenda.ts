import { Agenda } from 'agenda';
import { getReviewMatches } from '@api/controllers/reviews';
import ReviewModel from '@api/models/Review';
import logger from '@helpers/logger';
import config from '@helpers/config';

const agenda = new Agenda({
  db: {
    address: config.MONGO || '',
    collection: 'logs_agenda_jobs'
  }
});

agenda.define('check reviews', async () => {
  logger.info({ msg: 'start check reviews' });
  const reviews = await getReviewMatches();
  if (reviews && reviews.length) {
    for (const r of reviews) {
      await ReviewModel.saveReviews(r);
    }
  }
  logger.info({ msg: 'finish check reviews' });
})

export const initAgenda = async () => {
  try {
    await agenda.start();
    await agenda.every('0 00,02,17,20,23 * * *', 'check reviews');
  } catch {}
}