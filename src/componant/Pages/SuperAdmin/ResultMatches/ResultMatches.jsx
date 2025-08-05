import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function ResultMatches() {

  const [matches, setMatches] = useState([]);
  const getMatches = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Matches`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMatches(response.data);
    } catch (error) {
      // Error handling
    }
  };
  useEffect(() => {
    getMatches();
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen p-4" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between p-4 rounded-md mb-6" style={{ background: '#ef4343' }}>
        <div className="text-white text-2xl font-bold">جدول ونتائج المباريات</div>
        <button className="bg-white text-[#ef4343] px-4 py-2 rounded shadow hover:bg-gray-100 font-medium">تحديث البيانات</button>
      </div>

      {matches.map((match) => (
        <>
      {/* جدول اليوم */}
      <div className="bg-white rounded shadow p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <button className="bg-[#ef4343] text-white px-4 py-2 rounded font-medium">{new Date(match.date).toLocaleDateString('ar-EG')}</button>
        </div>
        <div className="text-center text-xl font-bold mb-6 text-[#ef4343]">{new Date(match.date).toLocaleDateString('ar-EG')}</div>

        {/* بطاقة المباراة */}
        <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#ef4343] mb-2">
            <span className="material-icons text-base">edit</span>
            <span>{match.time}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-gray-700 font-medium">{match.homeTeam}</div>
            <div className="text-2xl font-extrabold text-[#ef4343]">{match.homeTeamScore} - {match.awayTeamScore}</div>
            <div className="text-gray-700 font-medium">{match.awayTeam}</div>
          </div>
          <div className="text-left text-gray-500 text-sm mt-2">{match.stadium}</div>
        </div>
      </div>
      </>
    ))}
    </div>
  )
}