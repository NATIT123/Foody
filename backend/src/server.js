import app from "./app.js";
import dotenv from "dotenv";
const port = process.env.PORT || 8080;

///Enviroment Variables
dotenv.config({ path: "./config.env" });

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});

// Import the required modules and clients
// import { GetRecommendationsCommand } from "@aws-sdk/client-personalize-runtime";
// import { personalizeRuntimeClient } from "./libs/personalizeClients.js"; // Ensure this is correctly implemented

// // Function to get recommendations by user ID
// export const getRecommendationsByUserId = async (userId) => {
//   const params = {
//     campaignArn:
//       "arn:aws:personalize:ap-southeast-1:390403892573:campaign/user-personalize-campaign",
//     userId: userId, // Dynamic userId
//     numResults: 15, // Optional parameter
//   };

//   try {
//     const response = await personalizeRuntimeClient.send(
//       new GetRecommendationsCommand(params)
//     );
//     console.log("Recommendations by User ID Success!", response);
//     return response;
//   } catch (err) {
//     console.error("Error fetching recommendations by User ID", err);
//   }
// };

// // Function to get recommendations by similar items
// export const getRecommendationsByItem = async (itemId) => {
//   const params = {
//     campaignArn:
//       "arn:aws:personalize:ap-southeast-1:390403892573:campaign/SIMS-campaign",
//     itemId: itemId, // Dynamic userId
//     numResults: 15, // Optional parameter
//   };

//   try {
//     const response = await personalizeRuntimeClient.send(
//       new GetRecommendationsCommand(params)
//     );
//     console.log("Recommendations by Similar Items Success!", response);
//     return response;
//   } catch (err) {
//     console.error("Error fetching recommendations by Similar Items", err);
//   }
// };

// // Function to get recommendations by popularity count
// export const getRecommendationsByPopularity = async (userId) => {
//   const params = {
//     campaignArn:
//       "arn:aws:personalize:ap-southeast-1:390403892573:campaign/popularitycount-campaign",
//     userId: userId, // Dynamic itemId
//     numResults: 15, // Optional parameter
//   };

//   try {
//     const response = await personalizeRuntimeClient.send(
//       new GetRecommendationsCommand(params)
//     );
//     console.log("Recommendations by Popularity Count Success!", response);
//     return response;
//   } catch (err) {
//     console.error("Error fetching recommendations by Popularity Count", err);
//   }
// };

// // Example Usage
// (async () => {
//   await getRecommendationsByUserId("USER_ID"); // Replace with actual user ID
//   await getRecommendationsByItem("USER_ID"); // Replace with actual user ID
//   await getRecommendationsByPopularity("ITEM_ID"); // Replace with actual item ID
// })();

process.on("unhandleRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLE REJECTION! SHUTTING DOWN....");
  server.close(() => {
    process.exit(1);
  });
});
