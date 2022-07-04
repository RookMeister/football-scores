import { Telegraf } from 'telegraf';
import config from '@helpers/config';

import { setupLoggerMiddleware } from '@bot/middlewares/setup-logger.middleware';
import { debugLoggerMiddleware } from '@bot/middlewares/debug-logger.middleware';
import { attachUserMiddleware } from '@bot/middlewares/attach-user.middleware';
import { analyticsMiddleware } from '@bot/middlewares/setup-analytics.middleware';
import { setLastActionToUserMiddleware } from '@bot/middlewares/last-action-to-user.middleware';

import { startCommandHandler } from '@bot/handlers/start-command.handler';

const bot: Telegraf = new Telegraf(config.BOT_TOKEN, {
  telegram: {
    apiRoot: config.BOT_API_ROOT,
  },
});

bot.use(setupLoggerMiddleware());
bot.use(attachUserMiddleware);
if (config.isProduction) {
  bot.use(analyticsMiddleware);
  bot.use(setLastActionToUserMiddleware);
}
bot.use(debugLoggerMiddleware());

bot.start(startCommandHandler);

bot.on('text', (ctx) => ctx.reply('Извини, я не могу тебя понять. Используй кнопки. Если не видишь кнопки, отправь мне /start'));

export default bot;
