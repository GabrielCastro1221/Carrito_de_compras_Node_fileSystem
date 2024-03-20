import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
  constructor(path) {
    this.path = path;
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

  addProduct = async (product) => {
    const { title, description, price, thumbnail, stock, category } = product;

    if (title && description && price && thumbnail && stock && category) {
        const id = uuidv4();
        const code = uuidv4();
        const status = true;
        const Id = prodId => prodId.id === id;
        const cod = prodCode => prodCode.code === code;

        if (this.products.some(Id)) return `El Producto con el id ${id} ya se encuentra registrado`;
        if (this.products.some(cod)) return `El Producto con el codigo ${code} ya se encuentra registrado`;


        product = { id, title, description, price, thumbnail, code, status, stock, category }
        this.products = await this.getProducts();
        this.products.push(product)
        await fs.writeFile(this.path, JSON.stringify(this.products))
        return product
    } else
        return "Debes completar todos los campos";
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
