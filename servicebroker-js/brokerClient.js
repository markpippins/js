// brokerClient.js

// A minimal function to call your Spring Boot Service Broker
async function callBroker(service, operation, params) {
  const response = await fetch("http://localhost:8080/api/broker/requestService", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service: service,
      operation: operation,
      params: params
    })
  });

  if (!response.ok) {
    throw new Error(`Broker error ${response.status}`);
  }
  return await response.json();
}

// Example 1: Fetch a user
async function demoGetUser(userId) {
  try {
    const res = await callBroker("userService", "getById", { id: userId });
    console.log("Get user response:", res);
  } catch (err) {
    console.error("Error fetching user:", err.message);
  }
}

// Example 2: Create a new user
async function demoCreateUser(name, email) {
  try {
    const res = await callBroker("userService", "create", {
      user: { name, email }
    });
    console.log("Create user response:", res);
  } catch (err) {
    console.error("Error c+reating user:", err.message);
  }
}

// Run demos when this script is executed
(async () => {
  await demoGetUser(1);
  await demoCreateUser("Alice", "alice@example.com");
})();
