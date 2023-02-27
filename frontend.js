const express = require("express");
const path = require("path");
const app = express();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


app.use(express.static(path.join(__dirname, "dist")));

app.get('/', () => { res.status(200).send('OK') })
app.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' });
});

app.listen(80, () => console.log("Listening on port " + 80));