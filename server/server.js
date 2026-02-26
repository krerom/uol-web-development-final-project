import express from 'express';
import fs from 'fs';
import cors from "cors";


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/template/:page", (req, res) => {
    const { page } = req.params;

    // creating an object for page data from pages.json
    fs.readFile("./conf/pages.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).type("text/plain").send("Error reading pages.json");
            return;
        }

        const pageData = JSON.parse(data);

        if (!pageData[page]) {
            res.status(404).type("text/plain").send("Page not found");
            return;
        }

        // getting the according template specified in pages.json
        fs.readFile(`./templates/${pageData[page].html}`, "utf-8", (err, template) => {
            if (err) {
                res.status(500).send("Error reading template");
                return;
            }
            res.status(200).type("text/plain").send(template);
        });
    });
});

app.get("/styles/:page", (req, res) => {
    const { page } = req.params;

    // creating an object for page data from pages.json
    fs.readFile("./conf/pages.json", "utf-8", (err, data) => {
        if (err) return res.status(500).send("Error reading pages.json");

        const pageData = JSON.parse(data);

        if (!pageData[page] || !pageData[page].css) return res.status(404).send("Page not found");

        // getting the according .css file specified in pages.json
        fs.readFile(`./styles/${pageData[page].css}`, "utf-8", (err, cssContent) => {
            if (err) return res.status(500).send("Error reading CSS");

            res.type("text/css").send(cssContent);
        });
    });
});

app.get("/data/:page", (req, res) => {
    const { page } = req.params;

    // creating an object of all page related data 
    fs.readFile("./conf/content.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).type("text/plain").send("Error reading pages.json");
            return;
        }

        const contData = JSON.parse(data);
        // returning content data for requested page
        res.status(200).type("text/plain").send(contData[page]);
    });
});

app.get("/pages", (req, res) => {
    // creating an object for all pages on website for navigation
    fs.readFile("./conf/pages.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading pages.json");
            return;
        }
        res.status(200).type("text/plain").send(data);
    });
});

app.get("/weather/:lat/:lon", async (req, res) => {
    const { lat, lon } = req.params;

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    if (response.ok) {
        const data = await response.json();
        res.status(200).type("text/plain").send(`${data.current_weather.temperature}`);
    }
});

app.get("/comments/:page", (req, res) => {
    const { page } = req.params;
    fs.readFile("./utils/comments.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading comments.json");
            return;
        }
        const commData = JSON.parse(data);
        return res.status(200).type("text/plain").send(commData[page]);
    });
});

app.post("/comment", (req, res) => {
    const { page, username, text, timestamp, email=""} = req.body.comment;

    fs.readFile("./utils/comments.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading comments.json");
        }

        const commData = JSON.parse(data);

        // If page does not exist yet, create it
        if (!commData[page]) {
            commData[page] = [];
        }

        // Create new comment
        const newComment = {
            username,
            timestamp,
            text,
            email
        };

        // Push comment
        commData[page].push(newComment);

        // Write back to file
        fs.writeFile(
            "./utils/comments.json",
            JSON.stringify(commData, null, 2),
            "utf-8",
            (err) => {
                if (err) {
                    return res.status(500).send("Error writing to comments.json");
                }

                res.status(201).json(newComment);
            }
        );
    });
});

app.listen(port, '0.0.0.0', () => console.log(`Server running on Port: ${port}`));