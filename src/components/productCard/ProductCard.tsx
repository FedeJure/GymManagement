import { MouseEventHandler } from "react"
import { Button, Card } from "semantic-ui-react"
import { Product } from "../../modules/product/Product"

export const ProductCard = ({ interactable=true, product, onDelete=() => {}, onEdit=() => {} }: {
    interactable?: boolean,
    product: Product,
    onDelete?: MouseEventHandler,
    onEdit?: MouseEventHandler
}) =>
    <Card header={product.data.name} description={<>
        <Card.Content>{product.data.payType}</Card.Content>
        {product.data.daysInWeek.length > 0 && <Card.Content>{product.data.daysInWeek.length} veces por semana</Card.Content>}
        {product.data.daysInWeek.length > 0 && <Card.Content>({product.data.daysInWeek.map(d => d.slice(0,2)).join(', ')})</Card.Content>}
        {interactable && <Button size="mini" color="red" floated="right" icon="trash" onClick={onDelete}></Button>}
        {interactable && <Button size="mini" active floated="right" icon="edit" onClick={onEdit}></Button>}
    </>} meta={`$${product.data.price}`} />
