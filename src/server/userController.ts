import express from 'express';

export function createUserController(collectionUsers: any, devicesCollection: any) {
  return {
    login: async (req: express.Request, res: express.Response) => {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({ message: 'Логин и пароль обязательны' });
      }

      try {
        const user = await collectionUsers.findOne({ username: login });

        if (!user) {
          return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const isPasswordValid = password == user.password;

        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Неверный пароль' });
        }

        (req.session as any).user = {
          id: user._id.toString(),
          username: user.username,
        };

        return res.json({ message: 'Вход успешен', user: user.username, type: user.type, priority: user.priority });

      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
    },

    getDevicesByUser: async (req: express.Request, res: express.Response) => {
      try {
        const { user } = req.query;

        if (!user) {
          return res.status(400).json({ message: 'Пользователь не указан' });
        }

        const devices = await devicesCollection.find({ username: user }).toArray();

        return res.status(200).json(devices);
      } catch (error) {
        console.error('[ERROR] Failed to fetch devices:', error);
        return res.status(500).json({ message: 'Ошибка при получении устройств' });
      }
    }
  };
}