import React from "react";
import { Order } from "../modules/order/Order";
import { fetchOrders } from "../services/api/orderApi";
import { GetListableContext, useListable } from "./useListable";

const OrderContext = GetListableContext<Order>()

export const OrderProvider: React.FC = ({ children }) => {
  const listable = useListable<Order>('order', fetchOrders);

  return (
    <OrderContext.Provider value={listable}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = React.useContext(OrderContext);

  return context;
};
