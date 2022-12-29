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
          <Button variant="ghost" color={"red"} onClick={onAccept}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
