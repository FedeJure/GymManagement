import React from "react";
import { User } from "../domain/users/User";
import { fetchUsers } from "../services/api";
import { GetListableContext, useListable } from "./useListable";

const UserContext = GetListableContext<User>();

export const UserProvider: React.FC = ({ children }) => {
  const listable = useListable<User>("users", fetchUsers);

  return (
    <UserContext.Provider value={listable}>{children}</UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = React.useContext(UserContext);

  return context;
};
