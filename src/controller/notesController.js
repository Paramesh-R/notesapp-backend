const Notes = require('../models/NotesModel');
const jwt = require('jsonwebtoken');

const ITEMS_PER_PAGE = 10;

exports.createNewNote = async (req, res) => {
    try {
        // const user_id = await jwt.verify(req.cookies.token, process.env.JWT_SECRET).id// This method is not getting cookies in render
        console.log("Creating New Note");
        const user_id = await jwt.verify(req.get('token'), process.env.JWT_SECRET).id
        const newNote = new Notes({ ...req.body, createdBy: user_id });
        console.log(user_id);
        await newNote.save()
            .then(result => {
                res.status(201).json({
                    status: 'success',
                    success: true,
                    data: result,
                    message: "Note created successfully",
                    type: "Success",
                })
            })
            .catch(err => console.log("Error Creating New Note: ", err))
    } catch (error) {
        console.log(error)
    }
}


exports.showMyNotes = async (req, res) => {
    const page = req.query.page || 1;
    console.log("Show result: Pg ", page)

    // const author_query = req.query.author ? { 'author': req.query.author } : {};

    try {
        // const user_id = await jwt.verify(req.cookies.token, process.env.JWT_SECRET).id || ""; // req.cookies.token is not working in Render
        const user_id = await jwt.verify(req.get('token'), process.env.JWT_SECRET).id || ""

        const skip = (page - 1) * ITEMS_PER_PAGE  //Page 2: (1*5 =>5)
        const count = await Notes.count({ 'createdBy': user_id })
        const pageCount = Math.ceil(count / ITEMS_PER_PAGE) || 1;

        const items = await Notes
            .find({ 'createdBy': user_id })
            .sort({ createdAt: -1 })
            .limit(ITEMS_PER_PAGE)
            .skip(skip)

        // console.log({ page, items, count, pageCount })
        res.status(200)
            .send({ page, items, count, pageCount })

    } catch (err) {
        console.log(err)
        res.status(304).send(err)
    }




    // console.log(req.body)
    // res.status(200).send("Done")
}


exports.deleteNote = async (req, res) => {
    console.log("Delete note")
    console.log(req.params.id)
    Notes
        .findByIdAndDelete(req.params.id)
        .then(
            result =>
                res
                    .status(200)
                    .send({
                        success: true,
                        data: result,
                        message: "Note deleted successfully",
                        type: "success"
                    })
        )
        .catch(err => console.log('Error while deleting note: ', err))
}

exports.viewNote = async (req, res) => {
    try {
        const user_id = await jwt.verify(req.get('token'), process.env.JWT_SECRET).id
        const filter = { _id: req.params.id, createdBy: user_id };


        await Notes.findOne(                                    //referred from mongoose
            filter,
            // { $inc: { "viewCount": 1 } },
            // { returnOriginal: false }
        )
            .then((result) => {
                res.json(result);
                console.log("view Note result sent.")
            })
            .catch((err) => res.send("ERROR View Notes: " + err))
    } catch (error) {
        console.log("Error View Note", error)
    }
}

exports.updateNote = async (req, res) => {
    try {
        console.log("Entered Update Notes Function")
        const user_id = await jwt.verify(req.get('token'), process.env.JWT_SECRET).id
        
        const filter = { _id: req.params.id, createdBy: user_id };
        const update = req.body;
        console.log(req.body)
        await Notes.findOneAndUpdate(filter, update, { returnOriginal: false }) //referred from mongoose
            .then((result) => res.send({ message: "Content updated successfully", result }))
            .catch((err) => res.send(err))

    } catch (error) {
        console.log("Update Note Error" + error)
    }
}