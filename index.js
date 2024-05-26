const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')



// middleWare
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcxten6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



// Middleware
const logged = async (req, res, next) => {
    console.log('logged:', req.host, req.url);
    next()
}


const verifyToken = async (req, res, next) => {

    const token = req.cookies?.token;
    console.log("verifyToken", token)

    // Mo token available
    if (!token) {
        return res.status(401).send({ massage: "401 UnAuthorized" })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decode) => {
        //     // error
        if (err) {
            console.log(err)
            return res.status(401).send({ massage: "Unauthorized " })
        }
        //  token veiled check 
        console.log("value In the verifyToken", decode)
        next();
    })
}





async function run() {
    try {


        const allJobsCollection = client.db('EasyHire').collection('allJobs')
        const applyJobsCollection = client.db('EasyHire').collection('applyJobs')
        const userInfoCollection = client.db('EasyHire').collection('userInfo')





        // JWT Auth Related Api
        app.post('/jwt',  async (req, res) => {
            const user = req.body;
            // console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            // console.log('user',token)
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
                .send({ success: true })

        })


        // logOut Auth Api
        app.post("/logout", async (req, res) => {
            // const user = req.body
            res.clearCookie("token", { ...cookieOptions, maxAge: 0 }).send({ success: true })
        })
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        }




        // save UserInfo MongoDB userInfo collection
        app.post('/userInfo', async (req, res) => {
            const user = req.body;
            const result = await userInfoCollection.insertOne(user);
            res.send(result)
        })



        // Save Data MongoDB Added Jobs
        app.post('/allJobs', async (req, res) => {
            const jobs = req.body;
            const result = await allJobsCollection.insertOne(jobs);
            res.send(result)
        })



        // Save Data MongoDB  Apply Jobs
        app.post('/applyJobs', async (req, res) => {
            const jobs = req.body;
            const result = await applyJobsCollection.insertOne(jobs);
            res.send(result)
        })



        // Read & Show Data Clint Side ...
        app.get('/allJobs', async (req, res) => {
            const cursor = allJobsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
            // console.log(result)
        })



        //   View Details Page ...
        app.get('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allJobsCollection.findOne(query);
            res.send(result)
        })




        // Find myJobs Data With Email ...
        app.get('/allJobss/:email', async (req, res) => {
            const result = await allJobsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })



        // Find applyJobs Data With Email ...
        app.get('/applyJobss/:email', async (req, res) => {
            const result = await applyJobsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })




        // Jobs Data Delete ...
        app.delete('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allJobsCollection.deleteOne(query);
            res.send(result);
        })




        // Update Jobs MongoDB...
        app.put('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const updateJobs = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const jobs = {
                $set: {
                    photo: updateJobs.photo,
                    job_title: updateJobs.job_title,
                    salary: updateJobs.salary,
                    description: updateJobs.description
                },
            };

            const result = await allJobsCollection.updateOne(filter, jobs, options);
            res.send(result)

        })






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {

    res.send("EasyHire is running")

})

app.listen(port, () => {

    console.log(`Easy Hire Server is Running is on port :${port}`)

})