const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// get all useraccounts
app.get('/UserAccounts', async (req, res) => {
  try {
    const userAccounts = await prisma.userAccount.findMany({
      include: {
        userProfile: true 
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
    const userId = req.params.id 
    const user = await prisma.userAccount.findUnique({
      where: { id: userId }, 
      include: {
        userProfile: true 
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
    if (!user_name || !email || !mob_number) {
      return res.status(400).json({ error: 'Missing required fields' })
      }
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
// DELETE useraccount 
app.delete('/useraccount/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const user = await prisma.userAccount.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const deletedUser = await prisma.userAccount.delete({
      where: { id: userId }
    })
    return res.json(deletedUser)
  } catch (error) {
    console.error('Error deleting user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})
// UPDATE useraccount
app.put('/useraccount/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const { user_name, email, mob_number } = req.body
    if (!user_name || !email || !mob_number) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const user = await prisma.userAccount.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const updatedUser = await prisma.userAccount.update({
      where: { id: userId },
      data: {
        user_name,
        email,
        mob_number
      }
    })
    return res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
