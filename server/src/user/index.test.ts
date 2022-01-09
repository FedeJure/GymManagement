import { ObjectId } from "mongodb";
import { getBrothersOfUser, getUsers, saveUser } from ".";
import { MockDb } from "../test/db";
import { InitProductOnDb, InitUserOnDb, MockUserPayload } from "../test/mocks";

const db = new MockDb();
beforeAll(async () => await db.connect());
beforeEach(async () => {
  await InitProductOnDb();
});
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Users", () => {
  it("create user on db", async (done) => {
    var users = await getUsers({ page: 0, step: 10 });
    expect(users.length).toEqual(0);
    await InitUserOnDb();
    users = await getUsers({ page: 0, step: 10 });
    expect(users.length).toEqual(1);

    done();
  });

  it("try to create a user with nonexistent familiar", async (done) => {
    expect(async () => {
      await saveUser({
        ...MockUserPayload,
        familiars: [new ObjectId().toString()],
      });
    }).rejects.toThrowError();
    done();
  });
});
