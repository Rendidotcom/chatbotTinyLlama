import axios from 'axios';

const proxyUrl = 'https://83f5-103-148-232-37.ngrok-free.app/chat';

export const getChatResponse = async () => {
  try {
    const response = await axios.get(proxyUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat response:', error);
  }
};
