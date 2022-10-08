const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require("multer");
const multipart = multer().none();

// views route
const indexRoute = require("./routes/index.routes");
const profileRoute = require("./routes/profile.routes");
const clientRoute = require("./routes/clients.routes");
const businessRoute = require("./routes/business.routes");
const notFoundRoute = require("./routes/page-not-found.routes");

// api routers require
const signupRoute = require("./routes/signup.routes");
const loginRoute = require("./routes/login.routes");


const accessRoute = require("./routes/access.routes");

// private api
const companyRoute = require("./routes/company.routes");
const userRoute = require("./routes/user.routes");
const logoutRoute = require("./routes/logout.routes");
const sendmailRoute = require("./routes/sendmail.routes");
const exporterRoute = require("./routes/exporter.routes");
const tokenRoute = require("./routes/token.routes");

// services
const tokenService = require("./services/token.service");

// controller
const authController = require("./controller/auth.controller");

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multipart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware route
app.use("/", indexRoute);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/page-not-found", notFoundRoute);

// implementing api security
app.use(async (request, response, next)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    next();
  }
  else {
    response.clearCookie("authToken");
    response.status(401);
    response.redirect("/");
  }
});

const autoLogger = ()=>{
  return async (request, response, next)=>{
    const isLogged = await authController.checkUserLog(request, response);
    if(isLogged)
    {
      next()
    }
    else {
      response.clearCookie("authToken");
      response.redirect("/");
    }
  }
}

app.use("/api/private/company", companyRoute);
app.use("/api/private/user", userRoute);
app.use("/profile", autoLogger(), profileRoute);
app.use("/clients", clientRoute);
app.use("/logout", logoutRoute);
app.use("/sendmail", sendmailRoute);
app.use("/export-to-pdf", exporterRoute);
app.use("/get-token", tokenRoute);
app.use("/access", accessRoute);
app.use("/business", businessRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
