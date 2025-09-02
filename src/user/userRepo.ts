import { IUser } from "../models/User";
import { Request, Response } from "express";

const getUserSession = async (
    req: Request,
    res: Response
) => {
    if (req.user) {
        const user = (req.user as IUser)
        res.json({
            username: user.name,
            profileUrl: user.profileUrl
        })
    }
    else {
        res.status(401).send();
    }
}