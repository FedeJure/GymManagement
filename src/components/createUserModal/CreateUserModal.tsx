import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button, Modal, Form, Grid, Divider, Segment, Icon, Header, Image, Dropdown, TextArea } from 'semantic-ui-react'
import { User } from "../../modules/users/User"
import { UserPayload } from "../../modules/users/UserPayload"
import { UserType } from "../../modules/users/UserType"
import { fetchUsers, getBrothersOfUser } from "../../services/api"

const defaultDate = new Date(0)

export const CreateUserModal = ({ onClose, onSubmit, initialData }:
    { onClose: any, onSubmit: any, initialData?: User | null }) => {
    const allowedTypes = ["image/png", "image/jpeg"]
    const fileRef = useRef<HTMLInputElement>(null)
    const [submitted, setSubmitted] = useState(false)
    const [familiars, setBrothers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])
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
                familiars: [],
                productsSubscribed: [],
                profilePicture: "",
                type: UserType.STUDENT,
                dni: ""
            })
    const handleSubmit = () => {
        setSubmitted(true)
        if (formData.name !== "" &&
            formData.lastname !== "" &&
            formData.address !== "" &&
            formData.contactEmail !== "" &&
            formData.contactPhone !== "" &&
            formData.birthDate !== defaultDate &&
            formData.dni !== "")
            onSubmit(formData)
    }

    const handleChange = (value: any, tag: string) => {
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

    const handleBrotherSearch = (value: string) => {
        const query = value.trim()
        if (query.length <= 0) return

        fetchUsers({
            page: 0,
            step: 200,
            filterByContent: [query]
        })
            .then(users => {
                setUsers(users)
            })
    }

    useEffect(() => {
        if (initialData)
            getBrothersOfUser(initialData.id)
                .then(users => setBrothers(users))
    }, [initialData])

    return (
        <Modal
            onClose={onClose}
            open
        >
            <Modal.Header>{initialData ? "Edición de persona" : "Creación de persona"}</Modal.Header>
            <Modal.Content>
                <Segment placeholder>
                    <Form onSubmit={handleSubmit}>
                        <Grid columns={2} stackable>
                            <Divider vertical />
                            <Grid.Row>
                                <Grid.Column verticalAlign='middle'>

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
                                    <Form.Field
                                        error={submitted && formData.name.length == 0 ? {
                                            content: 'Ingresar Nombre',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Nombre</label>
                                        <input placeholder=''
                                            value={formData.name}
                                            onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                                    </Form.Field>
                                    <Form.Field
                                        error={submitted && formData.lastname.length == 0 ? {
                                            content: 'Ingresar Apellido',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Apellido</label>
                                        <input placeholder=''
                                            value={formData.lastname}
                                            onChange={(v) => handleChange(v.currentTarget.value, "lastname")} />
                                    </Form.Field>
                                    <Form.Field
                                        error={submitted && formData.dni.length == 0 ? {
                                            content: 'Ingresar Documento',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Documento (DNI)</label>
                                        <input placeholder=''
                                            value={formData.dni}
                                            onChange={(v) => handleChange(v.currentTarget.value, "dni")} />
                                    </Form.Field>
                                    <Form.Field
                                        error={submitted && formData.birthDate == defaultDate ? {
                                            content: 'Ingresar Fecha de nacimiento',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Fecha de nacimiento</label>
                                        <input placeholder=''
                                            type="date"
                                            value={formData.birthDate && formData.birthDate !== defaultDate ? formData.birthDate.toISOString().split("T")[0] : ""}
                                            onChange={(v) => handleChange(new Date(v.currentTarget.value), "birthDate")} />
                                    </Form.Field>
                                    <Form.Field
                                        error={submitted && formData.contactPhone.length == 0 ? {
                                            content: 'Ingresar Telefono',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Teléfono de contacto</label>
                                        <input placeholder=''
                                            value={formData.contactPhone}
                                            onChange={(v) => handleChange(v.currentTarget.value, "contactPhone")} />
                                    </Form.Field>
                                    <Form.Field
                                        error={submitted && formData.contactEmail.length == 0 ? {
                                            content: 'Ingresar Email',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Email de contacto</label>
                                        <input placeholder=''
                                            value={formData.contactEmail}
                                            onChange={(v) => handleChange(v.currentTarget.value, "contactEmail")} />
                                    </Form.Field>

                                    <input type="submit" hidden={true} />

                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field
                                        error={submitted && formData.address.length == 0 ? {
                                            content: 'Ingresar Direccion',
                                            pointing: 'below',
                                        } : false}
                                    >
                                        <label>Domicilio</label>
                                        <input placeholder=''
                                            value={formData.address}
                                            onChange={(v) => handleChange(v.currentTarget.value, "address")} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Comentario</label>
                                        <TextArea placeholder=''
                                            value={formData.comment}
                                            onChange={(v) => handleChange(v.currentTarget.value, "comment")} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Hermanos</label>
                                        <Dropdown fluid selection
                                            search
                                            onSearchChange={(_, value) => handleBrotherSearch(value.searchQuery)}
                                            multiple
                                            value={formData.familiars || []}
                                            onChange={(e, data) => handleChange(data.value, "familiars")}
                                            options={[...familiars, ...users]
                                                .filter(user => user.id !== initialData?.id)
                                                .map(p => ({
                                                    key: p.name,
                                                    text: `${p.lastname}, ${p.name}, ${p.dni}`,
                                                    value: p.id
                                                }))} />
                                    </Form.Field><Segment placeholder>
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
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
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