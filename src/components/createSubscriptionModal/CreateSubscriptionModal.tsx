import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Grid,
  Divider,
  Segment,
  Input,
} from "semantic-ui-react";
import { User } from "../../domain/users/User";
import { SubscriptionPayload } from "../../domain/subscription/SubscriptionPayload";
import { fetchProducts, fetchUsers } from "../../services/api";
import { Product } from "../../domain/product/Product";
import { DateInput } from "../inputComponent/DateInputComponent";

const defaultDate = new Date(0);

export const CreateSubscriptionModal = ({
  onClose,
  onSubmit,
}: {
  onClose: any;
  onSubmit: any;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<SubscriptionPayload>({
    userId: "",
    productId: "",
    specialDiscount: 0,
    initialTime: defaultDate,
    endTime: undefined,
    comment: "",
  });

  const handleSubmit = () => {
    setSubmitted(true);
    if (
      formData.productId.length > 0 &&
      formData.userId.length > 0 &&
      formData.initialTime != defaultDate
    )
      onSubmit(formData);
  };

  const handleChange = (value: any, tag: string) => {
    setFormData({ ...formData, [tag]: value });
  };

  const handleUserSearch = (value: string) => {
    const query = value.trim();
    if (query.length <= 0) return;

    fetchUsers({
      page: 0,
      step: 200,
      filterByContent: [query],
    }).then((users) => {
      setUsers(users);
    });
  };

  const handleProductSearch = (value: string) => {
    const query = value.trim();
    if (query.length <= 0) return;

    fetchProducts({
      page: 0,
      step: 1000,
      filterByContent: [query],
    }).then((products) => {
      setProducts(products);
    });
  };

  const handleDiscountChange = (value: string, key: string) => {
    if (value === "") {
      setFormData((form) => ({ ...form, [key]: 0 }));
      return;
    }
    const parsed = parseFloat(value) || 0;
    const newValue = parsed >= 0 ? Math.min(parsed, 100) : 0;
    setFormData((form) => ({ ...form, [key]: newValue }));
  };

  return (
    <Modal onClose={onClose} open>
      <Modal.Header>{"Creación de suscripción"}</Modal.Header>
      <Modal.Content>
        <Segment placeholder>
          <Grid columns={2} stackable>
            <Divider vertical />
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                <Form onSubmit={handleSubmit}>
                  <Form.Field
                    error={
                      submitted && formData.initialTime != defaultDate
                        ? {
                            content: "Ingresar Fecha de inicio",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Fecha de inicio de suscripción</label>
                    <DateInput
                      onChange={(value) => handleChange(value, "initialTime")}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>
                      Fecha de finalizacion de suscripción (Opcional)
                    </label>
                    <DateInput
                      onChange={(value) => handleChange(value, "endTime")}
                    />
                  </Form.Field>
                  <button type="submit" hidden={true} />
                </Form>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Alumno</label>
                  <Form.Dropdown
                    fluid
                    selection
                    search
                    error={
                      submitted && formData.userId.length == 0
                        ? {
                            content: "Ingresar un Alumno",
                            pointing: "below",
                          }
                        : false
                    }
                    onSearchChange={(_, value) =>
                      handleUserSearch(value.searchQuery)
                    }
                    onChange={(e, data) => handleChange(data.value, "userId")}
                    options={[...users].map((p) => ({
                      key: p.name,
                      text: `${p.lastname}, ${p.name}, ${p.dni}`,
                      value: p.id,
                    }))}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Producto</label>
                  <Form.Dropdown
                    fluid
                    selection
                    search
                    error={
                      submitted && formData.productId.length == 0
                        ? {
                            content: "Ingresar un Producto",
                            pointing: "below",
                          }
                        : false
                    }
                    onSearchChange={(_, value) =>
                      handleProductSearch(value.searchQuery)
                    }
                    onChange={(e, data) =>
                      handleChange(data.value, "productId")
                    }
                    options={[...products].map((p) => ({
                      key: p.name,
                      text: `${p.name},$${p.price} ${p.payType}(${p.daysInWeek
                        .map((d) => d.slice(0, 2))
                        .join(", ")})`,
                      value: p.id,
                    }))}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Descuento especial</label>
                  <Input
                    label="%"
                    labelPosition="right"
                    input={
                      <input
                        onChange={(target) =>
                          handleDiscountChange(
                            target.currentTarget.value,
                            "specialDiscount"
                          )
                        }
                        value={formData.specialDiscount}
                      />
                    }
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          content={"Crear"}
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
