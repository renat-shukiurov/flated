import dotenv from 'dotenv';
dotenv.config();

type Config = {
    tg_api_key: string;
    mongo: {
        url: string;
        db_name: string;
    };
}

const config = {
    tg_api_key: process.env.TG_API_TOKEN,
    mongo: {
        url: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@database:27017/`,
        db_name: process.env.MONGODB_NAME,
    }
}

export default config as Config