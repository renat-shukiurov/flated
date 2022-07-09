import mongoose from 'mongoose';
import {InputMediaPhoto} from "telegraf/typings/core/types/typegram";

export interface IAdvert {
    id: string;
    chat_id: number;
    href: string;
    title: string;
    description: string;
    images: InputMediaPhoto[];
    price: string;
    date: string;
    owner: object;
}

const AdvertSchema = new mongoose.Schema<IAdvert>({
    id: String,
    chat_id: Number,
    href: String,
    title: String,
    description: String,
    images: [{
        type: Object
    }],
    price: String,
    date: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

});

const Advert = mongoose.model<IAdvert>('Advert', AdvertSchema);

export default Advert;

