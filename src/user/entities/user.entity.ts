import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entitiy';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
  })
  fName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
  })
  lName!: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 255,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password!: string;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions!: Subscription[];

  @OneToMany(() => Category, (category) => category.user)
  categories!: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];

  @Column({
    type: 'varchar',
    default: 'user',
  })
  role!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
