import { Express, Request, Response } from "express"
import multer from "multer"
import { User } from "../../../src/modules/users/User"
import { UserPayload } from "../../../src/modules/users/UserPayload"
import { getBrothersOfUser, getUsers, saveUser, updateUser, removeUser } from "./index"


const upload = multer({ dest: 'images/' })

export const initUsersRoutes = (app: Express) => {

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
                res.status(503).send({ok: false, message: error.message, stacktrace: error.stack})
            })
    })

    app.get('/familiars', (req: Request, res: Response) => {
        const { userId } = req.query

        getBrothersOfUser(userId as string)
            .then(familiars => {
                res.status(200).send(familiars)
            })
            .catch(error => {
                res.status(503).send({ok: false, message: error.message, stacktrace: error.stack})
            })
    })

    app.post('/user', (req: Request, res: Response) => {
        const { user }: { user: UserPayload } = req.body

        saveUser(user)
            .then(savedUser => {
                res.status(200).send({ ok: true, user: savedUser })
            })
            .catch(error => {
                res.status(503).send({ok: false, message: error.message, stacktrace: error.stack})
            })
    })

    app.delete('/user', (req: Request, res: Response) => {
        const { userId } = req.body

        removeUser(userId)
            .then(() => {
                res.status(200).send({ ok: true })
            })
            .catch(error => {
                res.status(503).send({ok: false, message: error.message, stacktrace: error.stack})
            })
    })

    app.put('/user', (req: Request, res: Response) => {
        const { user }: { user: User } = req.body
        updateUser(user)
            .then(updatedUser => {
                res.status(200).send({ ok: true, user: updatedUser })
            })
            .catch((error: Error) => {
                res.status(503).send({ok: false, message: error.message, stacktrace: error.stack})
            })
    })

    app.post('/userImage', upload.single('image'), (req: Request, res: Response) => {
        const { userId }: { userId: string } = req.body
        if (req.file && userId) {
            const image = req.file
            console.log(image)
            res.status(200).send({ ok: true })
        }
        else res.status(500).send({ error: "Not image sended" })
    })

}