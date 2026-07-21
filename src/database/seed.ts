import { Category, CategoryType } from '../category/entities/category.entitiy';
import {
  Transaction,
  TransactionType,
} from '../transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import dataSource from './data-source';
import bcrypt from 'bcrypt';

const userRepository = dataSource.getRepository(User);
const categoryRepository = dataSource.getRepository(Category);
const transactionRepository = dataSource.getRepository(Transaction);

const email = 'seed1@gmail.com';

async function seed() {
  await dataSource.initialize();

  console.log('Database Connected');

  const existingUser = await userRepository.findOne({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    console.log('Seed Data Already Exists');
    await dataSource.destroy();
    return;
  }

  const hashPassword = await bcrypt.hash('12345678', 10);
  const user = await userRepository.save({
    fName: 'Seed1',
    lName: 'User',
    email: email,
    password: hashPassword,
  });
  console.log('User Created');

  const salary = await categoryRepository.save({
    name: 'Salary',
    type: CategoryType.INCOME,
    user: user,
  });

  const food = await categoryRepository.save({
    name: 'Food',
    type: CategoryType.EXPENSE,
    user: user,
  });

  const travel = await categoryRepository.save({
    name: 'Travel',
    type: CategoryType.EXPENSE,
    user: user,
  });

  console.log('Categories Created');

  const transactionsToInsert: any[] = [];

  const startDate = new Date(2025, 6, 19);
  const endDate = new Date(2026, 6, 19);

  for (let i = 0; i < 12; i++) {
    const salaryDate = new Date(2025, 6 + i, 20);
    transactionsToInsert.push({
      title: `Salary Month ${i + 1}`,
      amount: 50000,
      type: TransactionType.INCOME,
      description: 'Monthly Salary',
      date: salaryDate,
      category: salary,
      user: user,
    });
  }

  for (let i = 1; i <= 500; i++) {
    const isFood = Math.random() > 0.5;
    const randomAmount = Math.floor(Math.random() * 1500) + 100;

    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );

    transactionsToInsert.push({
      title: isFood ? `Food Transaction ${i}` : `Travel Transaction ${i}`,
      amount: randomAmount,
      type: TransactionType.EXPENSE,
      description: isFood ? 'Restaurant & Groceries' : 'Fuel & Cabs',
      date: randomDate,
      category: isFood ? food : travel,
      user: user,
    });
  }

  await transactionRepository.save(transactionsToInsert);

  console.log(
    `Successfully created ${transactionsToInsert.length} Transactions`,
  );

  await dataSource.destroy();

  console.log('Seeder Completed');
}

seed();
