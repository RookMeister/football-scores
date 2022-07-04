import { Context } from 'telegraf';
import { inlineKeyboard } from '@bot/services/keyboards';
import { mainMenu } from '@bot/services/buttons';

export const startCommandHandler = async (ctx: Context) => {
  const { size, column, values } = mainMenu;
  const keyboard = inlineKeyboard(values, size, column);
  const { username } = ctx.dbuser;
  await ctx.reply(`Привет @${username}.\n`, keyboard);
};
