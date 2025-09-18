const bcrypt = require("bcryptjs");

describe("Home Page", () => {
  it("should load the home page and display movies", () => {
    cy.visit("/");
    cy.contains("Search");
    cy.get(".card").should("have.length.greaterThan", 0);
  });

  it("should display genre filter buttons", () => {
    cy.visit("/");
    cy.get("form button").contains("All").should("exist");
    cy.get("form button").should("have.length.greaterThan", 1); // At least one genre
  });

  it("should filter movies by genre", () => {
    cy.visit("/");
    cy.contains("form button", "Action").click();
    cy.url().should("include", "genre=Action");
    cy.url().should("include", "genre=");
    cy.url().should("include", "q=");
    cy.get(".card").should("have.length.greaterThan", 0);
  });

  it("should search for a movie by title", () => {
    cy.visit("/");
    cy.get('input[name="q"]:visible').type("ACADEMY DINOSAUR");
    cy.get('button[type="submit"]').contains("Search").click();
    cy.get(".card-title").should("contain", "ACADEMY DINOSAUR");
  });

  it("should go to the movie detail page when clicking a card", () => {
    cy.visit("/");
    cy.get(".card-title a").first().click();
    cy.url().should("include", "/movies/");
    cy.get(".card-title").should("exist");
    cy.get("img").should("exist");
  });
});

describe("Login", () => {
  it("shows error on invalid login", () => {
    cy.visit("/users/login");
    cy.get("input[name=email]").type("notarealuser@example.com");
    cy.get("input[name=password]").type("wrongpassword");
    cy.contains("button[type=submit]", "Login").click();
    cy.contains("Invalid email or password");
  });

  it("shows error when fields are missing", () => {
    cy.visit("/users/login");
    cy.get("input[name=email]").clear();
    cy.get("input[name=password]").clear();
    cy.contains("button[type=submit]", "Login").click();
    cy.contains("Email and password required.");
  });

  it("shows error when only email is filled", () => {
    cy.visit("/users/login");
    cy.get("input[name=email]").type("someone@example.com");
    cy.get("input[name=password]").clear();
    cy.contains("button[type=submit]", "Login").click();
    cy.contains("Email and password required.");
  });

  it("shows error when only password is filled", () => {
    cy.visit("/users/login");
    cy.get("input[name=email]").clear();
    cy.get("input[name=password]").type("somepassword");
    cy.contains("button[type=submit]", "Login").click();
    cy.contains("Email and password required.");
  });
});

describe("Valid Login", () => {
  const testEmail = "cypress_test_user@example.com";
  const testPassword = "TestPassword123!";

  before(() => {
    cy.wrap(null).then(async () => {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash(testPassword, 10);
      await cy.task("createTestUser", { email: testEmail, passwordHash: hash });
    });
  });

  after(() => {
    cy.task("deleteTestUser", testEmail);
  });

  it("logs in successfully with valid credentials", () => {
    cy.visit("/users/login");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Login").click();
    cy.contains("Account"); // Should see Account dropdown after login
    cy.contains("Test User"); // Should see the user's name
  });

  it("shows account dropdown and user info after login", () => {
    cy.visit("/users/login");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Login").click();
    cy.get("#accountDropdown").should("exist");
    cy.get(".dropdown-menu").should("contain", "Test User");
    cy.get(".dropdown-menu").should("contain", testEmail);
  });
});

describe("Registration", () => {
  const testEmail = "newuser@example.com";
  const testPassword = "TestPassword123!";

  after(() => {
    // Clean up: delete the test user if needed
    cy.task("deleteTestUser", testEmail);
  });

  it("registers a new user successfully", () => {
    cy.visit("/users/register");
    cy.get("input[name=first_name]").type("New");
    cy.get("input[name=last_name]").type("User");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Register").click();
    cy.contains("Registration successful").should("exist");
    cy.url().should("include", "/users/login");
  });

  it("shows error for duplicate email", () => {
    // Register once
    cy.visit("/users/register");
    cy.get("input[name=first_name]").type("New");
    cy.get("input[name=last_name]").type("User");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Register").click();
    // Try again with same email
    cy.visit("/users/register");
    cy.get("input[name=first_name]").type("New");
    cy.get("input[name=last_name]").type("User");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Register").click();
    cy.contains("already used").should("exist");
  });
});

describe("Edit User", () => {
  const testEmail = "edituser@example.com";
  const testPassword = "EditUserPass123!";
  const newFirstName = "Edited";
  const newLastName = "User";
  const newEmail = "editeduser@example.com";

  before(() => {
    cy.task("deleteTestUser", testEmail);
    cy.task("deleteTestUser", newEmail);
    cy.wrap(null).then(async () => {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash(testPassword, 10);
      await cy.task("createTestUser", { email: testEmail, passwordHash: hash });
    });
  });

  after(() => {
    cy.task("deleteTestUser", testEmail);
    cy.task("deleteTestUser", newEmail);
  });

  it("allows a user to edit their profile", () => {
    // Login first
    cy.visit("/users/login");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Login").click();

    // Go to edit page
    cy.visit("/users/edit");
    cy.get("input[name=first_name]").clear().type(newFirstName);
    cy.get("input[name=last_name]").clear().type(newLastName);
    cy.get("input[name=email]").clear().type(newEmail);
    cy.get("input[name=password]").clear(); // Leave password blank to keep current
    cy.contains("button[type=submit]", "Save Changes").click();

    // Should redirect to home and show new name in account dropdown
    cy.contains("Account").click();
    cy.get(".dropdown-menu").should("contain", newFirstName);
    cy.get(".dropdown-menu").should("contain", newLastName);
    cy.get(".dropdown-menu").should("contain", newEmail);
  });
});

describe("Delete User", () => {
  const testEmail = "deleteuser@example.com";
  const testPassword = "DeleteUserPass123!";

  before(() => {
    cy.task("deleteTestUser", testEmail);
    cy.wrap(null).then(async () => {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash(testPassword, 10);
      await cy.task("createTestUser", { email: testEmail, passwordHash: hash });
    });
  });

  it("allows a user to delete their account", () => {
    // Login first
    cy.visit("/users/login");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=password]").type(testPassword);
    cy.contains("button[type=submit]", "Login").click();

    // Go to edit page
    cy.visit("/users/edit");
    cy.contains("button", "Delete Account").click();

    // Confirm the dialog (Cypress auto-confirms window.confirm)
    // Should redirect to home and not show account info
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains("Account").click();
    cy.get(".dropdown-menu").should("not.contain", testEmail);
  });
});
