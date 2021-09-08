import { useState } from "react"
import { connect } from "react-redux"
import { ProductCard } from "../../components/productCard/ProductCard"
import { Divider, Button, Segment, Header, Card } from "semantic-ui-react"
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal"
import { addProduct, editProduct, removeProduct } from "../../modules/product/product.actions"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"
import { ProductPayload } from "../../modules/product/ProductPayload"
import { Product } from "../../modules/product/Product"
import { StoreState } from "../../store"
import { Dispatch } from "redux"

const Products = ({ products, createProduct, removeProduct, editProduct }:
    { products: Product[], createProduct: Function, removeProduct: Function, editProduct:Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


    const handleCreation = (creationData: ProductPayload) => {
        createProduct(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = (productId: number) => {
        removeProduct(productId)
        setDeleteModal(false)
    }

    const handleEdit = (editData: ProductPayload) => {
        if (!selectedProduct) return
        setEditModalOpen(false)
        editProduct(selectedProduct.id, editData)
    }

    return <div>
       {deleteModal && <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => selectedProduct && handleDelete(selectedProduct.id)}
            message="Confirma eliminación de este producto? Esta acción no puede deshacerse." />}
        {creationModalOpen && <CreateProductModal
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />}
        {editModalOpen &&<CreateProductModal
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedProduct?.data}/>}
            <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
            <Header as='h2' floated='left'>
                Productos
            </Header>
            <Divider />
            <Card.Group>
                {products.map((product) => <ProductCard 
                    interactable={true}
                    product={product}
                    key={product.id}
                    onDelete={() => {
                        setSelectedProduct(product)
                        setDeleteModal(true)
                    }}
                    onEdit={() => {
                        setSelectedProduct(product)
                        setEditModalOpen(true)
                    }} />)}
            </Card.Group>
    </div>
}

const mapStateToProps = (state: StoreState) => {
    return {
        products: state.product.products
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        createProduct: (data: ProductPayload) => dispatch(addProduct(data)),
        removeProduct: (productId: number) => dispatch(removeProduct(productId)),
        editProduct: (productId: number, data: ProductPayload) => dispatch(editProduct(productId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)