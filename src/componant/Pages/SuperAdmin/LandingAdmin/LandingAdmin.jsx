import React from 'react'

const LandingAdmin = () => {
  return (
    <div className="admin-dashboard-bg min-h-screen p-6" style={{background: '#f6f7fa'}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-500 text-sm">ssalih292@gmail.com</span>
        <span className="font-bold text-lg text-gray-800">لوحة تحكم المشرف الرئيسية</span>
      </div>

      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">مرحباً بك في لوحة تحكم المشرف</h2>
        <p className="text-gray-500 text-base">يمكنك إدارة الأكاديميات، اللاعبين، المباريات والإحصائيات من هنا</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl shadow bg-white border-t-4 border-blue-500 p-5 flex flex-col items-center">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-2">
            <i className="fas fa-users text-2xl"></i>
          </div>
          <div className="text-lg font-bold text-blue-700">55</div>
          <div className="text-gray-600 text-sm mt-1">الموظفين والإداريين</div>
        </div>
        <div className="rounded-xl shadow bg-white border-t-4 border-purple-500 p-5 flex flex-col items-center">
          <div className="bg-purple-100 text-purple-600 rounded-full p-3 mb-2">
            <i className="fas fa-user-friends text-2xl"></i>
          </div>
          <div className="text-lg font-bold text-purple-700">3</div>
          <div className="text-gray-600 text-sm mt-1">مجموع اللاعبين</div>
        </div>
        <div className="rounded-xl shadow bg-white border-t-4 border-green-500 p-5 flex flex-col items-center">
          <div className="bg-green-100 text-green-600 rounded-full p-3 mb-2">
            <i className="fas fa-trophy text-2xl"></i>
          </div>
          <div className="text-lg font-bold text-green-700">33</div>
          <div className="text-gray-600 text-sm mt-1">عدد الفرق</div>
        </div>
        <div className="rounded-xl shadow bg-white border-t-4 border-pink-500 p-5 flex flex-col items-center">
          <div className="bg-pink-100 text-pink-600 rounded-full p-3 mb-2">
            <i className="fas fa-table text-2xl"></i>
          </div>
          <div className="text-lg font-bold text-pink-700">11</div>
          <div className="text-gray-600 text-sm mt-1">عدد الأكاديميات المشاركة</div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* معلومات البطولة */}
          <div>
            <div className="font-bold text-gray-700 mb-2">معلومات البطولة</div>
            <div className="text-sm text-gray-600 mb-2">مواعيد البطولة</div>
            <div className="text-base text-blue-700 mb-4">15 - 30 يونيو 2025</div>
            <div className="text-sm text-gray-600 mb-2">الإحصائيات العامة</div>
            <div className="text-base text-blue-700">عدد المباريات <span className="font-bold">2 مباراة</span></div>
          </div>
          {/* إحصائيات */}
          <div className="flex flex-col items-center justify-center border-x border-gray-100">
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm mb-1">عدد الأهداف</div>
              <div className="text-2xl font-bold text-green-600 mb-2">2 هدف</div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <div className="text-gray-500 text-sm mb-1">عدد البطاقات</div>
              <div className="text-2xl font-bold text-pink-600">0 بطاقة</div>
            </div>
          </div>
          {/* تواريخ مهمة */}
          <div>
            <div className="font-bold text-gray-700 mb-2">تواريخ مهمة</div>
            <ul className="list-disc pr-5 text-gray-600 text-sm space-y-1">
              <li>آخر موعد لتسجيل اللاعبين: 10 يونيو 2025</li>
              <li>اجتماع المشرفين: 14 يونيو 2025</li>
              <li>حفل افتتاح البطولة: 15 يونيو 2025</li>
              <li>نهائي البطولة: 30 يونيو 2025</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingAdmin