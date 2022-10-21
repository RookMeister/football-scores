import { Agenda } from 'agenda';
import logger from '@helpers/logger';
import config from '@helpers/config';

const agenda = new Agenda({
  db: {
    address: config.MONGO || '',
    collection: 'logs_agenda_jobs'
  }
});

agenda.define('check shedule', async () => {
  logger.info({ msg: new Date() });
})

export const initAgenda = async () => {
  try {
    await agenda.start();
    await agenda.every('1 minute', 'check shedule');
  } catch {}
}