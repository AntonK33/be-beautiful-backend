import createHttpError from 'http-errors';
import { ClientModel } from '../db/models/clientModel.js';

export const addClientsSevice = async (clientsData) => {
    console.log("what comes in clientsData", clientsData);
    let client = await ClientModel.findOne({ phoneNumber: clientsData.phoneNumber }); 
   // let isNew = false;

    // console.log("what comes in client", client);
    // const getDiffFields = (obj1, obj2) => {
      //  console.log("what comes in compareObj", obj1, obj2);
       // return  Object.keys(obj1).filter(key => obj1[key] !== obj2[key]);
    //    const diff = {};
    //    for (const key of Object.keys(obj1)) {
    //        if (obj1[key] !== obj2[key]) {
    //            diff[key] = {from:obj1[key], to:obj2[key] }
    //        }
    //    }
    //       return diff
      
    // };
//     const  diff = getDiffFields(clientsData, client);
//   console.log("all fields diff",diff);
    if (!client) {
        client = await ClientModel.create(clientsData);
//         isNew = true;
        //console.log("what comes in addClient", client);
    }
   // const compareObj = getDiffFields(clientsData, client);
   
   // if (compareObj.lenght > 0) {
   //     console.log("fields do not match  ", compareObj);
   // } else {
   //     console.log("all fields match");
   // }
 
    client = await ClientModel.findOneAndUpdate({ phoneNumber: clientsData.phoneNumber }, clientsData, {new:true});
    // console.log("what comes in client",client);

  

        // return {client, isNew};
        return client;
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
};