import { MouseEventHandler } from "react";
import { User } from "../../domain/users/User";
import { getUserPayload, UserPayload } from "../../domain/users/UserPayload";
import { UserTypeLabel } from "../userTypeLabel/UserTypeLabel";
import {
  Card,
  Stack,
  Button,
  Text,
  Heading,
  Box,
  Flex,
  Avatar,
  useColorModeValue,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverContent,
  PopoverBody,
  PopoverTrigger,
  PopoverArrow,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {FiEdit} from "react-icons/fi"
import { AiFillDelete } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import {FaUser} from "react-icons/fa"
import { ConfirmationModal } from "../confirmationModal/ConfirmationModal";
import { CreateUserModal } from "../createUserModal/CreateUserModal";
import { deleteUser, updateUser } from "../../services/api";

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onInfo,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onInfo: MouseEventHandler;
}) => {
  const toast = useToast()
    const {
      isOpen: editOpen,
      onOpen: onEditOpen,
      onClose: onEditClose,
    } = useDisclosure();
    const {
      isOpen: deleteOpen,
      onOpen: onDeleteOpen,
      onClose: onDeleteClose,
    } = useDisclosure();

      const handleDelete = async () => {
        try {
          await deleteUser(user.id);
          toast({
            title: "Usuario eliminado",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "No se pudo eliminar el usuario",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
        onDeleteClose()
        onDelete()
      };

        const handleEdit = async (
          editData: UserPayload,
          image: File | undefined
        ) => {
          try {
            await updateUser(user.id, editData, image);
            toast({
              title: "Usuario editado",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          } catch (error) {
            toast({
              title: "No se pudo editar el usuario",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          }
          onEditClose();
          onEdit();
        };
  return (
    <>
      <ConfirmationModal
        open={deleteOpen}
        onCancel={onDeleteClose}
        onAccept={handleDelete}
        message="Confirma eliminación de este usuario? Esta acción no puede deshacerse."
      />

      <CreateUserModal
        open={editOpen}
        onClose={onEditClose}
        onSubmit={handleEdit}
        initialData={user}
      />
      <Card
        maxW={{ base: "full", sm: "270px" }}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        rounded={"md"}
      >
        <Box pos="absolute" left={2} top={1}>
          <UserTypeLabel user={getUserPayload(user)} />
        </Box>
        <Flex justifyContent="center" position="absolute" right={2} top={1}>
          <Popover placement="bottom" isLazy>
            <PopoverTrigger>
              <IconButton
                aria-label="More server options"
                icon={<BsThreeDots />}
                variant="ghost"
                w="fit-content"
              />
            </PopoverTrigger>
            <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
              <PopoverArrow />
              <PopoverBody>
                <Stack>
                  <Button
                    w="194px"
                    variant="ghost"
                    rightIcon={<AiFillDelete />}
                    justifyContent="space-between"
                    fontWeight="normal"
                    colorScheme="red"
                    fontSize="sm"
                    onClick={onDeleteOpen}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
        <Flex justify={"center"} mt={5}>
          <Avatar
            size={"xl"}
            icon={
              !user.profilePicture ? <FaUser fontSize={"1.5em"} /> : undefined
            }
            src={user.profilePicture}
            css={{
              border: "2px solid white",
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {user.lastname}, {user.name}
            </Heading>
            <Text color={"gray.500"}>DNI: {user.dni}</Text>
          </Stack>

          <Stack direction={"row"} justify={"center"} spacing={6}>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Followers
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}></Stack>
          </Stack>
          <ButtonGroup>
            <Button
              w={"full"}
              mt={8}
              rounded={"md"}
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg",
              }}
              onClick={onInfo}
            >
              Detalles
            </Button>
            <IconButton
              icon={<FiEdit />}
              aria-label="Editar"
              mt={8}
              rounded={"md"}
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg",
              }}
              onClick={onEditOpen}
            ></IconButton>
          </ButtonGroup>
        </Box>
      </Card>
    </>
  );
}
  


export { UserCard };
