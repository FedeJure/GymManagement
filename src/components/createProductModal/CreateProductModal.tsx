import { MouseEventHandler, useState } from "react"
import { Button, Modal, Form, Dropdown, Input, Grid } from 'semantic-ui-react'
import { PayType } from "../../modules/product/PayType"
import { ProductPayload } from "../../modules/product/ProductPayload"
import { Weekdays } from "./Weekdays"


export const CreateProductModal = ({ onClose, onSubmit, initialData }:
    { onClose: MouseEventHandler, onSubmit: (data: ProductPayload) => void, initialData?: ProductPayload | null }) => {
    const [formData, setFormData] = useState<ProductPayload>(initialData
        ? initialData
        : {
            name: "",
            price: 0,
            oneFamiliarDiscount: 20,
            twoFamiliarDiscount: 20,
            threeFamiliarDiscount: 20,
            fourOrMoreFamiliarDiscount: 20,
            payType: PayType.MONTHLY,
            daysInWeek: []
        })
    const handleSubmit = () => {
        if (formData.name !== "" && formData.price !== null)
            onSubmit(formData)
    }

    const handleChange = (value: any, tag: string) => {
        setFormData({ ...formData, [tag]: value })
    }

    const handleDiscountChange = (value: string, key: string) => {
        if (value === "") {
            setFormData(form => ({ ...form, [key]: undefined }))
            return
        }
        const parsed = parseFloat(value) || 0
        const newValue = parsed >= 0 ? Math.min(parsed, 100) : 0
        setFormData(form => ({ ...form, [key]: newValue }))
    }

    return (
        <Modal
            onClose={onClose}
            open
        >
            <Modal.Header>{initialData ? "Edición de producto" : "Creación de producto"}</Modal.Header>
            <Modal.Content image >
                <Form onSubmit={handleSubmit} style={{width: "100%"}}>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle'>
                                <Form.Field inline>
                                    <label>Nombre</label>
                                    <Input 
                                        value={formData.name}
                                        onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Precio Base</label>
                                    <Input  type="number"
                                        label="ARS $"
                                        value={formData.price}
                                        onChange={(v) => handleChange(v.currentTarget.value, "price")} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Tipo de cobro</label>
                                    <Dropdown fluid selection
                                        value={formData.payType}
                                        options={[PayType.MONTHLY].map(t =>
                                        ({
                                            key: t,
                                            text: t,
                                            value: t
                                        }))}
                                        onChange={(e, data) => handleChange(data.value, "payType")} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Días de la semána</label>
                                    <Dropdown multiple selection fluid
                                        value={formData.daysInWeek}
                                        options={[Weekdays.Monday,
                                        Weekdays.Tuesday,
                                        Weekdays.Wednesday,
                                        Weekdays.Thursday,
                                        Weekdays.Friday,
                                        Weekdays.Saturday,
                                        Weekdays.Sunday].map(t =>
                                        ({
                                            key: t,
                                            text: t,
                                            value: t
                                        }))}
                                        onChange={(e, data) => handleChange(data.value, "daysInWeek")} />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column verticalAlign='middle'>
                                <Form.Field>
                                    <label>Descuento por 1 familiar</label>
                                    <Input label="%" labelPosition="right" type="number"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "oneFamiliarDiscount")}
                                            value={formData.oneFamiliarDiscount} />} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Descuento por 2 familiares</label>
                                    <Input label="%" labelPosition="right"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "twoFamiliarDiscount")}
                                            value={formData.twoFamiliarDiscount} />} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Descuento por 3 familiares</label>
                                    <Input label="%" labelPosition="right"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "threeFamiliarDiscount")}
                                            value={formData.threeFamiliarDiscount} />} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Descuento por 4 o mas familiares</label>
                                    <Input label="%" labelPosition="right"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "fourOrMoreFamiliarDiscount")}
                                            value={formData.fourOrMoreFamiliarDiscount} />} />
                                </Form.Field>
                                <button type="submit" hidden={true} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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