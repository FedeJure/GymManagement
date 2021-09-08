import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Divider, Button, Segment, Header, Card } from "semantic-ui-react"
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

const Users = ({ products, users, createUser, removeUser, editUser }:
    { products: Product[], users: User[], createUser: Function, removeUser: Function, editUser: Function }) => {
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
        if (selectedUser == null) return
        removeUser(selectedUser.id)
        setDeleteModal(false)
    }

    const handleEdit = (editData: UserPayload) => {
        if (selectedUser == null) return
        setEditModalOpen(false)
        editUser(selectedUser.id, editData)
    }

    const mustShowUser = (user: User) => {
        const userString = `${user.data.name} ${user.data.lastname} ${user.data.dni}`.toLocaleLowerCase()
        if (userCustomFiltes.length == 0 && userTagFiltes.length == 0) return true
        console.log(userTagFiltes.length > 0 ,userTagFiltes,user.data.type)
        if (userTagFiltes.length > 0 && userTagFiltes.includes(user.data.type)) return true
        return userCustomFiltes.some(c => c.length > 1 && userString.includes(c))
    }

    const usersToShow = users.filter(u => mustShowUser(u))

    return <div className="usersScreen">
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
            users={users.filter(u => u.id != selectedUser?.id)}
            products={products}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedUser} />}
        <Segment>
            <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
            <Header as='h2' floated='left'>
                Personas
            </Header>
            <Divider />
            <FilterInput
                onCustomChange={(f: string[]) => setUserCustomFiltes(f.map(v => v.toLocaleLowerCase()))}
                onUserTypeFilterChange={(v: string[]) => setUserTagFiltes(v)} />

            <Divider />
            {usersToShow.length > 0 && <Card.Group >
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

        </Segment>
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