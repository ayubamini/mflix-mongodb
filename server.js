const { MongoClient } = require("mongodb");

async function main() {
    const uri =
        "mongodb+srv://admin:6CBBJb2wrAipUVbd@cluster0.azx2e5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);


    try {
        await client.connect();

        /*
        await createMovie(client, {
            plot: "A group of adventures, looking for gold..",
            runtime: 12,
            title: "The Dream",
            languages: ["English", "Azeri"],
            lastupdated: { $gt: new Date('2000-06-22') }
        });
        */

        /*
        await createMultipleMovie(client, [{
            plot: "A group of adventures, looking for gold..",
            runtime: 12,
            title: "The Dream",
            languages: ["English", "Azeri"],
            lastupdated: { $gt: new Date('2000-06-22') }
        }, {
            plot: "A man who looking for his son..",
            runtime: 13,
            title: "The Dream2",
            lastupdated: { $gt: new Date('2000-06-22') }
        }, {
            plot: "A group of adventures, looking for gold..",
            runtime: 14,
            title: "The Dream3",
            countries: ["USA", "Iran", "Canada"],
            lastupdated: { $gt: new Date('2000-06-22') }
        }]);
        */

        //await findOneMoviewByName(client, "The Dream");

        //await updateMovieByTitle(client, "The Dream3", { title: "Non" });

        //await upsertMovieByTitle(client, "A separation", { title: "A separation", runtime: 150 });

        //await UpdateMoviesWithNewProperty(client);

        //await deleteMovieByMovieType(client, "UnKnown");

        await deleteMoviesReleasedBeforeDate(client, new Date("1911-05-01"));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error());


// Get MongoDB databases list
async function getDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}

// Create one document
async function createMovie(client, newMovie) {
    const result = await client.db("sample_mflix").collection("movies").insertOne(newMovie);

    console.log(`New movie created with the folowing id: ${result.insertedId}`);
}

// Create multiple document
async function createMultipleMovie(client, newMovies) {
    const result = await client.db("sample_mflix").collection("movies").insertMany(newMovies);

    console.log(`${result.insertedCount} new movies created with the folowing id(s):`);

    console.log(result.insertedIds);
}

// Find item by field value
async function findOneMoviewByName(client, nameOfTheMovie) {
    const result = await client.db('sample_mflix').collection('movies').findOne({ title: nameOfTheMovie });

    if (result) {
        console.log(`Fount a movie in the collection with the name '${nameOfTheMovie}'`);
        console.log(result);
    } else {
        console.log(`No movie found with the name '${nameOfTheMovie}'`);
    }
}

// Update selected document
async function updateMovieByTitle(client, titleOfMovie, updatedMovie) {
    const result = await client.db('sample_mflix').collection('movies').updateOne({ title: titleOfMovie }, { $set: updatedMovie });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}

// Upsert (update matched document if not exist otherwise, insert as a new one)
async function upsertMovieByTitle(client, titleOfMovie, updatedMovie) {
    const result = await client.db('sample_mflix').collection('movies').updateOne(
        { title: titleOfMovie }, { $set: updatedMovie }, { upsert: true });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);

    if (result.upsertedCount > 0) {
        console.log(`one document created with the id(s): ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated`);
    }
}

// Update all the movies to have a new property
async function UpdateMoviesWithNewProperty(client) {
    const result = await client.db("sample_mflix").collection("movies")
        .updateMany({ movie_type: { $exists: false } },
            { $set: { movie_type: "UnKnown" } });

    console.log(`${result.matchedCount} document(s) matched the quesry criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}

// Delete movie
async function deleteMovieByMovieType(client, movieTypeValue) {
    const result = await client.db("sample_mflix").collection("movies").deleteOne({ movie_type: movieTypeValue });

    console.log(`${result.deletedCount} document(s) was/were deleted`);
}

async function deleteMoviesReleasedBeforeDate(client, date) {
    const result = await client.db("sample_mflix").collection("movies").deleteMany({ released: { $lt: date } });

    console.log(`${result.deletedCount} document(s) was/were deleted`);
}