import { Button, Card } from "semantic-ui-react"

export const ProductCard = ({ name, cost, id, onDelete, onEdit }) =>
    <Card header={name} description={<>
        <Button size="mini" color="red" floated="right" icon="trash" onClick={onDelete}></Button>
        <Button size="mini"  active floated="right" icon="edit" onClick={onEdit}></Button>
    </>} meta={`$${cost}`} />
