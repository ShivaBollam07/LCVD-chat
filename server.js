//Implementing a simple Express server that provides APIs for a chatbot application.
//Importing required modules
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8000;

const upload = multer();

const dataPath = path.join('./diseaseinfo.json');
let diseaseInfo = {};

// Reads the JSON file that contains disease information at server start
// The data is parsed and stored in the `diseaseInfo` variable
fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }
    diseaseInfo = JSON.parse(data);
});

// POST API that handles user chat with disease information
// It takes the disease name and question from the request body, then returns the corresponding answer
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

// GET API that returns a list of available questions for a specific disease (e.g., "Leaf Curl Disease")
// The questions are derived from the keys in the disease's data
app.get('/questions', (req, res) => {
    const questions = Object.keys(diseaseInfo["Leaf Curl Disease"]);
    return res.send(questions);
});

// Handles any undefined routes by returning a 404 error with a custom message
// This ensures that invalid API requests are properly managed
app.use('*', (req, res) => {
    res.status(404).json({ "error": "Route not found." });
});

// Starts the server and listens on the specified port
// Once the server is running, it logs the URL for accessing it
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
