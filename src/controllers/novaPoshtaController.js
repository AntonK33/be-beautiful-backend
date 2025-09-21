import * as npService from '../services/novaPoshtaService.js';

export const getCities = async (req, res, next) => {
  try {
    const data = await npService.getCities();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getWarehouses = async (req, res, next) => {
  try {
    const { cityRef } = req.params;
    const data = await npService.getWarehouses(cityRef);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

