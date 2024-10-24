const authService = require('../../services/authentication');

exports.signUp = async (req, res) => {
  try {
    const response = await authService.signUp(req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

exports.login = async (req, res) => {
  try {
    const response = await authService.login(req);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

