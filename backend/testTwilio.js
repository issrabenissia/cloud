require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendTestMessage() {
  try {
    const message = await client.messages.create({
      body: 'Test message from Twilio',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+21694300790', // Replace with a verified number
    });
    console.log('Message sent:', message.sid);
  } catch (error) {
    console.error('Twilio Error:', error.message, error.code, error.moreInfo);
  }
}

sendTestMessage();