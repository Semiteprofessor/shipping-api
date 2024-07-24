const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
require("dotenv").config();

const localOptions = { usernameField: "email" };

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return done(null, false, { message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return done(null, false, { message: "Invalid email or password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id);
    if (!user) return done(null, false);

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);
