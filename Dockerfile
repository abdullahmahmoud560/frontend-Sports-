# مرحلة البناء (Build Stage)
FROM node:18-alpine AS build

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات package.json و package-lock.json
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ بقية ملفات المشروع
COPY . .

# بناء تطبيق React
RUN npm run build

# ================================
# مرحلة الإنتاج (Production Stage)
FROM nginx:alpine

# نسخ الملفات المبنية إلى مجلد Nginx الافتراضي
COPY --from=build /app/build /usr/share/nginx/html

# استبدال ملف إعدادات Nginx بالملف المخصص
COPY nginx.conf /etc/nginx/conf.d/default.conf

# فتح المنفذ 80
EXPOSE 80

# تشغيل Nginx في الواجهة الأمامية
CMD ["nginx", "-g", "daemon off;"]
