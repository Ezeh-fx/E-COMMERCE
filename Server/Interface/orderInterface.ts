import { Document, Schema } from "mongoose";

export interface Item {
    productId : Schema.Types.ObjectId;
    quantity : string
} 

export interface Ioder extends Document {
    user : Schema.Types.ObjectId;
    status : string;
    paymentMethod : string;
    createdAt : Date;
    totalAmount : number;
    orderItem : Item[];
    city : string;
    address : string;
    country : string
    longitude : string;
    latitude : string
    zipCode : string
    TimeZone : string
}