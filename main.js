const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// get all useraccounts
app.get('/UserAccounts', async (req, res) => {
  try {
    // Fetch all UserAccount records using Prisma
    const userAccounts = await prisma.userAccount.findMany({
      include: {
        userProfile: true // If you want to include the associated UserProfile
      }
    })

    return res.json(userAccounts)
  } catch (error) {
    console.error('Error fetching user accounts:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})




app.get('/UserAccount/:id', async (req, res) => {
  try {
    const userId = req.params.id // Use the id as a string, not parsed to an integer

    // Fetch the UserAccount by its ID using Prisma
    const user = await prisma.userAccount.findUnique({
      where: { id: userId }, // Use userId as a string
      include: {
        userProfile: true // If you want to include the associated UserProfile
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})


// post useraccount
app.post('/useraccount', async (req, res) => {
  try {
    const { user_name, email, mob_number } = req.body

    // Validate the request body
    if (!user_name || !email || !mob_number) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create a new UserAccount using Prisma without providing the 'id'
    const newUser = await prisma.userAccount.create({
      data: {
        user_name,
        email,
        mob_number
      }
    })

    return res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
