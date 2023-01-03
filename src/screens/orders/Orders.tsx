import { useEffect, useState } from "react";
import { Order } from "../../domain/order/Order";
import { FilterInput } from "../../components/filterInput/FilterInput";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import { OrderStateEnum } from "../../domain/order/OrderStateEnum";
import {
  cancelOrder,
  generatePayment,
  getOrderConfig,
} from "../../services/api/orderApi";
import { GeneratePayModal } from "../../components/generatePayModal/generatePayModal";
import { useOrders } from "../../hooks/useOrders";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { getMonth } from "../../utils/date";
import { AiFillDelete } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { AddIcon } from "@chakra-ui/icons";
import {MdOutlinePayments} from "react-icons/md"

function getColor(state: OrderStateEnum): string {
  switch (state) {
    case OrderStateEnum.AVAILABLE:
      return "blue";
    case OrderStateEnum.COMPLETE:
      return "green";
    case OrderStateEnum.CANCELLED:
      return "orange";

    default:
      return "grey";
  }
}

const OrderRow = ({
  order,
  onDelete,
  onPay,
}: {
  order: Order;
  onDelete: () => void;
  onPay: () => void;
}) => {
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const handlePay = async (value: number) => {
    setGenerateModal(false);
    try {
      await generatePayment(order.id, value);
      toast({
        title: "Pago guardado",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onPay()
    } catch (error) {
      toast({
        title: "No se pudo guardar el pago",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await cancelOrder(order.id);
      toast({
        title: "Orden eliminada",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onDelete()
    } catch (error) {
      toast({
        title: "No se pudo eliminar la orden",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setConfirmModal(false);
  };
  return (
    <>
      {confirmModal && (
        <ConfirmationModal
          open={confirmModal}
          onCancel={() => setConfirmModal(false)}
          onAccept={() => handleDelete()}
          message="Confirma cancelación? Esta acción no puede deshacerse."
        />
      )}
      {generateModal && (
        <GeneratePayModal
          onClose={() => setGenerateModal(false)}
          onSubmit={handlePay}
          order={order}
        />
      )}
      <Tr>
        <Td maxW="3" overflow="hidden" textOverflow="ellipsis">
          # {order.id}
        </Td>
        <Td>
          <Badge colorScheme={getColor(order.state)}>{order.state}</Badge>
        </Td>
        <Td>{order.userName}</Td>
        <Td>{order.productName}</Td>
        <Td>
          {getMonth(order.periodPayed.getMonth())}
          <br />
          {order.periodPayed.getFullYear()}
        </Td>
        <Td width="1">
          <Popover placement="bottom">
            <PopoverTrigger>
              <IconButton
                alignSelf="start"
                aria-label="More server options"
                icon={<BsThreeDots />}
                variant="ghost"
                w="fit-content"
              />
            </PopoverTrigger>
            <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
              <PopoverArrow />
              <PopoverBody>
                <Stack>
                  <Button
                    w="194px"
                    variant="ghost"
                    rightIcon={<BiDetail />}
                    justifyContent="space-between"
                    fontWeight="normal"
                    fontSize="sm"
                  >
                    Ver detalle
                  </Button>
                  {order.state === OrderStateEnum.AVAILABLE && (
                    <Button
                      w="194px"
                      variant="ghost"
                      rightIcon={<MdOutlinePayments />}
                      justifyContent="space-between"
                      fontWeight="normal"
                      fontSize="sm"
                      onClick={() => setGenerateModal(true)}
                    >
                      Marcar como pagada
                    </Button>
                  )}
                  <Button
                    w="194px"
                    variant="ghost"
                    rightIcon={<AiFillDelete />}
                    justifyContent="space-between"
                    fontWeight="normal"
                    colorScheme="red"
                    fontSize="sm"
                    onClick={() => setConfirmModal(true)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Td>
      </Tr>
    </>
  );
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const toast = useToast();
  const {
    items: orders,
    setPage,
    page,
    setFilterByTag,
    setFilterByContent,
    step,
    refresh,
  } = useOrders();
  const defaultFilter = [
    { label: OrderStateEnum.AVAILABLE, value: OrderStateEnum.AVAILABLE },
  ];

  useEffect(() => {
    setFilterByTag(defaultFilter.map(f => f.value));
  }, []);

  const handlePay = () => {
    refresh();
  };

  const handleDelete = () => {
    refresh();
  };

  return (
    <Container maxWidth="none" p="3">
      <HStack>
        <Box width={{ base: "full", md: "md" }}>
          <FilterInput
            defaultTagFilters={defaultFilter}
            tagOptions={[
              {
                label: OrderStateEnum.COMPLETE,
                value: OrderStateEnum.COMPLETE,
                isFixed: true,
              },
              {
                label: OrderStateEnum.CANCELLED,
                value: OrderStateEnum.CANCELLED,
                isFixed: true,
              },
              {
                label: OrderStateEnum.AVAILABLE,
                value: OrderStateEnum.AVAILABLE,
                isFixed: true,
              },
            ]}
            onTagFilterChange={setFilterByTag}
            onCustomFilterChange={setFilterByContent}
          />
        </Box>

        <Tooltip label="Crear suscripcion">
          <IconButton
            aria-label="agregar suscripcion manualmente"
            icon={<AddIcon />}
          />
        </Tooltip>
      </HStack>

      <TableContainer>
        <Table variant="striped" size={"sm"}>
          <TableCaption>Ordenes de cobro</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Estado</Th>
              <Th>Alumno</Th>
              <Th>Clase</Th>
              <Th>Periodo</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((o) => (
              <OrderRow order={o} onDelete={handleDelete} onPay={handlePay} />
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Estado</Th>
              <Th>Alumno</Th>
              <Th>Clase</Th>
              <Th>Periodo</Th>
              <Th>Acciones</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Container>
  );

  // return (
  //   <div>
  //     {confirmModal && (
  //       <ConfirmationModal
  //         open={confirmModal}
  //         onCancel={() => setConfirmModal(false)}
  //         onAccept={() => handleDelete()}
  //         message="Confirma cancelación? Esta acción no puede deshacerse."
  //       />
  //     )}
  //     {selectedOrder && generateModal && (
  //       <GeneratePayModal
  //         onClose={() => setGenerateModal(false)}
  //         onSubmit={handlePay}
  //         order={selectedOrder}
  //       />
  //     )}

  //     <Container>
  //       <Grid verticalAlign="middle" style={{ width: "100%" }}>
  //         <Grid.Row columns="equal">
  //           <Grid.Column textAlign="left">
  //             <h3>Ordenes de pago</h3>
  //           </Grid.Column>
  //         </Grid.Row>
  //       </Grid>
  //     </Container>

  //     <FilterInput
  //       defaultTagFilters={defaultFilter}
  //       tagOptions={[
  //         {
  //           key: OrderStateEnum.COMPLETE,
  //           text: OrderStateEnum.COMPLETE,
  //           value: OrderStateEnum.COMPLETE,
  //           label: { color: "green", empty: true, circular: true },
  //         },
  //         {
  //           key: OrderStateEnum.CANCELLED,
  //           text: OrderStateEnum.CANCELLED,
  //           value: OrderStateEnum.CANCELLED,
  //           label: { color: "black", empty: true, circular: true },
  //         },
  //         {
  //           key: OrderStateEnum.AVAILABLE,
  //           text: OrderStateEnum.AVAILABLE,
  //           value: OrderStateEnum.AVAILABLE,
  //           label: { color: "yellow", empty: true, circular: true },
  //         },
  //       ]}
  //       onTagFilterChange={setFilterByTag}
  //       onCustomFilterChange={setFilterByContent}
  //     />
  //     <List
  //       verticalAlign="middle"
  //       style={{ height: "35vh", width: "100%", overflowY: "auto" }}
  //     >
  //       <PaginatedGridPage
  //         step={step}
  //         fetchCountOfItems={getOrderConfig}
  //         elements={orders.map((s) => (
  //           <OrderCard
  //             key={s.id}
  //             handleCancel={() => {
  //               setSelectedOrder(s);
  //               setConfirmModal(true);
  //             }}
  //             order={s}
  //             handleGenerate={() => {
  //               setSelectedOrder(s);
  //               setGenerateModal(true);
  //             }}
  //           />
  //         ))}
  //         maxHeight="30vh"
  //         onPageChange={setPage}
  //       />
  //     </List>
  //   </div>
  // );
};

export default Orders;
