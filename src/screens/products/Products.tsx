import { connect } from "react-redux"
import { Product } from "../../modules/product/product.reducer"
import { StoreState } from "../../store"
import { ProductCard } from "../../components/productCard/ProductCard"

const Products = ({ products }: { products: Product[] }) => {
    return <>
        {
            products.map(({ cost, name, id }) => <ProductCard name={name}
                cost={cost}
                id={id} />)
        }</>
}

const mapStateToProps = (state: StoreState) => {
    return {
        products: state.product.products
    }
}

const mapDispatchToProps = (dispatch: Function) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)