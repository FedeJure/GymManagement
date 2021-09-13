import { Product } from "../../../src/modules/product/Product"
import { ProductPayload } from "../../../src/modules/product/ProductPayload"
import { getProductModel } from "../mongoClient"

export const getProducts = async ({ page, step }: { page: number, step: number }) => {
    const productModel = getProductModel()
    return productModel.find({}, null, { skip: step * page, limit: step })
}

export const saveProduct = async (product: ProductPayload) => {
    const productModel = getProductModel()
    const newProduct = new productModel({ ...product })
    return productModel.create(newProduct)
}

export const removeProduct = async (productId: number) => {
    const productModel = getProductModel()
    return productModel.deleteOne({ _id: productId })
}

export const updateProduct = async (product: Product) => {
    const productModel = getProductModel()
    return productModel.updateOne({ _id: product.id, ...product })
        .then(() => productModel.findOne({ _id: product.id }))
}