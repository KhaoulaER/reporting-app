import MistralClient from '@mistralai/mistralai'

const apiKey = process.env.MISTRAL_API_KEY
const client = new MistralClient(apiKey)
const chatResponse = await client.chat({
    model: 'mistral-large-latest',
    messages: [{role: 'user', content: 'Quels sont les chiens préférés pour les enfants ?'}]
   } )

console.log('Chat: ',chatResponse.choices[0].message.content);
