import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeamsRanking() {
  const [age, setAge] = useState('all');
  const [teams, setTeams] = useState([]);
  const getTeams = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Matches-Table`);
      setTeams(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTeams();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7fa] p-2 sm:p-4" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 rounded-md mb-4 sm:mb-6 bg-[#ef4343] gap-3">
        <div className="text-white text-xl sm:text-2xl font-bold text-center sm:text-right">ترتيب الفرق المشاركة</div>
        <button className="bg-white text-[#ef4343] px-3 py-2 rounded shadow hover:bg-gray-100 font-medium flex items-center gap-2 text-sm sm:text-base">
          <span className="material-icons" style={{ fontSize: 18 }}>refresh</span>
          تحديث الترتيب
        </button>
      </div>

      {/* جدول الترتيب */}
      <div className="bg-white rounded-xl shadow p-0 max-w-5xl mx-auto overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full text-center border-collapse text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-[#ef4343] text-white">
                <th className="py-2 px-1 sm:py-3 sm:px-2">#</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">الفريق</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">لعب</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">فوز</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">تعادل</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">خسارة</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">له</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">عليه</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">+/-</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2">نقاط</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={team.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-1 sm:px-2 font-bold text-[#ef4343]">{idx + 1}</td>
                  <td className="py-2 px-1 sm:px-2 text-right">{team.matchesPlayed}</td>
                  <td className="py-2 px-1 sm:px-2">{team.academyName}</td>
                  <td className="py-2 px-1 sm:px-2">{team.wins}</td>
                  <td className="py-2 px-1 sm:px-2">{team.draws}</td>
                  <td className="py-2 px-1 sm:px-2">{team.losses}</td>
                  <td className="py-2 px-1 sm:px-2">{team.goalsFor}</td>
                  <td className="py-2 px-1 sm:px-2">{team.goalsAgainst}</td>
                  <td className="py-2 px-1 sm:px-2">{team.goalDifference}</td>
                  <td className="py-2 px-1 sm:px-2 font-bold text-[#ef4343]">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
