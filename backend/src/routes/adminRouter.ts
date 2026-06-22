import { Router } from "express";
import { requireAdmin, 
    getImageKitAuth, 
    listAdminProducts, 
    createAdminProduct, 
    updateAdminProduct, 
    deleteAdminProduct } from "../controllers/adminController";

const router = Router()

router.use(requireAdmin)

router.get("/imagekit/auth", getImageKitAuth)
router.get("/products", listAdminProducts)
router.post("/products", createAdminProduct)
router.patch("/products", updateAdminProduct)
router.delete("/products/:id", deleteAdminProduct)
export default router