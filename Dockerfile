# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# نستخدم env.production تلقائيًا
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# نسخ ملفات البناء إلى nginx
COPY --from=build /app/build /usr/share/nginx/html

# حذف الكونفج الافتراضي
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
