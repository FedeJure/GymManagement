import { UserPayload } from "../../domain/users/UserPayload";
import { User } from "../../domain/users/User";
import { getOptionsWithBody, getOptionWithForm, url } from ".";
import { IListableFetchPayload } from "../../hooks/useListable";
import { EntityConfigResponse } from "../../domain/EntityConfig";

const mapToUser = (data: any) => {
  return {
    ...data,
    birthDate: new Date(data.birthDate),
  };
};

export const fetchUsers = async ({
  page,
  step,
  filterByTag = [],
  filterByContent = [],
}: IListableFetchPayload): Promise<User[]> => {
  return fetch(
    `${url}/users?page=${page}&step=${step}${
      filterByTag.length > 0 ? `&tagFilter=${filterByTag.join(",")}` : ""
    }${
      filterByContent.length > 0
        ? `&contentFilter=${filterByContent.join(",")}`
        : ""
    }`
  )
    .then((response) => response.json())
    .then((response) => response.map(mapToUser));
};

export const createUser = async (
  user: UserPayload,
  image?: File
): Promise<User> => {
  const options = getOptionsWithBody({ user }, "POST");
  const newUser = await fetch(`${url}/user`, options)
    .then((response) => response.json())
    .then((response) => response.user)
    .then(mapToUser);
  if (image) {
    await sendImage(image, newUser.id);
  }
  return newUser;
};

export const updateUser = async (
  userId: string,
  user: Partial<UserPayload>,
  image: File | null
): Promise<User> => {
  const options = getOptionsWithBody({ user, userId }, "PUT");

  const updated = await fetch(`${url}/user`, options)
    .then((response) => response.json())
    .then((response) => response.user)
    .then(mapToUser);
  if (image != null) {
    await sendImage(image, userId);
  }

  return updated;
};

const sendImage = async (image: File, userId: string) => {
  let formData = new FormData();
  formData.append("image", image);
  const options = getOptionWithForm(formData, "POST");
  return fetch(`${url}/userImage?userId=${userId}`, options).then((response) =>
    response.json()
  );
};

export const deleteUser = (userId: string) => {
  const options = getOptionsWithBody({ userId }, "DELETE");
  return fetch(`${url}/user`, options)
    .then((response) => response.json())
    .then((response) => response.user);
};

export const getBrothersOfUser = (userId: string): Promise<User[]> => {
  return fetch(`${url}/familiars?userId=${userId}`)
    .then((response) => response.json())
    .then((response) => response.map(mapToUser));
};

export const getUserConfig = () : Promise<EntityConfigResponse> => {
  return fetch(`${url}/user/config`)
  .then((response) => response.json())
}