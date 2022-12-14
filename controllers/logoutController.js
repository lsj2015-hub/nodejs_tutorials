const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  // On clinet, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  const otherUSers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUSers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie('jwt', { httpOnly: true }); // secure: true - only servers on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
