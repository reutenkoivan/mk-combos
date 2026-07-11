import { validateMk1Data } from "./coverage/runtime";

const result = validateMk1Data();

if (!result.ok) {
  console.error("MK1 data validation failed:");
  for (const issue of result.issues) {
    const path = issue.path ? ` (${issue.path.join(" > ")})` : "";
    console.error(`- ${issue.code}${path}: ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `MK1 data validation passed: ${result.counts.characters} characters, ${result.counts.kameos} kameos, ${result.counts.combos} combos.`,
  );
}
