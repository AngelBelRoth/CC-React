const PORT = 8080
import cors from 'cors'
import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import { v1 as uuidv1 } from 'uuid'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bodyParser from 'body-parser'

dotenv.config();

const uri = process.env.URI

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,      
    secure: true,   
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Default
app.get('/', (req, res) => {
    res.json('Welcome to My App')
})

// Sign up to the Database
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body
    const generateUserId = uuidv1()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generateUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }
        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        })
        res.status(201).json({ token, userId: generateUserId, email: sanitizedEmail })

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    } finally {
        await client.close()
    }
})

// Log in to the Database
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')
        // const sanitizedEmail = email.toLowerCase()
        const user = await users.findOne({ email })
        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({ token, userId: user.user_id })
        } else {
            res.status(400).json('Invalid Credentials')
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Get individual user
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')
        const query = { user_id: userId }
        const user = await users.findOne(query)
        res.send(user)
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    } finally {
        await client.close()
    }
})


// Update User with a match
app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const { userId, matchedUserId } = req.body

    console.log(userId, matchedUserId);

    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')

        const query = { user_id: userId }
        const updateDocument = {
            $push: { matches: { user_id: matchedUserId } }
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})


// Get all Users by userIds in the Database
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()

        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

// app.get('/users', async (req, res) => {
//     const client = new MongoClient(uri)

//     try {
//         await client.connect()
//         const database = client.db('Match')
//         const users = database.collection('users')
//         const returnedUsers = await users.find().toArray()
//         res.send(returnedUsers)
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     } finally {
//         await client.close()
//     }
// })


//Get all Business Type from DB
app.get('/business-type', async (req, res) => {
    const client = new MongoClient(uri)
    const business = req.query.business
    console.log(business)

    //security feature
    //to validate the input, only accept these input
    //if (business !== 'software' && business !== 'hardware') {
    //   throw res.status('400')
    // }
    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')

        var query;
        if (business == "all") {
            query = {
                business_type: { $ne: null }
            }
        }
        else {
            query = { business_type: { $eq: business } }
        }
        const foundUsers = await users.find(query).toArray()

        res.send(foundUsers)
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    } finally {
        await client.close()
    }
})


// Update user's data to DB
app.put('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('Match')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set: {
                company_name: formData.company_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                // show_gender: formData.show_gender,
                business_type: formData.business_type,
                business_interest: formData.business_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            }
        }
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    } finally {
        await client.close()
    }
})



// Get Messages by from_userId and to_userId
app.get('/messages', async (req, res) => {
    const { userId, correspondingUserId } = req.query
    const client = new MongoClient(uri)

    console.log(userId, correspondingUserId);
    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})


// Add a Message to our Database
app.post('/message', async (req, res) => {

    const client = new MongoClient(uri)
    const message = req.body.message
    console.log(message);

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

//Logo image Upload
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        console.log("image_upload");
        const result = await cloudinary.uploader.upload_stream(
            { folder: "my_uploads" },
            (error, uploadResult) => {
                if (error) return res.status(500).json({ error });

                res.json({
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id,
                });
            }
        );

        result.end(req.file.buffer);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Match');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour

        await usersCollection.updateOne(
            { email },
            { $set: { resetToken: token, resetTokenExpiry: expiry } }
        );

        await sendPasswordResetEmail(email, token);

        res.json({ message: 'Password reset email sent' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        await client.close();
    }
});

app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Match');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await usersCollection.updateOne(
            { resetToken: token },
            {
                $set: { hashed_password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiry: "" }
            }
        );

        res.json({ message: 'Password reset successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        await client.close();
    }
});

const sendPasswordResetEmail = async (toEmail, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };

    return transporter.sendMail(mailOptions);
};

app.listen(PORT, () => console.log('server running on PORT ' + PORT))