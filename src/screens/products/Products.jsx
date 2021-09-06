import { useState } from "react"
import { connect } from "react-redux"
import { ProductCard } from "../../components/productCard/ProductCard"
import { Divider, Button, Segment, Header, Card } from "semantic-ui-react"
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal"
import { addProduct, editProduct, removeProduct } from "../../modules/product/product.actions"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"

const Products = ({ products, createProduct, removeProduct, editProduct }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const handleCreation = (creationData) => {
        createProduct(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = (productId) => {
        removeProduct(productId)
        setDeleteModal(false)
    }

    const handleEdit = (editData) => {
        setEditModalOpen(false)
        editProduct(selectedProduct.id, editData)
    }

    return <div>
       {deleteModal && <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => handleDelete(selectedProduct.id)}
            message="Confirma eliminación de este producto? Esta acción no puede deshacerse." />}
        {creationModalOpen && <CreateProductModal
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />}
        {editModalOpen &&<CreateProductModal
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedProduct}/>}
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
                        setSelectedProduct({cost, name, id})
                        setDeleteModal(true)
                    }}
                    onEdit={() => {
                        setSelectedProduct({cost, name, id})
                        setEditModalOpen(true)
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
        removeProduct: (productId) => dispatch(removeProduct(productId)),
        editProduct: (productId, data) => dispatch(editProduct(productId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)