### ✅ 2xx — Success Responses

### 🔹 200 OK
- Request successful
- Used for: GET, PUT, PATCH

```js
res.status(200).json(data);
🔹 201 Created
Resource successfully created
Used for: POST
res.status(201).json({ message: "Created successfully" });
❌ 4xx — Client Errors
🔹 400 Bad Request
Invalid input from client
res.status(400).jcdson({ error: "Invalid data" });
🔹 401 Unauthorized
User not logged in / authentication required
res.status(401).json({ error: "Login required" });
🔹 403 Forbidden
User is logged in but has no permission
res.status(403).json({ error: "Access denied" });
🔹 404 Not Found
Resource does not exist
res.status(404).json({ error: "Not found" });
💥 5xx — Server Errors
🔹 500 Internal Server Error
Something went wrong on server
res.status(500).json({ error: "Server error" });
🔁 Real-Life Examples
🛒 E-commerce API
Action	Status Code
Get products	200
Create product	201
Invalid input	400
Unauthorized access	401
Forbidden action	403
Product not found	404
Server crash	500
⚠️ Common Mistakes
❌ Always sending 200
res.json({ error: "Not found" });
✅ Correct way
res.status(404).json({ error: "Not found" });
❌ Not returning after error
if (!data) {
  res.status(404).send("Not found");
}
res.send(data); // ❌
✅ Fix
if (!data) {
  return res.status(404).send("Not found");
}
🧠 Best Practice (Recommended Format)
res.status(200).json({
  success: true,
  message: "Request successful",
  data: data
});
🏁 Conclusion
Use correct status codes for better API design
Helps frontend understand responses clearly
Essential for real-world backend development