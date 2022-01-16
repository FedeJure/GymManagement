import { useState } from "react";
import { Button, Container, Grid } from "semantic-ui-react";
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
import { createUser, deleteUser, getUserConfig, updateUser } from "../../services/api";
import { PaginatedGridPage } from "../../components/paginatedGridPage/PaginatedGridPage";

const Users = ({}) => {
  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
    await createUser(creationData, image);
    setCreationModalOpen(false);
    refresh();
  };
  const handleDelete = async () => {
    if (selectedUser === null) return;
    await deleteUser(selectedUser.id);
    setDeleteModal(false);
    refresh()
  };

  const handleEdit = async (editData: UserPayload, image: File | null) => {
    if (selectedUser === null) return;
    await updateUser({ ...selectedUser, ...editData }, image);
    setEditModalOpen(false);
    refresh()
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
    .map((user: User) => (
      <UserCard
        key={user.id}
        user={user}
        onDelete={() => {
          setSelectedUser(user);
          setDeleteModal(true);
        }}
        onEdit={() => {
          setSelectedUser(user);
          setEditModalOpen(true);
        }}
        onInfo={() => {}}
      />
    ));

  return (
    <div>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          onAccept={() => handleDelete()}
          message="Confirma eliminación de este usuario? Esta acción no puede deshacerse."
        />
      )}
      {creationModalOpen && (
        <CreateUserModal
          onClose={() => setCreationModalOpen(false)}
          onSubmit={handleCreation}
        />
      )}
      {editModalOpen && (
        <CreateUserModal
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEdit}
          initialData={selectedUser}
        />
      )}
      <Container>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column width="10" textAlign="left">
              <h2>Personas</h2>
            </Grid.Column>
            <Grid.Column>
              <h4>
                Crear nueva{" "}
                <Button
                  color="blue"
                  circular
                  icon="plus"
                  onClick={() => setCreationModalOpen(true)}
                />
              </h4>
            </Grid.Column>
            <Grid.Column>
              <ExcelUploader onLoad={handleExcelLoad} />
              <ExcelDownloader
                data={users.map((u) => mapToExcel(u))}
                name="Users Database"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

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
    </div>
  );
};

export default Users;
