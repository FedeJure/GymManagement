import { MouseEventHandler, useState } from "react"
import { Button, Modal, Form } from 'semantic-ui-react'
import { ProductPayload } from "../../modules/product/product.reducer"

export const CreateProductModal = ({ onClose, onSubmit, initialData }:
    { onClose: MouseEventHandler, onSubmit: (data: ProductPayload) => void, initialData?: ProductPayload }) => {
    const [formData, setFormData] = useState<ProductPayload>(initialData ? initialData : { name: "", cost: 0 })
    const handleSubmit = () => {
        if (formData.name != "" && formData.cost != null)
            onSubmit(formData)
    }

    const handleChange = (value: any, tag: string) => {
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