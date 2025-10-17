
const express = require('express');
const path = require('path');
const planetRoutes = require('./routes/planetRoutes'); // путь к твоим маршрутам

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем маршруты
app.use(planetRoutes); // так как маршруты уже с /api/planets

// Тестовый маршрут
app.get('/', (req, res) => res.send('Planet CRUD API działa!'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
