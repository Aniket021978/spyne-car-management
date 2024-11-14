const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadDir));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const carSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: String },
    images: [String],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.post('/api/cars', upload.array('carImages', 10), async (req, res) => {
    const { title, description, tags, userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    try {
        const newCar = new Car({
            title,
            description,
            tags,
            images: imagePaths,
            userId
        });
        await newCar.save();
        res.status(201).json({ success: true, message: 'Car details uploaded successfully', car: newCar });
    } catch (err) {
        console.error('Car upload error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/cars/:userId', async (req, res) => {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
    }

    try {
        const userCars = await Car.find({ userId });
        res.json({ cars: userCars });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
    }
});

app.get('/api/cars', (req, res) => {
    Car.find()
        .then(cars => {
            if (!cars || cars.length === 0) {
                return res.status(404).json({ message: 'No cars available' });
            }
            res.json({ cars });
        })
        .catch(err => {
            console.error('Error fetching cars:', err);
            res.status(500).json({ message: 'Server error while fetching cars' });
        });
});

app.delete('/api/cars/:carId', async (req, res) => {
    const carId = req.params.carId;

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        const imagesToDelete = car.images;
        for (let imagePath of imagesToDelete) {
            const fullPath = path.join(__dirname, imagePath);

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        await Car.deleteOne({ _id: carId });
        res.json({ success: true, message: 'Car deleted successfully' });
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/cars/:carId', async (req, res) => {
    const carId = req.params.carId;
    console.log('Received carId:', carId);
    if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ success: false, message: 'Invalid car ID' });
    }
    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        return res.json({ success: true, car });
    } catch (err) {
        console.error('Error fetching car details:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/cars/:carId', upload.array('carImages', 10), async (req, res) => {
    const { title, description, tags, userId } = req.body;
    const carId = req.params.carId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
    }

    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        if (req.files.length > 0) {
            const oldImagePaths = car.images;
            oldImagePaths.forEach(imagePath => {
                const fullPath = path.join(__dirname, imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = tags || car.tags;
        car.images = [...car.images, ...imagePaths];
        await car.save();

        res.json({ success: true, message: 'Car details updated successfully', car });
    } catch (err) {
        console.error('Car update error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/user/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
