import { static as Static } from "express";
import { getSubscriptionModel, getUserModel } from "../mongoClient";
import { UserPayload } from "../../../src/modules/users/UserPayload";
import { User } from "../../../src/modules/users/User";
import { Model } from "mongoose";
import { promisify } from "util";
import { unlink } from "fs";
import { STATIC_DIR } from "../configs";
import { ObjectId } from "mongodb";

export const getUsers = async ({
  page,
  step,
  tagFilter,
  contentFilter,
}: {
  page: number;
  step: number;
  tagFilter?: string;
  contentFilter?: string;
}) => {
  const userModel = getUserModel();
  let queries: any[] = [];
  if (tagFilter) {
    const filters = tagFilter.split(",");
    queries.push({ type: { $in: filters } });
  }

  if (contentFilter) {
    const filters = contentFilter.split(",");
    filters.forEach((f) => {
      queries = [
        ...queries,
        ...[
          { name: { $regex: f, $options: "i" } },
          { lastname: { $regex: f, $options: "i" } },
          { dni: { $regex: f, $options: "i" } },
          { contactEmail: { $regex: f, $options: "i" } },
          { contactPhone: { $regex: f, $options: "i" } },
        ],
      ];
    });
  }
  const withQueries = tagFilter != undefined || contentFilter != undefined;
  return userModel.find(withQueries ? { $or: queries } : {}, null, {
    skip: step * page,
    limit: step,
  });
};

export const saveUser = async (user: UserPayload) => {
  const userModel = getUserModel();
  const familiars = await userModel.find({
    _id: { $in: user.familiars.map((id) => new ObjectId(id)) },
  });
  if (familiars.length !== user.familiars.length) {
    throw new Error(
      `Non existent familiar or familiars. Please create those users before assing it as familair`
    );
  }

  const newUser = new userModel({ ...user });
  const createdUser = await userModel.create(newUser);
  if (user.familiars.length > 0) {
    await updateSelfToBrothers(createdUser.familiars, userModel, createdUser.id, []);
  }
  return createdUser;
};

export const removeUser = async (userId: string): Promise<User> => {
  const userModel = getUserModel();
  const subscriptionModel = getSubscriptionModel();
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  await subscriptionModel.deleteMany({ user: user });
  if (user.profilePicture) removeImage(user.profilePicture);
  updateSelfToBrothers([], userModel, user.id, user.familiars);
  await userModel.deleteOne({ _id: userId });
  return user;
};

export const updateUser = async (user: User) => {
  const userModel = getUserModel();
  const oldUser = await userModel.findOne({ _id: user.id });
  if (!oldUser) throw Error("User not found");
  if (!oldUser.familiars.every(async (f) => user.familiars.includes(f))) {
    const allFamiliars = [...oldUser.familiars, ...user.familiars];
    const newFamiliars = allFamiliars.filter(
      (f) => !oldUser.familiars.includes(f)
    );
    const removedFamiliars = allFamiliars.filter(
      (f) => !user.familiars.includes(f)
    );
    updateSelfToBrothers(newFamiliars, userModel, oldUser.id, removedFamiliars);
  }
  oldUser.name = user.name;
  oldUser.lastname = user.lastname;
  oldUser.dni = user.dni;
  oldUser.familiars = user.familiars;
  oldUser.birthDate = user.birthDate;
  oldUser.contactEmail = user.contactEmail;
  oldUser.contactPhone = user.contactPhone;
  oldUser.profilePicture = user.profilePicture;
  oldUser.comment = user.comment;
  oldUser.address = user.address;
  await oldUser.save();
  return oldUser;
};

export const getBrothersOfUser = async (userId: string) => {
  const userModel = getUserModel();
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  return userModel.find({ _id: { $in: user.familiars } });
};

export const getImageRoute = async (userId: string, extension: string) => {
  return `${userId}.${extension}`;
};

export const removeImage = async (path: string) => {
  const pathParts = path.split("/");
  return promisify(unlink)(`${STATIC_DIR}/${pathParts[pathParts.length - 1]}`);
};

export const updateImagePath = async (userId: string, path: string) => {
  const userModel = getUserModel();
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.profilePicture) removeImage(user.profilePicture);
  user.profilePicture = path;
  return user.save();
};

async function updateSelfToBrothers(
  newFamiliars: string[],
  userModel: Model<User, {}, {}>,
  userId: string,
  removedFamiliars: string[]
) {
  newFamiliars.forEach(async (f) => {
    const familiar = await userModel.findById(f);
    if (!familiar)
      throw new Error(
        `Non existent familiar with id: ${f}. Please create that user before assing it as familair`
      );
    familiar.familiars = [...familiar.familiars, userId];
    await familiar.save();
  });
  removedFamiliars.forEach(async (f) => {
    const familiar = await userModel.findById(f);
    if (!familiar) return;
    familiar.familiars = familiar.familiars.filter((ff) => ff != userId);
    await familiar.save();
  });
}

export const setPendingPayed = async (userId: string) => {
  console.log("Set payed on update");
  const userModel = getUserModel();
  const oldUser = await userModel.findOne({ _id: userId });
  if (!oldUser) throw Error("User not found");
  oldUser.pendingPay = true;
  oldUser.save();
};
