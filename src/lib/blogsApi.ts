// Search blogs by title, category, tag, or author
export const searchBlogs = async (params: {
  q?: string;
  category?: string;
  author?: string;
  tag?: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.append('q', params.q);
  if (params.category) searchParams.append('category', params.category);
  if (params.author) searchParams.append('author', params.author);
  if (params.tag) searchParams.append('tag', params.tag);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  const { data } = await axios.get(`${SERVER_URL}/api/blogs/search?${searchParams.toString()}`);
  return data;
};
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