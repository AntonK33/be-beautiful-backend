import createHttpError from 'http-errors';
import {
    addClientsSevice,
    deleteClientService,
    getAllClientsService,
    getClientsByTelService
} from '../services/clientService.js';

export const addClientsController = async (req, res, next) => {
    try {
        const clientsData = req.body;
        if (!clientsData) {
             throw createHttpError(400, "clientsData is not defaind");
        }
        const {client, isNew} = await addClientsSevice(clientsData);

        return  res.status(isNew ? 201 : 200).json(client);

    } catch (error) {
        next(error);
    }
    
};

export const getAllClientsController = async (req, res, next) => {
    try {
        const data = await getAllClientsService();
        return res.status(200).json(data);
    } catch (error) {
        next(error)
    }
    
};
export const getClientsByTelController = async (req, res, next) => {
    try {
        const clientsData = req.params;

        const client = await getClientsByTelService(clientsData);

        return res.status(200).json(client);
    } catch (error) {
        next(error);
    }
    
};

export const deleteClientsController = async (req, res, next) => {
    try {
        const clientsData = req.params;
        console.log("what as a resalt hawe we in clientsData.phoneNumber", clientsData)
       

        const client = await deleteClientService(clientsData);
        if (!client) {
      throw createHttpError(404, `Contact with tel=${client} not found`);
    }
        return res.status(204).end();
        
    } catch (error) {
        next(error); 
    }
   
};