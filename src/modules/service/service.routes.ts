import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import {
  addService,
  editService,
  getService,
  getServices,
  removeService,
} from "./service.controller";

const serviceRouter: IRouter = Router();

serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getService);

serviceRouter.post("/", auth("TECHNICIAN", "ADMIN"), addService);
serviceRouter.patch("/:id", auth("TECHNICIAN", "ADMIN"), editService);
serviceRouter.delete("/:id", auth("TECHNICIAN", "ADMIN"), removeService);

export default serviceRouter;
