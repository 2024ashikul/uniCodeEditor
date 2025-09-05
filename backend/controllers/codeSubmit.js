const fs = require('fs').promises;
const axios = require('axios');
const { Submission, Problem } = require('../models');
const { timeStamp } = require('console');
const { GoogleGenAI } = require("@google/genai");
const path = require('path')
exports.codeRun = async (req, res) => {
    console.log('coderunning');
    const { code, language, stdin } = req.body;
    const encodedCode = Buffer.from(code).toString('base64');
    const encodedInput = Buffer.from(stdin).toString('base64');
    console.log(encodedCode);
    const languageMap = {
        cpp: 54,
        c: 50,
        javascript: 63,
        python: 71,
        java: 62,
        csharp: 51
    }
    try {

        const submission = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions',
            {
                language_id: languageMap[language],
                source_code: encodedCode,
                stdin: encodedInput,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': 'f4b9df28fdmsh31feb4c0a56b9d8p13b748jsn7bef54346c81',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
                params: { base64_encoded: 'true', wait: 'true' },
            }
        );


        const result = submission.data;
        console.log(result);
        

        res.json({
            status: result.status.description,
            stdout: result.stdout && Buffer.from(result.stdout, 'base64').toString('utf-8'),
            stderr: result.stderr && Buffer.from(result.stderr, 'base64').toString('utf-8'),
            time: result.time,
            memory : result.memory
        });
    } catch (error) {

        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Execution failed' });
    }
};





exports.codeSubmit = async (req, res) => {

    const extensions = {
        cpp: 'cpp',
        c: 'c',
        javascript: 'js',
        python: 'py',
        java: 'java',
        csharp: 'cs'
    }
    console.log("submititng");
    const { code, language, problemId, userId } = req.body;
    const ext = extensions[language];
    const time = Date.now();
    const timestamp = time.toString();

    console.log(timestamp);
    console.log(code);
    console.log({ language, problemId });
    const filesDir = path.join(__dirname, '..', 'files');
    const filePath = path.join(filesDir, `${timestamp}.${ext}`);
    const txtPath = path.join(filesDir, `${timestamp}.txt`);
    try{
        await fs.mkdir(filesDir, { recursive: true });

        // Now, write the files safely
        await Promise.all([
            fs.writeFile(filePath, code),
            fs.writeFile(txtPath, code)
        ]);

    

        const newSubmission = await Submission.create({
            file: timestamp,
            ext: ext,
            problemId: problemId,
            userId: userId,
            time: Date.now()
        });



        console.log(problemId);
        console.log(`userId is ${userId}`)


        const problem = await Problem.findOne({
            where: { id: problemId }
        })
        const statement = problem.statement;
        console.log(statement)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
            You are an AI evaluator.

            Task:
            - The user has submitted code for a programming problem.
            - Evaluate the submission out of 9.
            - Use partial marks if necessary (e.g., 5, 7, etc.)
            - 3 marks for logic, 3 marks for syntax, 3 marks for overall coding
            Important:
            - Output ONLY the score as a single digit (0-9).
            - DO NOT explain or output anything else.

            Problem:
            ${statement}

            Code:
            ${code}
            Language : 
            ${language}
        `;
        let score = 4;
        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: [{ parts: [{ text: prompt }] }]
            });
            console.log(`response is ${response.text}`);
            score = response.text;
        }
        try {
            await main();
            newSubmission.AIscore = score;
            await newSubmission.save();

        } catch (err) {
            console.log(err);
            console.log("could not");
        }

        if (newSubmission) {
            res.status(201).json({ message: 'submitted succesfully' })
        } else {
            res.status(402).json({ message: 'could not submit' })
        }
    }
catch(err){
    console.log(err);
}
}