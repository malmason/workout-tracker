const router = require("express").Router();
const mongoose = require("mongoose");
// const { aggregate } = require("../models/workout.js");
const Workout = require("../models/workout.js");
const { ObjectId } = require('mongodb');

router.post("/api/workouts", ({ body }, res) => {
  console.log(body);
  Workout.create(body)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

router.put("/api/workouts/:id", (req, res) => {
  let id = ObjectId(req.params.id);
  console.log(req.params.id);
  console.log(req.body);

  // *** Command works in Mongosh:  workout> db.workouts.find({"_id": ObjectId( "60fc3dca24e43ce68894d7a3")}) / 
  // *** workout> db.workouts.updateOne({"_id": ObjectId("60fc58f0af3353ef145985a5")},{ $set: {"day": "7/25/2021", "exercises": [{"type": "resistance", "name": "Squats", "duration": 20, "weight": 100, "reps": 10, "sets": 3}]}}) - This also works from mongosh shell......

  Workout.collection.findOneAndUpdate({_id: id}, { $set: {
    exercises: [req.body],
  }}, { new: true })
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

router.get("/api/workouts", (req, res) => {
  Workout.aggregate().project({'day':1,'exercises.duration':1,'exercises.sets':1,'exercises.weight':1,'exercises.reps':1,'exercises.distance':1,'exercises.type':1,'exercises.name':1}).addFields(
  {totalDuration:{$sum: '$exercises.duration'},totalSets:{$sum: '$exercises.sets'},totalWeight:{$sum:'$exercises.weight'},totalReps:{$sum:'$exercises.reps'},
  totalDistance:{$sum:'$exercises.distance'}})
    .sort({ day: 1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
  })
    .catch(err => {
    res.status(400).json(err);
  });
});

router.get("/api/workouts/range", (req, res) => {
  const endDate = new Date().toISOString();
  const startDate = new Date().setDate(new Date().getDate() -7);
  const starting = new Date(startDate).toISOString();

  console.log(endDate);
  console.log(starting);
  
  Workout.aggregate().project({'day':1,'exercises.duration':1,'exercises.sets':1,'exercises.weight':1,'exercises.reps':1,'exercises.distance':1,'exercises.type':1,'exercises.name':1}).addFields(
    {totalDuration:{$sum: '$exercises.duration'},totalSets:{$sum: '$exercises.sets'},totalWeight:{$sum:'$exercises.weight'},totalReps:{$sum:'$exercises.reps'},
    totalDistance:{$sum:'$exercises.distance'}})
    .sort({ day: 1 })
    .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

// Review this route, may need updating. 
router.get("/exercise", (req, res) => {

  Workout.find({})
  .sort({ day: 1 })
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

module.exports = router;