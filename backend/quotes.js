const axios = require('axios');

async function generateQuote() {
    try {
        const response = await axios.post('https://api.deepseeker.ai/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are a motivational quote generator. Generate an inspiring and original quote.' 
                },
                {
                    role: 'user',
                    content: 'Generate a short motivational quote.'
                }
            ],
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate quote: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
}

module.exports = { generateQuote };
