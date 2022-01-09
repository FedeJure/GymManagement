import { ObjectId } from "mongodb";
import { getBrothersOfUser, getUsers, saveUser } from ".";
import { MockDb } from "../test/db";
import {
  InitBrothersOnDb,
  InitProductOnDb,
  InitUserOnDb,
  MockBrotherIds,
  MockUserId,
  MockUserPayload,
} from "../test/mocks";

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

  it("create user with existent familiar", async (done) => {
    const brother = await saveUser({
      ...MockUserPayload,
    });
    const user = await saveUser({
      ...MockUserPayload,
      familiars: [brother._id.toString()],
    });
    expect(user.name).toEqual(MockUserPayload.name);
    done();
  });

  it("update familiar user when another asignit like familiar", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
    });
    const user = await saveUser({
      ...MockUserPayload,
      familiars: [brother._id.toString()],
    });

    const users = await getUsers({page: 0, step: 10})
    brother = users.find(u => u.id === brother.id) || brother
    expect(brother.familiars.length).toEqual(1)
    console.log(user)
    expect(brother.familiars[0] == user.id.toString()).toBeTruthy()
    done();
  });
});
