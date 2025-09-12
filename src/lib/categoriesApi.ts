import axios from 'axios';
import { SERVER_URL } from '@/config';

export const fetchCategories = async () => {
  const { data } = await axios.get(`${SERVER_URL}/api/categories`);
  return data;
};

export const createCategory = async (category: { name: string; description?: string; color?: string }, token: string) => {
  const { data } = await axios.post(`${SERVER_URL}/api/categories`, category, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return data;
};
