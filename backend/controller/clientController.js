import asyncHandler from 'express-async-handler';
import Client from '../Models/Client.js';
import User from '../Models/User.js';
import Role from '../Models/Role.js';

// * Private
const getClients = asyncHandler(async (req, res) => {
  // Check if user has permission to view clients
  if (req.user.role.clientsView === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  const { search } = req.query;
  
  let query = {};
  
  // Add search functionality
  if (search && search.trim()) {
    query = {
      name: { $regex: search, $options: 'i' }
    };
  }

  const clients = await Client.find(query).sort({ createdAt: -1 });

  const users = await User.find();

  let data = [];

  clients.forEach((client) => {
    let docs = users.filter((obj) => {
      return obj.clients && obj.clients.includes(client._id.toString())
    });

    data.push({ ...client._doc, users: docs.length });
  });

  res.json(data);
});

// * Private
const addClient = asyncHandler(async (req, res) => {
  if (req.user.role.clientsAdd === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  const { name } = req.body;

  if (!name) {
    res.status(400)
    throw new Error('Client name is required')
  }

  // * Find client by name
  const clientFound = await Client.findOne({ name });

  if (!clientFound) {
    const newClient = new Client({ name });

    if (newClient) {
      await newClient.save();

      // Find the role IDs for Field Executive and Super Admin
      const roles = await Role.find({ name: { $in: ['Field Executive', 'Super Admin'] } });
      const roleIds = roles.map(role => role._id);

      // Automatically assign the client to Field Executives and Super Admins
      await User.updateMany(
        { role: { $in: roleIds } },
        { $addToSet: { clients: newClient._id } }
      );

      res.status(201).json(newClient);
    } else {
      res.status(400)
      throw new Error('Error creating client')
    }
  } else {
    res.status(409)
    throw new Error('Client already exists')
  }
});

// * Private
const updateClient = asyncHandler(async (req, res) => {
  if (req.user.role.clientsUpdate === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  const { name } = req.body;

  if (!name) {
    res.status(400)
    throw new Error('Client name is required')
  }

  // * Find client by ID
  const clientFound = await Client.findById(req.params.id);

  const clientFoundWithName = await Client.findOne({ name });

  if (clientFound) {
    if (clientFoundWithName) {
      if (
        clientFoundWithName._id.toString() !== clientFound._id.toString()
      ) {
        res.status(409)
        throw new Error('Client already exists')
      }
    }

    await Client.findByIdAndUpdate(clientFound._id, {
      name,
    });

    const client = await Client.findById(clientFound._id);

    res.json(client);
  } else {
    res.status(404)
    throw new Error('No client found')
  }
});

// * Private
const deleteClient = asyncHandler(async (req, res) => {
  if (req.user.role.clientsDelete === false) {
    res.status(400)
    throw new Error('You are not authorized to perform this request')
  }

  // * Find client by ID
  const clientFound = await Client.findById(req.params.id);

  if (clientFound) {
    // Remove client from all users
    await User.updateMany(
      { clients: clientFound._id },
      { $pull: { clients: clientFound._id } }
    );

    // Delete the client
    await Client.findByIdAndDelete(clientFound._id);

    res.json({ 
      message: 'Client deleted successfully',
      deletedId: clientFound._id 
    });
  } else {
    res.status(404)
    throw new Error('No client found')
  }
});

export { getClients, addClient, updateClient, deleteClient };