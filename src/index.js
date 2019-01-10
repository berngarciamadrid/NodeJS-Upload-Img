const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');


// Iniciar
const app = express();

// Settings
app.set('port', 3000);
// Para las plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  Debug
app.use(morgan('dev'));

// Middleware Parte intermedia
// Como guardar imágenes
const almacenaje = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {
        // cb(null, file.originalname + '-' + Date.now());
        cb(null, uuid() + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({
    storage: almacenaje,
    dest: path.join(__dirname, 'public/images'),
    limits: { fileSize: '10000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: El archivo debe ser una imagen válida");
    }
}).single('image');

// Routes
app.use(upload);
app.use(require('./routes/index.routes'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})