import { validateMkxlData } from "./coverage/runtime";

const result = validateMkxlData();

if (!result.ok) {
  console.error("MKXL data validation failed:");
  for (const issue of result.issues) {
    const path = issue.path ? ` (${issue.path.join(" > ")})` : "";
    console.error(`- ${issue.code}${path}: ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `MKXL data validation passed: ${result.counts.characters} characters, ${result.counts.variations} variations, ${result.counts.combos} combos.`,
  );
}
