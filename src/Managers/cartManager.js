import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManager from "./productManager.js";

const productAll = new ProductManager();

class CartManager {
  constructor(path) {
    this.path = path;
  }

  readCart = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  writeCart = async (carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts));
  };

  cartExist = async (id) => {
    let carts = await this.readCart();
    return carts.find((cart) => cart.id === id);
  };

  addCart = async () => {
    let allCarts = await this.readCart();
    let id = uuidv4();
    let cart = [{ id: id, products: [] }, ...allCarts];
    await this.writeCart(cart);
    return "Carrito Agregado exitosamente";
  };

  getCartById = async (id) => {
    let cartID = await this.cartExist(id);
    if (!cartID) return "Carrito no encontrado";
    return cartID;
  };

  addProductCart = async (cartId, prodId) => {
    let cartById = await this.cartExist(cartId);
    if (!cartById) return "Carrito no encontrado";
    let productById = await productAll.productExist(prodId);
    if (!cartById) return "Producto no encontrado";
    let carts = await this.readCart();
    let cartF = carts.filter((cart) => cart.id != cartId);

    if (cartById.products.some((prod => prod.id === prodId))) {
      let AddproductInCart = cartById.products.find((prod) => prod.id === prodId);
      AddproductInCart.cantidad++;
      console.log(AddproductInCart.cantidad)
      let cartAdd = [cartById, ...cartF];
      await this.writeCart(cartAdd);
      return "Producto agregado nuevamente al carrito";
    }
    cartById.products.push({ id: productById.id, cantidad: 1 })
    let cartAdd = [cartById, ...cartF];
    await this.writeCart(cartAdd);
    return "Producto agregado al carrito";
  };
}

export default CartManager;
