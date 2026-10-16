// ใส่ลิงก์ API ของ Cloudflare ของเรา
const API_URL = 'https://smart-school-api.anon-0da.workers.dev';

// ========== ระบบเปลี่ยนหน้า (Navigation) ==========
function showPage(pageId) {
  // ซ่อนทุกหน้า
  $('.page').removeClass('active');
  // โชว์หน้าที่เลือก
  $('#' + pageId).addClass('active');
  
  // เปลี่ยนสีเมนูซ้ายมือ
  $('.nav-item').removeClass('active');
  $(`.nav-item[data-page="${pageId}"]`).addClass('active');
  
  // เปลี่ยนชื่อหัวเรื่องด้านบน
  const pageTitle = $(`.nav-item[data-page="${pageId}"] span`).text();
  $('#topbarPageTitle').text(pageTitle);

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function toggleMobileSidebar() {
  $('#tech-sidebar').toggleClass('mobile-open');
  $('#mobileOverlay').toggleClass('hidden');
}

// ========== ฟังก์ชันกลางสำหรับคุยกับ Cloudflare API ==========
// ตัวนี้จะมาแทน google.script.run ทั้งหมดของระบบเดิม
async function fetchAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(API_URL + endpoint, options);
    const result = await response.json();
    return result;

  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
}

// ========== เริ่มต้นการทำงานเมื่อเปิดเว็บ ==========
$(document).ready(async function() {
  console.log("ระบบพร้อมใช้งาน!");

  // ทดสอบยิงไปถาม API ว่าทำงานปกติไหม
  const ping = await fetchAPI('/api/ping');
  console.log("สถานะ API:", ping);

  // ถ้า API ตอบกลับมา โชว์ข้อความสำเร็จหน้าเว็บ
  if(ping && ping.message) {
    $('#page-landing .glass-card').append(
      `<div class="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-bold">
        <i class="fa-solid fa-link"></i> เชื่อมต่อฐานข้อมูล Cloudflare สำเร็จ! 🚀<br>
        <span class="text-sm font-normal text-slate-500">${ping.message}</span>
      </div>`
    );
  }
});
