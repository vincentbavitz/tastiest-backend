import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(title: string, desc: string, price: number) {
    const id = Date.now().toString();
    const newProduct = new Product(id, title, desc, price);
    this.products.push(newProduct);

    return id;
  }

  getProducts() {
    // Copy the array to avoid mutating products from outside
    // of our service.
    return [...this.products];
  }

  getSingleProduct(id: string) {
    return this.findProduct(id)[0];
  }

  updateProduct(id: string, title: string, desc: string, price: number) {
    const [product, index] = this.findProduct(id);
    const updatedProduct = { ...product };

    if (title) updatedProduct.title = title;
    if (desc) updatedProduct.desc = desc;
    if (price) updatedProduct.price = price;

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  deleteProduct(id: string) {
    const [, index] = this.findProduct(id);
    this.products.splice(index, 1);
  }

  private findProduct(id: string): [Product, number] {
    const index = this.products.findIndex((product) => product.id === id);
    const product = this.products[index];

    if (!product) {
      throw new NotFoundException('Could not find product.');
    }

    return [product, index];
  }
}
