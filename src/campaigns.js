const express = require("express");
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create new campaign
// This endpoint handles the data coming from the React Native form
router.post("/", async (req, res) => {
  try {
    // Extract fields from request body (matches frontend form fields)
    const { 
      title, // Note: This is sent from frontend but not stored in DB model
      description, 
      targetAmount, 
      equity, 
      minimumInvestment,
      businessPlan,
      financialProjections,
      marketAnalysis,
      riskFactors
    } = req.body;

    // Set default dates for campaign duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Default 30-day campaign

    // Create campaign record
    const campaign = await prisma.campaign.create({
      data: {
        // Map frontend field names to database field names
        title,
        description,
        targetAmt: targetAmount ? parseInt(targetAmount, 10) : 0,
        equityOffered: equity ? parseFloat(equity) : 0,
        minInvestmentAmt: minimumInvestment ? parseInt(minimumInvestment, 10) : 0,
        buisnessPlan: businessPlan || "",
        financialProjec: financialProjections || "",
        marketAnalysis: marketAnalysis || "",
        riskFactor: riskFactors || "",
        startDate,
        endDate,
        isActive: true
      },
    });
    
    console.log("Campaign created successfully", campaign);
    res.json(campaign);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

// Update campaign
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      targetAmount, 
      equity, 
      minimumInvestment,
      businessPlan,
      financialProjections,
      marketAnalysis,
      riskFactors,
      isActive
    } = req.body;
    
    // Update only the fields that are provided
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        description,
        targetAmt: targetAmount ? parseInt(targetAmount, 10) : undefined,
        equityOffered: equity ? parseFloat(equity) : undefined,
        minInvestmentAmt: minimumInvestment ? parseInt(minimumInvestment, 10) : undefined,
        buisnessPlan: businessPlan,
        financialProjec: financialProjections,
        marketAnalysis,
        riskFactor: riskFactors,
        isActive: isActive !== undefined ? isActive : undefined
      },
    });
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

// Delete campaign
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.delete({
      where: { id },
    });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;