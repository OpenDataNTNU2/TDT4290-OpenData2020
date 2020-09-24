module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/Login.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/Login.js":
/*!************************!*\
  !*** ./pages/Login.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Login; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core/Grid */ "@material-ui/core/Grid");
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/TextField */ "@material-ui/core/TextField");
/* harmony import */ var _material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/Button */ "@material-ui/core/Button");
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/lab/Alert */ "@material-ui/lab/Alert");
/* harmony import */ var _material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _material_ui_core_Snackbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core/Snackbar */ "@material-ui/core/Snackbar");
/* harmony import */ var _material_ui_core_Snackbar__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Snackbar__WEBPACK_IMPORTED_MODULE_5__);
var _jsxFileName = "C:\\Users\\admin\\kundestyrt\\TDT4290-OpenData2020\\opendata\\pages\\Login.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;






function Login() {
  // setter initial states, er garra en bedre måte å gjøre dette på, fremdeles et tidlig utkast
  // sjekker etter bedre løsninger på local states og/eller global states med next atm (Håkon)
  const {
    0: open,
    1: setOpen
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const {
    0: username,
    1: setUsername
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const {
    0: loggedUsername,
    1: setLoggedUsername
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const {
    0: loggedIn,
    1: setLoggedIn
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const {
    0: notEligUsername,
    1: setNotEligUsername
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false); // Når brukere trykker login, endres statesene, dette skjer kun i login atm, så hvis man refresher/bytter page, blir man logget ut. 

  const handleLoginClick = () => {
    if (!loggedIn) {
      if (checkUsernameElig(username)) {
        setLoggedUsername(username);
        setLoggedIn(true);
        setOpen(true);
        setNotEligUsername(false);
      } else setNotEligUsername(true);
    }
  }; // resetter alle statsene når bruker trykker på logg ut


  const handleLogoutClick = () => {
    setLoggedUsername("");
    setUsername("");
    setOpen(false);
    setLoggedIn(false);
  }; // sjekker elig av brukernavn, må nok adde at den sjekker etter kommune bruker o.l, men vi kan vente litt med det.


  const checkUsernameElig = username => {
    if (username.length === 0) {
      return false;
    }

    return true;
  };

  return __jsx(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_1___default.a, {
    container: true,
    spacing: 0,
    direction: "column",
    alignItems: "center",
    justify: "center",
    style: {
      minHeight: '70vh',
      minWidth: '90vh'
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 9
    }
  }, loggedIn ? __jsx("h2", {
    style: {
      fontWeight: "normal"
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61,
      columnNumber: 17
    }
  }, "Logget inn som ", loggedUsername) : __jsx("h2", {
    style: {
      fontWeight: "normal"
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62,
      columnNumber: 17
    }
  }, "Logg inn"), loggedIn ? null : __jsx("form", {
    noValidate: true,
    autoComplete: "off",
    style: {
      width: "50vh"
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67,
      columnNumber: 17
    }
  }, __jsx(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_2___default.a, {
    id: "outlined-basic",
    label: "Brukernavn",
    size: "large",
    variant: "outlined",
    fullWidth: "true",
    value: username,
    onChange: e => setUsername(e.target.value),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68,
      columnNumber: 21
    }
  })), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 13
    }
  }), loggedIn ? __jsx(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_3___default.a, {
    variant: "contained",
    color: "secondary",
    onClick: handleLogoutClick,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 81,
      columnNumber: 17
    }
  }, "Logg ut") : __jsx(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_3___default.a, {
    variant: "contained",
    color: "primary",
    onClick: handleLoginClick,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82,
      columnNumber: 17
    }
  }, "Logg inn"), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84,
      columnNumber: 13
    }
  }), loggedIn ? null : __jsx(_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_4___default.a, {
    elevation: 1,
    severity: "info",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88,
      columnNumber: 17
    }
  }, "For \xE5 logge inn med kommune, velg et brukernavn p\xE5 formen [Ditt navn]_kommune"), __jsx(_material_ui_core_Snackbar__WEBPACK_IMPORTED_MODULE_5___default.a, {
    open: notEligUsername,
    autoHideDuration: 6000,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91,
      columnNumber: 13
    }
  }, __jsx(_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_4___default.a, {
    elevation: 1,
    severity: "error",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92,
      columnNumber: 17
    }
  }, "Ikke gyldig brukernavn (sjekker bare om det er noe skrevet eller ikke atm)", loggedUsername)), __jsx(_material_ui_core_Snackbar__WEBPACK_IMPORTED_MODULE_5___default.a, {
    open: open,
    autoHideDuration: 6000,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95,
      columnNumber: 13
    }
  }, __jsx(_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_4___default.a, {
    elevation: 1,
    severity: "success",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96,
      columnNumber: 17
    }
  }, "Innlogging vellykket, velkommen ", loggedUsername)));
}

