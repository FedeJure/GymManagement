import { ChangeEvent, useRef, useState } from "react"
import { Button, Modal, Form, Grid, Divider, Segment, Icon, Header, Image, Dropdown } from 'semantic-ui-react'
import { Product } from "../../modules/product/Product"
import { User } from "../../modules/users/User"
import { UserPayload } from "../../modules/users/UserPayload"
import { UserType } from "../../modules/users/UserType"
import { ProductCard } from "../productCard/ProductCard"

const defaultDate = new Date(0)

export const CreateUserModal = ({ products, users, onClose, onSubmit, initialData }:
    { products: Product[], users: User[], onClose: any, onSubmit: any, initialData?: User | null }) => {
    const allowedTypes = ["image/png", "image/jpeg"]
    const fileRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState<UserPayload>(
        initialData ?
            initialData :
            {
                name: "",
                lastname: "",
                birthDate: defaultDate,
                address: "",
                contactEmail: "",
                comment: "",
                contactPhone: "",
                brothers: [],
                productsSubscribed: [],
                profilePicture: "",
                type: UserType.STUDENT,
                dni: ""
            })
    const handleSubmit = () => {
        if (formData.name !== "" &&
            formData.lastname !== "" &&
            formData.address !== "" &&
            formData.contactEmail !== "" &&
            formData.contactPhone !== "" &&
            formData.birthDate !== defaultDate)
            onSubmit(formData)
        console.log(formData)
    }

    const handleChange = (value: any, tag: string) => {
        console.log(value)
        setFormData({ ...formData, [tag]: value })
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files) return
        const file = files[0]
        if (!file) return
        if (!allowedTypes.includes(file.type)) {
            event.currentTarget.value = ""
            return
        }
        const reader = new FileReader()
        reader.addEventListener("load", function () {
            setFormData({ ...formData, profilePicture: reader.result as string });
        }, false);
        reader.readAsDataURL(file)
    }

    return (
        <Modal
            onClose={onClose}
            open
        >
            <Modal.Header>{initialData ? "Edición de persona" : "Creación de persona"}</Modal.Header>
            <Modal.Content>
                <Segment placeholder>
                    <Grid columns={2} stackable>
                        <Divider vertical />
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle'>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Field>
                                        <label>Tipo</label>
                                        <Dropdown fluid selection
                                            value={formData.type}
                                            options={[UserType.ADMIN, UserType.STUDENT, UserType.TRAINER].map(t =>
                                            ({
                                                key: t,
                                                text: t,
                                                value: t
                                            }))}
                                            onChange={(e, data) => handleChange(data.value, "type")} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Nombre</label>
                                        <input placeholder=''
                                            value={formData.name}
                                            onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Apellido</label>
                                        <input placeholder=''
                                            value={formData.lastname}
                                            onChange={(v) => handleChange(v.currentTarget.value, "lastname")} />
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Documento (DNI)</label>
                                        <input placeholder=''
                                            value={formData.dni}
                                            onChange={(v) => handleChange(v.currentTarget.value, "dni")} />
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Fecha de nacimiento</label>
                                        <input placeholder=''
                                            type="date"
                                            value={formData.birthDate && formData.birthDate !== defaultDate ? formData.birthDate.toISOString().split("T")[0] : ""}
                                            onChange={(v) => handleChange(new Date(v.currentTarget.value), "birthDate")} />
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Teléfono de contacto</label>
                                        <input placeholder=''
                                            value={formData.contactPhone}
                                            onChange={(v) => handleChange(v.currentTarget.value, "contactPhone")} />
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Email de contacto</label>
                                        <input placeholder=''
                                            value={formData.contactEmail}
                                            onChange={(v) => handleChange(v.currentTarget.value, "contactEmail")} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Domicilio</label>
                                        <input placeholder=''
                                            value={formData.address}
                                            onChange={(v) => handleChange(v.currentTarget.value, "address")} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Comentario</label>
                                        <textarea placeholder=''
                                            value={formData.comment}
                                            onChange={(v) => handleChange(v.currentTarget.value, "comment")} />
                                    </Form.Field>
                                    <button type="submit" hidden={true} />
                                </Form>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment placeholder>
                                    {formData.profilePicture ? <Image fluid src={formData.profilePicture} /> :
                                        <Header icon>
                                            <Icon name="file image outline" />
                                            Imagen de perfil
                                        </Header>}
                                    <Divider />
                                    <Button primary onClick={() => {
                                        var ref = fileRef.current
                                        if (ref !== null) {
                                            ref.click()
                                        }
                                    }}>Subir Imagen</Button>
                                    <input ref={fileRef} type="file" hidden onChange={handleImageChange} />
                                </Segment>
                                <Form.Field>
                                    <label>Hermanos</label>
                                    <Dropdown fluid selection
                                        multiple
                                        value={formData.brothers}
                                        onChange={(e, data) => handleChange(data.value, "brothers")}
                                        options={users.map(p => ({
                                            key: p.name,
                                            text: `${p.lastname}, ${p.name}, ${p.dni}`,
                                            value: p.id
                                        }))} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Suscripciones</label>
                                    <Dropdown fluid selection
                                        multiple
                                        value={formData.productsSubscribed}
                                        onChange={(e, data) => handleChange(data.value, "productsSubscribed")}
                                        options={products.map(p => ({
                                            key: p.name,
                                            text: p.name,
                                            content: <ProductCard product={p} interactable={false} />,
                                            value: p.id
                                        }))} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    content={initialData ? "Editar" : "Crear"}
                    labelPosition='right'
                    icon='checkmark'
                    positive
                    type="submit"
                    onClick={handleSubmit}
                />
            </Modal.Actions>

        </Modal>
    )
}