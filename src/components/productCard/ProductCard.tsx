import { Button, Card } from "semantic-ui-react"

export const ProductCard = ({ name, cost, id }: { name: string, cost: number, id: number }) =>
    <Card header={name} description={<>
        <Button size="mini"  active floated="left">Editar</Button>
        <Button size="mini" color="red" floated="right">Borrar</Button>
    </>} meta={`$${cost}`} />
