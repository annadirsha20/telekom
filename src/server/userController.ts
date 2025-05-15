import express from 'express';

export function createUserController(collectionUsers: any) {
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
          email: user.email
        };

        return res.json({ message: 'Вход успешен', user: user.username });

      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
    }
  };
}