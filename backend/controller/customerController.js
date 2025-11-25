import asyncHandler from 'express-async-handler';

import Customer from '../Models/Customer.js';
import User from '../Models/User.js';
import Role from '../Models/Role.js';

// * Private
const getCustomers = asyncHandler(async (req, res) => {
  if (req.user.role.customersView === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  const { search } = req.query;
  
  let query = {};
  
  // Add search functionality
  if (search && search.trim()) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { logo: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const customers = await Customer.find(query)

  const users = await User.find()

  let data = []

  customers.forEach((customer) => {
    let docs = users.filter((obj) => {
      return obj.customers.includes(customer._id.toString())
    })

    data.push({ ...customer._doc, users: docs.length })
  })

  res.json(data)
})

// * Private
const addCustomer = asyncHandler(async (req, res) => {
  if (req.user.role.customersAdd === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  const { name, logo, mapOnPDF, openTransfers } = req.body

  // * Find customer by name
  const customerFound = await Customer.findOne({ name })

  if (!customerFound) {
    const newCustomer = new Customer({ name, logo, mapOnPDF, openTransfers })

    if (newCustomer) {
      await newCustomer.save()

      // Find the role IDs for Field Executive and Super Admin
      const roles = await Role.find({ name: { $in: ['Field Executive', 'Super Admin'] } })
      const roleIds = roles.map(role => role._id)

      // Automatically assign the customer to Field Executives and Super Admins
      await User.updateMany(
        { role: { $in: roleIds } },
        { $addToSet: { customers: newCustomer._id } }
      )

      res.json(newCustomer)
    } else {
      res.status(400)
      throw new Error('Error creating customer')
    }
  } else {
    res.status(409)
    throw new Error('Customer already exists')
  }
})

// * Private
const updateCustomer = asyncHandler(async (req, res) => {
  if (req.user.role.customersUpdate === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  const { name, logo, mapOnPDF, openTransfers } = req.body

  // * Find customer by name
  const customerFound = await Customer.findById(req.params.id)

  const customerFoundWithName = await Customer.findOne({ name })

  if (customerFound) {
    if (customerFoundWithName) {
      if (
        customerFoundWithName._id.toString() !== customerFound._id.toString()
      ) {
        res.status(409)
        throw new Error('Customer already exists')
      }
    }

    await Customer.findByIdAndUpdate(customerFound._id, {
      name,
      logo,
      mapOnPDF,
      openTransfers,
    })

    const customer = await Customer.findById(customerFound._id)

    res.json(customer)
  } else {
    res.status(409)
    throw new Error('No customer found')
  }
})

export { getCustomers, addCustomer, updateCustomer }