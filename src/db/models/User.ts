import mongoose from 'mongoose';

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    url: string;
    intervalId: number;
    date: Date;
    adverts: [];
}

const UserSchema = new mongoose.Schema<IUser>({
    id: Number,
    firstName: String,
    lastName: String,
    url: String,
    intervalId: Number,
    date: { type: Date, default: Date.now },
    adverts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advert'
    }]

});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;