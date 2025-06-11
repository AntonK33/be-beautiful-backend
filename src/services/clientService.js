import createHttpError from 'http-errors';
import { ClientModel } from '../db/models/clientModel';

export const addClientsSevice = async (clientsData) => {
    const client = await ClientModel.findOne(clientsData._id);  
    if (!client) {
        client = await ClientModel.create(clientsData)
    }
    client = await ClientModel.findOneAndUpdate(clientsData)

    await client.save();

    return client;
};