const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })

  .then(() => {
    const recipe1 = {
      title: "Lasagna",
      level: "Amateur Chef",
      ingredientes: ["tomate", "pasta", "cebolla", "oregano", "sal", "pimienta", "soja texturizada"],
      cuisine: "Italiana",
      dishType: "main_course",
      duration: 70,
      creator: "Jesi"
    };
    return Recipe.create(recipe1)
  })
  .then(recipe => {
      console.log(`Recipe created: ${recipe.title}`)
      return Recipe.insertMany(data)
    })
  .then( () => {
    console.log(`Recipes created from data`)
    return Recipe.find({}, { title: 1, _id: 0}) 
    })
    .then(recipes => {
      console.log(recipes)
      return Recipe.findOneAndUpdate({title: "Rigatoni alla Genovese"}, {$set: {duration: 100}}, {new: true})
    })  
    .then(recipes => { 
      console.log(`${recipes.title} updated succesfully`)
      return Recipe.deleteOne({ title: "Carrot Cake" })
    })
    .then(recipes => {
        console.log(`Recipe deleted succesfully`);
        mongoose.connection.close()
          .then( () => console.log("Connection closed"))
          .catch(error => console.error(error))
    })
  .catch(error => {
    console.error('Error connecting to the database');
  });