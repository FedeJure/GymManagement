import { MouseEventHandler } from "react";
import { User } from "../../domain/users/User";
import { getUserPayload } from "../../domain/users/UserPayload";
import { UserTypeLabel } from "../userTypeLabel/UserTypeLabel";
import {
  Card,
  Image,
  Stack,
  CardBody,
  Button,
  CardFooter,
  Text,
  Heading,
  Center,
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
} from "@chakra-ui/react";
import {FiEdit} from "react-icons/fi"
import { AiFillDelete } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onInfo,
}: {
  user: User;
  onEdit: MouseEventHandler;
  onDelete: MouseEventHandler;
  onInfo: MouseEventHandler;
}) => (
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
                onClick={onDelete}
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
        src={
          user.profilePicture ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9YhceWoUKbK2wMeimcB0NgVEqYlpd6ccl411nf7jlx4sV5e8y5b8CdsEjPFtmbHoKhb0&usqp=CAU"
        }
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
          onClick={onEdit}
        ></IconButton>
      </ButtonGroup>
    </Box>
  </Card>
  // <Card style={{ height: "auto" }} color="teal">
  //     <Card.Content>
  //         {<Image
  //             rounded
  //             floated='right'
  //             size='mini'
  //             src={user.profilePicture}
  //         />}
  //         <Card.Header textAlign="left">
  //             <UserTypeLabel user={getUserPayload(user)} />
  //         </Card.Header>
  //         <Card.Header textAlign="center">
  //             {user.lastname}, {user.name}
  //         </Card.Header>
  //         <Card.Meta>DNI: {user.dni} | {(new Date()).getFullYear() - user.birthDate.getFullYear()} años</Card.Meta>
  //         <Card.Description >
  //             <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{user.comment}</p>
  //         </Card.Description>
  //     </Card.Content>
  //     <Card.Content extra>
  //         <Button size="mini" color="red" floated="right" icon="trash" onClick={onDelete}></Button>
  //         <Button size="mini" active floated="right" icon="edit" onClick={onEdit}></Button>
  //         <Button primary size="mini" active floated="left" icon="info circle" onClick={onInfo}></Button>
  //     </Card.Content>
  // </Card>
);

export { UserCard };
