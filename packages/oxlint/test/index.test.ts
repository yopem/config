import { expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALL_REACT_DOCTOR_RULES,
  NEXTJS_RULES,
  REACT_NATIVE_RULES,
  RECOMMENDED_RULES,
  TANSTACK_QUERY_RULES,
  TANSTACK_START_RULES,
} from "oxlint-plugin-react-doctor";
import baseConfig from "@yopem/oxlint-config";
import reactConfig from "@yopem/oxlint-config/react";
import nextjsConfig from "@yopem/oxlint-config/nextjs";
import reactNativeConfig from "@yopem/oxlint-config/react-native";
import tanstackStartConfig from "@yopem/oxlint-config/tanstack-start";

test("React Doctor rules stay scoped to their framework presets", () => {
  expect(JSON.stringify(baseConfig.jsPlugins)).not.toContain("react-doctor");

  for (const key of Object.keys(ALL_REACT_DOCTOR_RULES)) {
    const disabled = [
      "react-doctor/react-in-jsx-scope",
      "react-doctor/jsx-no-jsx-as-prop",
      "react-doctor/jsx-max-depth",
      "react-doctor/only-export-components",
    ].includes(key);

    expect(baseConfig.rules?.[key]).toBeUndefined();
    expect(reactConfig.rules?.[key]).toEqual(
      disabled ? "off" : (TANSTACK_QUERY_RULES[key] ?? RECOMMENDED_RULES[key]),
    );
    expect(nextjsConfig.rules?.[key]).toEqual(
      disabled ? "off" : (NEXTJS_RULES[key] ?? RECOMMENDED_RULES[key]),
    );
    expect(reactNativeConfig.rules?.[key]).toEqual(
      disabled ? "off" : (REACT_NATIVE_RULES[key] ?? RECOMMENDED_RULES[key]),
    );
    expect(tanstackStartConfig.rules?.[key]).toEqual(
      disabled ? "off" : (TANSTACK_START_RULES[key] ?? RECOMMENDED_RULES[key]),
    );
  }

  const directory = mkdtempSync(join(tmpdir(), "oxlint-react-doctor-"));
  const configPath = join(directory, "oxlint.config.ts");
  const fixturePath = join(directory, "component.jsx");
  const oxlintPath = fileURLToPath(new URL("../bin/oxlint", import.meta.resolve("oxlint")));

  try {
    for (const presets of [
      [],
      ["react"],
      ["nextjs"],
      ["react", "nextjs"],
      ["react-native"],
      ["tanstack-start"],
      ["react", "tanstack-start"],
    ]) {
      writeFileSync(
        configPath,
        `import base from ${JSON.stringify(import.meta.resolve("@yopem/oxlint-config"))};
${presets.map((preset, index) => `import preset${index} from ${JSON.stringify(import.meta.resolve(`@yopem/oxlint-config/${preset}`))};`).join("\n")}
export default { extends: [base, ${presets.map((_, index) => `preset${index}`).join(", ")}] };`,
      );
      writeFileSync(fixturePath, "export const answer = 42;\n");
      const clean = Bun.spawnSync(["node", oxlintPath, "-c", configPath, fixturePath]);
      expect(clean.exitCode).toBe(0);
      expect(clean.stderr.toString()).toBe("");

      writeFileSync(
        fixturePath,
        `import { View } from "react-native";
export const answer = 42;
export function Component() {
  debugger;
  return <View slot={<img />}>Raw text<div><div><div><div><div><div><div><div><div><div>Text</div></div></div></div></div></div></div></div></div></div></View>;
}
`,
      );
      const invalid = Bun.spawnSync(["node", oxlintPath, "-c", configPath, fixturePath]);
      const output = invalid.stdout.toString() + invalid.stderr.toString();
      expect(invalid.exitCode).toBe(1);
      expect(output).toContain("eslint(no-debugger)");
      expect(output).not.toContain("Failed to load");
      expect(output.includes("react-doctor(alt-text)")).toBe(presets.length > 0);
      expect(output.includes("react-doctor(rn-no-raw-text)")).toBe(
        presets.includes("react-native"),
      );

      for (const id of [
        "react-in-jsx-scope",
        "jsx-no-jsx-as-prop",
        "jsx-max-depth",
        "only-export-components",
        "preact-no-react-hooks-import",
      ]) {
        expect(output).not.toContain(`react-doctor(${id})`);
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 30_000);
