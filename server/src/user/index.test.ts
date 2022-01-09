import { MockDb } from "../test/db";
import { InitProductOnDb, InitUserOnDb } from "../test/mocks";

const db = new MockDb();
beforeAll(async () => await db.connect());
beforeEach(async () => {
  await InitProductOnDb();
});
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("User", () => {
    it("create user on db", async done => {
        await InitUserOnDb()
        done()
    })
})