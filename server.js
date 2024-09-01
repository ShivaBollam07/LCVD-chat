const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8000;

const upload = multer();

const dataPath = path.join(__dirname, 'diseaseinfo.json');
let diseaseInfo = {};

fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }
    diseaseInfo = JSON.parse(data);
});

app.post('/chat', upload.none(), (req, res) => {
    const diseaseName = req.body.disease_name;
    const question = req.body.question;

    if (!diseaseName || !question) {
        return res.status(400).json({ "error": "Both disease_name and question fields are required." });
    }

    if (!diseaseInfo[diseaseName]) {
        return res.status(404).json({ "error": `Disease '${diseaseName}' not found.` });
    }

    const diseaseData = diseaseInfo[diseaseName];
    const formattedQuestion = question.charAt(0).toUpperCase() + question.slice(1).toLowerCase();
    const answer = diseaseData[formattedQuestion];

    if (!answer) {
        return res.status(400).json({ "error": `Invalid question '${question}' for disease '${diseaseName}'.` });
    }

    return res.json({
        "disease_name": diseaseName,
        "question": formattedQuestion,
        "answer": answer
    });
});

app.get('/questions', (req, res) => {
    const questions = Object.keys(diseaseInfo["Leaf Curl Disease"]);
    return res.send(questions);
});

app.use('*', (req, res) => {
    res.status(404).json({ "error": "Route not found." });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
