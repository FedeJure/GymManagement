import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { Button, List, Header, Grid } from 'semantic-ui-react'
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

const Subscriptions = ({ subscriptions, createSubscription, fetchSubscriptions, deleteSubscription }:
    { subscriptions: Subscription[], createSubscription: Function, fetchSubscriptions: Function, deleteSubscription: Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState<string[]>([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

    const handleSubmit = (data: SubscriptionPayload) => {
        createSubscription(data)
        setCreationModalOpen(false)
    }

    const handleDelete = () => {
        setConfirmModal(false)
        deleteSubscription(selectedSubscription)
    }

    useEffect(() => {
        fetchSubscriptions({
            page: 0,
            append: false
        })
    }, [])

    useEffect(() => {
        if (page > 0)
            fetchSubscriptions({
                page,
                append: true,
                filterByContent: filter
            })
    }, [page])

    useEffect(() => {
        fetchSubscriptions({
            page: 0,
            append: false,
            filterByContent: filter
        })
        setPage(0)
    }, [filter])

    const SubscriptionSection = <>
        <Grid.Row columns={2}>
            <Grid.Column><h3>Subscriptions</h3></Grid.Column>
            <Grid.Column><Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} /></Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
            <FilterInput
                tagOptions={[
                    {
                        key: PayState.DEBT,
                        text: PayState.DEBT,
                        value: PayState.DEBT,
                        label: { color: 'red', empty: true, circular: true }
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
        </Grid.Row>
        <List divided verticalAlign="middle" style={{ height: "30vh", width: "100%", overflowY: "auto" }}>
            <InfiniteScroll
                as={List.Item}
                onLoadMore={() => setPage(page => page + 1)}
                data={subscriptions.map(s => <SubscriptionCard handleDelete={() => {
                    setSelectedSubscription(s)
                    setConfirmModal(true)
                }} subscription={s} />)} />
        </List></>


    return (<div>
        {confirmModal && <ConfirmationModal
            open={confirmModal}
            onCancel={() => setConfirmModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma eliminación? Esta acción no puede deshacerse." />}
        {creationModalOpen && <CreateSubscriptionModal onClose={() => setCreationModalOpen(false)}
            onSubmit={handleSubmit} />}

        <Header as='h2' floated='left'>
            Suscripciones
        </Header>

        <Grid divided='vertically' style={{ width: "100%" }}>
            <Grid.Row columns={1}>
                {SubscriptionSection}
            </Grid.Row>

            <Grid.Row columns={2}>
                <Grid.Column>
                    {SubscriptionSection}
                </Grid.Column>
                <Grid.Column>
                    {SubscriptionSection}
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
            { page: number, filterByContent: string[], append: boolean }) => fetchSubscriptionsAction({ page, filterByContent, append })(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions)