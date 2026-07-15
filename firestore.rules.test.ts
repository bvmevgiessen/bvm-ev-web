// @ts-nocheck
/**
 * Firestore Security Rules Test Suite
 * 
 * To execute these tests, run:
 *   npm install -D @firebase/rules-unit-testing
 *   firebase emulators:start --only firestore
 *   npx ts-node firestore.rules.test.ts
 */

import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";

const ADMIN_EMAIL = "bvmevgiessen@gmail.com";
const RANDOM_EMAIL = "test@example.com";

async function runTests() {
  console.log("=============================================");
  console.log("🔥 Starting Firestore Security Rules Test Simulator");
  console.log("=============================================");

  let testEnv: RulesTestEnvironment;
  try {
    testEnv = await initializeTestEnvironment({
      projectId: "bvm-portal-test",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
      },
    });
  } catch (err) {
    console.error("Failed to initialize test environment. Are you sure Firestore rules are readable?", err);
    return;
  }

  // --- Scenarios ---

  // Scenario 1: Unauthenticated Read of config
  const unauthContext = testEnv.unauthenticatedContext();
  try {
    await unauthContext.firestore().doc("survey_settings/config").get();
    console.log("✅ T01: [ALLOW] Unauthenticated Read of survey_settings/config Succeeded.");
  } catch (err) {
    console.error("❌ T01: [ALLOW] Unauthenticated Read of survey_settings/config Failed.");
  }

  // Scenario 2: Unauthenticated Write of config (Should block)
  try {
    await unauthContext.firestore().doc("survey_settings/config").set({
      taetigkeitsberichtGasUrl: "https://evil.com/exec"
    });
    console.error("❌ T03: [DENY] Unauthenticated Write to config bypass detected!");
  } catch (err) {
    console.log("✅ T03: [DENY] Unauthenticated Write to config blocked as expected.");
  }

  // Scenario 3: Random Authenticated Write of config (Should block)
  const randomUserContext = testEnv.authenticatedContext("user_123", {
    email: RANDOM_EMAIL,
    email_verified: true,
  });
  try {
    await randomUserContext.firestore().doc("survey_settings/config").set({
      taetigkeitsberichtGasUrl: "https://evil.com/exec"
    });
    console.error("❌ T05: [DENY] Random Authenticated Write to config bypass detected!");
  } catch (err) {
    console.log("✅ T05: [DENY] Random Authenticated Write to config blocked as expected.");
  }

  // Scenario 4: Unverified Admin Write of config (Should block)
  const unverifiedAdminContext = testEnv.authenticatedContext("admin_123", {
    email: ADMIN_EMAIL,
    email_verified: false,
  });
  try {
    await unverifiedAdminContext.firestore().doc("survey_settings/config").set({
      taetigkeitsberichtGasUrl: "https://script.google.com/macros/s/123/exec"
    });
    console.error("❌ T06: [DENY] Unverified Admin Write to config bypass detected!");
  } catch (err) {
    console.log("✅ T06: [DENY] Unverified Admin Write to config blocked as expected.");
  }

  // Scenario 5: Verified Admin Write of config with VALID data
  const verifiedAdminContext = testEnv.authenticatedContext("admin_123", {
    email: ADMIN_EMAIL,
    email_verified: true,
  });
  try {
    await verifiedAdminContext.firestore().doc("survey_settings/config").set({
      googleSheetsUrl: "https://docs.google.com/spreadsheets/d/123/edit",
      googleSpreadsheetUrl: "https://docs.google.com/spreadsheets/d/123/edit",
      taetigkeitsberichtGasUrl: "https://script.google.com/macros/s/123/exec",
      updatedAt: "2026-07-15T12:00:00Z"
    });
    console.log("✅ T07: [ALLOW] Verified Admin Write with valid data Succeeded.");
  } catch (err: any) {
    console.error("❌ T07: [ALLOW] Verified Admin Write with valid data Failed:", err.message);
  }

  // Scenario 6: Verified Admin Write of config with INVALID data type (Should block)
  try {
    await verifiedAdminContext.firestore().doc("survey_settings/config").set({
      taetigkeitsberichtGasUrl: 123456 // Invalid type, must be string
    });
    console.error("❌ T08: [DENY] Verified Admin Write with invalid schema type bypass detected!");
  } catch (err) {
    console.log("✅ T08: [DENY] Verified Admin Write with invalid schema type blocked as expected.");
  }

  // Scenario 7: Verified Admin Delete config (Should block)
  try {
    await verifiedAdminContext.firestore().doc("survey_settings/config").delete();
    console.error("❌ T09: [DENY] Admin document deletion bypass detected!");
  } catch (err) {
    console.log("✅ T09: [DENY] Admin document deletion blocked as expected.");
  }

  // Clean up
  await testEnv.cleanup();
  console.log("\n=============================================");
  console.log("🏁 Security Rules Simulation Finished!");
  console.log("=============================================");
}

if (require.main === module) {
  runTests();
}
