let courses = [];
let myCourses = [];

// JSON 데이터 불러오기
async function fetchCourses() {
    try {
        const response = await fetch('courses.json'); // 파일명 확인!
        if (!response.ok) throw new Error('데이터를 불러올 수 없습니다.');
        courses = await response.json();
        renderCourse();
        renderMyCourse();
    } catch (error) {
        console.error("오류 발생:", error);
    }
}

// 상단 표
function renderCourse() {
    const list = document.getElementById('course-list');
    if (!list) return;
    list.innerHTML = '';

    courses.forEach((course, index) => {
        const remain = course.limit - course.enrolled;
        const isFull = remain <= 0;

        const courseClass = course.courseId.split('-')[1]; // 분반
        const courseTime = `${course.day}${course.time} / ${course.room}`; //요일, 시간, 강의실

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>2</td><td>전선</td><td>컴퓨터공학과 /</td><td>주간</td>
                <td>${course.code}</td>
                <td>${courseClass}</td>
                <td style="text-align:left; padding-left:10px;">${course.name}</td>
                <td>${course.credit}</td>
                <td>${course.professor}</td>
                <td>${courseTime}</td>
                <td>
                    <button class="btn-ctrl" onclick="updateCount(${index}, -1)">-</button>
                    <span style="display:inline-block; width:25px;">${course.enrolled}</span>
                    <button class="btn-ctrl" onclick="updateCount(${index}, 1)">+</button>
                </td>
                <td class="${isFull ? 'full-text' : ''}">${remain}</td>
                <td><button class="reg-btn active" onclick="registerCourse(${index})">신청</button></td>
            </tr>
        `;
        list.innerHTML += row;
    });
}

// 하단 표 및 학점 합산
function renderMyCourse() {
    const myTableBody = document.getElementById('my-course-list');
    if (!myTableBody) return;
    myTableBody.innerHTML = '';

    let totalCount = myCourses.length;
    let totalCredit = 0;

    myCourses.forEach((course, index) => {
        totalCredit += Number(course.credit);

        const courseClass = course.courseId.split('-')[1];
        const courseTime = `${course.day}${course.time} / ${course.room}`;
        
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>2</td><td>전선</td><td>컴퓨터공학과 /</td><td>주간</td>
                <td>${course.code}</td>
                <td>${courseClass}</td>
                <td>${course.name}</td>
                <td>${course.credit}</td>
                <td>${course.professor}</td>
                <td>${courseTime}</td>
                <td><button class="btn-ctrl" onclick="cancelCourse('${course.courseId}')">취소</button></td>
            </tr>
        `;
        myTableBody.innerHTML += row;
    });

    document.getElementById('total-count').innerText = totalCount;
    document.getElementById('total-credit').innerText = totalCredit;
}

// 인원 조절 함수
function updateCount(index, delta) {
    const course = courses[index];
    const nextCount = course.enrolled + delta;
    if (nextCount >= 0 && nextCount <= course.limit) {
        course.enrolled = nextCount;
        renderCourse();
    } else if (nextCount > course.limit) {
        alert("정원이 초과되었습니다.");
    }
}

// 신청 함수
function registerCourse(index) {
    const course = courses[index];
    if (myCourses.some(c => c.courseId === course.courseId)) return alert("이미 신청한 과목입니다.");
    if (course.enrolled >= course.limit) return alert("정원이 초과되었습니다.");

    course.enrolled += 1;
    myCourses.push(course);
    renderCourse();
    renderMyCourse();
}

// 취소 함수
function cancelCourse(courseId) {
    const courseIndex = courses.findIndex(c => c.courseId === courseId);
    if (courseIndex !== -1) courses[courseIndex].enrolled -= 1;
    myCourses = myCourses.filter(c => c.courseId !== courseId);
    renderCourse();
    renderMyCourse();
}

// 초기 로딩
fetchCourses();
