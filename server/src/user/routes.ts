import { Express, Request, Response, static as Static } from "express";
import multer from "multer";
import { User } from "../../../src/domain/users/User";
import { UserPayload } from "../../../src/domain/users/UserPayload";
import { ORIGIN, STATIC_DIR } from "../configs";
import { getNowDate } from "../utils/date";
import {
  getBrothersOfUser,
  getUsers,
  saveUser,
  updateUser,
  removeUser,
  getImageRoute,
  updateImagePath,
  getConfig,
} from "./index";

export const initUsersRoutes = (app: Express) => {
  app.use("/userImages", Static(STATIC_DIR));

  const upload = multer({
    storage: multer.diskStorage({
      destination: "public/userImages",
      filename: async (req, file, cb) => {
        try {
          const userId = req.query.userId as string;
          const splitted = file.originalname.split(".");
          const imageName = `${getNowDate().getTime()}-${await getImageRoute(
            userId,
            splitted[splitted.length - 1]
          )}`;
          const imagePath = `${ORIGIN}/userImages/${imageName}`;
          await updateImagePath(userId, imagePath);
          cb(null, imageName);
        } catch (error: any) {
          cb(error, "");
        }
      },
    }),
  });

  app.get("/user/config", (req: Request, res: Response) => {
    getConfig()
      .then((config) => {
        res.status(200).send(config);
      })
      .catch((error) => {
        res.status(500).send({ ok: false, message: error.message });
      });
  });

  app.get("/users", (req: Request, res: Response) => {
    const { page, step, tagFilter, contentFilter } = req.query;

    getUsers({
      page: parseInt(page as string, 10),
      step: parseInt(step as string, 10),
      tagFilter: tagFilter as string,
      contentFilter: contentFilter as string,
    })
      .then((users) => {
        res.status(200).send(users);
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.get("/familiars", (req: Request, res: Response) => {
    const { userId } = req.query;

    getBrothersOfUser(userId as string)
      .then((familiars) => {
        res.status(200).send(familiars);
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.post("/user", (req: Request, res: Response) => {
    const { user }: { user: UserPayload } = req.body;

    saveUser(user)
      .then((savedUser) => {
        res.status(200).send({ ok: true, user: savedUser });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.delete("/user", (req: Request, res: Response) => {
    const { userId } = req.body;

    removeUser(userId)
      .then((user) => {
        res.status(200).send({ ok: true });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.put("/user", (req: Request, res: Response) => {
    const { userId, user }: {userId: string, user: Partial<UserPayload> } = req.body;
    updateUser(userId, user)
      .then((updatedUser) => {
        res.status(200).send({ ok: true, user: updatedUser });
      })
      .catch((error: Error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.post(
    "/userImage",
    upload.single("image"),
    (req: Request, res: Response) => {
      if (req.file) {
        res.status(200).send({ ok: true });
      } else res.status(500).send({ error: "Not image sended" });
    }
  );
};
