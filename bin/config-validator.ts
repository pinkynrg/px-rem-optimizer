import Ajv from "ajv";

const ajv = new Ajv();

// Define the schema
const schema = {
  type: "object",
  properties: {
    baseFontSize: {
      type: "number",
      minimum: 10,
      maximum: 25
    },
    targetPath: {
      type: "string"
    },
    excludePaths: {
      type: "array",
      items: {
        type: "string"
      }
    },
    roundStrategy: {
      type: "object",
      properties: {
        onTie: {
          type: "string",
          enum: ["up", "down"]
        },
        mode: {
          type: "string",
          enum: ["on", "off", "comment"]
        }
      },
      required: ["onTie", "mode"]
    },
    transformers: {
      type: "array",
    },
    properties: {
      type: "object",
      additionalProperties: {
        type: "string",
        enum: ["rem", "px", "skip"]
      }
    },
    sizes: {
      type: "object",
      patternProperties: {
        "^[0-9]+$": {
          type: "object",
          properties: {
            px: {
              anyOf: [
                { type: "null" },
                { type: "string" }
              ]
            },
            rem: {
              anyOf: [
                { type: "null" },
                { type: "string" }
              ]
            }
          },
          required: ["px", "rem"]
        }
      }
    }
  },
  required: ["baseFontSize", "targetPath", "excludePaths", "roundStrategy", "properties", "sizes", "transformers"],
  additionalProperties: false
};

// Define the function that validates the config
export const validateConfig = (config: any): boolean => {
  const validate = ajv.compile(schema);
  const isValid = validate(config);
  
  if (!isValid) {
    console.error("Config validation failed:");
    console.error(validate.errors);
    return false;
  }

  console.log("Config is valid.");
  return true;
};
