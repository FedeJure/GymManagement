import { useState } from "react"
import { connect } from "react-redux"
import { Divider, Button, Segment, Header, Card } from "semantic-ui-react"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"
import { addUser, editUser, removeUser } from "../../modules/users/users.actions"
import {CreateUserModal} from "../../components/createUserModal/CreateUserModal"
import {UserCard} from "../../components/userCard/UserCard"
import { Dispatch } from "redux"
import { StoreState } from "../../store"
import { UserPayload } from "../../modules/users/UserPayload"
import { User } from "../../modules/users/User"

const Users = ({ users, createUser, removeUser, editUser }: {users: User[], createUser: Function, removeUser: Function, editUser: Function}) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
console.log(users)
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

    return <div>
       {deleteModal && <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => handleDelete()}
            message="Confirma eliminación de este usuario? Esta acción no puede deshacerse." />}
        {creationModalOpen && <CreateUserModal
            onClose={() => setCreationModalOpen(false)}
            onSubmit={handleCreation} />}
        {editModalOpen &&<CreateUserModal
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={selectedUser}/>}
        <Segment >
            <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
            <Header as='h2' floated='left'>
                Personas
            </Header>
            <Divider />
            <Card.Group>
                {users.map((user: User) => <UserCard key={user.id} 
                user={user}
                onDelete={() => {
                    setSelectedUser(user)
                    setDeleteModal(true)
                }}
                onEdit={() => {
                    setSelectedUser(user)
                    setEditModalOpen(true)
                }}
                onInfo={() => {}}/>)}
            </Card.Group>

        </Segment>
    </div>
}

const mapStateToProps = (state: StoreState) => {
    return {
        users: state.user.users
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