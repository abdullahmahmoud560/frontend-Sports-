# ===== Build stage =====
FROM node:20-alpine as build

WORKDIR /app

# نسخ package.json و package-lock.json
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ باقي المشروع
COPY . .

# بناء التطبيق
RUN npm run build

# ===== Production stage =====
FROM nginx:alpine

# حذف ملفات HTML الافتراضية
RUN rm -rf /usr/share/nginx/html/*

# نسخ ملفات البناء
COPY --from=build /app/build /usr/share/nginx/html

# نسخ إعدادات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE المنفذ المستخدم في nginx.conf
EXPOSE 9000

# تشغيل Nginx
CMD ["nginx", "-g", "daemon off;"]