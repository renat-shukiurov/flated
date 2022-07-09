import User, {IUser} from "../../db/models/User";

export const subscribe = async (id: number, callback: () => Promise<void>) => {
    const user = await User.findOne({id});
    if (! user?.url) return;
    if (! user?.intervalId) {
        const intervalId = setInterval(callback, 60000);
        await User.findOneAndUpdate({id}, {$set: {intervalId}});
    }
}

export const unsubscribe = async (id:number) => {
    const user:IUser|null = await User.findOne({id});

    if (user && user.intervalId) {
        clearInterval(user.intervalId);
        await User.findOneAndUpdate({id}, {$set: {intervalId: 0}});
    }

}