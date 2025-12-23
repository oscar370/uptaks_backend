import type { Request, Response } from "express";
import { Types } from "mongoose";
import { INote, Note } from "../models/Note";

type NoteParams = {
  noteId: Types.ObjectId;
};

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
    const note = new Note();

    note.content = content;
    note.createdBy = req.user._id;
    note.task = req.task._id;

    req.task.notes.push(note._id);

    try {
      await Promise.allSettled([req.task.save(), note.save()]);
      res.send("Nota creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error crear la nota" });
    }
  };

  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task._id })
        .populate({ path: "completedBy.user", select: "id name email" })
        .populate({
          path: "notes",
          populate: { path: "createdBy", select: "id name email" },
        });

      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al obtener la nota" });
    }
  };

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    try {
      const { noteId } = req.params;
      const note = await Note.findById(noteId);

      if (!note) {
        const error = new Error("Nota no encontrada");
        return res.status(404).json({ error: error.message });
      }

      if (note.createdBy.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(401).json({ error: error.message });
      }

      req.task.notes = req.task.notes.filter(
        (note) => note.toString() !== noteId.toString()
      );

      await Promise.allSettled([note.deleteOne(), req.task.save()]);
      res.send("Nota eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al eliminar la nota" });
    }
  };
}
