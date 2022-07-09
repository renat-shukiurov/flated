
export const isUrlValid = (url: string) => {
    const availableServices = ['https://www.olx.ua/d/'];

    return availableServices.some((item) => isUrl(url) && url.includes(item))
}

const isUrl = (url:string) => (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/).test(url);