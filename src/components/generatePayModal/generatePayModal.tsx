import {
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Order } from "../../domain/order/Order";

interface IGeneratePayModal {
  order: Order;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

export const GeneratePayModal: React.FC<IGeneratePayModal> = ({
  order,
  onClose,
  onSubmit,
}) => {
  const [value, setValue] = useState(0);

  const debt = order.amount - order.amountPayed;

  const handleSubmit = () => {
    onSubmit(value);
  };
  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmacion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl onSubmit={handleSubmit}>
            <FormLabel>
              Valor restante por pagar: <b>${debt}</b> del total ${order.amount}
            </FormLabel>
            <Input
              value={value}
              max={debt}
              type="number"
              onChange={(e) => {
                setValue(
                  Math.max(0, Math.min(debt, e.currentTarget.valueAsNumber || 0))
                );
              }}
            />
            <FormHelperText>
              Ingrese el monto abonado (puede ser un monto parcial que no cubra
              la deuda completa)
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            No
          </Button>
          <Button
            disabled={value === 0}
            variant="ghost"
            color={"red"}
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  // return (
  //   <Modal size={"mini"} onClose={onClose} open>
  //     <Modal.Header>Generar pago</Modal.Header>
  //     <Modal.Content>
  //       <Segment>
  //         <label>
  //           Valor restante por pagar: <b>${debt}</b> del total ${order.amount}
  //         </label>
  //         <Divider />
  //         <Form onSubmit={handleSubmit}>
  //           <Form.Field>
  //             <label>Valor</label>
  //             <input
  //               value={value}
  //               max={debt}
  //               type="number"
  //               onChange={(e) => {
  //                 setValue(
  //                   Math.max(0, Math.min(debt, e.currentTarget.valueAsNumber))
  //                 );
  //               }}
  //             />
  //           </Form.Field>
  //           <button type="submit" hidden={true} />
  //         </Form>
  //       </Segment>
  //     </Modal.Content>
  //     <Modal.Actions>
  //       <Button color="black" onClick={onClose}>
  //         Cancelar
  //       </Button>
  //       <Button
  //         content={"Generar Pago"}
  //         labelPosition="right"
  //         icon="checkmark"
  //         positive
  //         type="submit"
  //         onClick={handleSubmit}
  //       />
  //     </Modal.Actions>
  //   </Modal>
  // );
};
