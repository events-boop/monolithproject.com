"use strict";

function isProductionEnvironment(env = process.env) {
  const nodeEnv = String(env.NODE_ENV || "").toLowerCase();
  const context = String(env.CONTEXT || env.NETLIFY_CONTEXT || "").toLowerCase();
  return nodeEnv === "production" || context === "production";
}

module.exports = {
  isProductionEnvironment
};
