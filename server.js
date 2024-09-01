const express = require('express');
const multer = require('multer');
const app = express();
const port = 8000;

const upload = multer();

const diseaseInfo = {
    "Leaf Curl Disease": {
        "What is this disease?": "Leaf Curl Disease (LCVD) is a plant disease that primarily affects the leaves of various plants, causing them to curl or deform. This disease is caused by pathogens such as viruses or fungi and is often transmitted by insect vectors like aphids, whiteflies, or mites. In chili plants, LCVD can significantly impact plant health by deforming leaves, reducing photosynthetic ability, and ultimately affecting growth and yield. For classification using DSLR images, identifying leaf curling and distortion is crucial as these are primary visual indicators of infection.",
        "What are the possible cures?": "There is currently no cure for Leaf Curl Disease once a plant is infected. Management strategies focus on preventing the disease's spread and minimizing damage through controlling insect vectors, removing infected plant material, and applying insecticides or fungicides. In the case of chili plants, early detection using DSLR images can help in identifying the disease early, allowing for timely intervention to prevent widespread infection. Integrated pest management (IPM) practices, including biological controls and using resistant plant varieties, are also recommended to reduce reliance on chemical treatments.",
        "What causes this disease?": "Leaf Curl Disease in chili plants can be caused by viruses like the Chili Leaf Curl Virus (ChiLCV), which is a begomovirus, or fungi that attack plant tissues. These pathogens are transmitted by insect vectors such as whiteflies, which acquire the virus or fungal spores from infected plants and then spread them to healthy plants. Environmental conditions like high humidity and warm temperatures can increase the prevalence of these vectors and pathogens. In classification using DSLR images, identifying features associated with insect damage and viral symptoms can be key indicators of the disease.",
        "What are the common symptoms?": "The symptoms of Leaf Curl Disease in chili plants include severe curling and distortion of the leaves, which may also exhibit yellowing, mottling, or stunted growth. Infected leaves often become thickened and brittle, making them more susceptible to damage. Additionally, the plant's overall growth may be stunted, with fewer flowers and reduced fruit yield. These visual symptoms are crucial for the classification of infected versus healthy plants using DSLR images, as they provide clear and distinguishable features for image recognition algorithms.",
        "What is the traditional diagnosis?": "Diagnosis of Leaf Curl Disease typically involves a visual inspection of the plant for symptoms such as leaf curling, yellowing, and stunted growth. Laboratory tests, like PCR for viral DNA or culturing for fungal pathogens, can provide a more definitive diagnosis. In a classification context using DSLR images, early-stage diagnosis can be facilitated by developing machine learning models trained on images of infected and healthy plants, which can analyze visual features and identify disease presence accurately and non-incisively.",
        "What are the preventive measures?": "Preventing Leaf Curl Disease involves integrated strategies such as using resistant plant varieties, controlling insect vectors, maintaining good plant hygiene, and applying fungicides or insecticides preventively. In the context of DSLR image classification, early detection and accurate identification of disease symptoms through image analysis can play a significant role in implementing timely preventive measures, thereby reducing the spread and impact of the disease."
    },
    "Healthy" : {

    }
};

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
    const answer = diseaseData[question.charAt(0).toUpperCase() + question.slice(1)];

    if (!answer) {
        return res.status(400).json({ "error": `Invalid question '${question}' for disease '${diseaseName}'.` });
    }

    return res.json({
        "disease_name": diseaseName,
        "question": question,
        "answer": answer
    });
});

app.get('/questions' , (req,res) =>{
    const questions = Object.keys(diseaseInfo["Leaf Curl Disease"])
    return res.send(questions)

})

app.use('*', (req, res) => {
    res.status(404).json({ "error": "Route not found." });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
