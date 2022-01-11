import { Button, Card, Icon, Label, List } from "semantic-ui-react";
import { Order } from "../../modules/order/Order";
import { getMonth } from "../../utils/date";

export const OrderCard = ({
  order,
  handleCancel,
  handleGenerate,
}: {
  order: Order;
  handleCancel: Function;
  handleGenerate: Function;
}) => (
  <List.Item style={{ padding: "0.5em", width: "100%" }}>
    <Card fluid color="teal">
      <Card.Content>
        {order.amountPayed <= 0 && !order.cancelled && !order.completed && (
          <List.Content floated="right">
            <Button icon compact primary onClick={() => handleGenerate()}>
              <Icon name="payment"></Icon> Generar pago
            </Button>
            <Button icon compact onClick={() => handleCancel()}>
              <Icon name="trash"></Icon>Cancelar orden
            </Button>
          </List.Content>
        )}
        {order.cancelled && (
          <List.Content floated="right">
            <Label>Cancelado</Label>
          </List.Content>
        )}
        <List.Content floated="left">
          <Label horizontal>
            {getMonth(order.periodPayed.getMonth())}
            <br />
            {order.periodPayed.getFullYear()}
          </Label>
          {order.productName}
        </List.Content>
        <List.Content floated="left">{order.userName}</List.Content>

        <List.Content floated="left">
          Pagado <b>$ARS {order.amountPayed}</b> de <b>$ARS{order.amount}</b>
        </List.Content>
        {order.totalDiscount > 0 && (
          <List.Content floated="left">
            Descuento aplicado: {order.totalDiscount}%
          </List.Content>
        )}
        <List.Content floated="left">
          Fecha de creacion {order.emittedDate.toLocaleDateString()}
        </List.Content>
      </Card.Content>
    </Card>
  </List.Item>
);
