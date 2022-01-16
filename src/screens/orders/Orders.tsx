import { useAlert } from "react-alert";
import { useEffect, useState } from "react";
import { List, Grid, Container } from "semantic-ui-react";
import { Order } from "../../domain/order/Order";
import { FilterInput } from "../../components/filterInput/FilterInput";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import { OrderStateEnum } from "../../domain/order/OrderStateEnum";
import { OrderCard } from "../../components/orderCard/OrderCard";
import {
  cancelOrder,
  generatePayment,
  getOrderConfig,
} from "../../services/api/orderApi";
import { GeneratePayModal } from "../../components/generatePayModal/generatePayModal";
import { useOrders } from "../../hooks/useOrders";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";

const Orders = () => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const alert = useAlert();
  const {
    items: orders,
    setPage,
    page,
    setFilterByTag,
    setFilterByContent,
    step,
    refresh,
  } = useOrders();
  const defaultFilter = [OrderStateEnum.AVAILABLE];
  useEffect(() => {
    setFilterByTag(defaultFilter);
  }, []);

  const handlePay = async (value: number) => {
    if (!selectedOrder) return;
    setGenerateModal(false);
    try {
      await generatePayment(selectedOrder.id, value);
      alert.success("Pago guardado");
      refresh();
    } catch (error) {
      alert.error("Ocurrio un problema");
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return setConfirmModal(false);
    try {
      await cancelOrder(selectedOrder.id);
      alert.success("Orden eliminada");
      refresh();
    } catch (error) {
      alert.error("Ocurrio un problema");
    }
    setConfirmModal(false);
  };

  return (
    <div>
      {confirmModal && (
        <ConfirmationModal
          open={confirmModal}
          onCancel={() => setConfirmModal(false)}
          onAccept={() => handleDelete()}
          message="Confirma cancelación? Esta acción no puede deshacerse."
        />
      )}
      {selectedOrder && generateModal && (
        <GeneratePayModal
          onClose={() => setGenerateModal(false)}
          onSubmit={handlePay}
          order={selectedOrder}
        />
      )}

      <Container>
        <Grid verticalAlign="middle" style={{ width: "100%" }}>
          <Grid.Row columns="equal">
            <Grid.Column textAlign="left">
              <h3>Ordenes de pago</h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <FilterInput
        defaultTagFilters={defaultFilter}
        tagOptions={[
          {
            key: OrderStateEnum.COMPLETE,
            text: OrderStateEnum.COMPLETE,
            value: OrderStateEnum.COMPLETE,
            label: { color: "green", empty: true, circular: true },
          },
          {
            key: OrderStateEnum.CANCELLED,
            text: OrderStateEnum.CANCELLED,
            value: OrderStateEnum.CANCELLED,
            label: { color: "black", empty: true, circular: true },
          },
          {
            key: OrderStateEnum.AVAILABLE,
            text: OrderStateEnum.AVAILABLE,
            value: OrderStateEnum.AVAILABLE,
            label: { color: "yellow", empty: true, circular: true },
          },
        ]}
        onTagFilterChange={setFilterByTag}
        onCustomFilterChange={setFilterByContent}
      />
      <List
        verticalAlign="middle"
        style={{ height: "35vh", width: "100%", overflowY: "auto" }}
      >
        <PaginatedGridPage
          step={step}
          fetchCountOfItems={getOrderConfig}
          elements={orders.map((s) => (
            <OrderCard
              key={s.id}
              handleCancel={() => {
                setSelectedOrder(s);
                setConfirmModal(true);
              }}
              order={s}
              handleGenerate={() => {
                setSelectedOrder(s);
                setGenerateModal(true);
              }}
            />
          ))}
          maxHeight="30vh"
          onPageChange={setPage}
        />
      </List>
    </div>
  );
};

export default Orders;
