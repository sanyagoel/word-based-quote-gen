const express = require('express');
const path = require('path');
const rootDir = require('./utils/path');
const homeRoutes = require('./routes/routes.js');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'public'));
app.use('/', homeRoutes);



const openai = new OpenAI({
    apiKey: "pk-BEfCaFfyosvcveICsfakspIHpJGwBcQTYCfVKGhaxdLwMxiL",
    baseURL: "https://api.pawan.krd/gpt-3.5-unfiltered/v1",
});

// const openaiAuthor = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY_2,
//     baseURL: "https://api.pawan.krd/gpt-3.5-unfiltered/v1",
// });

app.post('/generatequote', async (req, res) => {
    const { keyword } = req.body;
    console.log(keyword);
    try {
        const response = await openai.chat.completions.create({
            messages: [{ role: 'user', content: `give 1 quote about ${keyword}. DONT WRITE ANYTHING ELSE, JUST START WITH QUOTES, DO NOT GIVE THE NAME OF THE AUTHOR, I WANT JUST THE QUOTE` }],
            model: 'gpt-3.5-unfiltered',
        });

        const rawText = response.choices[0].message.content;
        console.log(rawText);
        const quoteAndAuthor = rawText.split(" – ");
        const quote = quoteAndAuthor[0];
        console.log(quote);
        res.render('generatedQuote.ejs', { quote: quote , keyword : keyword});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate quote" });
    }
});

app.post('/generateAuthor',async (req,res)=>{
    const author = req.body.author;
    console.log(author);
    try{
        const response = await openai.chat.completions.create({
            messages :[{role  : 'user', content:`Generate three unique quotes by ${author} and output them separated by a $ symbol without any spaces between them. Make sure the quotes do not repeat. Here is the format for your response: quote1$quote2$quote3`,
            model:'gpt-3.5-unfiltered'}]
        });
        const rawText = response.choices[0].message.content;
        console.log(rawText);
        const quotes = rawText.split("$");
        const quote1 = quotes[0];
        const quote2 = quotes[1];
        const quote3 = quotes[2];
        res.render('generateAuthor.ejs',{quote1 : quote1 , quote2 : quote2, quote3 : quote3, author : author});
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'failed to generate'});
    }
})


app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