/***/ }),

/***/ "@material-ui/core/Button":
/*!*******************************************!*\
  !*** external "@material-ui/core/Button" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/Button");

/***/ }),

/***/ "@material-ui/core/Grid":
/*!*****************************************!*\
  !*** external "@material-ui/core/Grid" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/Grid");

/***/ }),

/***/ "@material-ui/core/Snackbar":
/*!*********************************************!*\
  !*** external "@material-ui/core/Snackbar" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/Snackbar");

/***/ }),

/***/ "@material-ui/core/TextField":
/*!**********************************************!*\
  !*** external "@material-ui/core/TextField" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@material-ui/core/TextField");

/***/ }),

/***/ "@material-ui/lab/Alert":
/*!*****************************************!*\
  !*** external "@material-ui/lab/Alert" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@material-ui/lab/Alert");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvTG9naW4uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG1hdGVyaWFsLXVpL2NvcmUvQnV0dG9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG1hdGVyaWFsLXVpL2NvcmUvR3JpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBtYXRlcmlhbC11aS9jb3JlL1NuYWNrYmFyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG1hdGVyaWFsLXVpL2NvcmUvVGV4dEZpZWxkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG1hdGVyaWFsLXVpL2xhYi9BbGVydFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0XCIiXSwibmFtZXMiOlsiTG9naW4iLCJvcGVuIiwic2V0T3BlbiIsInVzZVN0YXRlIiwidXNlcm5hbWUiLCJzZXRVc2VybmFtZSIsImxvZ2dlZFVzZXJuYW1lIiwic2V0TG9nZ2VkVXNlcm5hbWUiLCJsb2dnZWRJbiIsInNldExvZ2dlZEluIiwibm90RWxpZ1VzZXJuYW1lIiwic2V0Tm90RWxpZ1VzZXJuYW1lIiwiaGFuZGxlTG9naW5DbGljayIsImNoZWNrVXNlcm5hbWVFbGlnIiwiaGFuZGxlTG9nb3V0Q2xpY2siLCJsZW5ndGgiLCJtaW5IZWlnaHQiLCJtaW5XaWR0aCIsImZvbnRXZWlnaHQiLCJ3aWR0aCIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMx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QTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FDSSxNQUFDLDZEQUFEO0FBQU8sYUFBUyxFQUFFLENBQWxCO0FBQXFCLFlBQVEsRUFBQyxPQUE5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1GQUFpSEosY0FBakgsQ0FESixDQXhDSixFQTRDSSxNQUFDLGlFQUFEO0FBQVUsUUFBSSxFQUFFTCxJQUFoQjtBQUFzQixvQkFBZ0IsRUFBRSxJQUF4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQ0ksTUFBQyw2REFBRDtBQUFPLGFBQVMsRUFBRSxDQUFsQjtBQUFxQixZQUFRLEVBQUMsU0FBOUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx5Q0FBeUVLLGNBQXpFLENBREosQ0E1Q0osQ0FESjtBQW9ESCxDOzs7Ozs7Ozs7OztBQ3JHRCxxRDs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSx1RDs7Ozs7Ozs7Ozs7QUNBQSx3RDs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSxrQyIsImZpbGUiOiJwYWdlcy9Mb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0gcmVxdWlyZSgnLi4vc3NyLW1vZHVsZS1jYWNoZS5qcycpO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vcGFnZXMvTG9naW4uanNcIik7XG4iLCJpbXBvcnQgR3JpZCBmcm9tICdAbWF0ZXJpYWwtdWkvY29yZS9HcmlkJ1xyXG5pbXBvcnQgVGV4dEZpZWxkIGZyb20gJ0BtYXRlcmlhbC11aS9jb3JlL1RleHRGaWVsZCdcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdAbWF0ZXJpYWwtdWkvY29yZS9CdXR0b24nXHJcbmltcG9ydCBBbGVydCBmcm9tICdAbWF0ZXJpYWwtdWkvbGFiL0FsZXJ0J1xyXG5pbXBvcnQgU25hY2tiYXIgZnJvbSAnQG1hdGVyaWFsLXVpL2NvcmUvU25hY2tiYXInO1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbigpe1xyXG5cclxuICAgIC8vIHNldHRlciBpbml0aWFsIHN0YXRlcywgZXIgZ2FycmEgZW4gYmVkcmUgbcOldGUgw6UgZ2rDuHJlIGRldHRlIHDDpSwgZnJlbWRlbGVzIGV0IHRpZGxpZyB1dGthc3RcclxuICAgIC8vIHNqZWtrZXIgZXR0ZXIgYmVkcmUgbMO4c25pbmdlciBww6UgbG9jYWwgc3RhdGVzIG9nL2VsbGVyIGdsb2JhbCBzdGF0ZXMgbWVkIG5leHQgYXRtIChIw6Vrb24pXHJcbiAgICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbdXNlcm5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gICAgY29uc3QgW2xvZ2dlZFVzZXJuYW1lLCBzZXRMb2dnZWRVc2VybmFtZV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICAgIGNvbnN0IFtsb2dnZWRJbiwgc2V0TG9nZ2VkSW5dID0gdXNlU3RhdGUoZmFsc2UpXHJcbiAgICBjb25zdCBbbm90RWxpZ1VzZXJuYW1lLCBzZXROb3RFbGlnVXNlcm5hbWVdID0gdXNlU3RhdGUoZmFsc2UpXHJcblxyXG5cclxuICAgIC8vIE7DpXIgYnJ1a2VyZSB0cnlra2VyIGxvZ2luLCBlbmRyZXMgc3RhdGVzZW5lLCBkZXR0ZSBza2plciBrdW4gaSBsb2dpbiBhdG0sIHPDpSBodmlzIG1hbiByZWZyZXNoZXIvYnl0dGVyIHBhZ2UsIGJsaXIgbWFuIGxvZ2dldCB1dC4gXHJcbiAgICBjb25zdCBoYW5kbGVMb2dpbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGlmKCFsb2dnZWRJbil7XHJcbiAgICAgICAgICAgIGlmKGNoZWNrVXNlcm5hbWVFbGlnKHVzZXJuYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBzZXRMb2dnZWRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRMb2dnZWRJbih0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNldE9wZW4odHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXROb3RFbGlnVXNlcm5hbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Ugc2V0Tm90RWxpZ1VzZXJuYW1lKHRydWUpOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVzZXR0ZXIgYWxsZSBzdGF0c2VuZSBuw6VyIGJydWtlciB0cnlra2VyIHDDpSBsb2dnIHV0XHJcbiAgICBjb25zdCBoYW5kbGVMb2dvdXRDbGljayA9ICgpID0+IHtcclxuICAgICAgICBzZXRMb2dnZWRVc2VybmFtZShcIlwiKTtcclxuICAgICAgICBzZXRVc2VybmFtZShcIlwiKTtcclxuICAgICAgICBzZXRPcGVuKGZhbHNlKTtcclxuICAgICAgICBzZXRMb2dnZWRJbihmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2pla2tlciBlbGlnIGF2IGJydWtlcm5hdm4sIG3DpSBub2sgYWRkZSBhdCBkZW4gc2pla2tlciBldHRlciBrb21tdW5lIGJydWtlciBvLmwsIG1lbiB2aSBrYW4gdmVudGUgbGl0dCBtZWQgZGV0LlxyXG4gICAgY29uc3QgY2hlY2tVc2VybmFtZUVsaWcgPSAodXNlcm5hbWUpID0+IHtcclxuICAgICAgICBpZih1c2VybmFtZS5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4oXHJcbiAgICAgICAgPEdyaWRcclxuICAgICAgICAgICAgY29udGFpbmVyXHJcbiAgICAgICAgICAgIHNwYWNpbmc9ezB9XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbj1cImNvbHVtblwiXHJcbiAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICAgICAgICBqdXN0aWZ5PVwiY2VudGVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAnNzB2aCcsIG1pbldpZHRoOiAnOTB2aCd9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHtsb2dnZWRJbiA/IFxyXG4gICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7Zm9udFdlaWdodDogXCJub3JtYWxcIn19PkxvZ2dldCBpbm4gc29tIHtsb2dnZWRVc2VybmFtZX08L2gyPiBcclxuICAgICAgICAgICAgOiAgIDxoMiBzdHlsZT17e2ZvbnRXZWlnaHQ6IFwibm9ybWFsXCJ9fT5Mb2dnIGlubjwvaDI+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB7bG9nZ2VkSW4gPyBcclxuICAgICAgICAgICAgICAgIG51bGwgXHJcbiAgICAgICAgICAgIDogICA8Zm9ybSBub1ZhbGlkYXRlIGF1dG9Db21wbGV0ZT1cIm9mZlwiIHN0eWxlPXt7d2lkdGg6IFwiNTB2aFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFRleHRGaWVsZCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJvdXRsaW5lZC1iYXNpY1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkJydWtlcm5hdm5cIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJvdXRsaW5lZFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsV2lkdGg9XCJ0cnVlXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt1c2VybmFtZX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0VXNlcm5hbWUoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGJyLz5cclxuICAgICAgICAgICAge2xvZ2dlZEluID8gXHJcbiAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiBjb2xvcj1cInNlY29uZGFyeVwiIG9uQ2xpY2s9e2hhbmRsZUxvZ291dENsaWNrfT5Mb2dnIHV0PC9CdXR0b24+XHJcbiAgICAgICAgICAgIDogICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiBjb2xvcj1cInByaW1hcnlcIiBvbkNsaWNrPXtoYW5kbGVMb2dpbkNsaWNrfT5Mb2dnIGlubjwvQnV0dG9uPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDxici8+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAge2xvZ2dlZEluID8gXHJcbiAgICAgICAgICAgICAgICBudWxsIFxyXG4gICAgICAgICAgICA6ICAgPEFsZXJ0IGVsZXZhdGlvbj17MX0gc2V2ZXJpdHk9XCJpbmZvXCI+Rm9yIMOlIGxvZ2dlIGlubiBtZWQga29tbXVuZSwgdmVsZyBldCBicnVrZXJuYXZuIHDDpSBmb3JtZW4gW0RpdHQgbmF2bl1fa29tbXVuZTwvQWxlcnQ+XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIDxTbmFja2JhciBvcGVuPXtub3RFbGlnVXNlcm5hbWV9IGF1dG9IaWRlRHVyYXRpb249ezYwMDB9PlxyXG4gICAgICAgICAgICAgICAgPEFsZXJ0IGVsZXZhdGlvbj17MX0gc2V2ZXJpdHk9XCJlcnJvclwiPklra2UgZ3lsZGlnIGJydWtlcm5hdm4gKHNqZWtrZXIgYmFyZSBvbSBkZXQgZXIgbm9lIHNrcmV2ZXQgZWxsZXIgaWtrZSBhdG0pe2xvZ2dlZFVzZXJuYW1lfTwvQWxlcnQ+XHJcbiAgICAgICAgICAgIDwvU25hY2tiYXI+XHJcblxyXG4gICAgICAgICAgICA8U25hY2tiYXIgb3Blbj17b3Blbn0gYXV0b0hpZGVEdXJhdGlvbj17NjAwMH0+XHJcbiAgICAgICAgICAgICAgICA8QWxlcnQgZWxldmF0aW9uPXsxfSBzZXZlcml0eT1cInN1Y2Nlc3NcIj5Jbm5sb2dnaW5nIHZlbGx5a2tldCwgdmVsa29tbWVuIHtsb2dnZWRVc2VybmFtZX08L0FsZXJ0PlxyXG4gICAgICAgICAgICA8L1NuYWNrYmFyPlxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgPC9HcmlkPiBcclxuICAgIClcclxufVxyXG5cclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG1hdGVyaWFsLXVpL2NvcmUvQnV0dG9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBtYXRlcmlhbC11aS9jb3JlL0dyaWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG1hdGVyaWFsLXVpL2NvcmUvU25hY2tiYXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG1hdGVyaWFsLXVpL2NvcmUvVGV4dEZpZWxkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBtYXRlcmlhbC11aS9sYWIvQWxlcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7Il0sInNvdXJjZVJvb3QiOiIifQ==