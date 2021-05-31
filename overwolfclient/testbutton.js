import axios from "axios";
const button = document.getElementById("test");
button.onclick = () => {
  axios
    .post("http://localhost:5000/api/match-history", {
      data: 1,
    })
    .then((data) => {});
};
