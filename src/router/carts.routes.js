import { Router } from "express";
import CartManager from "../Managers/cartManager.js";

const cartRouter = Router();
const cart = new CartManager("./src/models/carts.json");

// http://localhost:8080/api/cart
cartRouter.post("/", async (req, res) => {
  res.send(await cart.addCart());
});

// http://localhost:8080/api/cart
cartRouter.get("/", async (req, res) => {
  res.send(await cart.readCart());
});

// http://localhost:8080/api/cart/:id
cartRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await cart.getCartById(id));
});

// http://localhost:8080/api/cart/:cid/products/:pid
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    res.send(await cart.addProductCart(cartId, prodId));
})

export default cartRouter;
