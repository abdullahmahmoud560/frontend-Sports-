# ===== Build stage =====
FROM node:18-alpine as build

# تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات package.json و package-lock.json
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# بناء تطبيق React
RUN npm run build

# ===== Production stage =====
FROM nginx:alpine

# حذف ملفات HTML الافتراضية من Nginx
RUN rm -rf /usr/share/nginx/html/*

# نسخ الملفات المبنية من مرحلة البناء
COPY --from=build /app/build /usr/share/nginx/html

# نسخ إعدادات Nginx المخصصة
COPY nginx.conf /etc/nginx/conf.d/default.conf

# فتح بورت 80
EXPOSE 80

# تشغيل Nginx
CMD ["nginx", "-g", "daemon off;"]
