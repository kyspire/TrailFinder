import express from 'express';
import * as userService from '../services/ugcService.js';
import { authenticateToken } from "./authRouter.js";
import * as dataService from "../services/dataService.js";

const router = express.Router();

// Get ugc to be refactored later
// router.get('/', authenticateToken, async (req, res) => {
//     const { userId } = req.user;
//     const profileResult = await userService.getProfile(userId);
//     if (profileResult) {
//         console.log('User profile GET success - 200');
//         res.json({ success: true, profile: profileResult });
//     } else {
//         res.status(500).json({ success: false, error: 'Failed to GET Profile' })
//     }
// });


// Add friend
router.put('/review', authenticateToken, async (req, res) => {
    const { message, rating, locationname, latitude, longitude, trailname } = req.body;
    userService.addReview(message, rating, locationname, latitude, longitude, trailname, req.user["userId"])
        .then((result) => {
            console.log('UGC Review ADD success - 200');
            res.json({ success: true })
        }).catch((e) => {
            res.status(500).json({ success: false, error: e.message });
        });
});

router.delete('/review', authenticateToken, async (req, res) => {
    const { ugcid } = req.body;
    userService.deleteReview(ugcid)
        .then((result) => {
            console.log('UGC Review Delete success - 200');
            res.json({ success: true })
        }).catch((e) => {
        res.status(500).json({ success: false, error: e.message });
    });
});

router.get("/user", async (req, res) => {
    const { locationname, latitude, longitude, trailname, rating } = req.query;
    const result = await userService.joinUserUGC(locationname, latitude, longitude, trailname, rating);
    if (result === -1) {
        res.status(500).json({ success: false, error: 'attributes Invalid or No Rows Exist' });
    } else {
        console.log("Join UGC Review Success - 200");
        res.json({ success: true, ugc: result });
    }
});


export default router;