import { Button, Card } from "semantic-ui-react"

export const ProductCard = ({ name, cost, id, onDelete }) =>
    <Card header={name} description={<>
        <Button size="mini" color="red" floated="right" icon="trash" onClick={() => onDelete(id)}></Button>
        <Button size="mini"  active floated="right" icon="edit"></Button>
    </>} meta={`$${cost}`} />
