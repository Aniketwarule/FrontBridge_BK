const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create new investor
router.post("/register", async (req, res) => {
     try {
       const { firstName, lastName, email, phone, password, industryInterests, investmentScale, isActive = true } = req.body;
       
       // Check if user with this email already exists
       const existingUser = await prisma.investor.findUnique({
         where: { email }
       });
       
       if (existingUser) {
         return res.status(409).json({ message: "An account with this email already exists" });
       }
       
       // Create the investor in the database with plain password
       const investor = await prisma.investor.create({
         data: {
           firstName,
           lastName,
           email,
           phone,
           password, // Store the password directly without encryption
           industryInterests,
           investmentScale,
           isActive,
         },
       });
       
       // Return the created investor (minus the password)
       const { password: _, ...investorData } = investor;
       res.status(201).json(investorData);
     } catch (error) {
       console.error("Registration error:", error);
       res.status(500).json({ 
         message: "Failed to create account", 
         error: process.env.NODE_ENV === 'development' ? error.message : undefined 
       });
     }
   });

// Get all investors
router.get("/", async (req, res) => {
  try {
    const investors = await prisma.investor.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        industryInterests: true,
        investmentScale: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password field for security
      }
    });
    res.json(investors);
  } catch (error) {
    console.error("Error fetching investors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Modified login route for the backend
router.post("/login", async (req, res) => {
     try {
       const { email, password } = req.body;
       
       const investor = await prisma.investor.findUnique({ 
         where: { email } 
       });
       
       if (!investor) {
         return res.status(404).json({ message: 'User not found' });
       }
       
       // Since passwords aren't encrypted in your system (not recommended), 
       // we can directly compare
       if (investor.password === password) {
         // Return investor data without password
         const { password: _, ...investorData } = investor;
         return res.status(200).json(investorData);
       } else {
         return res.status(401).json({ message: 'Invalid credentials' });
       }
     } catch (error) {
       console.error("Login error:", error);
       return res.status(500).json({ message: 'Server error' });
     }
   });
// Get investor by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const investor = await prisma.investor.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        industryInterests: true,
        investmentScale: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      }
    });
    
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }
    
    res.json(investor);
  } catch (error) {
    console.error("Error fetching investor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;