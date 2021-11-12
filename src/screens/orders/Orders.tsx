import { connect } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { List, Grid, Container } from 'semantic-ui-react'
import { StoreState } from '../../store'
import { Order } from '../../modules/order/Order'
import { InfiniteScroll } from '../../components/infiniteScroll/InfiniteScroll'
import { FilterInput } from '../../components/filterInput/FilterInput'
import { ConfirmationModal } from '../../components/confirmationModal/ConfirmationModal'
import { getOrdersAction } from "../../modules/order/order.actions"
import { OrderStateEnum } from '../../modules/order/OrderStateEnum'
import { OrderCard } from "../../components/orderCard/OrderCard"
import { cancelOrder } from "../../services/api/orderApi"

const Orders = ({ orders, fetchOrders }:
    { orders: Order[], fetchOrders: Function }) => {
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState<string[]>([])
    const [tagFilter, setTagFilter] = useState({ cancelled: false, completed: undefined })
    const [confirmModal, setConfirmModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const handleDelete = () => {
        if (!selectedOrder) return setConfirmModal(false)
        console.log(selectedOrder)
        cancelOrder(selectedOrder.id)
            .then(() => {
                setConfirmModal(false)
                setPage(0)
                fetchOrders({
                    page: 0,
                    append: false,
                    contentFilter: filter,
                    cancelled: tagFilter.cancelled,
                    completed: tagFilter.completed
                })
            })
            .catch(err => {
                setConfirmModal(false)
            })

    }

    const handleTagFilterChange = useCallback((filters: string[]) => {
        let newFilter: { cancelled: any, completed: any } = { cancelled: undefined, completed: undefined }
        filters.forEach(f => {
            if (f === OrderStateEnum.CANCELLED) newFilter.cancelled = true;
            if (f === OrderStateEnum.COMPLETE) newFilter.completed = true;
            if (f === OrderStateEnum.INCOMPLETE) newFilter.completed = false;
            if (f === OrderStateEnum.AVAILABLE) newFilter.cancelled = false;
        })
        setTagFilter(newFilter)
    }, [])

    useEffect(() => {
        fetchOrders({
            page: 0,
            append: false,
            contentFilter: filter,
            cancelled: tagFilter.cancelled,
            completed: tagFilter.completed
        })
    }, [])

    useEffect(() => {
        if (page > 0)
            fetchOrders({
                page,
                append: true,
                contentFilter: filter,
                cancelled: tagFilter.cancelled,
                completed: tagFilter.completed
            })
    }, [page, filter, tagFilter])

    useEffect(() => {
        fetchOrders({
            page: 0,
            append: false,
            contentFilter: filter,
            cancelled: tagFilter.cancelled,
            completed: tagFilter.completed
        })
        setPage(0)
    }, [filter, tagFilter])
    return (<div>
        {confirmModal && <ConfirmationModal
            open={confirmModal}
            onCancel={() => setConfirmModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma cancelación? Esta acción no puede deshacerse." />}

        <Container>
            <Grid verticalAlign="middle" style={{ width: "100%" }}>
                <Grid.Row columns="equal">
                    <Grid.Column textAlign="left">
                        <h3>Ordenes de pago</h3>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>

        <FilterInput
            defaultTagFilters={[OrderStateEnum.AVAILABLE]}
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
                },
                {
                    key: OrderStateEnum.CANCELLED,
                    text: OrderStateEnum.CANCELLED,
                    value: OrderStateEnum.CANCELLED,
                    label: { color: 'black', empty: true, circular: true }
                },
                {
                    key: OrderStateEnum.AVAILABLE,
                    text: OrderStateEnum.AVAILABLE,
                    value: OrderStateEnum.AVAILABLE,
                    label: { color: 'yellow', empty: true, circular: true }
                }

            ]}
            onUserTypeFilterChange={(f: string[]) => { handleTagFilterChange(f) }}
            onCustomChange={(f: string[]) => {
                setPage(0)
                setFilter(f)
            }}
        />
        <List verticalAlign="middle" style={{ height: "30vh", width: "100%", overflowY: "auto" }}>
            <InfiniteScroll
                as={List.Item}
                onLoadMore={() => setPage(page => page + 1)}
                data={orders.map(s => <OrderCard 
                    key={s.id}
                    handleCancel={() => {
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
        fetchOrders: ({ page, contentFilter, append, cancelled, completed }:
            { page: number, contentFilter: string[], append: boolean, cancelled?: boolean, completed?: boolean }) => getOrdersAction({ page, contentFilter, append, cancelled, completed })(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders)