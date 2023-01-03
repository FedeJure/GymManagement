import { ModalOverlay, ModalCloseButton, ModalBody, Modal, ModalContent, ModalHeader, Text, Tag, Wrap, WrapItem, VStack } from "@chakra-ui/react";
import { Order } from "../../domain/order/Order";
import { getMonth } from "../../utils/date";


export const OrderDetailModal = ({order, onClose}: {order: Order,  onClose: () =>void}) => {
    return (
      <Modal size={"2xl"} isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Orden de cobro - detalle</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={"7"}>
            <Wrap>
              <WrapItem>
                <VStack align="start">
                  <VStack align="start">
                    <Text as="b">ID</Text>
                    <Tag>{order.id}</Tag>
                  </VStack>
                  <VStack align="start">
                    <Text as="b">Alumno</Text>
                    <Tag>{order.userName}</Tag>
                  </VStack>
                  <VStack align="start">
                    <Text as="b">Clase</Text>
                    <Tag>
                      {order.productName} (id: {order.productId})
                    </Tag>
                  </VStack>
                  <VStack align="start">
                    <Text as="b">Arancel</Text>
                    <Tag>
                      Total: ${order.amount}{" "}
                      {order.totalDiscount > 0
                        ? `[$${order.basePrice} base - $${order.totalDiscount} descuento]`
                        : ""}
                    </Tag>
                  </VStack>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack align="start">
                  <VStack align="start">
                    <Text as="b">Periodo</Text>
                    <Tag>
                      {getMonth(order.periodPayed.getMonth())} -{" "}
                      {order.periodPayed.getFullYear()}
                    </Tag>
                  </VStack>
                  <VStack align="start">
                    <Text as="b">Fecha de emision</Text>
                    <Tag>
                      {order.emittedDate.toLocaleDateString()}{" "}
                      {order.emittedDate.toLocaleTimeString()}
                    </Tag>
                  </VStack>
                </VStack>
              </WrapItem>
            </Wrap>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}