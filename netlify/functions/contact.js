"use strict";

const { handleContactSubmission } = require("./_lib/forms");

exports.handler = async function handler(event) {
  return handleContactSubmission(event);
};
