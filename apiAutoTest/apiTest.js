const { describe } = require("mocha");
const assert = require("assert");
const { expect } = require("chai");

let token;

describe("API Auto Testing", function () {
  it("Valid Login", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          password: "admin",
        }),
      }
    );

    // Assert 1: Check status code = 200
    expect(response.status).to.equal(200);

    const data = await response.json();
    // Assert 2: Check property
    expect(data).to.have.all.keys("message", "status", "token");
    // Assert 3: Check message "Login successful"
    expect(data.message).to.eql("Login successful");
    // Assert 4: Check token is not empty
    expect(data.token).to.be.a("string").that.is.not.empty;

    //Save Token
    token = data.token;
  });

  it("Get User", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/users",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    // Assert 1: Check status code = 200
    expect(response.status).to.equal(200);

    // Assert 2: Check the property
    expect(data.users[0]).to.have.property('userId');
    expect(data.users[0]).to.have.property('username');
    expect(data.users[0]).to.have.property('age');

    // Assert 3: Check the property is not empty
    expect(data.users).to.be.an('array').that.is.not.empty;

    // Assert 4: Check the username should be String
    expect(data.users[0].username).to.be.a("string");

    // Assert 5: Check the age should be Number and > 0
    expect(data.users[0].age).to.be.a("number").that.is.above(0);
  });

  it("Add User", async function () {
    const addUsername = "DETA_" + Date.now();
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          username: addUsername,
          age: 22,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    // Assert 1: Check status code = 201
    expect(response.status).to.equal(201);

    // Assert 2: Check the property
    expect(data).to.have.all.keys("status", "userId","username","age", "message");

    // Assert 3: Check message "User successfully added, Hi DETA New Name!"
    expect(data.message).to.eql("User successfully added, Hi " + addUsername + "!");

    // Assert 4: Check the age should be Number and > 0
    expect(data.age).to.be.a("number").that.is.above(0);

  });

  it("[NEG] Add User - Existing Username", async function () {
    const existUsername = "Deta";
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          username: existUsername,
          age: 22,
        }),
      }
    );

    const data = await response.json();

    // Assert 1: Check status code = 400
    expect(response.status).to.equal(400);

    // Assert 2: Check the eror message
    expect(data.message).to.eql(`Username "${existUsername}" already exists!`);
  });

});