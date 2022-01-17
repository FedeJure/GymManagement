import { useState } from "react";
import { useAlert } from "react-alert";
import { ProductCard } from "../../components/productCard/ProductCard";
import { Divider, Button, Grid, Container } from "semantic-ui-react";
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import { ProductPayload } from "../../domain/product/ProductPayload";
import { Product } from "../../domain/product/Product";
import { useProducts } from "../../hooks/useProducts";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";
import {
  createProduct,
  deleteProduct,
  getProductConfig,
  updateProduct,
} from "../../services/api";

const Products = ({}: {}) => {
  const alert = useAlert();
  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { items: products, step, setPage, refresh } = useProducts();

  const handleCreation = async (creationData: ProductPayload) => {
    try {
      await createProduct(creationData);
      refresh();
      alert.success("Producto creado");
    } catch (error) {
      alert.error("Ocurrio un problema");
    }
    setCreationModalOpen(false);
  };
  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refresh();
      alert.success("Producto eliminado");
    } catch (error) {
      alert.error("Ocurrio un error");
    }
    setDeleteModal(false);
  };

  const handleEdit = async (editData: ProductPayload) => {
    if (!selectedProduct) return;
    try {
      await updateProduct({ ...selectedProduct, ...editData });
      refresh();
      alert.success("Producto editado");
    } catch (error) {
      alert.error("Ocurrio un problema");
    }

    setEditModalOpen(false);
  };

  const productElements = products.map((product) => (
    <ProductCard
      interactable={true}
      product={product}
      key={product.id}
      onDelete={() => {
        setSelectedProduct(product);
        setDeleteModal(true);
      }}
      onEdit={() => {
        setSelectedProduct(product);
        setEditModalOpen(true);
      }}
    />
  ));

  return (
    <div>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          onAccept={() => selectedProduct && handleDelete(selectedProduct.id)}
          message="Confirma eliminación de este producto? Esta acción no puede deshacerse."
        />
      )}
      {creationModalOpen && (
        <CreateProductModal
          initialOwners={[]}
          onClose={() => setCreationModalOpen(false)}
          onSubmit={handleCreation}
        />
      )}
      {editModalOpen && (
        <CreateProductModal
          initialOwners={selectedProduct?.owners}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEdit}
          initialData={selectedProduct}
        />
      )}
      <Container>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column textAlign="left">
              <h2>Productos</h2>
            </Grid.Column>
            <Grid.Column floated="right">
              <h4>
                Crear nuevo{" "}
                <Button
                  color="blue"
                  circular
                  icon="plus"
                  onClick={() => setCreationModalOpen(true)}
                />
              </h4>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <Divider />

      <PaginatedGridPage
        step={step}
        elements={productElements}
        fetchCountOfItems={getProductConfig}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Products;
