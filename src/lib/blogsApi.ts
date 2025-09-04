import axios from 'axios';
import { SERVER_URL } from '@/config';
export const fetchLatestBlogs = async () => {
  const { data } = await axios.get(`${SERVER_URL}/api/blogs/latest`);
  return data;
};

export const fetchOlderBlogs = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`${SERVER_URL}/api/blogs/older?page=${pageParam}&limit=9`);
  return data;
};

// Optional: Add other blog-related API functions
export const fetchBlogBySlug = async (slug: string) => {
  const { data } = await axios.get(`${SERVER_URL}/api/blogs/${slug}`);
  return data;
};

export const fetchBlogsByCategory = async (category: string, page = 1) => {
  const { data } = await axios.get(`${SERVER_URL}/api/blogs/older?category=${category}&page=${page}`);
  return data;
};

export const fetchBlogsByAuthor = async (author: string, page = 1) => {
  const { data } = await axios.get(`${SERVER_URL}/api/blogs/older?author=${author}&page=${page}`);
  return data;
};