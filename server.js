const express = require('express');
const app = express();
const PORT = 3000;


// 1 Middleware для логирования 
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // Передаем управление дальше
});

// 2 Middleware для парсинга JSON из тела запроса 
app.use(express.json());


// ВРЕМЕННАЯ БАЗА ДАННЫХ 
let courses = [
    { id: 1, title: 'Основы C#', instructor: 'Иванов А.П.', duration: 40, price: 12000 },
    { id: 2, title: 'ASP.NET Core MVC', instructor: 'Петров С.В.', duration: 60, price: 18000 },
    { id: 3, title: 'Архитектура веб-приложений', instructor: 'Козлов Е.Н.', duration: 50, price: 25000 }
];

let nextId = 4; // счетчик для новых ID


// МАРШРУТЫ 

// Главная страница 
app.get('/', (req, res) => {
    res.send(`
        <h1>API Курсов</h1>
        <p>Доступные маршруты:</p>
        <ul>
            <li>GET /api/courses</li>
            <li>GET /api/courses/:id</li>
            <li>POST /api/courses</li>
            <li>PUT /api/courses/:id</li>
            <li>DELETE /api/courses/:id</li>
        </ul>
    `);
});

// 1 Получить все курсы
app.get('/api/courses', (req, res) => {
    res.json(courses);
});

// 2 Получить курс по ID
app.get('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);

    if (!course) {
        return res.status(404).json({ error: 'Курс не найден' });
    }
    res.json(course);
});

// Добавить новый курс
app.post('/api/courses', (req, res) => {
    const { title, instructor, duration, price } = req.body;

    // валидация 400 Bad Request
    if (!title || !instructor || duration === undefined || price === undefined) {
        return res.status(400).json({ error: 'Поля title, instructor, duration и price обязательны' });
    }

    const newCourse = {
        id: nextId++,
        title,
        instructor,
        duration: parseInt(duration),
        price: parseFloat(price)
    };

    courses.push(newCourse);
    res.status(201).json(newCourse); // 201 Created
});

//  Обновить существующий курс
app.put('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);

    if (!course) {
        return res.status(404).json({ error: 'Курс не найден' });
    }

    const { title, instructor, duration, price } = req.body;

    // Обновляем только те поля, которые пришли в запросе
    if (title) course.title = title;
    if (instructor) course.instructor = instructor;
    if (duration !== undefined) course.duration = parseInt(duration);
    if (price !== undefined) course.price = parseFloat(price);

    res.json(course);
});

// Удалить курс
app.delete('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = courses.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Курс не найден' });
    }

    // удаляем из массива и сохраняем удаленный элемент
    const deletedCourse = courses.splice(index, 1)[0];
    res.json({ message: 'Курс удален', course: deletedCourse });
});


// ОБРАБОТКА 404 
app.use((req, res) => {
    res.status(404).send('Страница не найдена (404)');
});


// ЗАПУСК СЕРВЕРА
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});