const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
const User = require('../../models/User');
const Game = require('../../models/Game');
const { authenticateUser } = require('../../middleware/authenticateUser'); // Import the authenticateUser middleware

const router = express.Router();

// Landing page route (No authentication required)
router.get('/landing', (req, res) => {
    // Render the landing page HTML content
    const landingPageContent = `
        <div>
            <h1>Welcome to BattleBoat</h1>
            <div>
                <a href="/login">Login</a>
                <a href="/signup">Sign Up</a>
            </div>
        </div>
    `;
    
    res.send(landingPageContent);
});

// User registration (signup) route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username or email already exist
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to the database
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token and send it in the response
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected routes
router.get('/lobby', authenticateUser, (req, res) => {
    res.json({ message: 'Welcome to the lobby' });
});

router.post('/create-game', authenticateUser, async (req, res) => {
    // Handle creating a new game
    try {
        const { userId } = req.user;  // assuming authenticateUser middleware adds user to req object
        const newGame = new Game({
            players: [userId],  // start with the creator of the game
            state: 'waiting_for_opponent', // initial game state
            // Add any other initial game configurations here
        });
        await newGame.save();
        res.status(201).json({ message: 'Game created successfully', gameId: newGame._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/game', authenticateUser, async (req, res) => {
    // Handle getting game details
    try {
        const { userId } = req.user;
        const game = await Game.findOne({ $or: [{ player1: userId }, { player2: userId }] });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/game/:id', authenticateUser, async (req, res) => {
    // Handle making a move in the game
    try {
        const { userId } = req.user;
        const { move } = req.body;  // get the move details from request body
        
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Validate the move and update the game state (this is just a placeholder, actual logic depends on your game)
        // game.makeMove(userId, move);

        await game.save();
        res.status(200).json({ message: 'Move made successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', authenticateUser, (req, res) => {
    // Handle user logout - This is typically handled on the client side by removing the token from local storage or cookie
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
