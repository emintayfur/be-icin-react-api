// index.js

const port = 3001;
let list = [];

const express = require('express')
const app = express();

// app.use(require('cors')());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const successResponse = (data) => ({
    status: true,
    data,
})

const errorResponse = (message = null) => ({
    status: true,
    message,
})

// Listele
app.get('/todos', (req, res) => {
    res.json(successResponse(list));
})

// Ekle
app.post('/todo', (req, res) => {
    const todo = req?.body?.str;

    if (!todo || typeof todo !== 'string') {
        return res.status(400).json(errorResponse('Lütfen geçerli bir değer gönderin!'))
    }

    const foundItem = list.find((item) => item.toLowerCase() === todo.toLowerCase());
    if (foundItem) {
        return res.status(409).json(errorResponse(`"${todo}" zaten mevcut!`))
    }

    list.push(todo);
    res.status(201).json(successResponse())
});

// Sil
app.delete('/todo', (req, res) => {
    const index = req?.body?.index;

    if (typeof index !== 'number') {
        return res.status(400).json(errorResponse('Lütfen geçerli bir değer gönderin!'))
    }

    const foundItem = list?.[index];
    if (!foundItem) {
        return res.status(404).json(errorResponse('Bulunamadı!'))
    }

    delete list[index];
    list = list.filter(Boolean);
    return res.json(successResponse())
})

app.listen(port, () => {
    console.log(`Sunucu "${port}" portu üstünde çalışmaya başladı :)`)
})
