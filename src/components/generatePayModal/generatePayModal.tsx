import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Segment,
  FormInput,
  Divider,
} from "semantic-ui-react";
import { Order } from "../../modules/order/Order";

interface IGeneratePayModal {
  order: Order;
  onClose: () => void;
  onSubmit: () => void;
}

export const GeneratePayModal: React.FC<IGeneratePayModal> = ({
  order,
  onClose,
  onSubmit,
}) => {
  const [value, setValue] = useState(0);

  const debt = order.amount - order.amountPayed;

  const handleSubmit = () => {};
  return (
    <Modal size={"mini"} onClose={onClose} open>
      <Modal.Header>Generar pago</Modal.Header>
      <Modal.Content>
        <Segment>
          <label>
            Valor restante por pagar: <b>${debt}</b> del total ${order.amount}
          </label>
          <Divider />
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Valor</label>
              <input
                value={value}
                max={debt}
                type="number"
                onChange={(e) => {
                  setValue(
                    Math.max(0, Math.min(debt, e.currentTarget.valueAsNumber))
                  );
                }}
              />
            </Form.Field>
            <button type="submit" hidden={true} />
          </Form>
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          content={"Generar Pago"}
          labelPosition="right"
          icon="checkmark"
          positive
          type="submit"
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};
