import { useState } from "react"
import { connect } from "react-redux"
import { ProductCard } from "../../components/productCard/ProductCard"
import { Divider, Button, Segment, Header, Card } from "semantic-ui-react"
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal"
import { addProduct, removeProduct } from "../../modules/product/product.actions"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"

const Products = ({ products, createProduct, removeProduct }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);


    const handleCreation = (creationData) => {
        createProduct(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = (productId) => {
        removeProduct(productId)
        setDeleteModal(false)
    }
    return <div>
        <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => handleDelete(selectedProductId)}
            message="Confirma eliminación de este producto? Esta acción no puede deshacerse." />
        <CreateProductModal open={creationModalOpen}
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />
        <Segment >
            <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
            <Header as='h2' floated='left'>
                Productos
            </Header>
            <Divider />
            <Card.Group>
                {products.map(({ cost, name, id }) => <ProductCard name={name}
                    cost={cost}
                    id={id}
                    key={id}
                    onDelete={() => {
                        setSelectedProductId(id)
                        setDeleteModal(true)
                    }} />)}
            </Card.Group>


        </Segment>
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