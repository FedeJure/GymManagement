import { getOptionsWithBody, url } from ".";
import { Order } from "../../modules/order/Order";

const mapToOrder = (data: any) => {
  return {
    ...data,
    id: data._id,
    emittedDate: new Date(data.emittedDate),
  };
};

export const fetchOrders = ({
  page,
  step,
  cancelled,
  completed,
  contentFilter,
}: {
  page: number;
  step: number;
  cancelled?: boolean;
  completed?: boolean;
  contentFilter?: string[];
}) => {
  let urlWithQueries = `${url}/orders?page=${page}&step=${step}`;
  urlWithQueries += cancelled !== undefined ? `&cancelled=${cancelled}` : "";
  urlWithQueries += completed !== undefined ? `&completed=${completed}` : "";
  urlWithQueries +=
    contentFilter !== undefined
      ? `&contentFilter=${contentFilter.join(",")}`
      : "";
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

export const cancelOrder = (orderId: string) => {
  const options = getOptionsWithBody({ orderId }, "DELETE");
  return fetch(`${url}/order`, options).then((response) => response.json());
};