import { Router } from "express";
import { body, param } from "express-validator";
import { NoteController } from "../controllers/NoteController";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { TeamMemberController } from "../controllers/TeamController";
import { authenticate } from "../middleware/auth";
import { projectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.use(authenticate);

router.param("projectId", projectExists);

router.post(
  "/",

  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del client es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),

  handleInputErrors,

  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  ProjectController.getProjectById
);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),

  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del client es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),

  handleInputErrors,

  hasAuthorization,

  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  hasAuthorization,

  ProjectController.deleteProject
);

/* Routes for Tasks */
router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.post(
  "/:projectId/tasks",

  hasAuthorization,

  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),

  handleInputErrors,

  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTask);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",

  hasAuthorization,

  param("taskId").isMongoId().withMessage("ID no válido"),

  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),

  handleInputErrors,

  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",

  hasAuthorization,

  param("taskId").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no válido"),

  body("status").notEmpty().withMessage("El estado es obligatorio"),

  handleInputErrors,

  TaskController.updateStatus
);

// Routes for teams
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("E-mail no válido"),

  handleInputErrors,

  TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team", TeamMemberController.getProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  TeamMemberController.addMemberById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  TeamMemberController.removeMemberById
);

/* Routes for Notes */
router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota es obligatorio"),

  handleInputErrors,

  NoteController.createNote
);

router.get(
  "/:projectId/tasks/:taskId/notes",

  NoteController.getTaskNotes
);

router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",

  param("noteId").isMongoId().withMessage("ID no válido"),

  handleInputErrors,

  NoteController.deleteNote
);

export default router;
