import { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Divider, Button, Header, Card, Container } from "semantic-ui-react"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"
import "./Users.css"
import { addUser, editUser, removeUser } from "../../modules/users/users.actions"
import { CreateUserModal } from "../../components/createUserModal/CreateUserModal"
import { UserCard } from "../../components/userCard/UserCard"
import { Dispatch } from "redux"
import { StoreState } from "../../store"
import { UserPayload } from "../../modules/users/UserPayload"
import { User } from "../../modules/users/User"
import { Product } from "../../modules/product/Product"
import { FilterInput } from "../../components/filterInput/FilterInput"
import { ExcelUploader } from "../../components/excelUploader/excelUploader"
import { ExcelDownloader } from "../../components/excelDownloader/excelDownloader"
import { mapToExcel, mapFromExcel } from "../../modules/users/UserMapper"

const Users = ({ products, users, createUser, removeUser, editUser }:
    { products: Product[], users: User[], createUser: (user: UserPayload) => void, removeUser: Function, editUser: Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [userTagFiltes, setUserTagFiltes] = useState<string[]>([])
    const [userCustomFiltes, setUserCustomFiltes] = useState<string[]>([])
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
        console.log(userTagFiltes.length > 0, userTagFiltes, user.type)
        if (userTagFiltes.length > 0 && userTagFiltes.includes(user.type)) return true
        return userCustomFiltes.some(c => c.length > 1 && userString.includes(c))
    }

    const handleExcelLoad = (data: any[]) => {
        data.map(d => mapFromExcel(d)).forEach(createUser)
    }

    const usersToShow = users.filter(u => mustShowUser(u))

    return <div>
        {deleteModal && <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma eliminación de este usuario? Esta acción no puede deshacerse." />}
        {creationModalOpen && <CreateUserModal
            users={users}
            products={products}
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />}
        {editModalOpen && <CreateUserModal
            users={users.filter(u => u.id !== selectedUser?.id)}
            products={products}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedUser} />}



        <Container fluid style={{ minHeight: "2em", display: "flex", justifyContent: "space-between " }}>
            <Header as='h2' floated='left'>
                Personas
            </Header>
            <div>
                <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
                <ExcelUploader onLoad={handleExcelLoad} />
                <ExcelDownloader data={users.map(u => mapToExcel(u))} name="Users Database" />
            </div>

        </Container>


        <Divider />
        <FilterInput
            onCustomChange={(f: string[]) => setUserCustomFiltes(f.map(v => v.toLocaleLowerCase()))}
            onUserTypeFilterChange={(v: string[]) => setUserTagFiltes(v)} />

        <Divider />
        {usersToShow.length > 0 && <Card.Group centered >
            {usersToShow.map((user: User) => <UserCard key={user.id}
                user={user}
                onDelete={() => {
                    setSelectedUser(user)
                    setDeleteModal(true)
                }}
                onEdit={() => {
                    setSelectedUser(user)
                    setEditModalOpen(true)
                }}
                onInfo={() => { }} />)}
        </Card.Group>}
    </div>
}

const mapStateToProps = (state: StoreState) => {
    return {
        users: state.user.users,
        products: state.product.products
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        createUser: (data: UserPayload) => dispatch(addUser(data)),
        removeUser: (userId: number) => dispatch(removeUser(userId)),
        editUser: (userId: number, data: UserPayload) => dispatch(editUser(userId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)