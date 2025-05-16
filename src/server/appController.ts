// appController.ts

import { Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';

type ApplicationStatus = 'new' | 'in progress' | 'closed';

async function assignFromPool(
  applicationsCollection: Collection,
  usersCollection: Collection,
  username: string
): Promise<boolean> {
  console.log('BBBBBBBBBBBBBBBB');

  try {
  const poolApp = await applicationsCollection
    .find({ appointed: null })
    .sort({ isVip: -1, createdAt: 1 })
    .limit(1)
    .next();

    console.log('aAAAAAAAAAAAAAAA');

    if (!poolApp) {
          console.log(poolApp)
      return false;
    }

    const app = poolApp;
    const isVip = app.isVip;
    const cost = isVip ? 5 : 1;

    const manager = await usersCollection.findOne({ username: username });
    const currentLoad = manager?.load ?? 0;

    if (currentLoad + cost > 8) return false;

    await applicationsCollection.updateOne(
      { _id: app._id },
      { $set: { appointed: username } }
    );

    await usersCollection.updateOne(
      { username: username },
      { $inc: { load: cost } }
    );

    return true;

  } catch (error) {
    console.error('[ERROR] Failed to assign from pool:', error);
    return false;
  }
}

export function createAppController(applicationsCollection: Collection, usersCollection: Collection) {
  return {
    createApplication: async (req: Request, res: Response) => {
      try {
        const { title, text, owner, priority } = req.body;

        if (!title || !text) {
          return res.status(400).json({ message: 'Title и текст обязательны!' });
        }
        const isVip = priority === 'vip';
        const priorityCost = isVip ? 5 : 1;
        console.group(isVip)

        let assignedManager = null;

        // Ищем подходящего менеджера
        const managers = await usersCollection
          .find({ type: 'admin' })
          .sort({ load: 1 })
          .toArray();


        for (const manager of managers) {
          const currentLoad = manager.load ?? 0;
          if (currentLoad + priorityCost <= 8) {
            assignedManager = manager;
            break;
          }
        }

        const application = {
          title,
          text,
          status: 'new',
          owner: owner,
          isVip,
          appointed: assignedManager ? assignedManager.username : null,
          createdAt: new Date(),
        };

        // Используем напрямую applicationsCollection
        const result = await applicationsCollection.insertOne(application);

        if (assignedManager) {
          await usersCollection.updateOne(
            { username: assignedManager.username },
            { $inc: { load: priorityCost } }
          );
        }
        return res.status(201).json({
          message: 'Заявка успешно создана!',
          applicationId: result.insertedId
        });

      } catch (error) {
        console.error('[ERROR] Failed to create application:', error);
        return res.status(500).json({ message: 'Ошибка при создании заявки' });
      }
    },

    getApplicationsByUser: async (req: Request, res: Response) => {
      try {
        const { user } = req.query;

        if (!user) {
          return res.status(400).json({ message: 'Пользователь не указан' });
        }

        const apps = await applicationsCollection
          .find({ owner: user as string })
          .sort({
            status: 1,
            createdAt: -1
          })
          .toArray();
        // Сортировка на сервере по нужному порядку статусов
        const statusOrder = { 'in progress': 0, 'new': 1, 'closed': 2 };
        apps.sort((a: any, b: any) =>
          statusOrder[a.status as ApplicationStatus] - statusOrder[b.status as ApplicationStatus]
        );

        return res.status(200).json(apps);
      } catch (error) {
        console.error('[ERROR] Failed to fetch applications:', error);
        return res.status(500).json({ message: 'Ошибка при получении заявок' });
      }
    },

    getApplicationsByAdmin: async (req: Request, res: Response) => {
      try {
        const { user } = req.query;

        if (!user) {
          return res.status(400).json({ message: 'Пользователь не указан' });
        }

        const apps = await applicationsCollection
          .find({ appointed: user as string })
          .sort({
            status: 1,
            createdAt: -1
          })
          .toArray();
        // Сортировка на сервере по нужному порядку статусов
        const statusOrder = { 'in progress': 0, 'new': 1, 'closed': 2 };
        apps.sort((a: any, b: any) =>
          statusOrder[a.status as ApplicationStatus] - statusOrder[b.status as ApplicationStatus]
        );

        return res.status(200).json(apps);
      } catch (error) {
        console.error('[ERROR] Failed to fetch applications:', error);
        return res.status(500).json({ message: 'Ошибка при получении заявок' });
      }
    },

    updateApplicationStatus: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'in progress', 'closed'].includes(status)) {
          return res.status(400).json({ message: 'Неверный статус' });
        }

        const app = await applicationsCollection.findOne({ _id: new ObjectId(id) });

        if (!app || !app.appointed) {
          return res.status(404).json({ message: 'Заявка не найдена или не назначена' });
        }

        const usernameManager = app.appointed;
        const cost = app.isVip ? 5 : 1;

        if (status === 'closed') {
          await usersCollection.updateOne(
            { username: usernameManager },
            { $inc: { load: -cost } }
          );
          // Пытаемся взять заявку из пула
          await assignFromPool(applicationsCollection, usersCollection, usernameManager);
        }
        else {
          await usersCollection.updateOne(
            { username: usernameManager },
            { $inc: { load: +cost } }
          );
        }

        // Обновляем статус
        await applicationsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );

        return res.status(200).json({ message: 'Статус успешно обновлён' });

      } catch (error) {
        console.error('[ERROR] Failed to update application status:', error);
        return res.status(500).json({ message: 'Ошибка при обновлении статуса заявки' });
      }
    },

    getApplicationsAll: async (req: Request, res: Response) => {
      try {
        const apps = await applicationsCollection
          .find({ appointed: null }) // Только неназначенные заявки
          .sort({ createdAt: -1 })
          .toArray();

        const statusOrder: Record<ApplicationStatus, number> = {
          'in progress': 0,
          'new': 1,
          'closed': 2,
        };

        apps.sort((a, b) =>
          statusOrder[a.status as ApplicationStatus] - statusOrder[b.status as ApplicationStatus]
        );

        return res.status(200).json(apps);
      } catch (error) {
        console.error('[ERROR] Failed to fetch applications:', error);
        return res.status(500).json({ message: 'Ошибка при получении заявок' });
      }
    },

    updateApplication: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await applicationsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Заявка не найдена' });
        }

        return res.status(200).json({ message: 'Заявка успешно обновлена' });
      } catch (error) {
        console.error('[ERROR] Failed to update application:', error);
        return res.status(500).json({ message: 'Ошибка при обновлении заявки' });
      }
    },
  }
}