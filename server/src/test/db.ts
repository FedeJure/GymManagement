import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, connection } from "mongoose";

export class MockDb {
  private db: MongoMemoryServer = new MongoMemoryServer({instance: {
    port: 27017,
    dbName: "gymManagement",
  }});
  constructor() {}
  async connect() {

    this.db = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: "gymManagement",
      },
    });
    await connect("mongodb://localhost:27017/gymManagement");
  }
  async clearDatabase() {
    const collections = connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

  }
  async closeDatabase() {
    await connection.dropDatabase();
    await connection.close();
    await this.db.stop();
    // await this.db.cleanup();
  }
}
