import Ajv from "ajv";
import addFormats from "ajv-formats";

// Load and parse the config schema
const configSchema = {
  type: "object",
  properties: {
    baseFontSize: { 
      type: "number", 
      minimum: 1 
    },
    targetPath: { 
      type: "string", 
    },
    excludePaths: { 
      type: "array", 
      items: {
        type: 'string',
      },
    },
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
      properties: {
        px: { type: "string", format: "regex" },
        rem: { type: "string", format: "regex" }
      },
      additionalProperties: false,
      required: ["px", "rem"]
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
      patternProperties: {
        "^[0-9]+$": {
          type: "object",
          properties: {
            px: { type: ["string", "null"], pattern: "^\\d+(\\.\\d+)?px$" },
            rem: { type: ["string", "null"], pattern: "^\\d+(\\.\\d+)?rem$" }
          },
          required: ["px", "rem"]
        }
      },
      additionalProperties: false
    }
  },
  required: [
    "baseFontSize", 
    "targetPath",
    "excludePaths", 
    "round", 
    "lengthMatchingRules", 
    "properties", 
    "sizes"
  ],
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