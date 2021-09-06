import { Product } from "./Product";


export interface ProductState {
    products: Product[];
    lastId: number;
}
