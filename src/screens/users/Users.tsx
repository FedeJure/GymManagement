import { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Divider, Button, Header, Card, Container, CardGroup, Grid } from "semantic-ui-react"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"
import "./Users.css"
import { addUser, editUser, getUsersAction, removeUser } from "../../modules/users/users.actions"
import { CreateUserModal } from "../../components/createUserModal/CreateUserModal"
import { UserCard } from "../../components/userCard/UserCard"
import { Dispatch } from "redux"
import { StoreState } from "../../store"
import { UserPayload } from "../../modules/users/UserPayload"
import { User } from "../../modules/users/User"
import { FilterInput } from "../../components/filterInput/FilterInput"
import { ExcelUploader } from "../../components/excelUploader/excelUploader"
import { ExcelDownloader } from "../../components/excelDownloader/excelDownloader"
import { mapToExcel, mapFromExcel } from "../../modules/users/UserMapper"
import { InfiniteScroll } from "../../components/infiniteScroll/InfiniteScroll"
import { UserType } from "../../modules/users/UserType"

const Users = ({ users, createUser, removeUser, editUser, fetchUsers }:
    {
        users: User[],
        createUser: (user: UserPayload) => void,
        removeUser: Function,
        editUser: Function,
        fetchUsers: Function
    }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [userTagFiltes, setUserTagFiltes] = useState<string[]>([])
    const [userCustomFiltes, setUserCustomFiltes] = useState<string[]>([])
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [page, setPage] = useState(0)

    useEffect(() => {
        if (page === 0) return
        fetchUsers({ page, append: true, filterByTag: userTagFiltes, filterByContent: userCustomFiltes })
    }, [page])

    useEffect(() => {
        fetchUsers({ page, filterByTag: userTagFiltes, filterByContent: userCustomFiltes })
    }, [userTagFiltes, userCustomFiltes])

    const handleCreation = (creationData: UserPayload) => {
        createUser(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = () => {
        if (selectedUser === null) return
        removeUser(selectedUser.id)
        setDeleteModal(false)
    }

    const handleEdit = (editData: UserPayload) => {
        if (selectedUser === null) return
        setEditModalOpen(false)
        editUser(selectedUser.id, editData)
    }

    const mustShowUser = (user: User) => {
        const userString = `${user.name} ${user.lastname} ${user.dni}`.toLocaleLowerCase()
        if (userCustomFiltes.length === 0 && userTagFiltes.length === 0) return true
        if (userTagFiltes.length > 0 && userTagFiltes.includes(user.type)) return true
        return userCustomFiltes.some(c => c.length > 1 && userString.includes(c))
    }

    const handleExcelLoad = (data: any[]) => {
        data.map(d => mapFromExcel(d)).forEach(createUser)
    }

    const usersToShow = users.filter(u => mustShowUser(u))
    const usersMapped = usersToShow.map((user: User) => <UserCard key={user.id}
        user={user}
        onDelete={() => {
            setSelectedUser(user)
            setDeleteModal(true)
        }}
        onEdit={() => {
            setSelectedUser(user)
            setEditModalOpen(true)
        }}
        onInfo={() => { }} />)

    return <div>
        {deleteModal && <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma eliminación de este usuario? Esta acción no puede deshacerse." />}
        {creationModalOpen && <CreateUserModal
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />}
        {editModalOpen && <CreateUserModal
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedUser} />}

        <Grid>
            <Grid.Row columns="equal">
                <Grid.Column width="10" textAlign="left">
                    <h2>Personas</h2>
                </Grid.Column>
                <Grid.Column >
                    <h4>Crear nueva<Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} /></h4>
                </Grid.Column>
                <Grid.Column>
                    <ExcelUploader onLoad={handleExcelLoad} />
                    <ExcelDownloader data={users.map(u => mapToExcel(u))} name="Users Database" />
                </Grid.Column>
            </Grid.Row>
        </Grid>


        <Divider />
        <FilterInput
            tagOptions={[
                {
                    key: UserType.ADMIN,
                    text: UserType.ADMIN,
                    value: UserType.ADMIN,
                    label: { color: 'green', empty: true, circular: true }
                },
                {
                    key: UserType.STUDENT,
                    text: UserType.STUDENT,
                    value: UserType.STUDENT,
                    label: { color: 'yellow', empty: true, circular: true }
                },
                {
                    key: UserType.TRAINER,
                    text: UserType.TRAINER,
                    value: UserType.TRAINER,
                    label: { color: 'orange', empty: true, circular: true }
                }
            ]}
            onCustomChange={(f: string[]) => setUserCustomFiltes(f.map(v => v.toLocaleLowerCase()))}
            onUserTypeFilterChange={(v: string[]) => setUserTagFiltes(v)} />

        <Divider />
        {usersToShow.length > 0 &&
            <CardGroup centered>
                <InfiniteScroll data={usersMapped} onLoadMore={() => setPage(page + 1)} as={Card} />
            </CardGroup>}

    </div>
}

const mapStateToProps = (state: StoreState) => {
    return {
        users: state.user.users,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchUsers: ({ page, append, filterByTag, filterByContent }
            : { page: number, append: boolean, filterByTag: string[], filterByContent: [] }) =>
            getUsersAction({ page, append, filterByTag, filterByContent })(dispatch),
        createUser: (data: UserPayload) => addUser(data)(dispatch),
        removeUser: (userId: string) => removeUser(userId)(dispatch),
        editUser: (userId: string, data: UserPayload) => editUser(userId, data)(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)