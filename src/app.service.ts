import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GetPrivateResponse, GetPublicResponse } from './types';
import { Message } from './schemas/message.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly configService: ConfigService,
  ) {}

  async create() {
    console.log('Seeding data');

    await this.messageModel.insertMany([
      { message: 'Private message', type: 'private' },
      { message: 'Public message', type: 'public' },
    ]);
  }

  async getPublicMessage(): Promise<GetPublicResponse> {
    console.log('Getting public message');
    const getMessage = await this.messageModel
      .findOne()
      .where({ type: 'public' })
      .exec();

    return { message: getMessage.message };
  }

  async getPrivateMessage(): Promise<GetPrivateResponse> {
    console.log('Getting private message');

    const getMessage = await this.messageModel
      .findOne()
      .where({ type: 'private' })
      .exec();

    return { message: getMessage.message };
  }
}
