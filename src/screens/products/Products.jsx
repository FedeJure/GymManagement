import { useState } from "react"
import { connect } from "react-redux"
import { ProductCard } from "../../components/productCard/ProductCard"
import { Divider, Button } from "semantic-ui-react"
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal"
import { addProduct, removeProduct } from "../../modules/product/product.actions"

const Products = ({ products, createProduct, removeProduct }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const handleCreation = (creationData) => {
        createProduct(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = (productId) => removeProduct(productId)
    return <div>
        <CreateProductModal open={creationModalOpen}
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />
        <div><Button circular icon="plus" onClick={() => setCreationModalOpen(true)} /></div>
        <Divider />
        {products.map(({ cost, name, id }) => <ProductCard name={name}
            cost={cost}
            id={id}
            key={id} 
            onDelete={handleDelete}/>)}
    </div>
}

const mapStateToProps = (state) => {
    return {
        products: state.product.products
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createProduct: (data) => dispatch(addProduct(data)),
        removeProduct: (productId) => dispatch(removeProduct(productId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)