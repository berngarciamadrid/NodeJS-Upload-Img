const { Router } = require('express');
const path = require('path');
const router = Router();


router.get('/', (req, res) => {
    res.render('index');
});

router.post('/upload', (req, res) => {
    console.log(req.file);
    res.send('uploaded');
});

module.exports = router;