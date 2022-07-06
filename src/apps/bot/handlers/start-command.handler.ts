import { Context } from 'telegraf';
import { inlineKeyboard } from '@bot/services/keyboards';
import { mainMenu } from '@bot/services/buttons';

export const startCommandHandler = async (ctx: Context) => {
  const { size, column, values } = mainMenu;
  const keyboard = inlineKeyboard(values, size, column);
  const { username } = ctx.dbuser;
  await ctx.reply(`Привет @${username}.\nЭти кнопки помогут тебе в получении информации нужной информации. Так же можно поощрить автора за его работу по кнопке "Donate".\nПо любым вопросам писать @RookMeister`, keyboard);
};
