import { useState } from "react"
import { Button, Modal, Form } from 'semantic-ui-react'
import { UserPayload } from "../../modules/users/users.reducer"

const defaultDate = new Date(0)

export const CreateUserModal = ({ onClose, onSubmit, initialData }:
    { onClose: any, onSubmit: any, initialData: UserPayload }) => {
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
                productsSubscribed: []
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
        setFormData({ ...formData, [tag]: value })
    }

    return (
        <Modal
            onClose={onClose}
            open
        >
            <Modal.Header>{initialData ? "Edición de persona" : "Creación de persona"}</Modal.Header>
            <Modal.Content image>
                <Form onSubmit={handleSubmit}>

                    <Form.Field inline>
                        <label>Nombre</label>
                        <input placeholder=''
                            value={formData.name}
                            onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Apellido</label>
                        <input placeholder=''
                            value={formData.lastname}
                            onChange={(v) => handleChange(v.currentTarget.value, "lastname")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Fecha de nacimiento</label>
                        <input placeholder=''
                            type="date"
                            value={formData.birthDate && formData.birthDate !== defaultDate ? formData.birthDate.toISOString().split("T")[0] : ""}
                            onChange={(v) => handleChange(new Date(v.currentTarget.value), "birthDate")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Teléfono de contacto</label>
                        <input placeholder=''
                            value={formData.contactPhone}
                            onChange={(v) => handleChange(v.currentTarget.value, "contactPhone")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Email de contacto</label>
                        <input placeholder=''
                            value={formData.contactEmail}
                            onChange={(v) => handleChange(v.currentTarget.value, "contactEmail")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Domicilio</label>
                        <input placeholder=''
                            value={formData.address}
                            onChange={(v) => handleChange(v.currentTarget.value, "address")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Comentario</label>
                        <textarea placeholder=''
                            value={formData.comment}
                            onChange={(v) => handleChange(v.currentTarget.value, "comment")} />
                    </Form.Field>
                    <button type="submit" hidden={true} />
                </Form>
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