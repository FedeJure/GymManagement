import { Product } from "../../../src/modules/product/Product"
import { ProductPayload } from "../../../src/modules/product/ProductPayload"
import { getProductModel } from "../mongoClient"

export const getProducts = async ({ page, step, contentFilter }
    : { page: number, step: number, tagFilter?: string, contentFilter?: string }) => {
    const productModel = getProductModel()
    let queries: any[] = []

    if (contentFilter) {
        const filters = contentFilter.split(',')
        filters.forEach(f => {
            queries = [...queries,
            { name: { $regex: f, "$options": "i" } },
            f.length == 24 ? { _id: f } : {}]
        })
    }
    const withQueries = contentFilter != undefined
    return productModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
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