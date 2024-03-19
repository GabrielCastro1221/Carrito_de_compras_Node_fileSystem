import { Router } from "express";
import ProductManager from "../Managers/productManager.js";

const productRouter = Router();
const prod = new ProductManager();

// http://localhost:8080/api/products
productRouter.post("/", async (req, res) => {
  let newProd = req.body;
  res.send(await prod.addProduct(newProd));
});

// http://localhost:8080/api/products/?limit=5
productRouter.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) return res.send(await prod.readProduct());
  let allprod = await prod.readProduct();
  let prodLimit = allprod.slice(0, limit);
  res.send(prodLimit);
});

//localhost:8080/api/products/:id
http: productRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await prod.getProductsById(id));
});

// http://localhost:8080/api/products/:id
productRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  let updateProd = req.body;
  res.send(await prod.updateProducts(id, updateProd));
});

// http://localhost:8080/api/products/:id
productRouter.delete("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await prod.deleteProducts(id));
});

export default productRouter;
