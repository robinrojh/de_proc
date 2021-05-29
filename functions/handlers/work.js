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

exports.editWorkDescription = (req, res) => {
  if (req.body.description.trim() === "") {
    return res
      .status(400)
      .json({ description: "Description should not be empty" });
  }
  const work = db.doc(`/work/${req.params.workId}`);
  work
    .get()
    .then((doc) => {
      console.log(doc.data().owner);
      console.log(req.user.email);
      if (!doc.exists) {
        return res.status(404).json({ error: "Work not found" });
      }
      if (doc.data().owner !== req.user.email) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        const modifiedWork = {
          description: req.body.description.trim(),
          dueDate: doc.data().dueDate,
        };
        return modifiedWork;
      }
    })
    .then((updatedWork) => {
      work.update(updatedWork).then(() => {
        return res.json({ message: "Description changed successfully" });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.json(err);
    });
};

exports.editdueDate = (req, res) => {
  if (req.body.dueDate.trim() === "") {
    return res
      .status(400)
      .json({ description: "Due date should not be empty" });
  }
  const work = db.doc(`/work/${req.params.workId}`);
  work
    .get()
    .then((doc) => {
      console.log(doc.data().owner);
      console.log(req.user.email);
      if (!doc.exists) {
        return res.status(404).json({ error: "Work not found" });
      }
      if (doc.data().owner !== req.user.email) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        let date = req.body.dueDate.trim().split(" ")[0].split("/");
        let time = req.body.dueDate.trim().split(" ")[1].split(":");
        const modifiedWork = {
          description: doc.data().description,
          dueDate: new Date(date[0], date[1], date[2], time[0], time[1]),
        };
        return modifiedWork;
      }
    })
    .then((updatedWork) => {
      work.update(updatedWork).then(() => {
        return res.json({ message: "Due date changed successfully" });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.json(err);
    });
};
