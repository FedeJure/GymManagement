import { Subscription } from "../../domain/subscription/Subscription";
import {
  Card,
  CardBody,
  Tag,
  HStack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { BiDetail } from "react-icons/bi"
import {FaRegMoneyBillAlt} from "react-icons/fa"

interface ISubscriptionCard {
  subscription: Subscription;
  handleDelete: () => void;
  handleCreateOrder: (id: string) => void;
  handleDetails: () => void;
}

export const SubscriptionCard: React.FC<ISubscriptionCard> = ({
  subscription,
  handleDelete,
  handleCreateOrder,
  handleDetails,
}) => (
  <Popover placement="bottom">
    <Card variant="filled">
      <CardBody>
        <HStack>
          {subscription.pendingPay && (
            <Tag alignSelf="start" colorScheme="orange">
              Adeuda
            </Tag>
          )}
          <Stat textAlign="start">
            <StatLabel>
              {subscription.user.lastname}, {subscription.user.name}
            </StatLabel>
            <StatNumber>{subscription.product.name}</StatNumber>
            <StatHelpText>
              {subscription.initialTime.toLocaleDateString()} -{" "}
              {subscription.endTime
                ? subscription.endTime.toLocaleDateString()
                : "Indefinido"}
            </StatHelpText>
          </Stat>
          <PopoverTrigger>
            <IconButton
              alignSelf="start"
              aria-label="More server options"
              icon={<BsThreeDots />}
              variant="ghost"
              w="fit-content"
            />
          </PopoverTrigger>
        </HStack>
      </CardBody>
    </Card>
    <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
      <PopoverArrow />
      <PopoverBody>
        <Stack>
          <Button
            w="194px"
            variant="ghost"
            rightIcon={<BiDetail />}
            justifyContent="space-between"
            fontWeight="normal"
            fontSize="sm"
            onClick={handleDetails}
          >
            Ver detalle
          </Button>
          <Button
            w="194px"
            variant="ghost"
            rightIcon={<FaRegMoneyBillAlt />}
            justifyContent="space-between"
            fontWeight="normal"
            fontSize="sm"
            onClick={() => handleCreateOrder(subscription.id)}
          >
            Crear orden de cobro
          </Button>
          <Button
            w="194px"
            variant="ghost"
            rightIcon={<AiFillDelete />}
            justifyContent="space-between"
            fontWeight="normal"
            colorScheme="red"
            fontSize="sm"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </Stack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);
