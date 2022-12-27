import {
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal
} from "@chakra-ui/react";
export const ConfirmationModal = ({ open, message, onAccept, onCancel }) => {
  return (
    open && <Modal isOpen onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmacion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCancel}>
            No
          </Button>
          <Button variant="ghost" onClick={onAccept}>
            Si, eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    // <Modal
    //     open={open}
    // >
    //     <Header icon='trash' content={message} />
    //     <Modal.Actions><></>
    //         <Button color='red' onClick={onCancel}>
    //             <Icon name='remove' /> No
    //         </Button>
    //         <Button color='green' onClick={onAccept}>
    //             <Icon name='checkmark' /> Yes
    //         </Button>
    //     </Modal.Actions>
    // </Modal>
  );
};
