import { Button, Card } from "semantic-ui-react"

export const ProductCard = ({ name, cost, id }: { name: string, cost: number, id: number }) =>
    <Card header={name} description={<>
        <Button size="mini" color="red" floated="right" icon="trash"></Button>
        <Button size="mini"  active floated="right" icon="edit"></Button>
    </>} meta={`$${cost}`} />
