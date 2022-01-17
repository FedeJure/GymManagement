import { getOptionsWithBody, url } from ".";
import { IListableFetchPayload } from "../../hooks/useListable";
import { Product } from "../../domain/product/Product";
import { ProductPayload } from "../../domain/product/ProductPayload";
import { EntityConfigResponse } from "../../domain/EntityConfig";

function mapToProduct(product: any): Product {
  return {
    ...product,
    id: product._id,
  };
}
//====PRODUCT=====
export const fetchProducts = ({
  page,
  step,
  filterByContent = [],
  filterByTag = [],
}: IListableFetchPayload): Promise<Product[]> => {
  return fetch(
    `${url}/products?page=${page}&step=${step}${
      filterByContent.length > 0
        ? `&contentFilter=${filterByContent.join(",")}`
        : ""
    }`
  )
    .then((response) => response.json())
    .then((response) => response.map(mapToProduct));
};

export const createProduct = (product: ProductPayload): Promise<Product> => {
  const options = getOptionsWithBody({ product }, "POST");
  return fetch(`${url}/product`, options)
    .then((response) => response.json())
    .then((response) => mapToProduct(response.product));
};

export const updateProduct = (product: ProductPayload & { id: string }) => {
  const options = getOptionsWithBody({ product }, "PUT");
  return fetch(`${url}/product`, options)
    .then((response) => response.json())
    .then((response) => mapToProduct(response.product));
};

export const deleteProduct = (productId: string) => {
  const options = getOptionsWithBody({ productId }, "DELETE");
  return fetch(`${url}/product`, options).then((response) => response.json());
};

export const getProductConfig = (): Promise<EntityConfigResponse> => {
  return fetch(`${url}/product/config`).then((response) => response.json());
};
