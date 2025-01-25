import { PersonalizeRuntimeClient } from "@aws-sdk/client-personalize-runtime";

const personalizeRuntimeClient = new PersonalizeRuntimeClient({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIAVVZPCUVORQEPZCBQ",
    secretAccessKey: "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",
  },
});

export { personalizeRuntimeClient };
