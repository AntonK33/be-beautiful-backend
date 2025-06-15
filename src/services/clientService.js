import createHttpError from 'http-errors';
import { ClientModel } from '../db/models/clientModel.js';

export const addClientsSevice = async (clientsData) => {
    let client = await ClientModel.findOne({ phoneNumber: clientsData.phoneNumber }); 
    let isNew = false;

    // console.log("what comes in client", client);

    if (!client) {
        client = await ClientModel.create(clientsData);
        isNew = true;
        //console.log("what comes in addClient", client);
    }
    client = await ClientModel.findOneAndUpdate({ phoneNumber: clientsData.phoneNumber }, clientsData, {new:true});
   

    return {client, isNew};
};

export const getAllClientsService = async () => {
    const allClients = await ClientModel.find({}).sort({ createdAt: -1 });
    return allClients;
};

export const getClientsByTelService = async (clientsData) => {
    let client = await ClientModel.findOne({ phoneNumber: clientsData.phoneNumber });
    if (!client) {
        throw createHttpError(400, "client with this number not found");
    };
    return client;
};



export const deleteClientService = async (clientsData) => {
    console.log("what as a resalt hawe we in clientsData.phoneNumber", clientsData.phoneNumber)
    let client = await ClientModel.findOne({ phoneNumber: clientsData.phoneNumber }); 
    
    if (!client) {
        throw createHttpError(400, "client with this number not found");
    };

    const deletedClient = await ClientModel.deleteOne({ phoneNumber: clientsData.phoneNumber });
   
    if (deletedClient.deletedCount === 0) {
         throw createHttpError(400, "clientsData is not defaind");
    }
    return deletedClient;
}