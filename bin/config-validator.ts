import Ajv from "ajv";
import addFormats from "ajv-formats";

// Load and parse the config schema
const configSchema = {
  // Your schema goes here
  type: "object",
  properties: {
    baseFontSize: { type: "number", minimum: 1 },
    round: {
      type: "object",
      properties: {
        enabled: { type: "boolean" },
        roundUpOnTie: { type: "boolean" }
      },
      required: ["enabled", "roundUpOnTie"]
    },
    lengthMatchingRules: {
      type: "object",
      propertyNames: { pattern: "^[a-zA-Z]+$" },
      additionalProperties: { type: "string", format: "regex" }
    },
    properties: {
      type: "object",
      propertyNames: { pattern: "^[a-zA-Z-]+$" },
      additionalProperties: {
        type: "string",
        enum: ["px", "rem"]
      }
    },
    sizes: {
      type: "object",
      properties: {
        px: {
          type: "object",
          propertyNames: { pattern: "^[0-9]+(\\.[0-9]+)?$" },
          additionalProperties: { type: "string", pattern: "^\\d+(\\.\\d+)?px$" }
        },
        rem: {
          type: "object",
          propertyNames: { pattern: "^[0-9]+(\\.[0-9]+)?$" },
          additionalProperties: { type: "string", pattern: "^\\d+(\\.\\d+)?rem$" }
        }
      },
      required: ["px", "rem"]
    }
  },
  required: ["baseFontSize", "round", "lengthMatchingRules", "properties", "sizes"],
  additionalProperties: false
};

// Load AJV and formats
const ajv = new Ajv();
addFormats(ajv); // Add regex format support

// Compile the schema
const validate = ajv.compile(configSchema);

// Function to validate the config
export const validateConfig = (config: any) => {
  const valid = validate(config);

  if (!valid) {
    console.error("Config validation failed:");
    console.error(validate.errors);
    return false;
  }

  console.log("Config is valid.");
  return true;
};