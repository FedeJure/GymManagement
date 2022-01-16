import React from "react";
import { Subscription } from "../domain/subscription/Subscription";
import { fetchSubscriptions } from "../services/api";
import { GetListableContext, useListable } from "./useListable";

const SubscriptionContext = GetListableContext<Subscription>()

export const SubscriptionProvider: React.FC = ({ children }) => {
  const listable = useListable<Subscription>("subscriptions",fetchSubscriptions);

  return (
    <SubscriptionContext.Provider value={listable}>{children}</SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = React.useContext(SubscriptionContext);

  return context;
};
