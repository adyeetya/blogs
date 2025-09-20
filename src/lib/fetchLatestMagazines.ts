import axios from "axios";

export const fetchLatestMagazines = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/magazines/latest`
  );
  return res.data;
};
