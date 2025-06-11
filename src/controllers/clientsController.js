import createHttpError from 'http-errors';

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
    const clientsInfo = req.body;
};

export const getClientsController = async () => {
    try {
        
    } catch (error) {
        
    }
    
};

export const updateClientsController = async () => {
    try {
        
    } catch (error) {
        
    }
    
};
export const deleteClientsController = async () => {
    try {
        
    } catch (error) {
        
    }
   
};