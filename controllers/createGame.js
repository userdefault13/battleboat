const Game = require('../models/Game'); // You need to import the Game model

const createGame = async (req, res) => {
    try {
        // Create a new game with a single player who initializes game
        // The game's name and other fields can be added later
        const { userId } = req.body;
        const newGame = new Game({
            player1: userId, 
            status: 'active'
        });
        await newGame.save();
        
        res.status(201).json({ message: 'Game created successfully', game: newGame });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createGame };
