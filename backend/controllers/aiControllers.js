const AiPrompt = require('../ai')

exports.generate = async (req, res) => {
    const { prompt } = req.body;

    try {
        const airesponse = await AiPrompt(prompt)
        return res.status(201).json(airesponse)
    } catch (err) {
        console.log(err)
    }
}

exports.generateProblem = async (req, res) => {
    const { prompt } = req.body;

    try {
        const finalPrompt =
            `Listen and Follow the instructions carefully-
                1. It is a promt for creating a problem in computer science problem
                2. Do not tell anything extra just to the point
                3. The place where it will be used is in markdown format, so make raw markdown use whatever needed
                4. Use whatever it takes to make it nice and precise, not too short not too big
                5. Provide a example how the output should be and input as well if exists or needed
                6. You do not need to give them inside triple quote as i am using the response value directly in the react-markdown's mardown box
                now lets generate the markdown for ${prompt}
            `;
        const airesponse = await AiPrompt(finalPrompt);
        
        const response = airesponse.text;

        return res.status(201).json(response)

    } catch (err) {
        console.log(err);
    }
}

exports.generateLesson = async (req, res) => {
    const { prompt } = req.body;

    try {
        const finalPrompt =
            `Listen and Follow the instructions carefully-
                1. It is a promt for creating a lesson in computer science lessons
                2. tell something in the given topic 
                3. The place where it will be used is in markdown format, so make raw markdown use whatever needed
                4. Use whatever it takes to make it nice and precise, not too short not too big, make sure to give examples
                5. You do not need to give them inside triple quote as i am using the response value directly in the react-markdown's mardown box
                now lets generate the markdown for ${prompt}
            `;
        const airesponse = await AiPrompt(finalPrompt);
        const response = airesponse.text;
        return res.status(201).json(response)
    } catch (err) {
        console.log(err);
    }
}

exports.generateCode = async (req, res) => {
    const { prompt } = req.body;

    try {
        const finalPrompt =
            `Listen and Follow the instructions carefully-
                1. It is a promt for getting the errors in computer science learning codes
                2. You just need to find out the errors
                3. You will paste the exact but with errors suggestions commented on the right side of lines where needed
                4. What ever edit you do has to be in the comment
                5. now give me the code ${prompt}
            `;
        const airesponse = await AiPrompt(finalPrompt);
        const response = airesponse.text;
        return res.status(201).json(response)
    } catch (err) {
        console.log(err);
    }
}