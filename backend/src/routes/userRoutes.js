import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.sendStatus(200);
});

export default router;
