import React from "react";
import { Button, Grid, GridRow, Modal, GridColumn } from "semantic-ui-react";
import { Subscription } from "../modules/subscription/Subscription";

interface ISubscriptionDetailModal {
    subscription: Subscription
    onClose: () => void
}

export const SubscriptionDetailModal: React.FC<ISubscriptionDetailModal> = ({ subscription, onClose }) => {
    return (<Modal open onClose={onClose}>
        <Modal.Header>
            Detalle de subscripcion
        </Modal.Header>
        <Modal.Content>
            <Grid columns="2" >
                <GridRow>
                    <GridColumn>Alumno: <b>{subscription.user.lastname}, {subscription.user.name}</b></GridColumn>
                    <GridColumn>Id de subscripcion: <b>{subscription.id}</b></GridColumn>
                </GridRow>

                <GridRow>
                    <GridColumn>Subscripto a <b>{subscription.product.name}</b></GridColumn></GridRow>
                <GridRow >
                    <GridColumn>Fecha de inicio <b>{subscription.initialTime.toLocaleDateString()}</b></GridColumn>
                    {subscription.endTime && <GridColumn>  Fecha de fin <b>{subscription.endTime.toLocaleDateString()}</b></GridColumn>}
                </GridRow>
                <GridRow >
                    <GridColumn>Fecha de creacion de la subscripcion <b>{subscription.creationDate.toLocaleDateString()}</b></GridColumn>
                </GridRow>
            </Grid>
            {subscription.comment && <><span>Comentario:</span>
                <p>{subscription.comment}</p></>}
        </Modal.Content>
        <Modal.Actions>
            <Button color='green' onClick={onClose}>
                Cerrar
            </Button>
        </Modal.Actions>
    </Modal>)
}