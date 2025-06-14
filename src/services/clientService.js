import createHttpError from 'http-errors';
import { ClientModel } from '../db/models/clientModel.js';

export const addClientsSevice = async (clientsData) => {
    let client = await ClientModel.findOne({ phoneNumber: clientsData.phoneNumber }); 
    console.log("what comes in client", client)
    if (!client) {
        client = await ClientModel.create(clientsData);
        console.log("what comes in addClient", client);
    }
    client = await ClientModel.findOneAndUpdate({ phoneNumber: clientsData.phoneNumber }, clientsData);
    console.log("what as a resalt hawe we in updateClient", client)
   

    return client;
};






export const deleteClientService = async (tel) => {
    const delCient = await ClientModel.deleteOne(tel);
    return delCient;
}