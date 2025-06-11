import { Schema, model, Types } from 'mongoose';


const clientSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email:{
        type: String,
        trim: true,
    },
  phoneNumber: {
    type: String,
    trim: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  methodDelivery: {
    type: String,
    enum: ['courier', 'pickup', 'novaPoshta', 'ukrPoshta'],
  },
  address_city: {
      type: String,
      trim: true,
    },
  
    address_street: {
      type: String,
      trim: true,
    },
    address_postName: {
        type: String,
        trim: true,
    },
    address_postDepartmentNumber: {
      type: String,
      trim: true,
    },
   
  
});

export const ClientModel = mongoose.model('Client', clientSchema);

