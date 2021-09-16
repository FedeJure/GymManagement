import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { Button, List, Header, Grid } from 'semantic-ui-react'
import { StoreState } from '../../store'
import { OrderPayload } from '../../modules/order/OrderPayload'
import { Order } from '../../modules/order/Order'
import { InfiniteScroll } from '../../components/infiniteScroll/InfiniteScroll'
import { FilterInput } from '../../components/filterInput/FilterInput'
import { ConfirmationModal } from '../../components/confirmationModal/ConfirmationModal'
import { createOrderAction, getOrdersAction } from "../../modules/order/order.actions"
import { OrderStateEnum } from '../../modules/order/OrderStateEnum'
import { OrderCard } from "../../components/orderCard/OrderCard"

const Orders = ({ orders, createOrder, fetchOrders }:
    { orders: Order[], createOrder: Function, fetchOrders: Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState<string[]>([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const handleSubmit = (data: OrderPayload) => {
        createOrder(data)
        setCreationModalOpen(false)
    }

    const handleDelete = () => {
        setConfirmModal(false)
    }

    useEffect(() => {
        fetchOrders({
            page: 0,
            append: false
        })
    }, [])

    useEffect(() => {
        if (page > 0)
            fetchOrders({
                page,
                append: true,
                filterByContent: filter
            })
    }, [page])

    useEffect(() => {
        fetchOrders({
            page: 0,
            append: false,
            filterByContent: filter
        })
        setPage(0)
    }, [filter])

    return (<div>
        {confirmModal && <ConfirmationModal
            open={confirmModal}
            onCancel={() => setConfirmModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma eliminación? Esta acción no puede deshacerse." />}

<Grid verticalAlign="middle" style={{ width: "100%" }}>
            <Grid.Row  columns="equal">
                <Grid.Column textAlign="left">
                    <h3>Ordenes de pago</h3>
                </Grid.Column>
                <Grid.Column floated="right">
                    <h4>Crear nueva <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} /></h4>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <FilterInput
            tagOptions={[
                {
                    key: OrderStateEnum.INCOMPLETE,
                    text: OrderStateEnum.INCOMPLETE,
                    value: OrderStateEnum.INCOMPLETE,
                    label: { color: 'orange', empty: true, circular: true }
                },
                {
                    key: OrderStateEnum.COMPLETE,
                    text: OrderStateEnum.COMPLETE,
                    value: OrderStateEnum.COMPLETE,
                    label: { color: 'green', empty: true, circular: true }
                }
            ]}
            onUserTypeFilterChange={(f: string[]) => { }}
            onCustomChange={(f: string[]) => {
                setPage(0)
                setFilter(fi => f)
            }}
        />
        <List divided verticalAlign="middle" style={{ height: "30vh", width: "100%", overflowY: "auto" }}>
            <InfiniteScroll
                as={List.Item}
                onLoadMore={() => setPage(page => page + 1)}
                data={orders.map(s => <OrderCard handleCancel={() => {
                    setSelectedOrder(s)
                    setConfirmModal(true)
                }} order={s} />)} />
        </List>
    </div>)
}


const mapStateToProps = (state: StoreState) => {
    return {
        orders: state.order.orders
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        // deleteOrder: (order: Order) => deleteOrderAction(order)(dispatch),
        createOrder: (data: OrderPayload) => createOrderAction(data)(dispatch),
        fetchOrders: ({ page, filterByContent, append }:
            { page: number, filterByContent: string[], append: boolean }) => getOrdersAction({ page, filterByContent, append })(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders)