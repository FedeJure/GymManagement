import { MouseEventHandler } from "react"
import { Product } from "../../domain/product/Product"

export const ProductCard = ({ interactable=true, product, onDelete=() => {}, onEdit=() => {} }: {
    interactable?: boolean,
    product: Product,
    onDelete?: MouseEventHandler,
    onEdit?: MouseEventHandler
}) =><></>
    // <Card color="teal" header={product.name} description={<>
    //     <Card.Content>{product.payType}</Card.Content>
    //     {product.daysInWeek.length > 0 && <Card.Content>{product.daysInWeek.length} veces por semana</Card.Content>}
    //     {product.daysInWeek.length > 0 && <Card.Content>({product.daysInWeek.map(d => d.slice(0,2)).join(', ')})</Card.Content>}
    //     {interactable && <Button size="mini" color="red" floated="right" icon="trash" onClick={onDelete}></Button>}
    //     {interactable && <Button size="mini" active floated="right" icon="edit" onClick={onEdit}></Button>}
    // </>} meta={`$${product.price}`} />
