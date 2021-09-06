import { useState } from "react"
import { Button, Modal, Form } from 'semantic-ui-react'

export const CreateProductModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: "", price: -1 })
    const handleSubmit = () => {
        if (formData.name != "" && formData.price != -1)
            onSubmit(formData)
    }

    const handleChange = (value, tag) => {
        setFormData({ ...formData, [tag]: value })
    }
    return (
        <Modal
            onClose={() => onClose()}
            open={open}
        >

            <Modal.Header>Creación de producto</Modal.Header>
            <Modal.Content image>
                <Form onSubmit={handleSubmit}>

                    <Form.Field inline>
                        <label>Nombre</label>
                        <input placeholder='Nombre del producto'
                            onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                    </Form.Field>
                    <Form.Field inline>
                        <label>$</label>
                        <input placeholder='Valor' type="number"
                            onChange={(v) => handleChange(v.currentTarget.value, "price")} />
                    </Form.Field>
                    <button type="submit" hidden={true} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => onClose()}>
                    Cancelar
                </Button>
                <Button
                    content="Crear"
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