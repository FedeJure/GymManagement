import { Express, Request, Response } from "express"
import { User } from "../../../src/modules/users/User"
import { UserPayload } from "../../../src/modules/users/UserPayload"
import {getBrothersOfUser, getUsers, saveUser, updateUser, removeUser} from "./index"

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
                res.status(500).send({ error })
            })
    })

    app.get('/brothers', (req: Request, res: Response) => {
        const { userId } = req.query

        getBrothersOfUser(userId as string)
            .then(brothers => {
                res.status(200).send(brothers)
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })

    app.post('/user', (req: Request, res: Response) => {
        const { user }: { user: UserPayload } = req.body

        saveUser(user)
            .then(savedUser => {
                res.status(200).send({ ok: true, user: savedUser })
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })

    app.delete('/user', (req: Request, res: Response) => {
        const { userId } = req.body

        removeUser(userId)
            .then(() => {
                res.status(200).send({ ok: true })
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })

    app.put('/user', (req: Request, res: Response) => {
        const { user }: { user: User } = req.body

        updateUser(user)
            .then(updatedUser => {
                res.status(200).send({ ok: true, user: updatedUser })
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })

}