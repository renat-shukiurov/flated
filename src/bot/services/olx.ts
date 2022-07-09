import {Context} from "telegraf";
import User, {IUser} from "../../db/models/User";
import axios from "axios";
import {JSDOM} from 'jsdom'
import Advert, {IAdvert} from "../../db/models/Advert";
import {InputMediaPhoto} from "telegraf/typings/core/types/typegram";

const GetActualUrls = async (url:string) => {
    const res = await axios(url);
    const dom = new JSDOM(res.data);
    const urls:string[] = [];
    const is404 = dom.window.document.getElementsByClassName('emptynew')
    if (is404.length) return

    const cards = dom.window.document.querySelectorAll('[data-cy="l-card"]')
    if (!cards.length) return

    cards.forEach((card) => {
        const linkItem = card.querySelector('a');
        const date = card.querySelector('[data-testid="location-date"]')?.textContent;

        if (!linkItem) return;
        if (! ['Сьогодні', 'Сегодня'].some((item)=>date && date.includes(item))) return;

        urls.push("https://www.olx.ua/" + linkItem.href);
    })

    return urls;

}

const getAdvertObj = async (url: string) => {
    const res = await axios(url);
    const dom = new JSDOM(res.data);
    const document = dom.window.document;

    const date = document.querySelector('[data-cy="ad-posted-at"]')?.textContent;
    const images: InputMediaPhoto[] = [];
    document.querySelectorAll('[data-cy="adPhotos-swiperSlide"]').forEach((el) => {
        const media = el.querySelector('img')?.src ? el.querySelector('img')?.src : el.querySelector('img')?.dataset?.src;
        images.push(media ? {type: "photo", media} : {type: "photo", media: "https://osbornegroupcre.com/wp-content/uploads/2016/02/missing-image-640x360.png"});
    })
    return {
        id: document.querySelector('[data-cy="ad-footer-bar-section"] span')?.textContent,
        href: url,
        title: document.querySelector('[data-cy="ad_title"]')?.textContent,
        price: document.querySelector('[data-testid="ad-price-container"] h3')?.textContent?.trim(),
        images: images.length > 10 ? images.slice(0, 10) : images,
        date,
        description: document.querySelector('[data-cy="ad_description"] div')?.textContent?.trim(),
    } as IAdvert

}



export const runParser = (ctx:Context) => {

    return async () => {
        try {
            const id = ctx.chat?.id;
            const user:IUser|null = await User.findOne({id});
            if (user && user.url) {
                const searchUrl = user.url;
                const urls = await GetActualUrls(searchUrl);

                if(!urls) return;

                for (const url of urls) {
                    const advert = await getAdvertObj(url);
                    if (!advert) continue;

                    const isAdvertExist = await User.findOne({id}).populate({
                        path: 'adverts',
                        match: { id: { $eq: advert.id } },
                        select: 'id'
                    }).exec();

                    if (! isAdvertExist?.adverts.length) {

                        advert.images[0].caption = `<b>Нове оголошення</b>\n<a href="${advert.href}">${advert.title}</a> \n\n<b>Опис</b>:\n${advert.description}\n\nЦіна <b>${advert.price}</b>`;
                        advert.images[0].parse_mode = 'HTML';

                        const advertDoc = await Advert.create(advert);
                        await User.findOneAndUpdate({id}, {$push: {adverts: advertDoc._id}}, { new: true, useFindAndModify: false });

                        if (id) await ctx.telegram.sendMediaGroup(id, advert.images)
                    }

                }

            }

        }
        catch (e) {
            console.log(e);

        }
    }

}