import axios from 'axios';

export const fetchLatestBlogs = async () => {
  // Adjust endpoint as per your backend
  const { data } = await axios.get('/api/blogs/latest');
  return data;
};

export const fetchOlderBlogs = async ({ pageParam = 1 }) => {
  // Adjust endpoint as per your backend
  const { data } = await axios.get(`/api/blogs/older?page=${pageParam}`);
  return data;
};
