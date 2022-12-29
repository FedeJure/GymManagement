import "./Users.css";
import { CreateUserModal } from "../../components/createUserModal/CreateUserModal";
import { UserCard } from "../../components/userCard/userCard";
import { UserPayload } from "../../domain/users/UserPayload";
import { User } from "../../domain/users/User";
import { FilterInput } from "../../components/filterInput/FilterInput";
import { ExcelUploader } from "../../components/excelUploader/excelUploader";
import { ExcelDownloader } from "../../components/excelDownloader/excelDownloader";
import { mapToExcel, mapFromExcel } from "../../domain/users/UserMapper";
import { UserType } from "../../domain/users/UserType";
import { useUsers } from "../../hooks/useUsers";
import {
  Container,
  Tooltip,
  Heading,
  ButtonGroup,
  Spacer,
  IconButton,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { createUser, getUserConfig } from "../../services/api";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";

const Users = () => {
  const toast = useToast();
  const {
    isOpen: creationOpen,
    onOpen: onCreationOpen,
    onClose: onCreationClose,
  } = useDisclosure();
  const {
    items: users,
    setPage,
    filterByContent,
    filterByTag,
    setFilterByTag,
    setFilterByContent,
    step,
    refresh,
  } = useUsers();

  const handleCreation = async (
    creationData: UserPayload,
    image: File | undefined
  ) => {
    try {
      await createUser(creationData, image);
      toast({
        title: "Usuario creado",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No se pudo crear el usuario",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    onCreationClose();
    refresh();
  };

  const mustShowUser = (user: User) => {
    const userString =
      `${user.name} ${user.lastname} ${user.dni}`.toLocaleLowerCase();
    if (filterByContent.length === 0 && filterByTag.length === 0) return true;
    if (filterByTag.length > 0 && filterByTag.includes(user.type)) return true;
    return filterByContent.some((c) => c.length > 1 && userString.includes(c));
  };

  const handleExcelLoad = (data: any[]) => {
    data
      .map((d) => mapFromExcel(d))
      .forEach(async (data) => await createUser(data));
    refresh();
  };

  const usersMapped = users
    .filter((u) => mustShowUser(u))
    .map((user: User) => {
      return (
        <UserCard
          key={user.id}
          user={user}
          onDelete={refresh}
          onEdit={refresh}
          onInfo={() => {}}
        />
      );
    });

  return (
    <>
      <CreateUserModal
        open={creationOpen}
        onClose={onCreationClose}
        onSubmit={handleCreation}
      />

      <Container maxWidth="none" p="3">
        <Wrap justify={{ base: "center", sm: "center" }}>
          <Spacer maxW={{ sm: "full", base: 0 }} />
          <WrapItem>
            <Heading alignSelf={"center"} size="md">
              Alumnos y Profesores
            </Heading>
          </WrapItem>
          <Spacer maxW={{ sm: "full", base: 0 }} />
          <WrapItem>
            <ButtonGroup gap="2">
              <Tooltip label="Agregar usuario manualmente">
                <IconButton
                  aria-label="agregar usuario manualmente"
                  icon={<AddIcon />}
                  onClick={onCreationOpen}
                />
              </Tooltip>

              <ExcelUploader onLoad={handleExcelLoad} />
              <ExcelDownloader
                data={users.map((u) => mapToExcel(u))}
                name="Users Database"
              />
            </ButtonGroup>
          </WrapItem>
        </Wrap>
        <Box width={{ base: "full", md: "md" }}>
          <FilterInput
            tagOptions={[
              {
                value: UserType.ADMIN,
                label: UserType.ADMIN,
                isFixed: true,
              },
              {
                value: UserType.STUDENT,
                label: UserType.STUDENT,
                isFixed: true,
              },
              {
                value: UserType.TRAINER,
                label: UserType.TRAINER,
                isFixed: true,
              },
            ]}
            onCustomFilterChange={(f: string[]) =>
              setFilterByContent(f.map((v) => v.toLocaleLowerCase()))
            }
            onTagFilterChange={(v: string[]) => setFilterByTag(v)}
          />
        </Box>

        <PaginatedGridPage
          fetchCountOfItems={getUserConfig}
          step={step}
          onPageChange={(newPage) => setPage(newPage)}
          elements={usersMapped}
        />
      </Container>
    </>
  );

  // return (
  //   <div>
  //     {deleteModal && (
  //       <ConfirmationModal
  //         open={deleteModal}
  //         onCancel={() => setDeleteModal(false)}
  //         onAccept={() => handleDelete()}
  //         message="Confirma eliminación de este usuario? Esta acción no puede deshacerse."
  //       />
  //     )}
  //     {creationModalOpen && (
  //       <CreateUserModal
  //         onClose={() => setCreationModalOpen(false)}
  //         onSubmit={handleCreation}
  //       />
  //     )}
  //     {editModalOpen && (
  //       <CreateUserModal
  //         onClose={() => setEditModalOpen(false)}
  //         onSubmit={handleEdit}
  //         initialData={selectedUser}
  //       />
  //     )}
  //     <Container>
  //       <Grid>
  //         <Grid.Row columns="equal">
  //           <Grid.Column width="10" textAlign="left">
  //             <h2>Personas</h2>
  //           </Grid.Column>
  //           <Grid.Column>
  //             <h4>
  //               Crear nueva{" "}
  //               <Button
  //                 color="blue"
  //                 circular
  //                 icon="plus"
  //                 onClick={() => setCreationModalOpen(true)}
  //               />
  //             </h4>
  //           </Grid.Column>
  //           <Grid.Column>
  //             <ExcelUploader onLoad={handleExcelLoad} />
  //             <ExcelDownloader
  //               data={users.map((u) => mapToExcel(u))}
  //               name="Users Database"
  //             />
  //           </Grid.Column>
  //         </Grid.Row>
  //       </Grid>
  //     </Container>

  //     <FilterInput
  //       tagOptions={[
  //         {
  //           key: UserType.ADMIN,
  //           text: UserType.ADMIN,
  //           value: UserType.ADMIN,
  //           label: { color: "green", empty: true, circular: true },
  //         },
  //         {
  //           key: UserType.STUDENT,
  //           text: UserType.STUDENT,
  //           value: UserType.STUDENT,
  //           label: { color: "yellow", empty: true, circular: true },
  //         },
  //         {
  //           key: UserType.TRAINER,
  //           text: UserType.TRAINER,
  //           value: UserType.TRAINER,
  //           label: { color: "orange", empty: true, circular: true },
  //         },
  //       ]}
  //       onCustomFilterChange={(f: string[]) =>
  //         setFilterByContent(f.map((v) => v.toLocaleLowerCase()))
  //       }
  //       onTagFilterChange={(v: string[]) => setFilterByTag(v)}
  //     />

  //     <PaginatedGridPage
  //       fetchCountOfItems={getUserConfig}
  //       step={step}
  //       onPageChange={(newPage) => setPage(newPage)}
  //       elements={usersMapped}
  //     />
  //   </div>
  // );
};

export default Users;
