# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# نسخ ملفات package.json و package-lock.json فقط للتثبيت
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci

# نسخ باقي ملفات المشروع
COPY . .

# بناء المشروع (للبيئة الإنتاجية)
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# حذف ملفات nginx الافتراضية
RUN rm -rf /usr/share/nginx/html/*

# نسخ ملفات البناء من المرحلة الأولى
COPY --from=build /app/build /usr/share/nginx/html

# نسخ ملف إعدادات Nginx مخصص (اختياري)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# تعريض البورت 80
EXPOSE 80

# تشغيل Nginx في المقدمة
CMD ["nginx", "-g", "daemon off;"]
