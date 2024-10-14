import { Router } from "express";

const router = Router();

// GET /payments

router.get("/", (req, res) => {
    res.send("Payments Route");
})
    
// POST /payments
    
router.post("/", (req, res) => {
    res.send("Payments Route");
})
    
// GET /payments/:id
    
router.get("/:id", (req, res) => {
    res.send("Payments Route");
})


export default router;
