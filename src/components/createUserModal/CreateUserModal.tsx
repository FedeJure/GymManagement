import {
  ChangeEvent,
  forwardRef,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Wrap,
  WrapItem,
  Select as ChakraSelect,
  FormControl,
  VStack,
  Input,
  Textarea,
  Box,
  FormLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Image,
  Heading,
  Divider,
  Icon,
  Center,
} from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { User } from "../../domain/users/User";
import { UserPayload } from "../../domain/users/UserPayload";
import { UserType } from "../../domain/users/UserType";
import { UserProvider, useUsers } from "../../hooks/useUsers";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchUsers } from "../../services/api";
import { Header } from "semantic-ui-react";

const defaultDate = new Date(0);
type Option = {
  value: string;
  label: string;
};
interface ICreateUserModal {
  onClose: () => void;
  onSubmit: (
    userPayload: UserPayload,
    image: File | undefined
  ) => Promise<void>;
  initialData?: User;
  open: boolean;
}

export const _CreateUserModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: ICreateUserModal) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
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

  useEffect(() => {
    setFormData({
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
  }, [initialData]);

  const [formData, setFormData] = useState<UserPayload>({
    name: "",
    lastname: "",
    birthDate: defaultDate,
    address: "",
    contactEmail: "",
    comment: "",
    contactPhone: "",
    familiarIds: [],
    profilePicture: "",
    type: UserType.STUDENT,
    dni: "",
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

  const CustomDatepickerInput = forwardRef(
    ({ value, onClick }: any, ref: LegacyRef<HTMLInputElement>) => (
      <Input value={value} onClick={onClick} ref={ref}></Input>
    )
  );

  const loadFamiliarOptions = (
    inputValue: string,
    callback: (options: Option[]) => void
  ) => {
    setFilterByContent([inputValue]);
    fetchUsers({ page: 0, step: 10, filterByContent: [inputValue] }).then(
      (users) => {
        callback(
          users
            .filter((user) => user.id !== initialData?.id)
            .map((u) => ({
              value: u.id,
              label: `${u.lastname}, ${u.name}, ${u.dni}`,
            }))
        );
      }
    );
  };
  return open ? (
    <Modal size={"3xl"} isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialData ? "Edición de persona" : "Creación de persona"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap justify={"center"}>
            <WrapItem
              flexDirection={"column"}
              width={{ base: "full", md: "auto" }}
            >
              <VStack width={{ base: "full", md: "auto" }}>
                <FormControl>
                  <FormLabel>Tipo de usuario</FormLabel>
                  <ChakraSelect
                    value={formData.type}
                    placeholder="Tipo de usuario"
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "type")
                    }
                  >
                    {[UserType.ADMIN, UserType.STUDENT, UserType.TRAINER].map(
                      (type) => (
                        <option value={type}>{type}</option>
                      )
                    )}
                  </ChakraSelect>
                </FormControl>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "name")
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    placeholder="Apellido"
                    value={formData.lastname}
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "lastname")
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Dni</FormLabel>
                  <Input
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={(e) => handleChange(e.currentTarget.value, "dni")}
                  />
                </FormControl>
                <FormControl zIndex={1} flexDirection={"row"}>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <DatePicker
                    popperPlacement="top-end"
                    showYearDropdown
                    withPortal
                    customInput={<CustomDatepickerInput />}
                    selected={
                      formData.birthDate === defaultDate
                        ? undefined
                        : formData.birthDate
                    }
                    onChange={(date: Date) => handleChange(date, "birthDate")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Telefono de contacto</FormLabel>
                  <Input
                    placeholder="Telefono"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "contactPhone")
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "contactEmail")
                    }
                  />
                </FormControl>
              </VStack>
            </WrapItem>
            <WrapItem
              flexDirection={"column"}
              width={{ base: "full", md: "auto" }}
            >
              <VStack width={{ base: "full", md: "auto" }}>
                <FormControl>
                  <FormLabel>Direccion fisica</FormLabel>
                  <Input
                    placeholder="Direccion"
                    value={formData.address}
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "address")
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Comentario</FormLabel>
                  <Textarea
                    placeholder="Comentario"
                    value={formData.comment}
                    onChange={(e) =>
                      handleChange(e.currentTarget.value, "comment")
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Familiares</FormLabel>
                  <AsyncSelect
                    isMulti
                    options={familiars.map((f, i) => ({
                      value: f.id,
                      label: `${f.lastname}, ${f.name}, ${f.dni}`,
                    }))}
                    onChange={(newValue) => {
                      handleChange(
                        newValue.map((f) => f.value),
                        "familiarIds"
                      );
                    }}
                    loadOptions={loadFamiliarOptions}
                    isSearchable
                    defaultValue={
                      initialData
                        ? initialData.familiars.map((f) => ({
                            value: f.id,
                            label: `${f.lastname}, ${f.name}, ${f.dni}`,
                          }))
                        : []
                    }
                  />
                </FormControl>
                <FormControl>
                  <Center>
                    <Box maxW={"25em"}>
                      {base64Image || formData.profilePicture ? (
                        <Center>
                          <Image
                            src={
                              base64Image
                                ? base64Image
                                : formData.profilePicture
                            }
                          />{" "}
                        </Center>
                      ) : (
                        <Heading>
                          <Icon name="file image outline" />
                          Imagen de perfil
                        </Heading>
                      )}
                      <Divider />
                      <Center>
                        <Button
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
                      </Center>
                    </Box>
                  </Center>
                </FormControl>
              </VStack>
            </WrapItem>
          </Wrap>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {initialData ? "Editar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : (
    <></>
  );

  // return (
  //   <Modal onClose={onClose} open>
  //     <Modal.Header>
  //       {initialData ? "Edición de persona" : "Creación de persona"}
  //     </Modal.Header>
  //     <Modal.Content>
  //       <Segment placeholder>
  //         <Grid columns={2} stackable>
  //           <Divider vertical />
  //           <Grid.Row>
  //             <Grid.Column verticalAlign="middle">
  //               <Form onSubmit={handleSubmit}>
  //                 <Form.Field>
  //                   <label>Tipo</label>
  //                   <Dropdown
  //                     fluid
  //                     selection
  //                     value={formData.type}
  //                     options={[
  //                       UserType.ADMIN,
  //                       UserType.STUDENT,
  //                       UserType.TRAINER,
  //                     ].map((t) => ({
  //                       key: t,
  //                       text: t,
  //                       value: t,
  //                     }))}
  //                     onChange={(e, data) => handleChange(data.value, "type")}
  //                   />
  //                 </Form.Field>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.name.length === 0
  //                       ? {
  //                           content: "Ingresar Nombre",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Nombre</label>
  //                   <input
  //                     placeholder=""
  //                     value={formData.name}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "name")
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.lastname.length === 0
  //                       ? {
  //                           content: "Ingresar Apellido",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Apellido</label>
  //                   <input
  //                     placeholder=""
  //                     value={formData.lastname}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "lastname")
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.dni.length === 0
  //                       ? {
  //                           content: "Ingresar Documento",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Documento (DNI)</label>
  //                   <input
  //                     placeholder=""
  //                     value={formData.dni}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "dni")
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.birthDate === defaultDate
  //                       ? {
  //                           content: "Ingresar Fecha de nacimiento",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Fecha de nacimiento</label>
  //                   <input
  //                     placeholder=""
  //                     type="date"
  //                     value={
  //                       formData.birthDate && formData.birthDate !== defaultDate
  //                         ? formData.birthDate.toISOString().split("T")[0]
  //                         : ""
  //                     }
  //                     onChange={(v) =>
  //                       handleChange(
  //                         new Date(v.currentTarget.value),
  //                         "birthDate"
  //                       )
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.contactPhone.length === 0
  //                       ? {
  //                           content: "Ingresar Telefono",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Teléfono de contacto</label>
  //                   <input
  //                     placeholder=""
  //                     value={formData.contactPhone}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "contactPhone")
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.contactEmail.length === 0
  //                       ? {
  //                           content: "Ingresar Email",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Email de contacto</label>
  //                   <input
  //                     placeholder=""
  //                     value={formData.contactEmail}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "contactEmail")
  //                     }
  //                   />
  //                 </Form.Field>

  //                 <input type="submit" hidden={true} />
  //               </Form>
  //             </Grid.Column>
  //             <Grid.Column>
  //               <Form onSubmit={handleSubmit}>
  //                 <Form.Field
  //                   error={
  //                     submitted && formData.address.length === 0
  //                       ? {
  //                           content: "Ingresar Direccion",
  //                           pointing: "below",
  //                         }
  //                       : false
  //                   }
  //                 >
  //                   <label>Domicilio</label>
  //                   <input
  //                     placeholder=""
  //                     value={formData.address}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "address")
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field>
  //                   <label>Comentario</label>
  //                   <TextArea
  //                     placeholder=""
  //                     value={formData.comment}
  //                     onChange={(v) =>
  //                       handleChange(v.currentTarget.value, "comment")
  //                     }
  //                   />
  //                 </Form.Field>
  //                 <Form.Field>
  //                   <label>Hermanos</label>
  //                   <Dropdown
  //                     fluid
  //                     selection
  //                     search
  //                     onSearchChange={(_, value) => {
  //                       if (value.searchQuery.length > 0)
  //                         setFilterByContent([value.searchQuery]);
  //                     }}
  //                     multiple
  //                     defaultValue={
  //                       initialData
  //                         ? initialData.familiars.map((u) => u.id)
  //                         : []
  //                     }
  //                     onChange={(e, data) =>
  //                       handleChange(data.value, "familiarIds")
  //                     }
  //                     options={[...familiars]
  //                       .filter((user) => user.id !== initialData?.id)
  //                       .map((p) => ({
  //                         key: p.name,
  //                         text: `${p.lastname}, ${p.name}, ${p.dni}`,
  //                         value: p.id,
  //                       }))}
  //                   />
  //                 </Form.Field>
  //                 <input type="submit" hidden={true} />
  //               </Form>
  //               <Segment placeholder>
  //                 {base64Image || formData.profilePicture ? (
  //                   <Image
  //                     fluid
  //                     src={base64Image ? base64Image : formData.profilePicture}
  //                   />
  //                 ) : (
  //                   <Header icon>
  //                     <Icon name="file image outline" />
  //                     Imagen de perfil
  //                   </Header>
  //                 )}
  //                 <Divider />
  //                 <Button
  //                   primary
  //                   onClick={() => {
  //                     var ref = fileRef.current;
  //                     if (ref !== null) {
  //                       ref.click();
  //                     }
  //                   }}
  //                 >
  //                   Subir Imagen
  //                 </Button>
  //                 <input
  //                   ref={fileRef}
  //                   type="file"
  //                   hidden
  //                   onChange={handleImageChange}
  //                 />
  //               </Segment>
  //             </Grid.Column>
  //           </Grid.Row>
  //         </Grid>
  //       </Segment>
  //     </Modal.Content>
  //     <Modal.Actions>
  //       <Button color="black" onClick={onClose}>
  //         Cancelar
  //       </Button>
  //       <Button
  //         content={initialData ? "Editar" : "Crear"}
  //         labelPosition="right"
  //         icon="checkmark"
  //         positive
  //         type="submit"
  //         onClick={handleSubmit}
  //         loading={submitted}
  //       />
  //     </Modal.Actions>
  //   </Modal>
  // );
};

export const CreateUserModal: React.FC<ICreateUserModal> = (props) => (
  <UserProvider>
    <_CreateUserModal {...props} />
  </UserProvider>
);
