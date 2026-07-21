import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entitiy';
import { Transaction } from '../transaction/entities/transaction.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [User, Category, Transaction],
  synchronize: true,
});
