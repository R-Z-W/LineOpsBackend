const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

function generateJWT(userId, username, isAdmin = false) {
	return jwt.sign(
		{
			userId: userId,
			username: username,
			isAdmin: Boolean(isAdmin) 
		},
		jwtSecretKey,
		{
			expiresIn: "1d"
		}
	);
}

function decodeJWT(tokenToDecode) {
	return jwt.verify(tokenToDecode, jwtSecretKey);
}

async function validateUserAuth(request, response, next) {
	const token = request.headers['authorization']?.split(' ')[1]; // Extract the token from header

	if (!token) {
		return response.status(403).json({
			message: "Sign in to view this content!"
		});
	}

	try {
		const decodedData = decodeJWT(token);
		
		if (decodedData.userId) {
			next();
		} else {
			return response.status(403).json({
				message: "Sign in to view this content!"
			});
		}
	} catch (err) {
		return response.status(403).json({
			message: "Invalid token."
		});
	}
}

// Admin Privileges
async function validateAdminAuth(request, response, next) {
  const token = request.headers['authorization']?.split(' ')[1];

  if (!token) {
    return response.status(403).json({ message: "Authentication required" });
  }

  try {
    const decodedData = decodeJWT(token);
    if (decodedData.isAdmin) {
      next();
    } else {
      return response.status(403).json({ message: "Admin access required" });
    }
  } catch (err) {
    return response.status(403).json({ message: "Invalid token" });
  }
}

module.exports = { generateJWT, decodeJWT, validateUserAuth, validateAdminAuth };
