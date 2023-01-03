import { useState } from "react";
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
  getUserConfig,
} from "../../services/api";
import { createOrder } from "../../services/api/orderApi";
import { useOrders } from "../../hooks/useOrders";
import {
  Box,
  ButtonGroup,
  Container,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useBreakpointValue,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { UserType } from "../../domain/users/UserType";
import { AddIcon } from "@chakra-ui/icons";
import { ExcelDownloader } from "../../components/excelDownloader/excelDownloader";
import { ExcelUploader } from "../../components/excelUploader/excelUploader";
import { mapToExcel } from "../../domain/users/UserMapper";

const Subscriptions = () => {
  const toast = useToast();
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

  const { refresh: refreshOrders } = useOrders();

  const handleSubmit = async (data: SubscriptionPayload) => {
    try {
      await createSubscription(data);

      refresh();
      refreshOrders();
      toast({
        title: "Suscripcion creada",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No se pudo crear la suscripcion",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setCreationModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedSubscription) return;
    try {
      await deleteSubscription({ subscriptionId: selectedSubscription.id });
      refresh();
      toast({
        title: "Suscripcion eliminada",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No se pudo eliminar la suscripcion",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setConfirmModal(false);
  };

  const handleCreateOrder = async () => {
    if (!selectedSubscription) return;
    try {
      await createOrder(selectedSubscription.id);
      refresh();
      refreshOrders();
      toast({
        title: "Orden creada",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No se pudo crear la orden",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
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

  const fitted = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <>
      {confirmModal && (
        <ConfirmationModal
          open={confirmModal}
          onCancel={() => setConfirmModal(false)}
          onAccept={() => handleDelete()}
          message="Confirma eliminación? Esta acción no puede deshacerse."
        />
      )}
      {confirmOrderModal && (
        <ConfirmationModal
          open={confirmOrderModal}
          onCancel={() => setConfirmOrderModal(false)}
          onAccept={() => {
            setConfirmOrderModal(false);
            handleCreateOrder();
          }}
          message={
            <>
              <h2>Crear orden de cobro?</h2>
              <br /> Tenga en cuenta que las ordenes de cobro son generadas
              automaticamente cuando es requerido
            </>
          }
        />
      )}

      <CreateSubscriptionModal
        onClose={() => setCreationModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {detailModal && selectedSubscription && (
        <SubscriptionDetailModal
          subscription={selectedSubscription}
          onClose={() => setDetailModal(false)}
        />
      )}
      <Tabs isFitted={fitted} align="end" variant="enclosed">
        <TabList>
          <Tab>Suscripciones</Tab>
          <Tab>Ordenes de cobro</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Container maxWidth="none" p="3">
              <HStack>
                <Box width={{ base: "full", md: "md" }}>
                  <FilterInput
                    tagOptions={[
                      {
                        value: PayState.DEBT,
                        label: PayState.DEBT,
                        isFixed: true,
                      },
                      {
                        label: PayState.ON_DAY,
                        value: PayState.ON_DAY,
                        isFixed: true,
                      },
                    ]}
                    onTagFilterChange={setFilterByTag}
                    onCustomFilterChange={setFilterByContent}
                  />
                </Box>

                <Tooltip
                  label="Crear suscripcion"
                  onClick={() => setCreationModalOpen(true)}
                >
                  <IconButton
                    aria-label="agregar suscripcion manualmente"
                    icon={<AddIcon />}
                    onClick={() => setCreationModalOpen(true)}
                  />
                </Tooltip>
              </HStack>

              <PaginatedGridPage
                justify={"start"}
                fetchCountOfItems={getUserConfig}
                step={step}
                onPageChange={(newPage) => setPage(newPage)}
                elements={subscriptionElements}
              />
            </Container>
          </TabPanel>
          <TabPanel>
            <Orders />  
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );

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
