import "./Home.css"
import { Screens } from "../../domain/navigation/screens"
import Users from "../users/Users"
import Products from "../products/Products"
import { Reports } from "../reports/Reports"
import Subscriptions from '../subscriptions/Subscriptions'
import { useNavigation } from '../../hooks/useNavigation'
import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { HashRouter, Route, Routes, Link as RouteLink } from "react-router-dom";


interface LinkType {
    key: string,
    value: string
}


const Home = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {currentScreen, navigateTo} = useNavigation()
    const getCurrentScreenElement = () => {
        switch (currentScreen) {
            case Screens.Users:
                return <Users />
            case Screens.Products:
                return <Products />
            case Screens.Reports:
                return <Reports />
            case Screens.Subscriptions:
                return <Subscriptions />
            default:
                return <></>
        }
    }

    const Links: LinkType[] = [
      { key: "users", value: "Personas" },
      { key: "products", value: "Clases" },
    ];

    const NavLink = ({ children, value }: { children: ReactNode, value: LinkType }) => (
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={`/#/${value.key}`}
      >
      
        {children}
      </Link>
    );

    return (
      <>
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Box>Logo</Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link.key} value={link}>
                    {link.value}
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Link 1</MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider />
                  <MenuItem>Link 3</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link.key} value={link}>
                    {link.value}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>

        <HashRouter>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </HashRouter>
      </>
    );
    // return (
        // <Sidebar.Pushable as={Segment}>
        //     <Sidebar
        //         as={Menu}
        //         icon='labeled'
        //         inverted
        //         vertical
        //         visible
        //         width="thin"
        //     >
        //         <Menu.Item as='a'
        //             onClick={() => navigateTo(Screens.Users)}
        //             active={currentScreen === Screens.Users}>
        //             <Icon name='users' />
        //             Personas
        //         </Menu.Item>
        //         <Menu.Item as='a'
        //             onClick={() => navigateTo(Screens.Subscriptions)}
        //             active={currentScreen === Screens.Subscriptions}>
        //             <Icon name='table' />
        //             Suscripciones
        //         </Menu.Item>
        //         <Menu.Item as='a'
        //             onClick={() => navigateTo(Screens.Products)}
        //             active={currentScreen === Screens.Products}>
        //             <Icon name='shopping cart' />
        //             Productos
        //         </Menu.Item>
        //         <Menu.Item as='a'
        //             onClick={() => navigateTo(Screens.Reports)}
        //             active={currentScreen === Screens.Reports}>
        //             <Icon name='dashboard' />
        //             Reportes
        //         </Menu.Item>
        //     </Sidebar>

        //     <Sidebar.Pusher className="homeScreen">
        //         <Segment style={{ paddingRight: "150px", minHeight: "100vh" }}>
        //             {getCurrentScreenElement()}
        //         </Segment>
        //     </Sidebar.Pusher>
        // </Sidebar.Pushable>
    // )
}

export default Home