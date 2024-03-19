import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
  constructor() {
    this.path = "./src/models/productos.json";
    this.products = []
  }

  readProduct = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProduct = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
  };

  productExist = async (id) => {
    let products = await this.readProduct();
    return products.find((prod) => prod.id === id);
  };

  addProduct = async (Product) => {
    const { title, description, price, thumbnail, stock, category } = Product;
    if (title || description || price || thumbnail || stock || category) {
      let id = uuidv4();
      let code = uuidv4();
      let status = true;
      const cod = productCode => productCode.codigo === code;
      const pId = productId => productId.id === id;
      if (this.products.some(pId)) {
        return `\n El producto con el id # ${pId} ya se encuentra registrado... \n`;
      } else if (this.products.some(cod)) {
        return `\n El producto con el codigo ${cod} ya se encuentra registrado... \n`;
      } else
        Product = { id, title, description, price, thumbnail, code, stock, status, category }
      this.products = await this.getProducts();
      this.products.push(Product);
      await fs.writeFile(this.path, JSON.stringify(this.products));
      return Product;
    } else {
      return "Debes llenar todos los campos";
    }
  }

  getProducts = async () => {
    const read = await fs.readFile(this.path, "utf-8");
    const readJson = JSON.parse(read);
    return readJson;
  }

  getProductsById = async (id) => {
    let prodID = await this.productExist(id);
    if (!prodID) return "Producto no encontrado";
    return prodID;
  };

  updateProducts = async (id, product) => {
    let prodID = await this.productExist(id);
    if (!prodID) return "Producto no encontrado";
    await this.deleteProducts(id);
    let prod = await this.readProduct();
    let products = [{ id: id, ...product}, ...prod];
    await this.writeProduct(products);
    return "Producto actualizado exitosamente";
  };

  deleteProducts = async (id) => {
    let products = await this.readProduct();
    let exist = products.some((prod) => prod.id === id);
    if (exist) {
      let ProdID = products.filter((prod) => prod.id !== id);
      await this.writeProduct(ProdID);
      return "Producto eliminado";
    } else {
      return "El producto no existe";
    }
  };
}

export default ProductManager;
