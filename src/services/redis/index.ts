import Redis from "ioredis";


export class RedisService {

    private redisClient: Redis
    constructor() {
        this.redisClient = new Redis(process.env.REDIS_PUBLIC_URL!)
    }

    async addRedisData(key: string , value: string){
        try {
            await this.redisClient.set(key, value)
            console.log(key+ ': '+ value)

        }catch (e) {
            console.error(`Error on ${[key]}:` + e)
        }
    }

    async retrieveRedisData(key:string){
        try {
            const timeStamp =  await this.redisClient.get(key)
            console.log(`[Redis]: ${key}: `, timeStamp)

            return timeStamp;
        }catch (e) {
            console.error(`[Redis]: Error on Retrieving ${key}: ` + e)
        }
    }

}