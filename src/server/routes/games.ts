import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Get all games" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get game ${req.params.id}` });
});

router.post("/", (_req, res) => {
  res.json({ message: "Create new game" });
});

export default router;
