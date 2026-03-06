"use strict";

const { handleHealthCheck } = require("./_lib/forms");
const { methodNotAllowed } = require("./_lib/http");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  return handleHealthCheck();
};
