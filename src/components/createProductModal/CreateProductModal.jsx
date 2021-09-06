import { useState } from "react"
import { Button, Modal, Form } from 'semantic-ui-react'

export const CreateProductModal = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData ? initialData : { name: "", cost: "" })
    const handleSubmit = () => {
        if (formData.name != "" && formData.cost != null)
            onSubmit(formData)
    }

    const handleChange = (value, tag) => {
        setFormData({ ...formData, [tag]: value })
    }

    return (
        <Modal
            onClose={onClose}
            open
        >
            <Modal.Header>{initialData ? "Edición de producto" : "Creación de producto"}</Modal.Header>
            <Modal.Content image>
                <Form onSubmit={handleSubmit}>

                    <Form.Field inline>
                        <label>Nombre</label>
                        <input placeholder='Nombre del producto'
                            value={formData.name}
                            onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>$</label>
                        <input placeholder='Valor' type="number"
                            value={formData.cost}
                            onChange={(v) => handleChange(v.currentTarget.value, "cost")} />
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