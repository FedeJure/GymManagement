import { useState } from "react";
import { connect } from "react-redux";
import { ProductCard } from "../../components/productCard/ProductCard";
import { Divider, Button, Grid, Container } from "semantic-ui-react";
import { CreateProductModal } from "../../components/createProductModal/CreateProductModal";
import {
  addProduct,
  editProduct,
  getProductsAction,
  removeProduct,
} from "../../domain/product/product.actions";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import { ProductPayload } from "../../domain/product/ProductPayload";
import { Product } from "../../domain/product/Product";
import { StoreState } from "../../store";
import { Dispatch } from "redux";
import { useProducts } from "../../hooks/useProducts";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";
import { getProductConfig } from "../../services/api";

const Products = ({
  createProduct,
  removeProduct,
  editProduct,
}: {
  createProduct: Function;
  removeProduct: Function;
  editProduct: Function;
}) => {
  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { items: products, step, setPage } = useProducts();

  const handleCreation = (creationData: ProductPayload) => {
    createProduct(creationData);
    setCreationModalOpen(false);
  };
  const handleDelete = (productId: string) => {
    removeProduct(productId);
    setDeleteModal(false);
  };

  const handleEdit = (editData: ProductPayload) => {
    if (!selectedProduct) return;
    setEditModalOpen(false);
    editProduct({ ...selectedProduct, ...editData });
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
          onClose={() => setCreationModalOpen(false)}
          onSubmit={handleCreation}
        />
      )}
      {editModalOpen && (
        <CreateProductModal
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

const mapStateToProps = (state: StoreState) => {
  return {
    products: state.product.products,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchProducts: (page: number) => getProductsAction({ page })(dispatch),
    createProduct: (data: ProductPayload) => addProduct(data)(dispatch),
    removeProduct: (productId: string) => removeProduct(productId)(dispatch),
    editProduct: (product: Product) => editProduct(product)(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
