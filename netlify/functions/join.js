"use strict";

const { handleJoinSubmission } = require("./_lib/forms");

exports.handler = async function handler(event) {
  return handleJoinSubmission(event);
};
