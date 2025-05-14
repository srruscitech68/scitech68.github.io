document.addEventListener('DOMContentLoaded', function() {
    const otherActivityRadio = document.getElementById('otherActivity');
    const otherActivityGroup = document.getElementById('otherActivityGroup');
    const activityForm = document.getElementById('activityForm');
    const activitiesList = document.getElementById('activitiesList');

    // ตรวจสอบการเลือกกิจกรรมอื่นๆ
    otherActivityRadio.addEventListener('change', function() {
        if (this.checked) {
            otherActivityGroup.style.display = 'block';
            document.getElementById('customActivity').required = true;
        } else {
            otherActivityGroup.style.display = 'none';
            document.getElementById('customActivity').required = false;
        }
    });

    // จัดการการส่งฟอร์ม
    activityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // เก็บข้อมูลจากฟอร์ม
        const formData = new FormData(this);
        const activityData = {};
        
        for (let [key, value] of formData.entries()) {
            activityData[key] = value;
        }
        
        // ตรวจสอบกิจกรรมอื่นๆ
        if (activityData.activity === 'อื่นๆ') {
            activityData.activity = activityData.customActivity;
        }
        
        // สร้างการ์ดกิจกรรมใหม่
        createActivityCard(activityData);
        
        // รีเซ็ตฟอร์ม
        this.reset();
        otherActivityGroup.style.display = 'none';
        
        // แสดงข้อความสำเร็จ
        alert('บันทึกข้อมูลกิจกรรมเรียบร้อยแล้ว');
    });

    // ฟังก์ชันสร้างการ์ดกิจกรรม
    function createActivityCard(data) {
        // ลบข้อความ "ยังไม่มีกิจกรรมที่ส่ง" ถ้ามี
        const noActivitiesMsg = activitiesList.querySelector('.no-activities');
        if (noActivitiesMsg) {
            noActivitiesMsg.remove();
        }
        
        // สร้างองค์ประกอบการ์ด
        const card = document.createElement('div');
        card.className = 'activity-card';
        
        const title = document.createElement('h3');
        title.textContent = data.activity;
        
        const studentInfo = document.createElement('p');
        studentInfo.textContent = `${data.studentName} (${data.studentId})`;
        
        const majorYear = document.createElement('p');
        majorYear.textContent = `${data.major} ชั้นปีที่ ${data.year}`;
        
        const date = document.createElement('p');
        date.textContent = `วันที่เข้าร่วม: ${formatDate(data.activityDate)}`;
        
        card.appendChild(title);
        card.appendChild(studentInfo);
        card.appendChild(majorYear);
        card.appendChild(date);
        
        // เพิ่มรูปภาพถ้ามี
        if (data.activityImage && data.activityImage.name) {
            const imageInfo = document.createElement('p');
            imageInfo.textContent = `รูปภาพ: ${data.activityImage.name}`;
            card.appendChild(imageInfo);
            
            // ในแอปจริงควรแสดงรูปภาพที่อัพโหลด
            // const img = document.createElement('img');
            // img.src = URL.createObjectURL(data.activityImage);
            // card.appendChild(img);
        }
        
        activitiesList.appendChild(card);
    }

    // ฟังก์ชันจัดรูปแบบวันที่
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    }

    // โหลดกิจกรรมที่เคยบันทึกไว้ (ถ้ามี)
    loadSavedActivities();

    // ฟังก์ชันโหลดกิจกรรมที่บันทึกไว้
    function loadSavedActivities() {
        // ในแอปจริงควรดึงข้อมูลจากฐานข้อมูลหรือ localStorage
        // ตัวอย่างนี้ใช้ localStorage สำหรับการสาธิต
        const savedActivities = JSON.parse(localStorage.getItem('sciActivities')) || [];
        
        if (savedActivities.length > 0) {
            // ลบข้อความ "ยังไม่มีกิจกรรมที่ส่ง" ถ้ามี
            const noActivitiesMsg = activitiesList.querySelector('.no-activities');
            if (noActivitiesMsg) {
                noActivitiesMsg.remove();
            }
            
            // สร้างการ์ดสำหรับแต่ละกิจกรรม
            savedActivities.forEach(activity => {
                createActivityCard(activity);
            });
        }
    }
});