const {open} = require("./client");
const {create} = require("./bridge");

create("8000", "8081")

open("localhost", "8000", "localhost", "8080")
