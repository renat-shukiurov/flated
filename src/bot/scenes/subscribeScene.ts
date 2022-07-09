import {Composer, Scenes} from "telegraf";
import User from "../../db/models/User";
import {isUrlValid} from "../../utils/validation";
import {subscribe} from "../services/interval";
import {runParser} from "../services/olx";

const step1 = async (ctx: Scenes.WizardContext) => {
    ctx.reply('Відправь валідне посилання для підписки(olx)')
    return ctx.wizard.next()
}

const step2 = new Composer<Scenes.WizardContext>()

step2.on('text', async (ctx) => {
    const id = ctx.from.id;
    await ctx.reply('Я отримав твоє посилання. Обробляю ⏳');
    const url = ctx.message.text;

    if (!isUrlValid(url)) {
        await ctx.reply("Не валідне посилання ☹️\nСпробуй ще раз.");
        const currentStepIndex = ctx.wizard.cursor;
        return ctx.wizard.selectStep(currentStepIndex)
    }

    try {
        await User.findOneAndUpdate({id}, {$set: {url}});
        await subscribe(id, runParser(ctx))
        await ctx.reply('Посилання успішно додане ✅');
    }
    catch (error) {
        console.log(error);
        await ctx.reply('Щось пішло не так :/')
    }


    return ctx.scene.leave();
});

export const subscribeScene = new Scenes.WizardScene('subscribeScene',
    step1,
    step2,
    )