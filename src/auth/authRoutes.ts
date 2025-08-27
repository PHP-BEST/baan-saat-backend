import { Router, Request, Response } from "express"
import passport from "passport";
import { clientUrl } from "../configs/configs";

const router = Router();

const redirectRoute = {
    failureRedirect: `${clientUrl}/login`,
    successRedirect: `${clientUrl}`
};

const addSocialRoutes = (socials: string[]) => {
    socials.map(social => {
        router.get(
            `/auth/${social}`,
            passport.authenticate(social)
        );
        router.get(
            `/auth/${social}/callback`, 
            passport.authenticate(social, redirectRoute)
        );
    })
}

addSocialRoutes(["google", "facebook", "line"])

router.delete(
    "/logout", 
    (req: Request, res: Response) => {
        req.logOut(error => console.error(error))
        res.redirect(`${clientUrl}/login`)
    }
)

export default router