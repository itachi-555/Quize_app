const path = require('path');
const express = require('express');
const Quizzes = require('./models/quizes');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/quizzes/:index', (req, res) => {
    const index = req.params.index;
    res.status(200).json(Quizzes[index].quizzes); 
})
app.get('/categories',(req,res) => {
    let categories = [];
    Quizzes.forEach(element => {
        categories.push(element.categorie);
    });
    res.status(200).json(categories);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

