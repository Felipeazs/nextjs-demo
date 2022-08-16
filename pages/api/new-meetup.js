import { MongoClient } from "mongodb";

const handler = async (req, res) => {

    if (req.method === 'POST') {
        const data = req.body;

        //const { title, image, description, address } = data;

        const client = await MongoClient.connect('mongodb+srv://felipez:v6Lk7hpriRdaU4@academind.kpncuhg.mongodb.net/meetups?retryWrites=true&w=majority');
        const db = client.db();

        const meetupsCollection = db.collection('meetups');
        const result = await meetupsCollection.insertOne(data);

        console.log(result)

        client.close();

        res.status(201).json({ message: 'Meetup inserted!' });
    }
}

export default handler