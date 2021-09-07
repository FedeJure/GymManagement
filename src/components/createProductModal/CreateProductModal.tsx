import { MouseEventHandler, useState } from "react"
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import { PayType } from "../../modules/product/PayType"
import { ProductPayload } from "../../modules/product/ProductPayload"

export const CreateProductModal = ({ onClose, onSubmit, initialData }:
    { onClose: MouseEventHandler, onSubmit: (data: ProductPayload) => void, initialData?: ProductPayload }) => {
    const [formData, setFormData] = useState<ProductPayload>(initialData
        ? initialData
        : {
            name: "",
            price: 0,
            payType: PayType.MONTHLY
        })
    const handleSubmit = () => {
        if (formData.name != "" && formData.price != null)
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
                            value={formData.price}
                            onChange={(v) => handleChange(v.currentTarget.value, "price")} />
                    </Form.Field>
                    <Form.Field>
                        <label>Tipo de cobro</label>
                        <Dropdown fluid selection
                            value={formData.payType}
                            options={[PayType.MONTHLY, PayType.PER_CLASS].map(t =>
                            ({
                                key: t,
                                text: t,
                                value: t,
                                onClick: () => handleChange(t, "payType")
                            }))} />
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