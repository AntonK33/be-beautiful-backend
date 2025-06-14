import createHttpError from 'http-errors';
import { addClientsSevice, deleteClientService } from '../services/clientService.js';

export const addClientsController = async (req, res, next) => {
    try {
        const clientsData = req.body;
        if (!clientsData) {
             throw createHttpError(400, "clientsData is not defaind");
        }
        const data = await addClientsSevice(clientsData);

        return res.status(201).json(data)
    } catch (error) {
        next(error);
    }
    
};

export const getClientsController = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
    
};
export const getClientsByTelController = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
    
};
// export const updateClientsController = async () => {
//     try {
        
//     } catch (error) {
        
//     }
    
// };
export const deleteClientsController = async (req, res, next) => {
    try {
        const { tel } = req.params;

        const client = await deleteClientService(tel);
        if (!client) {
      throw createHttpError(404, `Contact with tel=${client} not found`);
    }
        return res.status(204).end();
        
    } catch (error) {
        next(error);
    }
   
};