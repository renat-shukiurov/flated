import {Scenes, session, Telegraf} from "telegraf";
import config from "./config";
import {addUrl, notificationsOff, notificationsOn, start} from "./bot/handlers";
import {connectDB} from "./db/connect";
import {subscribeScene} from "./bot/scenes/subscribeScene";

connectDB();
const bot = new Telegraf<Scenes.WizardContext>(config.tg_api_key);
const stage = new Scenes.Stage<Scenes.WizardContext>([subscribeScene]);

bot.use(session())
bot.use(stage.middleware())

bot.start(start)

bot.settings(async (ctx) => {
    await ctx.setMyCommands([
        {
            command: "url",
            description: "Додати посилання для підписки",
        },
        {
            command: "on",
            description: "Увімкнути підписку"
        },
        {
            command: "off",
            description: "Вимкнути підписку"
        },
    ]);
});

bot.command('url', addUrl);
bot.command('off', notificationsOff);
bot.command('on', notificationsOn);


bot.launch()
