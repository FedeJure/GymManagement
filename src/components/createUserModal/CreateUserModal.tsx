import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Grid,
  Divider,
  Segment,
  Icon,
  Header,
  Image,
  Dropdown,
  TextArea,
} from "semantic-ui-react";
import { User } from "../../domain/users/User";
import { UserPayload } from "../../domain/users/UserPayload";
import { UserType } from "../../domain/users/UserType";
import { UserProvider, useUsers } from "../../hooks/useUsers";

const defaultDate = new Date(0);

interface ICreateUserModal {
  onClose: any;
  onSubmit: any;
  initialData?: User | null;
}

export const _CreateUserModal: React.FC<ICreateUserModal> = ({
  onClose,
  onSubmit,
  initialData,
}) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>("");
  const { items: familiars, setFilterByContent } = useUsers();

  useEffect(() => {
    if (!image) return;
    var reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
      setBase64Image(reader.result as string);
    };
  }, [image]);

  const [formData, setFormData] = useState<UserPayload>({
    name: initialData?.name ?? "",
    lastname: initialData?.lastname ?? "",
    birthDate: initialData?.birthDate ?? defaultDate,
    address: initialData?.address ?? "",
    contactEmail: initialData?.contactEmail ?? "",
    comment: initialData?.comment ?? "",
    contactPhone: initialData?.contactPhone ?? "",
    familiarIds: initialData?.familiars.map((f) => f.id) ?? [],
    profilePicture: initialData?.profilePicture ?? "",
    type: initialData?.type ?? UserType.STUDENT,
    dni: initialData?.dni ?? "",
  });
  const handleSubmit = () => {
    setSubmitted(true);
    if (
      formData.name !== "" &&
      formData.lastname !== "" &&
      formData.address !== "" &&
      formData.contactEmail !== "" &&
      formData.contactPhone !== "" &&
      formData.birthDate !== defaultDate &&
      formData.dni !== ""
    )
      onSubmit(formData, image);
  };

  const handleChange = (value: any, tag: string) => {
    setFormData({ ...formData, [tag]: value });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      event.currentTarget.value = "";
      return;
    }
    setImage(file);
  };

  return (
    <Modal onClose={onClose} open>
      <Modal.Header>
        {initialData ? "Edición de persona" : "Creación de persona"}
      </Modal.Header>
      <Modal.Content>
        <Segment placeholder>
          <Grid columns={2} stackable>
            <Divider vertical />
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                <Form onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>Tipo</label>
                    <Dropdown
                      fluid
                      selection
                      value={formData.type}
                      options={[
                        UserType.ADMIN,
                        UserType.STUDENT,
                        UserType.TRAINER,
                      ].map((t) => ({
                        key: t,
                        text: t,
                        value: t,
                      }))}
                      onChange={(e, data) => handleChange(data.value, "type")}
                    />
                  </Form.Field>
                  <Form.Field
                    error={
                      submitted && formData.name.length === 0
                        ? {
                            content: "Ingresar Nombre",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Nombre</label>
                    <input
                      placeholder=""
                      value={formData.name}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "name")
                      }
                    />
                  </Form.Field>
                  <Form.Field
                    error={
                      submitted && formData.lastname.length === 0
                        ? {
                            content: "Ingresar Apellido",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Apellido</label>
                    <input
                      placeholder=""
                      value={formData.lastname}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "lastname")
                      }
                    />
                  </Form.Field>
                  <Form.Field
                    error={
                      submitted && formData.dni.length === 0
                        ? {
                            content: "Ingresar Documento",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Documento (DNI)</label>
                    <input
                      placeholder=""
                      value={formData.dni}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "dni")
                      }
                    />
                  </Form.Field>
                  <Form.Field
                    error={
                      submitted && formData.birthDate === defaultDate
                        ? {
                            content: "Ingresar Fecha de nacimiento",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Fecha de nacimiento</label>
                    <input
                      placeholder=""
                      type="date"
                      value={
                        formData.birthDate && formData.birthDate !== defaultDate
                          ? formData.birthDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(v) =>
                        handleChange(
                          new Date(v.currentTarget.value),
                          "birthDate"
                        )
                      }
                    />
                  </Form.Field>
                  <Form.Field
                    error={
                      submitted && formData.contactPhone.length === 0
                        ? {
                            content: "Ingresar Telefono",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Teléfono de contacto</label>
                    <input
                      placeholder=""
                      value={formData.contactPhone}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "contactPhone")
                      }
                    />
                  </Form.Field>
                  <Form.Field
                    error={
                      submitted && formData.contactEmail.length === 0
                        ? {
                            content: "Ingresar Email",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Email de contacto</label>
                    <input
                      placeholder=""
                      value={formData.contactEmail}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "contactEmail")
                      }
                    />
                  </Form.Field>

                  <input type="submit" hidden={true} />
                </Form>
              </Grid.Column>
              <Grid.Column>
                <Form onSubmit={handleSubmit}>
                  <Form.Field
                    error={
                      submitted && formData.address.length === 0
                        ? {
                            content: "Ingresar Direccion",
                            pointing: "below",
                          }
                        : false
                    }
                  >
                    <label>Domicilio</label>
                    <input
                      placeholder=""
                      value={formData.address}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "address")
                      }
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Comentario</label>
                    <TextArea
                      placeholder=""
                      value={formData.comment}
                      onChange={(v) =>
                        handleChange(v.currentTarget.value, "comment")
                      }
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Hermanos</label>
                    <Dropdown
                      fluid
                      selection
                      search
                      onSearchChange={(_, value) => {
                        if (value.searchQuery.length > 0)
                          setFilterByContent([value.searchQuery]);
                      }}
                      multiple
                      defaultValue={
                        initialData
                          ? initialData.familiars.map((u) => u.id)
                          : []
                      }
                      onChange={(e, data) =>
                        handleChange(data.value, "familiarIds")
                      }
                      options={[...familiars]
                        .filter((user) => user.id !== initialData?.id)
                        .map((p) => ({
                          key: p.name,
                          text: `${p.lastname}, ${p.name}, ${p.dni}`,
                          value: p.id,
                        }))}
                    />
                  </Form.Field>
                  <input type="submit" hidden={true} />
                </Form>
                <Segment placeholder>
                  {base64Image || formData.profilePicture ? (
                    <Image
                      fluid
                      src={base64Image ? base64Image : formData.profilePicture}
                    />
                  ) : (
                    <Header icon>
                      <Icon name="file image outline" />
                      Imagen de perfil
                    </Header>
                  )}
                  <Divider />
                  <Button
                    primary
                    onClick={() => {
                      var ref = fileRef.current;
                      if (ref !== null) {
                        ref.click();
                      }
                    }}
                  >
                    Subir Imagen
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={handleImageChange}
                  />
                </Segment>
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
          content={initialData ? "Editar" : "Crear"}
          labelPosition="right"
          icon="checkmark"
          positive
          type="submit"
          onClick={handleSubmit}
          loading={submitted}
        />
      </Modal.Actions>
    </Modal>
  );
};

export const CreateUserModal: React.FC<ICreateUserModal> = (props) => (
  <UserProvider>
    <_CreateUserModal {...props} />
  </UserProvider>
);
