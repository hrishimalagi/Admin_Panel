// server.js (Express backend)

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// File path for storing data
const dataFilePath = path.join(__dirname, 'data.json');

// Load data from the file or use an empty array
let names = [];

// Load data from the file
function loadDataFromFile() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const data = fs.readFileSync(dataFilePath, 'utf8');
            if (data) {
                names = JSON.parse(data);
            } else {
                console.log('Data file is empty.');
            }
        } else {
            console.log('Data file does not exist.');
        }
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

// Save data to the file
function saveDataToFile() {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(names), 'utf8');
    } catch (err) {
        console.error('Error saving data:', err);
    }
}

// Initialize by loading data from file
loadDataFromFile();

// Routes
// Get all names
app.get('/api/names', (req, res) => {
    res.json(names);
});

// Add a new name
app.post('/api/names/add', (req, res) => {
    const newName = req.body.name;
    if (!newName) {
        return res.status(400).json({ error: 'Name is required' });
    }
    names.push(newName);
    saveDataToFile();
    res.status(201).json({ message: 'Name added successfully', name: newName });
});

// Update a name
app.put('/api/names/update/:oldName', (req, res) => {
    const oldName = req.params.oldName;
    const newName = req.body.newName;

    if (!newName) {
        return res.status(400).json({ error: 'New name is required' });
    }

    const index = names.indexOf(oldName);
    if (index !== -1) {
        names[index] = newName;
        saveDataToFile();
        res.json({ message: 'Name updated successfully', oldName, newName });
    } else {
        res.status(404).json({ error: 'Name not found' });
    }
});

// Delete a name
app.delete('/api/names/delete/:name', (req, res) => {
    const nameToRemove = req.params.name;

    const index = names.indexOf(nameToRemove);
    if (index !== -1) {
        names.splice(index, 1);
        saveDataToFile();
        res.json({ message: 'Name deleted successfully', deletedName: nameToRemove });
    } else {
        res.status(404).json({ error: 'Name not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
