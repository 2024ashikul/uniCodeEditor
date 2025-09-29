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





