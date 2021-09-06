import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export const ConfirmationModal = ({ open, message, onAccept, onCancel }) => {
    return (
        <Modal
            open={open}
        >
            <Header icon='archive' content='Archive Old Messages' />
            <Modal.Content>
                <p>{message}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={onCancel}>
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' onClick={onAccept}>
                    <Icon name='checkmark' /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )
}