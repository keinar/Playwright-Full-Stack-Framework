import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("FATAL ERROR: MONGO_URI is not set in .env file");
}

/**
 * @file mongoHelper.ts
 * @description A helper class to connect directly to the MongoDB database
 * for data validation tests. This demonstrates deep backend testing.
 */
export class MongoHelper {
    private client: MongoClient;
    private db: Db | undefined;

    constructor() {
        this.client = new MongoClient(MONGO_URI!);
    }

    /**
     * Connects to the database.
     * This should be called in a 'beforeAll' hook.
     */
    async connect() {
        try {
            await this.client.connect();

            this.db = this.client.db('test');
            console.log('[MongoHelper] Successfully connected to MongoDB.');
        } catch (error) {
            console.error('[MongoHelper] Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    /**
     * Disconnects from the database.
     * This should be called in an 'afterAll' hook.
     */
    async disconnect() {
        await this.client.close();
        console.log('[MongoHelper] Disconnected from MongoDB.');
    }

    /**
     * Finds a gallery by its ID.
     * @param galleryId The ID of the gallery (as a string)
     * @returns The gallery document or null
     */
    async getGalleryById(galleryId: string) {
        if (!this.db) throw new Error("Database not connected. Call connect() first.");
        
        // Find the 'galleries' collection
        const galleriesCollection: Collection = this.db.collection('galleries');
        
        // Find the document by its _id (must convert string to ObjectId)
        const result = await galleriesCollection.findOne({ _id: new ObjectId(galleryId) });
        return result;
    }
}