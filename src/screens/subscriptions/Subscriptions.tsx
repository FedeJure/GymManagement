import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { Button, List, Grid, Container } from 'semantic-ui-react'
import { StoreState } from '../../store'
import { CreateSubscriptionModal } from "../../components/createSubscriptionModal/CreateSubscriptionModal"
import { SubscriptionPayload } from '../../modules/subscription/SubscriptionPayload'
import { createSubscriptionAction, deleteSubscriptionAction, fetchSubscriptionsAction } from '../../modules/subscription/subscription.actions'
import { Subscription } from '../../modules/subscription/Subscription'
import { SubscriptionCard } from "../../components/subscriptionCard/SubscriptionCard"
import { PayState } from "../../modules/subscription/PayState"
import { InfiniteScroll } from '../../components/infiniteScroll/InfiniteScroll'
import { FilterInput } from '../../components/filterInput/FilterInput'
import { ConfirmationModal } from '../../components/confirmationModal/ConfirmationModal'
import Orders from "../orders/Orders"
import { createOrderAction } from '../../modules/order/order.actions'
import { SubscriptionDetailModal } from '../../components/SubscriptionDetailModal'

const Subscriptions = ({ subscriptions, createSubscription, fetchSubscriptions, deleteSubscription, createOrder }:
    { subscriptions: Subscription[], createSubscription: Function, fetchSubscriptions: Function, deleteSubscription: Function, createOrder: Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState<string[]>([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [detailModal, setDetailModal] = useState(false)
    const [confirmOrderModal, setConfirmOrderModal] = useState(false)
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

    const handleSubmit = (data: SubscriptionPayload) => {
        createSubscription(data)
        setCreationModalOpen(false)
    }

    const handleDelete = () => {
        setConfirmModal(false)
        deleteSubscription(selectedSubscription)
    }

    const handleCreateOrder = () => {
        if (!selectedSubscription) return
        createOrder(selectedSubscription.id)
    }

    useEffect(() => {
        fetchSubscriptions({
            page: 0,
            append: false
        })
    }, [fetchSubscriptions])

    useEffect(() => {
        if (page > 0)
            fetchSubscriptions({
                page,
                append: true,
                filterByContent: filter
            })
    }, [page, fetchSubscriptions, filter])

    useEffect(() => {
        fetchSubscriptions({
            page: 0,
            append: false,
            filterByContent: filter
        })
        setPage(0)
    }, [filter, fetchSubscriptions])

    const SubscriptionSection = <>
        <Container>
            <Grid columns="equal" verticalAlign="middle" style={{ width: "100%" }}>
                <Grid.Row >
                    <Grid.Column textAlign="left">
                        <h2>Subscripciones</h2>
                    </Grid.Column>
                    <Grid.Column floated="right">
                        <h4>Crear nueva <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} /></h4>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>

        <FilterInput
            tagOptions={[
                {
                    key: PayState.DEBT,
                    text: PayState.DEBT,
                    value: PayState.DEBT,
                    label: { color: 'orange', empty: true, circular: true }
                },
                {
                    key: PayState.ON_DAY,
                    text: PayState.ON_DAY,
                    value: PayState.ON_DAY,
                    label: { color: 'green', empty: true, circular: true }
                }
            ]}
            onUserTypeFilterChange={(f: string[]) => { }}
            onCustomChange={(f: string[]) => {
                setPage(0)
                setFilter(fi => f)
            }}
        />
        <List verticalAlign="middle" style={{ height: "30vh", width: "100%", overflowY: "auto" }}>
            <InfiniteScroll
                as={List.Item}
                onLoadMore={() => setPage(page => page + 1)}
                data={subscriptions.map(s =>
                    <SubscriptionCard
                        key={s.id} handleDelete={() => {
                            setSelectedSubscription(s)
                            setConfirmModal(true)
                        }} subscription={s}
                        handleCreateOrder={() => {
                            setSelectedSubscription(s)
                            setConfirmOrderModal(true)
                        }}
                        handleDetails={() => {
                            setSelectedSubscription(s)
                            setDetailModal(true)

                        }} />)} />
        </List></>

    return (<div>
        {confirmModal && <ConfirmationModal
            open={confirmModal}
            onCancel={() => setConfirmModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma eliminación? Esta acción no puede deshacerse." />}
        {confirmOrderModal && <ConfirmationModal
            open={confirmOrderModal}
            onCancel={() => setConfirmOrderModal(false)}
            onAccept={() => {
                setConfirmOrderModal(false)
                handleCreateOrder()
            }}
            message={<><h2>Crear orden de cobro?</h2><br/> Tenga en cuenta que las ordenes de cobro son generadas automaticamente cuando es requerido</>} />}
        {creationModalOpen && <CreateSubscriptionModal onClose={() => setCreationModalOpen(false)}
            onSubmit={handleSubmit} />}
        {detailModal && selectedSubscription && <SubscriptionDetailModal
            subscription={selectedSubscription}
            onClose={() => setDetailModal(false)} />}

        <Grid celled="internally" divided='vertically' style={{ width: "100%" }}>
            <Grid.Row columns={1}>
                {SubscriptionSection}
            </Grid.Row>

            <Grid.Row columns={1}>
                <Grid.Column>
                    <Orders />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </div>)
}


const mapStateToProps = (state: StoreState) => {
    return {
        subscriptions: state.subscription.subscriptions
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        deleteSubscription: (subscription: Subscription) => deleteSubscriptionAction(subscription)(dispatch),
        createSubscription: (data: SubscriptionPayload) => createSubscriptionAction(data)(dispatch),
        fetchSubscriptions: ({ page, filterByContent, append }:
            { page: number, filterByContent: string[], append: boolean }) => fetchSubscriptionsAction({ page, filterByContent, append })(dispatch),
        createOrder: (subscriptionId: string) => createOrderAction(subscriptionId)(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions)