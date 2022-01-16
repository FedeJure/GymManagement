import { MouseEventHandler, useState } from "react"
import { Button, Modal, Form, Dropdown, Input, Grid } from 'semantic-ui-react'
import { PayType } from "../../domain/product/PayType"
import { ProductPayload } from "../../domain/product/ProductPayload"
import { Weekdays } from "./Weekdays"


export const CreateProductModal = ({ onClose, onSubmit, initialData }:
    { onClose: MouseEventHandler, onSubmit: (data: ProductPayload) => void, initialData?: ProductPayload | null }) => {
    const [formData, setFormData] = useState<ProductPayload>(initialData
        ? initialData
        : {
            name: "",
            price: 0,
            twoSubscriptionsDiscount: 20,
            threeSubscriptionsDiscount: 20,
            fourSubscriptionsDiscount: 20,
            fiveOrMoreSubscriptionsDiscount: 20,
            payType: PayType.MONTHLY,
            daysInWeek: [],
            ownerIds: []
        })
    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = () => {
        setSubmitted(true)
        if (formData.name !== ""
            && formData.price > 0
            && formData.daysInWeek.length > 0)
            onSubmit(formData)
    }

    const handleChange = (value: any, tag: string) => {
        setFormData({ ...formData, [tag]: value })
    }

    const handleDiscountChange = (value: string, key: string) => {
        if (value === "") {
            setFormData(form => ({ ...form, [key]: 0 }))
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
                <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle'>
                                <Form.Field inline
                                    error={submitted && formData.name.length == 0 ? {
                                        content: 'Ingresar Nombre',
                                        pointing: 'below',
                                    } : false}>
                                    <label>Nombre</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(v) => handleChange(v.currentTarget.value, "name")} />
                                </Form.Field>
                                <Form.Field inline
                                    error={submitted && formData.price <= 0 ? {
                                        content: 'Ingresar Nombre',
                                        pointing: 'below',
                                    } : false}>
                                    <label>Precio Base</label>
                                    <Input type="number"
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
                                <Form.Field
                                    error={submitted && formData.daysInWeek.length == 0 ? {
                                        content: 'Ingresar Dias',
                                        pointing: 'below',
                                    } : false}
                                >
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
                                <label>Importante: Los siguientes descuentos se refiere a la cantidad total de actividades entre todos los familiares (Ej: Si un alumno tiene 1 actividad y su hermano tiene 2 actividades, el descuento seria por 3 actividades)</label>
                                <Form.Field>
                                    <label>Por 2 actividades</label>
                                    <Input label="%" labelPosition="right" type="number"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "twoSubscriptionsDiscount")}
                                            value={formData.twoSubscriptionsDiscount} />} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Por 3 actividades</label>
                                    <Input label="%" labelPosition="right"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "threeSubscriptionsDiscount")}
                                            value={formData.threeSubscriptionsDiscount} />} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Por 4 actividades</label>
                                    <Input label="%" labelPosition="right"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "fourSubscriptionsDiscount")}
                                            value={formData.fourSubscriptionsDiscount} />} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Por 5 actividades o más</label>
                                    <Input label="%" labelPosition="right"
                                        input={<input
                                            onChange={target => handleDiscountChange(target.currentTarget.value, "fiveOrMoreSubscriptionsDiscount")}
                                            value={formData.fiveOrMoreSubscriptionsDiscount} />} />
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