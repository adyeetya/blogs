import axios from "axios";
import { SERVER_URL } from "@/config";
export const fetchMagazines = async ({ page = 1, limit = 12 } = {}) => {
  const res = await axios.get(`${SERVER_URL}/api/magazines`, {
    params: { page, limit },
  });
  return res.data;
};

export const fetchLatestMagazines = async () => {
  const res = await axios.get(`${SERVER_URL}/api/magazines/latest`);
  return res.data;
};
