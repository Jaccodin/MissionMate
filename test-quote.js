require('dotenv').config();
const { generateQuote } = require('./backend/quotes');

async function testQuoteGeneration() {
    try {
        console.log('Attempting to generate a motivational quote...');
        const quote = await generateQuote();
        console.log('Successfully generated quote:', quote);
    } catch (error) {
        console.error('Error generating quote:', error.message);
    }
}

testQuoteGeneration();
