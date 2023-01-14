const { default: mongoose } = require('mongoose')
const Tour = require('../models/tour')

const createTour = async (req, res) => {

    //   console.log('jhhh');

    const tour = req.body

    const newTour = new Tour({
        ...tour,

        creator: req.userId,
        createdAt: new Date().toISOString()
    })


    try {
        await newTour.save()
        res.status(201).json(newTour)
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }

}

const getTours = async (req, res) => {
    const { page } = req.query
    try {
        // const tours = await Tour.find();
        // res.status(201).json(tours)

        const limit = 6;
        const startIndex = (Number(page) - 1) * limit;
        const total = await Tour.countDocuments({});
        const tours = await Tour.find().limit(limit).skip(startIndex)
        res.json({
            data: tours,
            currentPage: Number(page),
            totalTours: total,
            numberOfPages: Math.ceil(total / limit)
        })

    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }
}


const getTour = async (req, res) => {
    const { id } = req.params;

    try {
        const tour = await Tour.findById(id);

        res.status(200).json(tour)

    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }
}


const getToursByUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "User doesn't exist" })
    }

    const userTours = await Tour.find({ creator: id })

    res.status(200).json(userTours)

}

const deleteTour = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No tour exist with id: ${id}` })
        }
        await Tour.findByIdAndRemove(id);
        res.json({ message: "Tour deleted successfully" })
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }
}

const updateTour = async (req, res) => {

    const { id } = req.params;

    const { title, description, creator, imageFile, tags } = req.body

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No tour exist with id : ${id}` })
        }

        const updatedTour = {
            creator, title, description, imageFile, tags, _id: id,
        }

        await Tour.findByIdAndUpdate(id, updatedTour, { new: true })
        res.json(updatedTour)
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }

}

const getToursBySearch = async (req, res) => {
    const { searchQuery } = req.query;

    try {
        const title = new RegExp(searchQuery, "i")



        const tours = await Tour.find({ title })
        res.json(tours)

    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }
}

const getToursByTag = async (req, res) => {

    const { tag } = req.params;

    try {
        //  $in is a MongoDB operator which is used to match a field in a document against an array of values.
        const tours = await Tour.find({ tags: { $in: tag } })
        res.json(tours)
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }

}

const getRelatedTours = async (req, res) => {
    const tags = req.body
    try {
        const tours = await Tour.find({ tags: { $in: tags } })
        res.json(tours)
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }
}

const likeTour = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.userId) {
            return res.json({ message: "User is not authenticated" })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No tour exist with id: ${id}` })
        }

        const tour = await Tour.findById(id)

        const index = tour.likes.findIndex((id) => id === String(req.userId))

        if (index === -1) {
            tour.likes.push(req.userId);
        } else {
            tour.likes = tour.likes.filter((id) => id !== String(req.userId))
        }

        const updatedTour = await Tour.findByIdAndUpdate(id, tour, { new: true, })

        res.status(200).json(updatedTour)

    } catch (error) {
        res.status(404).json({ message: "Something went wrong" })
    }
}



module.exports = { createTour, getTours, getTour, getToursByUser, deleteTour, updateTour, getToursBySearch, getToursByTag, getRelatedTours, likeTour }