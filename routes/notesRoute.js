const express = require('express');
const { createNewNote, showMyNotes, deleteNote, viewNote, updateNote } = require('../src/controller/notesController');

const router = express.Router();


// Import Controllers



// Notes Route Handler
router.post('/', createNewNote)
router.get('/', showMyNotes)
router.get('/:id', viewNote)
router.put('/:id', updateNote)
router.delete('/:id', deleteNote)
module.exports = router;