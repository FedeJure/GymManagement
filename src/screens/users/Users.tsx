import { useState } from "react";
import { useAlert } from "react-alert";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import {
  createUser,
  deleteUser,
  getUserConfig,
  updateUser,
} from "../../services/api";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";

const Users = ({}) => {
  const alert = useAlert();
  const {
    isOpen: creationOpen,
    onOpen: onCreationOpen,
    onClose: onCreationClose,
  } = useDisclosure();
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
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
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
      alert.success("Usuario creado");
    } catch (error) {
      alert.error("Ocurrio un error");
    }
    onCreationClose()
    refresh();
  };
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      alert.success("Usuario eliminado");
    } catch (error) {
      alert.error("Ocurrio un error");
    }
    onDeleteClose();
    refresh();
  };

  const handleEdit = async (editData: UserPayload, image: File | undefined) => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, editData, image);
      alert.success("Usuario editado");
    } catch (error) {
      alert.error("Ocurrio un error");
    }
    onEditClose();
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
          onDelete={() => {
            setSelectedUser(user);
            onDeleteOpen();
          }}
          onEdit={() => {
            setSelectedUser(user);
            onEditOpen();
          }}
          onInfo={() => {}}
        />
      );
    });

  return (
    <>
      <ConfirmationModal
        open={deleteOpen}
        onCancel={onDeleteClose}
        onAccept={handleDelete}
        message="Confirma eliminación de este usuario? Esta acción no puede deshacerse."
      />

      <CreateUserModal
        open={creationOpen}
        onClose={onCreationClose}
        onSubmit={handleCreation}
      />

      <CreateUserModal
        open={editOpen}
        onClose={onEditClose}
        onSubmit={handleEdit}
        initialData={selectedUser}
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
        <FilterInput
          tagOptions={[
            {
              key: UserType.ADMIN,
              text: UserType.ADMIN,
              value: UserType.ADMIN,
              label: { color: "green", empty: true, circular: true },
            },
            {
              key: UserType.STUDENT,
              text: UserType.STUDENT,
              value: UserType.STUDENT,
              label: { color: "yellow", empty: true, circular: true },
            },
            {
              key: UserType.TRAINER,
              text: UserType.TRAINER,
              value: UserType.TRAINER,
              label: { color: "orange", empty: true, circular: true },
            },
          ]}
          onCustomFilterChange={(f: string[]) =>
            setFilterByContent(f.map((v) => v.toLocaleLowerCase()))
          }
          onTagFilterChange={(v: string[]) => setFilterByTag(v)}
        />
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
