import fs from "fs";
import csv from "csv-parser";

export async function updateDatabase(
  restaurantModel,
  csvFilePath = "sorted_restaurants.csv"
) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        try {
          for (const row of results) {
            const { name, average_score } = row;

            if (!name || !average_score) {
              console.log(`Bỏ qua dòng thiếu dữ liệu:`, row);
              continue;
            }

            await restaurantModel.updateOne(
              { name: name },
              { $set: { averageScore: parseFloat(average_score) || 0 } }
            );

            console.log(`Updated: ${name} - Average Score: ${average_score}`);
          }

          console.log("Cập nhật hoàn tất!");
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => reject(error));
  });
}
