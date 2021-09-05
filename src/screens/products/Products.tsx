import { useState } from "react"
import { connect } from "react-redux"
import { Product } from "../../modules/product/product.reducer"
import { StoreState } from "../../store"
import { ProductCard } from "../../components/productCard/ProductCard"
import { Divider, Button } from "semantic-ui-react"
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal"
import { addProduct } from "../../modules/product/product.actions"

const Products = ({ products, createProduct }: { products: Product[], createProduct:Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const handleCreation = (creationData: { name: string, price: string }) => {
        createProduct(creationData)
        setCreationModalOpen(false)
    }
    return <div>
        <CreateProductModal open={creationModalOpen}
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />
        <div><Button circular icon="plus" onClick={() => setCreationModalOpen(true)} /></div>
        <Divider />
        {products.map(({ cost, name, id }) => <ProductCard name={name}
            cost={cost}
            id={id}
            key={id} />)}
    </div>
}

const mapStateToProps = (state: StoreState) => {
    return {
        products: state.product.products
    }
}

const mapDispatchToProps = (dispatch: Function) => {
    return { createProduct: (data: {name: string, price: string}) => dispatch(addProduct(data)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)