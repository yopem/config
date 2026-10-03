import { expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_REACT_DOCTOR_RULES } from "oxlint-plugin-react-doctor";
import baseConfig from "@yopem/oxlint-config";
import reactDoctorConfig from "@yopem/oxlint-config/react-doctor";

test("React Doctor is opt-in alongside existing and optional presets", () => {
  expect(JSON.stringify(baseConfig.jsPlugins)).not.toContain("react-doctor");
  for (const [name, severity] of Object.entries(ALL_REACT_DOCTOR_RULES)) {
    expect(baseConfig.rules?.[name]).toBeUndefined();
    expect(reactDoctorConfig.rules?.[name]).toEqual(severity);
  }

  expect(baseConfig.rules?.["quality/no-array-filter-map"]).toBe("error");
  expect(baseConfig.rules?.["no-console"]).toEqual(["error", { allow: ["error", "warn", "info"] }]);

  const directory = mkdtempSync(join(tmpdir(), "oxlint-react-doctor-"));
  const configPath = join(directory, "oxlint.config.ts");
  const fixturePath = join(directory, "component.jsx");
  const oxlintPath = fileURLToPath(new URL("../bin/oxlint", import.meta.resolve("oxlint")));
  const basePath = import.meta.resolve("@yopem/oxlint-config");
  const reactDoctorPath = import.meta.resolve("@yopem/oxlint-config/react-doctor");
  const reactPath = import.meta.resolve("@yopem/oxlint-config/react");
  const nextjsPath = import.meta.resolve("@yopem/oxlint-config/nextjs");

  try {
    for (const presets of [
      "base",
      "base, doctor",
      "base, doctor, react",
      "base, doctor, react, nextjs",
    ]) {
      writeFileSync(
        configPath,
        `import base from ${JSON.stringify(basePath)};
import doctor from ${JSON.stringify(reactDoctorPath)};
import react from ${JSON.stringify(reactPath)};
import nextjs from ${JSON.stringify(nextjsPath)};
export default { extends: [${presets}] };`,
      );
      writeFileSync(fixturePath, "export const answer = 42;\n");
      const clean = Bun.spawnSync(["node", oxlintPath, "-c", configPath, fixturePath]);
      expect(clean.exitCode).toBe(0);
      expect(clean.stderr.toString()).toBe("");

      writeFileSync(fixturePath, "export function Image() { debugger; return <img />; }\n");
      const invalid = Bun.spawnSync(["node", oxlintPath, "-c", configPath, fixturePath]);
      const output = invalid.stdout.toString() + invalid.stderr.toString();
      expect(invalid.exitCode).toBe(1);
      if (presets.includes("doctor")) {
        expect(output).toContain("react-doctor(alt-text)");
      } else {
        expect(output).not.toContain("react-doctor(");
      }
      expect(output).toContain("eslint(no-debugger)");
      expect(output).not.toContain("Failed to load");
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 30_000);
