import config from '@helpers/config';

interface ISettingsButtons {
  size: number;
  column: boolean;
  values: TArrayButtons;
}

type TArrayButtons = { label: string, value?: string, active: number, view?: 'url' | 'webApp' }[];


export const mainMenu: ISettingsButtons = {
  'size': 2,
  'column': false,
  'values': [
    { 'label': 'Матчи', 'value': config.WEB_URL + '/matches', 'active': 1, view: 'webApp' },
    { 'label': 'Статистика', 'value': config.WEB_URL + '/standings', 'active': 1, view: 'webApp' },
    { 'label': 'Обзоры за день', 'active': 0 },
    { 'label': 'О боте', 'active': 0 },
    { 'label': 'Donate', 'value': 'https://www.tinkoff.ru/cf/4320g6jTu2L', 'active': 1, view: 'url' }
  ]
}

export const donate: ISettingsButtons = {
  'size': 1,
  'column': false,
  'values': [{ 'label': 'Donate', 'value': 'https://www.tinkoff.ru/cf/4320g6jTu2L', 'active': 1, view: 'url' }]
}