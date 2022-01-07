import { MockDb } from "../test/db";
import { getSubscriptionModel } from "../mongoClient";

const db = new MockDb();
beforeAll(async () => await db.connect());
afterEach(async () => {
  await db.clearDatabase();
});
afterAll(async () => await db.closeDatabase());

describe("Subscriptions", () => {
  it("get subscriptions on empty db", (done) => {
    try {
      const model = getSubscriptionModel();
      model.find({}).then(subscriptions => {
        expect(subscriptions.length).toBe(0);
        done()
      })
      
    } catch (error) {
      done(error)
    }

  });
});
