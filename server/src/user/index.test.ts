import { ObjectId } from "mongodb";
import {  getUsers, saveUser, updateUser } from ".";
import { UserPayload } from "../../../src/domain/users/UserPayload";
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
      familiars: [brother.id.toString()],
    });

    console.log(brother, user)

    const users = await getUsers({ page: 0, step: 10 });
    brother = users.find((u) => u.id === brother.id) || brother;
    expect(brother.familiars.length).toEqual(1);
    expect(brother.familiars[0] == user.id.toString()).toBeTruthy();
    done();
  });

  it("update info of user", async (done) => {
    const user = await InitUserOnDb();
    const newData: UserPayload = {
      ...MockUserPayload,
      name: "New name",
      address: "New Address",
      contactEmail: "New Email",
      contactPhone: "New Phone",
      dni: "New Dni",
      comment: "New Comment",
      birthDate: new Date(),
    };

    const newUser = await updateUser({
      ...user,
      ...newData,
      id: MockUserId.toString(),
    });

    expect(newUser.name).toEqual(newData.name);
    expect(newUser.address).toEqual(newData.address);
    expect(newUser.contactEmail).toEqual(newData.contactEmail);
    expect(newUser.contactPhone).toEqual(newData.contactPhone);
    expect(newUser.dni).toEqual(newData.dni);
    expect(newUser.comment).toEqual(newData.comment);
    expect(newUser.birthDate).toEqual(newData.birthDate);
    done();
  });

  it("update brothers of user", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
      name: "Brother",
      familiars: [],
    });
    let user = await saveUser({
      ...MockUserPayload,
      familiars: [],
    });
    await updateUser({
      ...user,
      id: user._id.toString(),
      familiars: [brother._id.toString()],
    });
    const users = await getUsers({ page: 0, step: 10 });
    brother = users.find((u) => u.id === brother.id.toString()) || brother;
    expect(brother.familiars.length).toEqual(1);
    expect(brother.familiars[0] == user.id.toString()).toBeTruthy();

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(1);
    expect(user.familiars[0] == brother.id.toString()).toBeTruthy();
    done();
  });

  it("remove brother of user", async (done) => {
    let user = await InitUserOnDb();
    await InitBrothersOnDb(1);

    await updateUser({
      ...user,
      id: MockUserId.toString(),
      familiars: [],
    });
    const users = await getUsers({ page: 0, step: 10 });
    const brother = users.find((u) => u.id === MockBrotherIds[0].toString());

    if (brother === undefined) {
        done()
        return
    }
    expect(brother.familiars.length).toEqual(0);

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(0);
    done();
  });
});
