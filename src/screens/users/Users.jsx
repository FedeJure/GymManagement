import { useState } from "react"
import { connect } from "react-redux"
import { Divider, Button, Segment, Header, Card } from "semantic-ui-react"
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal"
import { addUser, editUser, removeUser } from "../../modules/users/users.actions"
import {CreateUserModal} from "../../components/createUserModal/CreateUserModal"
import { user } from "../../modules/users/users.reducer"

const Users = ({ users, createUser, removeUser, editUser }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleCreation = (creationData) => {
        createUser(creationData)
        setCreationModalOpen(false)
    }
    const handleDelete = (userId) => {
        removeUser(userId)
        setDeleteModal(false)
    }

    const handleEdit = (editData) => {
        setEditModalOpen(false)
        editUser(selectedUser.id, editData)
    }

    return <div>
       {deleteModal && <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            onAccept={() => handleDelete(selectedUser.id)}
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
                {users.map(({  }) => <></>)}
            </Card.Group>

        </Segment>
    </div>
}

const mapStateToProps = (state) => {
    return {
        users: state.user.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (data) => dispatch(addUser(data)),
        removeUser: (userId) => dispatch(removeUser(userId)),
        editUser: (userId, data) => dispatch(editUser(userId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)