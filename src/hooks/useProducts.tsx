import React from "react";
import { Product } from "../modules/product/Product";
import { fetchProducts } from "../services/api";
import { GetListableContext, useListable } from "./useListable";

const ProductContext = GetListableContext<Product>()

export const ProductProvider: React.FC = ({ children }) => {
  const listable = useListable<Product>("products", fetchProducts);

  return (
    <ProductContext.Provider value={listable}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = React.useContext(ProductContext);

  return context;
};
