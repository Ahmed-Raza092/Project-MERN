const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')


//@desc Get goals
// @route GET /api/goals
//@access Private

const getGoals = asyncHandler( async (req, res)=>{ 
    const goals = await Goal.find({ user: req.user.id })


    res.status(200).json(goals)
})

const setGoal = asyncHandler( async (req, res)=>{

    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })
   
    res.status(200).json(goal)
})

const updateGoal = asyncHandler( async (req, res)=>{

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    // Check for User
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }


    // make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not Authorized')

    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json(updatedGoal)
})


const deleteGoal = asyncHandler( async (req, res)=>{

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }else{
        await Goal.findByIdAndDelete(req.params.id)
    }

    const user = await User.findById(req.user.id)

    // Check for User
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }


    // make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not Authorized')

    }

   

    res.status(200).json({id: req.params.id})
})



module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal

}