import {Context, Scenes} from "telegraf";
import {HydratedDocument} from "mongoose";
import User, {IUser} from "../db/models/User";
import {subscribe, unsubscribe} from "./services/interval";
import {runParser} from "./services/olx";

const isUserExist = async (id: number | undefined) => {
    if (!id) return false;
    const user = await User.findOne({id});

    return !!user;
};

export const start = async (ctx: Context) => {
    try {
        const id: number|undefined = ctx.chat?.id;
        const firstName = ctx.from?.first_name ? ctx.from?.first_name : 'User';
        const lastName = ctx.from?.last_name ? ctx.from?.last_name : ctx.chat?.id;

        await ctx.reply(`Привіт, ${firstName} 👋`);

        if (await isUserExist(id)) return;

        const user: HydratedDocument<IUser> = new User({
            id,
            firstName,
            lastName,
            url: '',
        } as IUser);


        await user.save();
        await ctx.reply(`Я допоможу тобі орендувати житло 🙂`);
    }
    catch (e) {
        console.error(e)
        await ctx.reply('Щось пішло не так :/')
    }

};

export const addUrl = async (ctx:Scenes.WizardContext) => {
    ctx.scene.enter('subscribeScene');
}

export const notificationsOff = async (ctx:Context) => {
    const id: number|undefined = ctx.chat?.id;

    if (id) {
        await unsubscribe(id)
        await ctx.reply('Підписку вимкнено ❌')
    };
}

export const notificationsOn = async (ctx:Context) => {
    const id: number|undefined = ctx.chat?.id;

    if (id) {
        await subscribe(id, runParser(ctx))
        await ctx.reply('Підписку увімкнено 👀')
    }
}