const { db } = require("../util/admin");

exports.grabMyWork = (req, res) => {
  db.collection("work")
    .orderBy("dueDate")
    .where("owner", "==", req.user.email)
    .get()
    .then((data) => {
      let work = [];
      data.forEach((doc) => {
        work.push({
          description: doc.data().description,
          dueDate: doc.data().dueDate,
          owner: doc.data().owner,
        });
      });
      return res.json(work);
    })
    .catch((err) => console.log(err));
};

exports.addWork = (req, res) => {
  if (req.body.description.trim() === "") {
    return res
      .status(400)
      .json({ description: "Description should not be empty" });
  }
  let date = req.body.dueDate.split(" ")[0].split("/");
  let time = req.body.dueDate.split(" ")[1].split(":");
  const newWork = {
    description: req.body.description,
    dueDate: new Date(
      date[0],
      date[1],
      date[2],
      time[0],
      time[1]
    ).toISOString(),
    owner: req.user.email,
  };
  db.collection("work")
    .add(newWork)
    .then((doc) => {
      res.json({ newWork });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
