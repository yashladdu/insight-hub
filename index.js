import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;
let posts = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

function getFormattedDate() {
    const options = { 
        month: 'short',  // "Feb"
        day: 'numeric',  // "9"
        year: 'numeric', // "2025"
        hour: 'numeric', // "8"
        minute: '2-digit', // "55"
        hour12: true // Use 12-hour format with AM/PM
    };

    const date = new Date(); // Get current date and time
    return date.toLocaleString('en-US', options);
}

app.get("/", (req, res) => {
    console.log("Current Posts Array:", posts); // Debugging
    res.render("index.ejs", {
        posts: posts,
    });
});

app.get("/new_post", (req, res) => {
    res.render("post.ejs");
})

app.get("/post", (req, res) => {
    res.render("post.ejs", { posts: posts })
});


app.post("/create_post", (req, res) => {
    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content.replace(/\r\n|\r|\n/g, "<br>"), // Convert new lines to <br>
        date: getFormattedDate() // Store the date at creation
    };

    posts.unshift(newPost); // Add the new post with its creation date

    res.redirect("/"); // Redirect to homepage
})


app.get("/post/:id", (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];

    if (post) {
        res.render("viewpost.ejs", { title: post.title, content: post.content, postId: postId });
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];
   
    if (post) {
        res.render("edit.ejs", { title: post.title, content: post.content, postId: postId });
        console.log(post);
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/edit_post/:id", (req, res) => {
    const postId = parseInt(req.params.id); // Convert ID to number
    
    if (postId >= 0 && postId < posts.length) {
        // Get the existing post
        const updatedPost = {
            title: req.body.title,
            content: req.body.content,
            date: getFormattedDate() // Update the timestamp
        };

        // Remove the post from its current position
        posts.splice(postId, 1); 
        
        // Add the updated post at the beginning
        posts.unshift(updatedPost);

        console.log("Updated Post:", updatedPost);

        // Redirect to homepage to reflect changes
        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id); // Convert ID to a number

    if (postId >= 0 && postId < posts.length) {
        posts.splice(postId, 1); // Remove the post from the array
        res.redirect("/"); // Redirect back to the homepage after deletion
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
    console.log("Connected to server.");
});