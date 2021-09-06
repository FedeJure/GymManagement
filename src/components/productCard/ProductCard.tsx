import { MouseEventHandler } from "react"
import { Button, Card } from "semantic-ui-react"
import { Product } from "../../modules/product/Product"

export const ProductCard = ({ product, onDelete, onEdit }: {product: Product, 
    onDelete: MouseEventHandler, 
    onEdit: MouseEventHandler}) =>
    <Card header={product.data.name} description={<>
        <Button size="mini" color="red" floated="right" icon="trash" onClick={onDelete}></Button>
        <Button size="mini"  active floated="right" icon="edit" onClick={onEdit}></Button>
    </>} meta={`$${product.data.cost}`} />
