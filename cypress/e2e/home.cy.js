const bcrypt = require('bcryptjs');

describe("Home Page", () => {
  it("should load the home page and display movies", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Search");
    cy.get(".card").should("have.length.greaterThan", 0);
  });
});

describe("Login", () => {
  it("shows error on invalid login", () => {
    cy.visit("http://localhost:3000/users/login");
    cy.get("input[name=email]").type("notarealuser@example.com");
    cy.get("input[name=password]").type("wrongpassword");
    cy.contains("button[type=submit]", "Login").click();
    cy.contains("Invalid email or password");
  });
});

describe("Valid Login", () => {
  const testEmail = "cypress_test_user@example.com";
  const testPassword = "TestPassword123!";

  before(() => {
    // Hash the password and create the user
    cy.wrap(null).then(async () => {
      const hash = await bcrypt.hash(testPassword, 10);
      await cy.task('createTestUser', { email: testEmail, passwordHash: hash });
    });
  });

  after(() => {
    // Delete the test user
    cy.task('deleteTestUser', testEmail);
  });

  it("logs in successfully with valid credentials", () => {
    cy.visit("http://localhost:3000/users/login");
    cy.get('input[name=email]').type(testEmail);
    cy.get('input[name=password]').type(testPassword);
    cy.contains('button[type=submit]', 'Login').click();
    cy.contains('Account'); // Should see Account dropdown after login
    cy.contains('Test User'); // Should see the user's name
  });
});
