import { prop, getModelForClass, ReturnModelType, modelOptions } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import logger from '@helpers/logger';

interface IReminder {
  chat_id: number;
  date: number;
  username: string
  text: string
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Reminder extends TimeStamps {
  @prop({ required: true }) chat_id: number
  @prop({ required: true }) username: string;
  @prop({ required: true }) date: number;
  @prop({ required: true, default: '' }) text: string;

  static async saveReminder(this: ReturnModelType<typeof Reminder>, reminder: IReminder) {
    const reminderFind = await this.findOne(reminder);
    if (!reminderFind) {
      logger.info({ msg: `reminder save ${reminder.text}` });
      this.create(reminder)
    }
  }

  // static async findReview(this: ReturnModelType<typeof Reminder>, date: string, title: RegExp) {
  //   return await this.findOne({ title: { '$regex': title, $options: 'i' }, date: { '$regex': date } });
  // }

  // static async findReviewsToday(this: ReturnModelType<typeof Reminder>, date: string) {
  //   return await this.find({ dateDay: date });
  // }
}

export default getModelForClass(Reminder);

