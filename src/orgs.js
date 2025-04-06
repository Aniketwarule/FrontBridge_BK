const express = require("express");
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get("/all", async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany();
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const {id} = req.params;
    const org = await prisma.organization.findUnique({
      where: {id},
    });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, industry, numberOfEmployees, email, phone, password, website, businessDescription, faqs, location } = req.body;
    const org = await prisma.organization.create({
      data: {
        name,
        industry,
        numberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees, 10) : 0,
        email,
        phone,
        password,
        website,
        businessDescription,
        isActive: true,
        isVerified: false,
        isApplied: false,
        location,
      },
    });
    console.log("sucess",res.json(org));
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry, numberOfEmployees, email, phone, password, website, businessDescription, location } = req.body;
    const org = await prisma.organization.update({
      where: { id },
      data: {
        name,
        industry,
        numberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees, 10) : 0,
        email,
        phone,
        password,
        website,
        businessDescription,
        location,
      },
    });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
    
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const org = await prisma.organization.delete({
      where: { id },
    });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;