const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const userRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["asdfghjkl"],
  })
);

app.get("/", (req, res) => {
  res.send(`
  Your id is: ${req.session.userId}
    <div>
      <form method='POST'>
        <input name='email' placeholder='email'/>
        <input name='password' placeholder='password'/>
        <input name='passwordConfimation' placeholder='password confirmation'/>
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post("/", async (req, res) => {
  const { email, password, passwordConfimation } = req.body;

  const existingUser = await userRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email is use");
  }

  if (password !== passwordConfimation) {
    return res.send("Password must match");
  }

  // Create a user in our user repo to respresent this person
  const user = await userRepo.create({ email, password });

  // Store the id of that user inside the users cookie
  req.session.useId = user.id;

  res.send("Account created!");
});

app.listen(3000, () => {
  console.log("Listening");
});
