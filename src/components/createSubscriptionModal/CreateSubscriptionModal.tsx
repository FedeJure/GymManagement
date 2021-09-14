import { useState } from "react"
import { Button, Modal, Form, Grid, Divider, Segment, Dropdown } from 'semantic-ui-react'
import { User } from "../../modules/users/User"
import { SubscriptionPayload } from "../../modules/subscription/SubscriptionPayload"
import { fetchProducts, fetchUsers } from "../../services/api"
import { Product } from "../../modules/product/Product"

const defaultDate = new Date(0)

export const CreateSubscriptionModal = ({ onClose, onSubmit }:
    { onClose: any, onSubmit: any }) => {
    const [users, setUsers] = useState<User[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [formData, setFormData] = useState<SubscriptionPayload>(
        {
            userId: "",
            productId: "",
            initialTime: defaultDate,
            endTime: undefined,
            comment: ""
        }
    )

    const handleSubmit = () => {
        if (formData.productId.length > 0
            && formData.userId.length > 0)
            onSubmit(formData)
    }

    const handleChange = (value: any, tag: string) => {
        setFormData({ ...formData, [tag]: value })
    }

    const handleUserSearch = (value: string) => {
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

    const handleProductSearch = (value: string) => {
        const query = value.trim()
        if (query.length <= 0) return

        fetchProducts({
            page: 0,
            step: 1000,
            filterByContent: [query]
        })
            .then(products => {
                setProducts(products)
            })
    }

    return (
        <Modal
            onClose={onClose}
            open
        >
            <Modal.Header>{"Creación de suscripción"}</Modal.Header>
            <Modal.Content>
                <Segment placeholder>
                    <Grid columns={2} stackable>
                        <Divider vertical />
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle'>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Field >
                                        <label>Fecha de inicio de suscripción</label>
                                        <input placeholder=''
                                            type="date"
                                            value={formData.initialTime !== defaultDate ? formData.initialTime.toISOString().split("T")[0] : ""}
                                            onChange={(v) => handleChange(new Date(v.currentTarget.value), "initialTime")} />
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Fecha de finalizacion de suscripción (Opcional)</label>
                                        <input placeholder=''
                                            type="date"
                                            value={formData.endTime && formData.endTime !== defaultDate ? formData.endTime.toISOString().split("T")[0] : ""}
                                            onChange={(v) => handleChange(new Date(v.currentTarget.value), "endTime")} />
                                    </Form.Field>

                                    <button type="submit" hidden={true} />
                                </Form>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Usuario</label>
                                    <Dropdown
                                        fluid
                                        selection
                                        search
                                        onSearchChange={(_, value) => handleUserSearch(value.searchQuery)}
                                        onChange={(e, data) => handleChange(data.value, "userId")}
                                        options={[...users].map(p => ({
                                            key: p.name,
                                            text: `${p.lastname}, ${p.name}, ${p.dni}`,
                                            value: p.id
                                        }))} />
                                </Form.Field>

                                <Form.Field>
                                    <label>Producto</label>
                                    <Dropdown
                                        fluid
                                        selection
                                        search
                                        onSearchChange={(_, value) => handleProductSearch(value.searchQuery)}
                                        onChange={(e, data) => handleChange(data.value, "productId")}
                                        options={[...products].map(p => ({
                                            key: p.name,
                                            text: `${p.name},$${p.price} ${p.payType}(${p.daysInWeek.map(d => d.slice(0,2)).join(', ')})`,
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
                    content={"Crear"}
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