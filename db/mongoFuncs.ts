import * as mongo from "mongodb"
import DBObj from "./types"

export type UrlSchema = {
    url?: string,
    b64Hash: string
}

class MongoUrlShortener extends DBObj{
    client: mongo.Collection;

    constructor(url: string){
        super();
        const mongoClient = new mongo.MongoClient(url);
        this.client = mongoClient.db("jellyware").collection("urlshortener");
    }

    async findOneRecord(queryParams: UrlSchema) {
        try{
            return await this.client.findOne(queryParams)
        }
        catch{
            throw new Error("failed to fetch a record from the database")
        }
    }

    async writeRecord(data: UrlSchema): Promise<boolean> {
        try {
            await this.client.insertOne(data);
            return true;
        }
        catch {
            throw new Error("failed to write a new record to the database");
        }
    }
}

export default MongoUrlShortener;