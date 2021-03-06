import { Product } from "../../../src/domain/product/Product";
import { ProductPayload } from "../../../src/domain/product/ProductPayload";
import { getProductModel, getUserModel } from "../mongoClient";

export const getProducts = async ({
  page,
  step,
  contentFilter,
}: {
  page: number;
  step: number;
  tagFilter?: string;
  contentFilter?: string;
}) => {
  const productModel = getProductModel();
  let queries: any[] = [];

  if (contentFilter) {
    const filters = contentFilter.split(",");
    filters.forEach((f) => {
      queries = [
        ...queries,
        { name: { $regex: f, $options: "i" } },
        f.length == 24 ? { _id: f } : {},
      ];
    });
  }
  const withQueries = contentFilter != undefined;
  return productModel
    .find(withQueries ? { $or: queries } : {}, null, {
      skip: step * page,
      limit: step,
    })
    .populate("owners");
};

export const saveProduct = async (product: ProductPayload) => {
  const productModel = getProductModel();
  const newProduct = new productModel({ ...product });
  return productModel.create(newProduct);
};

export const removeProduct = async (productId: string) => {
  const productModel = getProductModel();
  return productModel.deleteOne({ _id: productId });
};

export const updateProduct = async (
  product: ProductPayload & { id: string }
) => {
  const productModel = getProductModel();
  const userModel = getUserModel();
  let payload: any = product;
  if (product.owners.length > 0) {
    payload.owners = await userModel.find({ _id: { $in: product.owners } });
  }
  return productModel
    .updateOne({ _id: product.id }, { ...payload })
    .then(() => productModel.findOne({ _id: product.id }));
};

export const getConfig = async () => {
  const productModel = getProductModel();
  const size = await productModel.count();
  return {
    totalCount: size,
  };
};
