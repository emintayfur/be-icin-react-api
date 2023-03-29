// index.js

const port = 3001;
let list = [];

const express = require("express");
const app = express();

app.use(require("cors")());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const successResponse = (data) => ({
    status: true,
    data,
});

const errorResponse = (message = null) => ({
    status: false,
    message,
});

// 4 saniyelik gecikme
const initialAppDelay = 4000;
const withDelay =
    (fc, ms = initialAppDelay) =>
        (req, res) => {
            setTimeout(() => fc(req, res), ms);
            return null;
        };

// Listele
app.get(
    "/todos",
    withDelay((req, res) => {
        res.json(successResponse(list));
    })
);

// Ekle
app.post(
    "/todo",
    withDelay((req, res) => {
        const todo = req?.body?.str;

        if (!todo || typeof todo !== "string") {
            return res
                .status(400)
                .json(errorResponse("Lütfen geçerli bir değer gönderin!"));
        }

        if (todo?.length > 255) {
            return res
                .status(400)
                .json(errorResponse("Lütfen en fazla 255 karakter girin."));
        }

        const foundItem = list.find(
            (item) => item.toLowerCase() === todo.toLowerCase()
        );
        if (foundItem) {
            return res.status(409).json(errorResponse(`"${todo}" zaten mevcut!`));
        }

        list.push(todo);
        res.status(201).json(successResponse());
    })
);

// Sil
app.delete(
    "/todo",
    withDelay((req, res) => {
        const index = req?.body?.index;

        if (typeof index !== "number") {
            return res
                .status(400)
                .json(errorResponse("Lütfen geçerli bir değer gönderin!"));
        }

        const foundItem = list?.[index];
        if (!foundItem) {
            return res.status(404).json(errorResponse("Bulunamadı!"));
        }

        delete list[index];
        list = list.filter(Boolean);
        return res.json(successResponse());
    })
);

app.use((req, res, next) => {
    res.status(404).json(errorResponse("Not found"));
    next();
});

app.listen(port, () => {
    console.log(`Sunucu "${port}" portu üstünde çalışmaya başladı :)`);
});
