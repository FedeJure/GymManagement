import { getOptionsWithBody, url } from ".";
import { IListableFetchPayload } from "../../hooks/useListable";
import { Order } from "../../domain/order/Order";
import { EntityConfigResponse } from "../../domain/EntityConfig";

const mapToOrder = (data: Order) => {
  return {
    ...data,
    emittedDate: new Date(data.emittedDate),
    periodPayed: new Date(data.periodPayed),
  };
};

export const fetchOrders = ({
  page,
  step,
  filterByContent = [],
  filterByTag = [],
}: IListableFetchPayload) => {
  let urlWithQueries = `${url}/orders?page=${page}&step=${step}`;
  urlWithQueries +=
    filterByContent.length > 0
      ? `&contentFilter=${filterByContent.join(",")}`
      : "";
  urlWithQueries +=
    filterByTag.length > 0 ? `&tagFilter=${filterByTag.join(",")}` : "";
  return fetch(urlWithQueries)
    .then((response) => response.json())
    .then((response) => response.map(mapToOrder));
};

export const createOrder = (subscriptionId: string): Promise<Order | null> => {
  const options = getOptionsWithBody({ subscriptionId }, "POST");
  return fetch(`${url}/order`, options)
    .then((response) => response.json())
    .then((response) => (response.order ? mapToOrder(response.order) : null));
};

export const generatePayment = (orderId: string, amount: number) => {
  const options = getOptionsWithBody({ orderId, amount }, "POST");
  return fetch(`${url}/pay`, options).then((response) => response.json());
};

export const cancelOrder = (orderId: string) => {
  const options = getOptionsWithBody({ orderId }, "DELETE");
  return fetch(`${url}/order`, options).then((response) => response.json());
};

export const getOrderConfig = () : Promise<EntityConfigResponse> => {
  return fetch(`${url}/order/config`)
  .then((response) => response.json())
}