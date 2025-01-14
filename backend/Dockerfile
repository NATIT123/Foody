FROM node:16-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Cài đặt Babel CLI toàn cục (nếu cần)
RUN npm install -g @babel/core @babel/cli

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chạy build Babel sau khi sao chép mã nguồn
RUN npm run build

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi chạy container
CMD ["npm", "run", "production"]
