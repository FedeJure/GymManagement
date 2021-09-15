import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { ProductCard } from "../../components/productCard/ProductCard"
import { Divider, Button, Header, Card } from "semantic-ui-react"
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal"
import { addProduct, editProduct, getProductsAction, removeProduct } from "../../modules/product/product.actions"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"
import { ProductPayload } from "../../modules/product/ProductPayload"
import { Product } from "../../modules/product/Product"
import { StoreState } from "../../store"
import { Dispatch } from "redux"

const Products = ({ products, createProduct, removeProduct, editProduct, fetchProducts }:
    {
        products: Product[],
        createProduct: Function,
        removeProduct: Function,
        editProduct: Function,
        fetchProducts: Function
    }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts(0)
    }, [])

    const handleCreation = (creationData: ProductPayload) => {
        createProduct(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = (productId: string) => {
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
        {editModalOpen && <CreateProductModal
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedProduct} />}
        <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
        <Header as='h2' floated='left'>
            Productos
        </Header>
        <Divider />
        <Card.Group centered>
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
        fetchProducts: (page: number) => getProductsAction({ page })(dispatch),
        createProduct: (data: ProductPayload) => addProduct(data)(dispatch),
        removeProduct: (productId: string) => removeProduct(productId)(dispatch),
        editProduct: (productId: string, data: ProductPayload) => editProduct(productId, data)(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)