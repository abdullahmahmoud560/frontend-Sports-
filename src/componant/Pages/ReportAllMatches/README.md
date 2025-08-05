# نظام تقارير المباريات

## نظرة عامة
تم تطوير نظام شامل لإدارة تقارير المباريات يتكون من عدة مكونات تعمل معاً لتوفير تجربة مستخدم متكاملة.

## المكونات

### 1. MatchesList.jsx
**الوظيفة**: عرض قائمة المباريات وإدارة التنقل
- جلب المباريات من API: `https://sports.runasp.net/api/Get-Score-Matches-By-Academy`
- عرض بطاقات المباريات مع التفاصيل
- إرسال معرف المباراة إلى كومبوننت التقرير

**الاستخدام**:
```jsx
import MatchesList from "./MatchesList";

function App() {
  return <MatchesList />;
}
```

### 2. ReportAllMatches.jsx
**الوظيفة**: إنشاء وتحرير تقارير المباريات
- استقبال معرف المباراة وبياناتها
- إدارة بيانات اللاعبين، الطاقم الفني، الأهداف، والبطاقات
- إرسال التقرير إلى API: `https://sports.runasp.net/api/Add-Matches-Report`

**الخصائص (Props)**:
- `matchId`: معرف المباراة
- `matchData`: بيانات المباراة الأساسية
- `onClose`: دالة العودة لقائمة المباريات

### 3. useMatchReportModel.js
**الوظيفة**: إدارة منطق الأعمال وحالة البيانات
- إدارة جميع العمليات (CRUD) للبيانات
- التعامل مع API calls
- إدارة حالات التحميل والأخطاء

## تدفق العمل

```
1. MatchesList → جلب المباريات من API
2. عرض قائمة المباريات في بطاقات
3. المستخدم يختار مباراة → openMatchReport()
4. ReportAllMatches يستقبل matchId و matchData
5. تحميل/إنشاء تقرير المباراة
6. المستخدم يعدل البيانات ويحفظ
7. إرسال التقرير إلى API
8. العودة لقائمة المباريات
```

## API Endpoints

### جلب المباريات
```
GET https://sports.runasp.net/api/Get-Score-Matches-By-Academy
Headers: Authorization: Bearer {token}
```

### حفظ التقرير
```
POST https://sports.runasp.net/api/Add-Matches-Report
Headers: 
- Authorization: Bearer {token}
- Content-Type: application/json

Body:
{
  "matchId": number,
  "players": [
    {
      "playerName": string,
      "position": string,
      "essential": string,
      "reserve": string,
      "notes": string
    }
  ],
  "goals": [...],
  "cards": [...],
  "staff": [
    {
      "techName": string,
      "role": string,
      "notes": string
    }
  ]
}
```

## الميزات

### ✅ قائمة المباريات
- عرض تفاصيل المباراة (الفرق، التاريخ، النتيجة)
- حالة المباراة (مكتملة، جارية، منتظرة)
- زر الوصول لتقرير كل مباراة
- تحديث القائمة

### ✅ تقرير المباراة
- إدارة قائمة اللاعبين
- تسجيل الأهداف مع اختيار اللاعب
- تسجيل البطاقات (صفراء/حمراء)
- إدارة الطاقم الفني
- حفظ التقرير وإرساله للخادم

### ✅ تجربة المستخدم
- تصميم متجاوب
- رسائل الحالة والأخطاء
- تأثيرات بصرية وانيميشن
- زر العودة للتنقل السهل

## التخصيص

يمكن تخصيص النظام عبر:
- تعديل CSS في `ReportAllMatches.css`
- إضافة حقول جديدة في النماذج
- تغيير بنية البيانات في `useMatchReportModel.js`
- تخصيص API endpoints

## الاستخدام في التطبيق

لاستخدام النظام في تطبيقك، ما عليك سوى استيراد `MatchesList`:

```jsx
// في Router أو المكون الرئيسي
import MatchesList from "./componant/Pages/ReportAllMatches/MatchesList";

// في التطبيق
<Route path="/matches-reports" component={MatchesList} />
```

النظام سيتولى باقي العمليات تلقائياً!