# نظام المصادقة والأدوار

## نظرة عامة

تم تطوير نظام مصادقة متكامل للتحكم في الوصول إلى مكونات التطبيق بناءً على دور المستخدم.

## المكونات الرئيسية

### 1. `tokenUtils.js`
مجموعة من الدوال المساعدة لفك تشفير التوكن والتحقق من الأدوار:

- `decodeToken(token)` - فك تشفير التوكن JWT
- `isTokenValid(decodedToken)` - التحقق من صلاحية التوكن
- `isAdmin(decodedToken)` - التحقق من كون المستخدم مشرف
- `getUserInfo(token)` - الحصول على معلومات المستخدم
- `hasAccess(token, requiredRole)` - التحقق من صلاحية الوصول

### 2. `useAuth.js` Hook
Hook مخصص لإدارة حالة المصادقة:

```javascript
const { isAuthenticated, isAdmin, userData, loading, logout } = useAuth();
```

### 3. `ProtectedRoute.jsx`
مكون حماية للصفحات التي تتطلب صلاحيات خاصة:

```javascript
<ProtectedRoute requiredRole="admin" redirectTo="/info">
  <AdminComponent />
</ProtectedRoute>
```

## كيفية الاستخدام

### 1. التحقق من دور المستخدم في المكونات

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isAdmin, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isAuthenticated && <UserPanel />}
    </div>
  );
}
```

### 2. حماية الصفحات

```javascript
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin" redirectTo="/login">
          <AdminPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### 3. التحقق من التوكن يدوياً

```javascript
import { getUserInfo, hasAccess } from '../utils/tokenUtils';

const token = localStorage.getItem('token');
const userInfo = getUserInfo(token);

if (userInfo.isAdmin) {
  // إظهار مكونات المشرف
}
```

## هيكل التوكن المتوقع

التوكن يجب أن يحتوي على حقل `Role` أو `role` مع القيم التالية:

```json
{
  "sub": "user123",
  "Role": "admin",
  "exp": 1640995200,
  "iat": 1640908800
}
```

## الأدوار المدعومة

- `admin` / `Admin` / `ADMIN` - مشرف النظام
- يمكن إضافة المزيد من الأدوار حسب الحاجة

## الأمان

- التحقق التلقائي من انتهاء صلاحية التوكن
- إزالة التوكن من localStorage عند انتهاء الصلاحية
- مراقبة التغييرات في localStorage
- حماية الصفحات من الوصول غير المصرح به

## التشخيص

يمكن مراقبة معلومات المصادقة في وحدة تحكم المتصفح:

```javascript
// معلومات المستخدم
console.log("معلومات المستخدم:", { isAuthenticated, isAdmin, userData });

// معلومات التوكن المفكك
console.log("معلومات التوكن:", decodedToken);
```

## التحديثات المستقبلية

- إضافة المزيد من الأدوار (مستخدم عادي، مدير، إلخ)
- دعم الصلاحيات التفصيلية
- إضافة نظام تجديد التوكن
- تحسين الأمان وإضافة المزيد من طبقات الحماية 