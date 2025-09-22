import dotenv from "dotenv";
import NovaPoshta from "novaposhta";

dotenv.config();

const np = new NovaPoshta({ apiKey: process.env.NOVAPOSHTA_KEY });

export const getCities = async () => {
  return await np.address.getCities();
};

export const getWarehouses = async (cityRef) => {
  return await np.address.getWarehouses({ CityRef: cityRef });
};

