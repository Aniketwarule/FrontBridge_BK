
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {       
        const { firstName, lastName, email, phone, password, industryInterests, investmentScale, isActive } = req.body;
        const investor = await prisma.investor.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password,
                industryInterests,
                investmentScale,
                isActive,
            },
        });
        res.json(investor);
    });

router.get("/", async (req, res) => {
    try {
        const investors = await prisma.investor.findMany();
        res.json(investors);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;