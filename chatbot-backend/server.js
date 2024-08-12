const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const app = express();

app.use(express.json());

const PORT = 5000;

const configuration = new Configuration({
  apiKey: 'OPENAI_API_KEY_PLACEHOLDER',
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const botMessage = response.data.choices[0].message.content;
    res.json({ message: botMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching response from ChatGPT' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
