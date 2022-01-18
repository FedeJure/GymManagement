import { getSubscriptionModel, getUserModel } from "../mongoClient";
import { UserPayload } from "../../../src/domain/users/UserPayload";
import { User } from "../../../src/domain/users/User";
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
  return userModel
    .find(withQueries ? { $and: queries } : {}, null, {
      skip: step * page,
      limit: step,
    })
    .populate("familiars");
};

export const saveUser = async (user: UserPayload) => {
  const userModel = getUserModel();
  const familiars = await userModel.find({
    _id: { $in: user.familiarIds },
  });
  if (familiars.length !== user.familiarIds.length) {
    throw new Error(
      `Non existent familiar or familiars. Please create those users before assing it as familair`
    );
  }

  // const createdUser = new userModel({ ...user });

  const createdUser = await userModel.create({ ...user });
  createdUser.id = createdUser._id.toString();
  await userModel.updateOne({ _id: createdUser._id }, { id: createdUser._id });

  if (user.familiarIds.length > 0) {
    await updateSelfToBrothers(user.familiarIds, userModel, createdUser.id, []);
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
  await updateSelfToBrothers(
    [],
    userModel,
    user.id,
    user.familiars.map((f) => f.id)
  );
  await userModel.deleteOne({ _id: userId });
  return user;
};

export const updateUser = async (
  userId: string,
  payload: Partial<UserPayload>
): Promise<User> => {
  console.log("DSDSD");
  const userModel = getUserModel();
  const oldUser = await userModel
    .findOne({ _id: userId })
    .populate("familiars");
  if (!oldUser) throw Error("User not found");
  if (
    (payload.familiarIds !== undefined &&
      payload.familiarIds.length > 0 &&
      oldUser.familiars.length === 0) ||
    !oldUser.familiars.every((f) =>
      payload.familiarIds?.find((u) => u === f.id)
    )
  ) {
    const allFamiliars = [
      ...oldUser.familiars.map((f) => f.id),
      ...(payload.familiarIds ?? []),
    ];
    const newFamiliars = allFamiliars.filter(
      (f) => !oldUser.familiars.map((f) => f.id).includes(f)
    );
    const removedFamiliars = allFamiliars.filter(
      (f) => !payload.familiarIds?.includes(f)
    );

    await updateSelfToBrothers(
      newFamiliars,
      userModel,
      oldUser.id,
      removedFamiliars
    );
  }

  const familiarsToUpdate = await userModel.find({
    _id: { $in: payload.familiarIds },
  });

  await userModel.updateOne(
    {
      _id: userId,
    },
    {
      name: payload.name,
      lastname: payload.lastname,
      dni: payload.dni,
      familiars: familiarsToUpdate,
      birthDate: payload.birthDate,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      profilePicture: payload.profilePicture,
      comment: payload.comment,
      address: payload.address,
      type: payload.type,
    }
  );

  return (await userModel.findById(userId)) || oldUser;
};

export const getBrothersOfUser = async (userId: string) => {
  const userModel = getUserModel();
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  return userModel.find({ _id: { $in: user.familiars.map((f) => f.id) } });
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
  const user = await userModel.findById(userId);
  if (!user) return;
  for (let i = 0; i < newFamiliars.length; i++) {
    const familiarId = newFamiliars[i];
    const familiar = await userModel.findById(familiarId);
    if (!familiar)
      throw new Error(
        `Non existent familiar with id: ${familiarId}. Please create that user before assing it as familair`
      );
    return userModel.updateOne(
      { _id: familiarId },
      { familiars: [...familiar.familiars, user] }
    );
  }

  for (let i = 0; i < removedFamiliars.length; i++) {
    const familiarId = removedFamiliars[i];
    const familiar = await userModel.findById(familiarId);
    if (!familiar) return;
    return userModel.updateOne(
      {
        _id: familiarId,
      },
      {
        familiars: familiar.familiars.filter((f) => f.id != userId),
      }
    );
  }
}

export const setPendingPayed = async (userId: string) => {
  console.log("Set payed on update");
  const userModel = getUserModel();
  const oldUser = await userModel.findOne({ _id: userId });
  if (!oldUser) throw Error("User not found");
  return userModel.updateOne(
    {
      _id: userId,
    },
    {
      pendingPay: true,
    }
  );
};

export const getConfig = async () => {
  const usersModel = getUserModel();
  const size = await usersModel.count();
  return {
    totalCount: size,
  };
};
