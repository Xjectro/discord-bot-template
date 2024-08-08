export enum Env {
    production = 'production',
    development = 'development',
    test = 'test',
}
export const initConfig = () => {
    switch (config.env) {
        case Env.production:
            console.log('Production environment')
            break
        case Env.development:
            console.log('Development environment')
            break
        case Env.test:
            console.log('Test environment')
            break
        default:
            throw new Error(`Unknown environment: ${config.env}`)
    }
}

export const config = {
    env: process.env.NODE_ENV,
    token: process.env.TOKEN as string,
    client: {
        id: process.env.CLIENT_ID as string
    },
    mongoDB: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        dbName: process.env.MONGODB_DB_NAME,
    },
}