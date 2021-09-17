import { Express, Request, Response, static as Static } from "express"
import multer from "multer"
import { User } from "../../../src/modules/users/User"
import { UserPayload } from "../../../src/modules/users/UserPayload"
import { ORIGIN } from "../configs"
import { getBrothersOfUser, getUsers, saveUser, updateUser, removeUser, getImageRoute, updateImagePath } from "./index"

export const initUsersRoutes = (app: Express) => {

    app.use('/userImages', Static('public/userImages'));

    const upload = multer({
        storage: multer.diskStorage({
            destination: 'public/userImages',
            filename: async (req, file, cb) => {
                try {
                    const userId = req.query.userId as string
                    const splitted = file.originalname.split('.')
                    const imageName = await getImageRoute(userId, splitted[splitted.length - 1])
                    const imagePath =   `${ORIGIN}/userImages/${imageName}`
                    await updateImagePath(userId, imagePath)
                    cb(null, imageName);
                } catch (error: any) {
                    cb(error, "")
                }

            }
        })
    })

    app.get('/users', (req: Request, res: Response) => {
        const { page, step, tagFilter, contentFilter } = req.query

        getUsers({
            page: parseInt(page as string, 10),
            step: parseInt(step as string, 10),
            tagFilter: tagFilter as string,
            contentFilter: contentFilter as string
        })
            .then(users => {
                res.status(200).send(users)
            })
            .catch(error => {
                res.status(503).send({ ok: false, message: error.message, stacktrace: error.stack })
            })
    })

    app.get('/familiars', (req: Request, res: Response) => {
        const { userId } = req.query

        getBrothersOfUser(userId as string)
            .then(familiars => {
                res.status(200).send(familiars)
            })
            .catch(error => {
                res.status(503).send({ ok: false, message: error.message, stacktrace: error.stack })
            })
    })

    app.post('/user', (req: Request, res: Response) => {
        const { user }: { user: UserPayload } = req.body

        saveUser(user)
            .then(savedUser => {
                res.status(200).send({ ok: true, user: savedUser })
            })
            .catch(error => {
                res.status(503).send({ ok: false, message: error.message, stacktrace: error.stack })
            })
    })

    app.delete('/user', (req: Request, res: Response) => {
        const { userId } = req.body

        removeUser(userId)
            .then(() => {
                res.status(200).send({ ok: true })
            })
            .catch(error => {
                res.status(503).send({ ok: false, message: error.message, stacktrace: error.stack })
            })
    })

    app.put('/user', (req: Request, res: Response) => {
        const { user }: { user: User } = req.body
        updateUser(user)
            .then(updatedUser => {
                res.status(200).send({ ok: true, user: updatedUser })
            })
            .catch((error: Error) => {
                res.status(503).send({ ok: false, message: error.message, stacktrace: error.stack })
            })
    })

    app.post('/userImage', upload.single('image'), (req: Request, res: Response) => {
        if (req.file) {
            const image = req.file
            res.status(200).send({ ok: true })
        }
        else res.status(500).send({ error: "Not image sended" })
    })

}