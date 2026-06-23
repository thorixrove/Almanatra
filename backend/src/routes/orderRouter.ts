import { Router } from "express";
import { getOrder, listOrder, createStreamChannel, createVideoInvite } from "../controllers/orderController";

const router = Router();
router.get("/", listOrder)
router.get("/:id", getOrder)
router.get("/:id/stream-channel", createStreamChannel)
router.get("/id/video-invite", createVideoInvite )
export default router;