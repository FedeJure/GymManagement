import { connect } from "react-redux";
import { useAlert } from 'react-alert'
import {  useEffect, useState } from "react";
import { Dispatch } from "redux";
import { List, Grid, Container } from "semantic-ui-react";
import { StoreState } from "../../store";
import { Order } from "../../domain/order/Order";
import { InfiniteScroll } from "../../components/infiniteScroll/InfiniteScroll";
import { FilterInput } from "../../components/filterInput/FilterInput";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import { getOrdersAction } from "../../domain/order/order.actions";
import { OrderStateEnum } from "../../domain/order/OrderStateEnum";
import { OrderCard } from "../../components/orderCard/OrderCard";
import { cancelOrder, generatePayment } from "../../services/api/orderApi";
import { GeneratePayModal } from "../../components/generatePayModal/generatePayModal";
import { useOrders } from "../../hooks/useOrders";

const Orders = ({
  fetchOrders,
}: {
  fetchOrders: Function;
}) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const alert = useAlert()
  const {
    items: orders,
    setPage,
    page,
    setFilterByTag,
    setFilterByContent,
  } = useOrders();
  const defaultFilter = [OrderStateEnum.AVAILABLE]
  useEffect(() => {
    setFilterByTag(defaultFilter)
  }, [])
  const handlePay = (value: number) => {
    if (!selectedOrder) return;
    setGenerateModal(false)
    generatePayment(selectedOrder.id, value).then((updatedResponse) => {
      alert.success("Pago guardado")
    })
    .catch(error => {
      alert.error("Ocurrio un problema")
    })
  };

  const handleDelete = () => {
    if (!selectedOrder) return setConfirmModal(false);
    cancelOrder(selectedOrder.id)
      .then(() => {
        setConfirmModal(false);
        alert.success("Orden cancelada")
      })
      .catch((err) => {
        setConfirmModal(false);
        alert.error("Ocurrio un problema")
      });
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
        style={{ height: "30vh", width: "100%", overflowY: "auto" }}
      >
        <InfiniteScroll
          as={List.Item}
          onLoadMore={() => setPage(page+1)}
          data={orders.map((s) => (
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
        />
      </List>
    </div>
  );
};

const mapStateToProps = (state: StoreState) => {
  return {
    orders: state.order.orders,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchOrders: ({
      page,
      contentFilter,
      append,
      cancelled,
      completed,
    }: {
      page: number;
      contentFilter: string[];
      append: boolean;
      cancelled?: boolean;
      completed?: boolean;
    }) =>
      getOrdersAction({ page, contentFilter, append, cancelled, completed })(
        dispatch
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
