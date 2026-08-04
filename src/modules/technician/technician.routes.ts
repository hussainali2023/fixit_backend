import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import {
  editAvailability,
  editProfile,
  getTechnician,
  getTechnicians,
} from "./technician.controller";

const technicianRouter: IRouter = Router();

technicianRouter.get("/", getTechnicians);
technicianRouter.get("/:id", getTechnician);

technicianRouter.put("/profile", auth("TECHNICIAN"), editProfile);
technicianRouter.put("/availability", auth("TECHNICIAN"), editAvailability);

export default technicianRouter;
