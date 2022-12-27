import { useState } from "react";
import { useAlert } from "react-alert";
import { CreateSubscriptionModal } from "../../components/createSubscriptionModal/CreateSubscriptionModal";
import { SubscriptionPayload } from "../../domain/subscription/SubscriptionPayload";

import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionCard } from "../../components/subscriptionCard/SubscriptionCard";
import { PayState } from "../../domain/subscription/PayState";
import { FilterInput } from "../../components/filterInput/FilterInput";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import Orders from "../orders/Orders";
import { SubscriptionDetailModal } from "../../components/SubscriptionDetailModal";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionConfig,
} from "../../services/api";
import { createOrder } from "../../services/api/orderApi";
import { useOrders } from "../../hooks/useOrders";

const Subscriptions = ({}) => {
  const alert = useAlert();
  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [confirmOrderModal, setConfirmOrderModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const {
    items: subscriptions,
    setPage,
    page,
    setFilterByTag,
    setFilterByContent,
    step,
    refresh,
  } = useSubscriptions();

  const {refresh: refreshOrders} = useOrders()

  const handleSubmit = async (data: SubscriptionPayload) => {
    try {
      await createSubscription(data);

      refresh();
      refreshOrders()
      alert.success("Suscripcion creada");
    } catch (error) {
      alert.error("Ocurrio un problema");
    }
    setCreationModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedSubscription) return;
    try {
      await deleteSubscription({ subscriptionId: selectedSubscription.id });
      refresh();
      alert.success("Suscripcion eliminada");
    } catch (error) {
      alert.error("Ocurrio un problema");
    }
    setConfirmModal(false);
  };

  const handleCreateOrder = async () => {
    if (!selectedSubscription) return;
    try {
      await createOrder(selectedSubscription.id);
      refresh();
      refreshOrders()
      alert.success("Orden creada");
    } catch (error) {
      alert.error("Ocurrio un problema");
    }
  };

  const subscriptionElements = subscriptions.map((s) => (
    <SubscriptionCard
      key={s.id}
      handleDelete={() => {
        setSelectedSubscription(s);
        setConfirmModal(true);
      }}
      subscription={s}
      handleCreateOrder={() => {
        setSelectedSubscription(s);
        setConfirmOrderModal(true);
      }}
      handleDetails={() => {
        setSelectedSubscription(s);
        setDetailModal(true);
      }}
    />
  ));

    return <></>;


  // return (
  //   <div>
  //     {confirmModal && (
  //       <ConfirmationModal
  //         open={confirmModal}
  //         onCancel={() => setConfirmModal(false)}
  //         onAccept={() => handleDelete()}
  //         message="Confirma eliminación? Esta acción no puede deshacerse."
  //       />
  //     )}
  //     {confirmOrderModal && (
  //       <ConfirmationModal
  //         open={confirmOrderModal}
  //         onCancel={() => setConfirmOrderModal(false)}
  //         onAccept={() => {
  //           setConfirmOrderModal(false);
  //           handleCreateOrder();
  //         }}
  //         message={
  //           <>
  //             <h2>Crear orden de cobro?</h2>
  //             <br /> Tenga en cuenta que las ordenes de cobro son generadas
  //             automaticamente cuando es requerido
  //           </>
  //         }
  //       />
  //     )}
  //     {creationModalOpen && (
  //       <CreateSubscriptionModal
  //         onClose={() => setCreationModalOpen(false)}
  //         onSubmit={handleSubmit}
  //       />
  //     )}
  //     {detailModal && selectedSubscription && (
  //       <SubscriptionDetailModal
  //         subscription={selectedSubscription}
  //         onClose={() => setDetailModal(false)}
  //       />
  //     )}

  //     <>
  //       <Container>
  //         <Grid
  //           columns="equal"
  //           verticalAlign="middle"
  //           style={{ width: "100%" }}
  //         >
  //           <Grid.Row>
  //             <Grid.Column textAlign="left">
  //               <h2>Subscripciones</h2>
  //             </Grid.Column>
  //             <Grid.Column floated="right">
  //               <h4>
  //                 Crear nueva{" "}
  //                 <Button
  //                   color="blue"
  //                   circular
  //                   icon="plus"
  //                   onClick={() => setCreationModalOpen(true)}
  //                 />
  //               </h4>
  //             </Grid.Column>
  //           </Grid.Row>
  //         </Grid>
  //       </Container>

  //       <FilterInput
  //         tagOptions={[
  //           {
  //             key: PayState.DEBT,
  //             text: PayState.DEBT,
  //             value: PayState.DEBT,
  //             label: { color: "orange", empty: true, circular: true },
  //           },
  //           {
  //             key: PayState.ON_DAY,
  //             text: PayState.ON_DAY,
  //             value: PayState.ON_DAY,
  //             label: { color: "green", empty: true, circular: true },
  //           },
  //         ]}
  //         onTagFilterChange={setFilterByTag}
  //         onCustomFilterChange={setFilterByContent}
  //       />
  //       <PaginatedGridPage
  //         step={step}
  //         elements={subscriptionElements}
  //         onPageChange={setPage}
  //         fetchCountOfItems={getSubscriptionConfig}
  //         maxHeight="35vh"
  //       />
  //     </>

  //     <Grid.Row columns={1}>
  //       <Grid.Column>
  //         <Divider hidden />
  //         <Orders />
  //       </Grid.Column>
  //     </Grid.Row>
  //   </div>
  // );
};

export default Subscriptions;
