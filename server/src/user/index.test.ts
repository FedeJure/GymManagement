import { ObjectId } from "mongodb";
import { getFamiliarsOfUsers, getUsers, saveUser, updateUser } from ".";
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
        familiarIds: [new ObjectId().toString()],
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
      familiarIds: [brother.id.toString()],
    });
    expect(user.name).toEqual(MockUserPayload.name);
    done();
  });

  it("update familiar user when another asign as like familiar", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
      name: "Brother",
    });
    const user = await saveUser({
      ...MockUserPayload,
      familiarIds: [brother.id.toString()],
    });

    const users = await getUsers({ page: 0, step: 10 });
    brother = users.find((u) => u.id === brother.id) || brother;
    expect(brother.familiars.length).toEqual(1);
    expect(brother.familiars[0].id == user.id.toString()).toBeTruthy();
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

    const newUser = await updateUser(MockUserId.toString(), {
      ...newData,
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
      familiarIds: [],
    });
    let user = await saveUser({
      ...MockUserPayload,
      familiarIds: [],
    });
    await updateUser(user.id, {
      familiarIds: [brother.id],
    });
    const users = await getUsers({ page: 0, step: 10 });
    brother = users.find((u) => u.id === brother.id.toString()) || brother;
    expect(brother.familiars.length).toEqual(1);
    expect(brother.familiars[0].id == user.id.toString()).toBeTruthy();

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(1);
    expect(user.familiars[0].id == brother.id.toString()).toBeTruthy();
    done();
  });

  it("remove brother of user", async (done) => {
    let user = await InitUserOnDb();
    await InitBrothersOnDb(1);

    await updateUser(user.id, {
      familiarIds: [],
    });
    const users = await getUsers({ page: 0, step: 10 });
    const brother = users.find((u) => u.id === MockBrotherIds[0].toString());

    if (brother === undefined) {
      done();
      return;
    }
    expect(brother.familiars.length).toEqual(0);

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(0);
    done();
  });

  it("update brothers of user (removing brothers)", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
      name: "Brother",
      familiarIds: [],
    });
    let user = await saveUser({
      ...MockUserPayload,
      familiarIds: [brother.id],
    });

    await updateUser(user.id, {
      familiarIds: [],
    });

    const users = await getUsers({ page: 0, step: 10 });
    brother = users.find((u) => u.id === brother.id.toString()) || brother;
    expect(brother.familiars.length).toEqual(0);

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(0);
    done();
  });

  it("update sub-brothers when adding many", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
      name: "Brother",
      familiarIds: [],
    });
    let brother1 = await saveUser({
      ...MockUserPayload,
      name: "Brother1",
      familiarIds: [brother.id],
    });
    let user = await saveUser({
      ...MockUserPayload,
      familiarIds: [brother1.id],
    });

    const users = await getUsers({ page: 0, step: 10 });

    brother = users.find((u) => u.id === brother.id.toString()) || brother;
    expect(brother.familiars.length).toEqual(2);

    brother1 = users.find((u) => u.id === brother1.id.toString()) || brother1;
    expect(brother1.familiars.length).toEqual(2);

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(2);
    done();
  });

  it("update sub-brothers when adding so many", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
      name: "Brother",
      familiarIds: [],
    });
    let brother1 = await saveUser({
      ...MockUserPayload,
      name: "Brother1",
      familiarIds: [brother.id],
    });
    let brother2 = await saveUser({
      ...MockUserPayload,
      name: "Brother2",
      familiarIds: [brother.id],
    });
    let user = await saveUser({
      ...MockUserPayload,
      familiarIds: [brother1.id, brother],
    });

    const users = await getUsers({ page: 0, step: 10 });

    brother = users.find((u) => u.id === brother.id.toString()) || brother;
    expect(brother.familiars.length).toEqual(3);

    brother1 = users.find((u) => u.id === brother1.id.toString()) || brother1;
    expect(brother1.familiars.length).toEqual(3);

    brother2 = users.find((u) => u.id === brother2.id.toString()) || brother2;
    expect(brother2.familiars.length).toEqual(3);

    user = users.find((u) => u.id === user.id) || user;
    expect(user.familiars.length).toEqual(3);
    done();
  });

  it("get familiars from user recursively", async (done) => {
    let brother = await saveUser({
      ...MockUserPayload,
      name: "Brother",
      familiarIds: [],
    });
    let brother1 = await saveUser({
      ...MockUserPayload,
      name: "Brother1",
      familiarIds: [brother.id],
    });

    let user = await saveUser({
      ...MockUserPayload,
      familiarIds: [brother1.id],
    });

    const familiars = await getFamiliarsOfUsers([
      brother1.id,
      user.id,
    ]);
    expect(familiars.length).toEqual(3);
    done();
  });
});
