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
} from "@chakra-ui/react";

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
    <Flex justify={"center"} mt={5}>
      <Avatar
        size={"xl"}
        src={
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
        }
        css={{
          border: "2px solid white",
        }}
      />
    </Flex>

    <Box p={6}>
      <Stack spacing={0} align={"center"} mb={5}>
        <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
          John Doe
        </Heading>
        <Text color={"gray.500"}>Frontend Developer</Text>
      </Stack>

      <Stack direction={"row"} justify={"center"} spacing={6}>
        <Stack spacing={0} align={"center"}>
          <Text fontWeight={600}>23k</Text>
          <Text fontSize={"sm"} color={"gray.500"}>
            Followers
          </Text>
        </Stack>
        <Stack spacing={0} align={"center"}>
          <Text fontWeight={600}>23k</Text>
          <Text fontSize={"sm"} color={"gray.500"}>
            Followers
          </Text>
        </Stack>
      </Stack>

      <Button
        w={"full"}
        mt={8}
        bg={useColorModeValue("#151f21", "gray.900")}
        color={"white"}
        rounded={"md"}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
      >
        Follow
      </Button>
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
