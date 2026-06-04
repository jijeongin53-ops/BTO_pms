/* ==========================================================================
   THE HUE LAB PMS - APPLICATION & SIMULATION ENGINE (app.js)
   ========================================================================== */

// 1. 전역 상태 및 데이터베이스 설정 (구글 시트 시뮬레이터)
const ACTIVE_SHEET_ID = "1izKpNWL9SYATmVTvVygakzZIaCxmb7BoD9XKDY0nsus";

const DEFAULT_USERS = [
  { UserID: "intern_01", Name: "홍길동", Role: "Intern", Email: "hong@gmail.com", ActiveState: "Active" },
  { UserID: "intern_02", Name: "김영희", Role: "Intern", Email: "young@gmail.com", ActiveState: "Active" },
  { UserID: "intern_03", Name: "이철수", Role: "Intern", Email: "chul@gmail.com", ActiveState: "Active" },
  { UserID: "company_01", Name: "밍글무드", Role: "Company", Email: "contact@minglemood.com", ActiveState: "Active" },
  { UserID: "operator_01", Name: "부산관광공사 & 밍글무드", Role: "Operator", Email: "pms@visitbusan.or.kr", ActiveState: "Active" }
];

const DEFAULT_PROJECTS = [
  { ProjectType: "Internship", UserID: "intern_01", Stage: "참가신청", MatchingStatus: "심사 중", ProgressPercent: "25", RegistrationNo: "N/A", UpdateTime: "2026-05-20 10:00:00" },
  { ProjectType: "Academy", UserID: "intern_01", Stage: "수강중", MatchingStatus: "진행중", ProgressPercent: "80", RegistrationNo: "N/A", UpdateTime: "2026-05-19 14:00:00" },
  { ProjectType: "Mice", UserID: "intern_01", Stage: "모집공고", MatchingStatus: "신청 대기", ProgressPercent: "10", RegistrationNo: "MICE-2026-0042", UpdateTime: "2026-05-20 09:30:00" },
  
  { ProjectType: "Internship", UserID: "intern_02", Stage: "최종매칭", MatchingStatus: "매칭 완료", ProgressPercent: "100", RegistrationNo: "N/A", UpdateTime: "2026-05-18 11:20:00" },
  { ProjectType: "Internship", UserID: "intern_03", Stage: "면접전형", MatchingStatus: "면접 대기", ProgressPercent: "50", RegistrationNo: "N/A", UpdateTime: "2026-05-20 08:15:00" }
];

const DEFAULT_DOCUMENTS = [
  { DocID: "DOC-001", UserID: "company_01", CompanyName: "밍글무드", DocType: "사업자등록증", OriginalName: "biz_license_2026.pdf", SavedName: "[인턴십]_[밍글무드]_[사업자등록증]_20260518.pdf", DriveURL: "https://drive.google.com/open?id=1A_B_C_Drive_Biz", Status: "Approved", UploadedTime: "2026-05-18 10:15:00" },
  { DocID: "DOC-002", UserID: "company_01", CompanyName: "밍글무드", DocType: "참여신청서", OriginalName: "apply_form_minglemood.docx", SavedName: "[인턴십]_[밍글무드]_[참여신청서]_20260519.pdf", DriveURL: "https://drive.google.com/open?id=1X_Y_Z_Drive_Apply", Status: "Pending", UploadedTime: "2026-05-19 14:30:00" },
  { DocID: "DOC-003", UserID: "company_01", CompanyName: "밍글무드", DocType: "매칭협약서", OriginalName: "agreement_draft.pdf", SavedName: "[인턴십]_[밍글무드]_[매칭협약서]_20260520.pdf", DriveURL: "https://drive.google.com/open?id=1K_L_M_Drive_Agreement", Status: "Rejected", UploadedTime: "2026-05-20 09:12:00" }
];

const DEFAULT_NOTICES = [];

const DEFAULT_ADMIN_DASHBOARD = [
  { TotalBudget: 0, ExecutedBudget: 0, RemainingBudget: 0, InternGoal: 30, LastUpdated: "2026-05-20 12:00:00" }
];

// 아카데미 5회차 출석 상세 로그
const DEFAULT_SESSIONS = [
  { session: 1, name: "1회차 (오리엔테이션)", status: "attended" },
  { session: 2, name: "2회차 (실무 기획 세션)", status: "attended" },
  { session: 3, name: "3회차 (Figma 실습)", status: "attended" },
  { session: 4, name: "4회차 (UI/UX 멘토링)", status: "attended" },
  { session: 5, name: "5회차 (최종 프로젝트)", status: "pending" }
];

// 이력서 상세 정보용 Mock Data
const CANDIDATE_RESUMES = {
  "intern_01": {
    name: "홍길동",
    track: "관광 MICE 기획 트랙",
    portfolioScore: "95점",
    intro: "부산의 매력을 세계로 알리고자 하는 로컬 관광 MICE 상품 기획자 지망생 홍길동입니다. 관광 MICE 실무 디자인 과정 이수 및 지역 콘텐츠 연계 상품 개발 프로젝트 포트폴리오를 보유하고 있습니다.",
    skills: "관광 상품 기획, MICE 컨벤션 기획, SNS 마케팅, 영어 회화 (Business)",
    experience: "관광 MICE 취창업 아카데미 우수 수료생 (2025), 로컬 관광 해커톤 장려상 (2025)"
  },
  "intern_03": {
    name: "이철수",
    track: "관광 콘텐츠 개발 트랙",
    portfolioScore: "88점",
    intro: "데이터 분석에 기반하여 부산의 실질적인 로컬 크리에이티브 투어를 구상하는 콘텐츠 기획 지망생 이철수입니다. 문제 정의 능력과 뛰어난 디지털 마케팅 스킬을 갖추고 있습니다.",
    skills: "Figma, GA4, 관광 통계 분석, MS Office, 일본어 회화",
    experience: "부산 로컬관광 아이디어 경진대회 우수상 (2026), 서부산 여행 콘텐츠 공모전 입상 1회"
  }
};

// 2. LocalStorage를 활용한 DB 초기화 및 복원 + Google Sheets Live 연동 지원
class PMSDatabase {
  constructor() {
    this.initDatabase();
    // 사용자 요청: 무조건 실시간 연동 켜기 (항상 구글 시트로 전송)
    this.liveMode = true;
    
    // 사용자 요청: 배포된 Google Apps Script URL 하드코딩
    this.appsScriptUrl = "https://script.google.com/macros/s/AKfycbzTb5lBpPS2jmN0mdeYVOf58HAj6Ol6b-nG2MdeEjgXhi3rkl-JQCet5QwvDWFi2hXD/exec";
  }

  initDatabase() {
    // Legacy wipe logic removed to prevent race conditions and data loss
    if (!localStorage.getItem("PMS_Master_Users")) {
      localStorage.setItem("PMS_Master_Users", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Project_Status")) {
      localStorage.setItem("PMS_Project_Status", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Documents_Log")) {
      localStorage.setItem("PMS_Documents_Log", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Notices") || localStorage.getItem("PMS_Notices") === "[]") {
      localStorage.setItem("PMS_Notices", JSON.stringify(DEFAULT_NOTICES));
    }
    if (!localStorage.getItem("PMS_Academy_Sessions") || localStorage.getItem("PMS_Academy_Sessions") === "[]") {
      localStorage.setItem("PMS_Academy_Sessions", JSON.stringify(DEFAULT_SESSIONS));
    }
    if (!localStorage.getItem("PMS_Registered_Users")) {
      localStorage.setItem("PMS_Registered_Users", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Application_Status")) {
      localStorage.setItem("PMS_Application_Status", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Admin_Dashboard")) {
      localStorage.setItem("PMS_Admin_Dashboard", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Document_Templates")) {
      localStorage.setItem("PMS_Document_Templates", JSON.stringify([]));
    }
  }

  getTable(tableName) {
    return JSON.parse(localStorage.getItem(`PMS_${tableName}`));
  }

  saveTable(tableName, data) {
    localStorage.setItem(`PMS_${tableName}`, JSON.stringify(data));
    this.notifySync(tableName);
  }

  notifySync(tableName) {
    const syncBadge = document.querySelector(".sync-badge");
    if (syncBadge) {
      const color = this.liveMode ? "var(--color-primary)" : "var(--color-secondary)";
      syncBadge.innerHTML = `<span class="indicator-glow" style="background-color: ${color}; box-shadow: 0 0 8px ${color}"></span>SYNCING...`;
      setTimeout(() => {
        const stateColor = this.liveMode ? "var(--status-success)" : "var(--color-primary)";
        const txt = this.liveMode ? "LIVE CONNECTED" : "CONNECTED";
        syncBadge.innerHTML = `<span class="indicator-glow" style="background-color: ${stateColor}; box-shadow: 0 0 8px ${stateColor}"></span>${txt}`;
      }, 800);
    }
  }

  // 1) 실제 구글 시트 데이터를 가져와 LocalStorage에 병합하는 동기화 함수
  async fetchFromGoogleSheets() {
    if (!this.liveMode || !this.appsScriptUrl) return false;
    
    const syncBadge = document.querySelector(".sync-badge");
    const syncPulse = document.getElementById("sync-pulse");
    const syncStatusLabel = document.getElementById("sync-status-label");
    
    try {
      if (syncBadge) {
        syncBadge.innerHTML = `<span class="indicator-glow" style="background-color: var(--color-primary); box-shadow: 0 0 8px var(--color-primary)"></span>SYNCING...`;
      }
      if (syncPulse) syncPulse.style.backgroundColor = "var(--color-primary)";
      
      const response = await fetch(this.appsScriptUrl, { method: "GET" });
      const res = await response.json();
      
      if (res.success && res.data) {
        if (res.data.Master_Users) {
          localStorage.setItem("PMS_Master_Users", JSON.stringify(res.data.Master_Users));
        }
        if (res.data.Project_Status) {
          localStorage.setItem("PMS_Project_Status", JSON.stringify(res.data.Project_Status));
          
          // 아카데미 출석 5회차 로그 복구 연계
          const academyProj = res.data.Project_Status.find(p => p.UserID === appState.currentUser && p.ProjectType === "Academy");
          if (academyProj) {
            const progress = parseInt(academyProj.ProgressPercent) || 0;
            const attendedCount = Math.min(5, Math.floor(progress / 20));
            const sessions = JSON.parse(localStorage.getItem("PMS_Academy_Sessions")) || DEFAULT_SESSIONS;
            sessions.forEach((s, idx) => {
              s.status = idx < attendedCount ? "attended" : "pending";
            });
            localStorage.setItem("PMS_Academy_Sessions", JSON.stringify(sessions));
          }
        }
        if (res.data.Documents_Log) {
          localStorage.setItem("PMS_Documents_Log", JSON.stringify(res.data.Documents_Log));
        }
        if (res.data.Registered_Users) {
          localStorage.setItem("PMS_Registered_Users", JSON.stringify(res.data.Registered_Users));
        }
        if (res.data.Application_Status) {
          localStorage.setItem("PMS_Application_Status", JSON.stringify(res.data.Application_Status));
        }
        if (res.data.Admin_Dashboard) {
          localStorage.setItem("PMS_Admin_Dashboard", JSON.stringify(res.data.Admin_Dashboard));
        }
        if (res.data.Notices) {
          localStorage.setItem("PMS_Notices", JSON.stringify(res.data.Notices));
        }
        if (res.data.Document_Templates) {
          localStorage.setItem("PMS_Document_Templates", JSON.stringify(res.data.Document_Templates));
        }
        if (res.data.Academy_Attendance) {
          localStorage.setItem("PMS_Academy_Attendance", JSON.stringify(res.data.Academy_Attendance));
        }
        if (res.data.Inquiries) {
          localStorage.setItem("PMS_Inquiries", JSON.stringify(res.data.Inquiries));
        }
        
        if (syncBadge) {
          syncBadge.innerHTML = `<span class="indicator-glow" style="background-color: var(--status-success); box-shadow: 0 0 8px var(--status-success)"></span>LIVE CONNECTED`;
        }
        if (syncPulse) {
          syncPulse.style.backgroundColor = "var(--status-success)";
          syncPulse.style.boxShadow = "0 0 10px var(--status-success)";
        }
        if (syncStatusLabel) syncStatusLabel.innerText = "Google Sheets: LIVE SYNCED";
        
        return true;
      } else {
        throw new Error(res.error || "Unknown server error");
      }
    } catch (err) {
      console.error("Google Sheets sync failed:", err);
      if (syncBadge) {
        syncBadge.innerHTML = `<span class="indicator-glow" style="background-color: var(--status-error); box-shadow: 0 0 8px var(--status-error)"></span>FAILED`;
      }
      if (syncPulse) syncPulse.style.backgroundColor = "var(--status-error)";
      if (syncStatusLabel) syncStatusLabel.innerText = "Connection Failed";
      return false;
    }
  }

  // 2) 실제 구글 시트에 데이터를 전송하는 동기화 함수
  async writeToGoogleSheets(postData) {
    if (!this.liveMode || !this.appsScriptUrl) return false;
    
    try {
      await fetch(this.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
      
      // 구글 Apps Script 비동기 쓰기 딜레이 대기 후 자동 데이터 일치 페칭
      setTimeout(async () => {
        await this.fetchFromGoogleSheets();
        appState.updateUI();
      }, 1000);
      return true;
    } catch (err) {
      console.error("Google Sheets write failed:", err);
      return false;
    }
  }
}

const db = new PMSDatabase();

// 3. 애플리케이션 상태 컨트롤러
const appState = {
  currentRole: "", // Intern, Company, Operator
  currentProject: "Internship", // Internship, Academy, Mice
  currentSheet: "Master_Users", // Master_Users, Project_Status, Documents_Log
  currentUser: "",
  
  setRole(role) {
    this.currentRole = role;
    this.updateUI();
  },
  
  setProject(project) {
    this.currentProject = project;
    this.updateUI();
  },

  setSheet(sheet) {
    this.currentSheet = sheet;
    renderSheetsEmulator();
  },

  async login(userId, role) {
    this.currentUser = userId;
    this.currentRole = role;

    // 접속자 정보 표시 업데이트
    const users = db.getTable("Master_Users") || [];
    const user = users.find(u => u.UserID === userId);
    let displayName = userId === "Btopms" ? "최고 관리자" : (user ? user.Name : userId);
    let roleName = role === "Intern" ? "인턴" : (role === "Company" ? "기업" : "운영사");
    
    const userDisplay = document.getElementById("logged-in-user-display");
    if (userDisplay) {
      userDisplay.innerText = `${displayName} (${roleName})`;
    }
    
    // 대시보드 메인 타이틀 업데이트
    if (role === "Intern") {
      document.getElementById("intern-user-name").innerText = displayName;
    } else if (role === "Company") {
      document.getElementById("company-user-name").innerText = displayName;
    } else if (role === "Operator") {
      document.getElementById("operator-user-name").innerText = displayName;
    }

    // 뷰를 먼저 전환하여 깜빡임 방지 (로컬 데이터 렌더링)
    this.updateUI();

    document.getElementById("auth-view").classList.remove("active");
    document.getElementById("app-main-content").style.display = "block";
    
    // 자동 실시간 데이터 동기화
    if (db.liveMode && db.appsScriptUrl) {
      await db.fetchFromGoogleSheets();
      // 최신 데이터로 뷰 갱신
      this.updateUI();
    }
  },

  updateUI() {
    if (!this.currentUser) return; // 로그인 전이면 UI 렌더링 스킵
    
    // 뷰 전환
    document.querySelectorAll(".dashboard-view").forEach(view => view.classList.remove("active"));
    
    if (this.currentRole === "Intern") {
      document.getElementById("intern-dashboard").classList.add("active");
      renderInternDashboard();
    } else if (this.currentRole === "Company") {
      document.getElementById("company-dashboard").classList.add("active");
      renderCompanyDashboard();
    } else if (this.currentRole === "Operator") {
      document.getElementById("operator-dashboard").classList.add("active");
      renderOperatorDashboard();
    }

    renderSheetsEmulator();
  }
};

// 4. 초기 이벤트 바인딩
document.addEventListener("DOMContentLoaded", async () => {
  // --- [인증 뷰 초기화] ---
  const authTabs = document.querySelectorAll(".auth-tab");
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      authTabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });

  const signupRadios = document.querySelectorAll('input[name="signup-role"]');
  signupRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      document.querySelectorAll(".signup-dynamic-fields").forEach(f => f.classList.remove("active"));
      const role = e.target.value;
      if (role === "Intern") document.getElementById("signup-intern-fields").classList.add("active");
      else if (role === "Company") document.getElementById("signup-company-fields").classList.add("active");
      else if (role === "Operator") document.getElementById("signup-operator-fields").classList.add("active");
    });
  });

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const userId = document.getElementById("login-id").value.trim();
    const password = document.getElementById("login-pwd").value;
    
    // 관리자(Operator) 하드코딩 체크
    if (userId === "Btopms" && password === "btopms1234") {
      appState.login("Btopms", "Operator");
      return;
    }
    
    const users = db.getTable("Master_Users");
    const user = users.find(u => u.UserID === userId);
    
    if (user) {
      if (user.Password && String(user.Password) !== password) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      appState.login(user.UserID, user.Role);
    } else {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  });

  document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("signup-id").value.trim();
    const password = document.getElementById("signup-pwd").value;
    const role = document.querySelector('input[name="signup-role"]:checked').value;
    
    const users = db.getTable("Master_Users");
    if (users.find(u => u.UserID === userId) || userId === "Btopms") {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    const postData = { action: "registerUser", UserID: userId, Password: password, Role: role };
    
    if (role === "Intern") {
      postData.Name = document.getElementById("signup-intern-name").value;
      postData.Phone = document.getElementById("signup-intern-phone").value;
      postData.Birthdate = document.getElementById("signup-intern-birth").value;
      postData.Email = document.getElementById("signup-intern-email").value;
      postData.School = document.getElementById("signup-intern-school")?.value || "";
      postData.EnrollmentStatus = document.getElementById("signup-intern-enrollment")?.value || "";
      postData.Major = document.getElementById("signup-intern-major")?.value || "";
      postData.Grade = document.getElementById("signup-intern-grade")?.value || "";
      postData.Residence = document.getElementById("signup-intern-residence")?.value || "";
    } else if (role === "Company") {
      postData.CompanyName = document.getElementById("signup-comp-name").value;
      postData.ContactPerson = document.getElementById("signup-comp-manager").value;
      postData.Phone = document.getElementById("signup-comp-phone").value;
      postData.Email = document.getElementById("signup-comp-email").value;
    }

    // Local Storage 즉시 반영
    users.push({ UserID: userId, Name: postData.Name || postData.CompanyName, Role: role, Email: postData.Email, Password: password, ActiveState: "Active" });
    db.saveTable("Master_Users", users);
    
    const registered = db.getTable("Registered_Users");
    registered.push(postData);
    db.saveTable("Registered_Users", registered);
    
    // Live 연동 시 Google Sheets 에 전송
    if (db.liveMode && db.appsScriptUrl) {
      db.writeToGoogleSheets(postData);
    }
    
    // 인턴 가입 시 기본 프로젝트 현황 및 아카데미 출석부 자동 생성
    if (role === "Intern") {
      const projects = db.getTable("Project_Status") || [];
      const nowStr = getNowDateString();
      projects.push({ ProjectType: "Internship", UserID: userId, Stage: "참가신청", MatchingStatus: "신청 대기", ProgressPercent: "0", RegistrationNo: "N/A", UpdateTime: nowStr });
      projects.push({ ProjectType: "Academy", UserID: userId, Stage: "수강대기", MatchingStatus: "신청 대기", ProgressPercent: "0", RegistrationNo: "N/A", UpdateTime: nowStr });
      projects.push({ ProjectType: "Mice", UserID: userId, Stage: "모집공고", MatchingStatus: "신청 대기", ProgressPercent: "0", RegistrationNo: "N/A", UpdateTime: nowStr });
      db.saveTable("Project_Status", projects);

      const attendance = db.getTable("Academy_Attendance") || [];
      attendance.push({ UserID: userId, Name: postData.Name, Session1: 0, Session2: 0, Session3: 0, Session4: 0, Session5: 0 });
      db.saveTable("Academy_Attendance", attendance);
    }
    
    alert("회원가입이 완료되었습니다!");
    document.querySelector('.auth-tab[data-target="login-form"]').click();
    document.getElementById("login-id").value = userId;
  });
  // --- [인증 뷰 초기화 끝] ---

  // --- [Auth Live Sync 동기화] ---
  const authUrlInput = document.getElementById("auth-apps-script-url");
  const authLiveCheckbox = document.getElementById("auth-live-mode-checkbox");
  
  if (authUrlInput && authLiveCheckbox) {
    authUrlInput.value = db.appsScriptUrl;
    authLiveCheckbox.checked = db.liveMode;
    
    authUrlInput.addEventListener("change", (e) => {
      db.appsScriptUrl = e.target.value.trim();
      localStorage.setItem("PMS_Apps_Script_URL", db.appsScriptUrl);
      const mainUrlInput = document.getElementById("apps-script-url");
      if (mainUrlInput) mainUrlInput.value = db.appsScriptUrl;
    });
    
    authLiveCheckbox.addEventListener("change", (e) => {
      db.liveMode = e.target.checked;
      localStorage.setItem("PMS_Live_Mode", db.liveMode);
      const mainLiveCheckbox = document.getElementById("live-mode-checkbox");
      if (mainLiveCheckbox) mainLiveCheckbox.checked = db.liveMode;
    });
  }
  // --- [Auth Live Sync 동기화 끝] ---

  // 1) 헤더 구글 시트 ID 연결 정보 업데이트
  document.getElementById("current-sheet-id").innerText = ACTIVE_SHEET_ID;
  document.getElementById("sheets-link-display").href = `https://docs.google.com/spreadsheets/d/${ACTIVE_SHEET_ID}/edit`;
  
  // 2) 로그아웃 버튼 바인딩
  const btnLogout = document.getElementById("btn-logout");
  if(btnLogout) {
    btnLogout.addEventListener("click", () => {
      location.reload();
    });
  }

  // 3) 사업 전환 탭 바인딩
  const projectTabs = document.querySelectorAll(".project-tab");
  projectTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      projectTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      
      appState.setProject(tab.getAttribute("data-project"));
    });
  });

  // 4) 구글 시트 에뮬레이터 탭 바인딩
  const sheetTabs = document.querySelectorAll(".sheet-tab");
  sheetTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      sheetTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      appState.setSheet(tab.getAttribute("data-sheet"));
    });
  });

  // 5) 테마 전환 토글 바인딩
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("PMS_Theme", isLight ? "light" : "dark");
  });
  
  if (localStorage.getItem("PMS_Theme") === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  }

  // 6) 구글 시트 에뮬레이터 슬라이딩 및 열기 토글
  const monitorToggleBtn = document.getElementById("monitor-toggle-btn");
  const dbMonitorPanel = document.querySelector(".db-monitor-panel");
  monitorToggleBtn.addEventListener("click", () => {
    dbMonitorPanel.classList.toggle("collapsed");
  });

  // 7) 파일 드래그 앤 드롭 영역 바인딩
  initDragAndDrop();

  // 7-1) 인턴 신청서 업로드 바인딩
  const internUploadBtn = document.getElementById("intern-upload-btn");
  const internUploadInput = document.getElementById("intern-upload-input");
  if (internUploadBtn && internUploadInput) {
    internUploadBtn.addEventListener("click", () => internUploadInput.click());
    internUploadInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        processInternFileUpload(e.target.files[0], internUploadBtn);
      }
    });
  }

  // 8) 모달 닫기
  const modal = document.getElementById("pms-modal");
  const closeModalSpan = document.querySelector(".close-modal");
  closeModalSpan.addEventListener("click", () => {
    modal.classList.remove("active");
  });
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // 9) [추가] Live Sync 연동 UI 바인딩 및 복구
  const liveModeCheckbox = document.getElementById("live-mode-checkbox");
  const appsScriptUrlInput = document.getElementById("apps-script-url");
  const btnConnectSheets = document.getElementById("btn-connect-sheets");
  const urlInputContainer = document.getElementById("url-input-container");
  const syncPulse = document.getElementById("sync-pulse");
  const syncStatusLabel = document.getElementById("sync-status-label");

  // 초기 복구
  liveModeCheckbox.checked = db.liveMode;
  appsScriptUrlInput.value = db.appsScriptUrl;

  if (db.liveMode) {
    urlInputContainer.style.display = "flex";
    if (db.appsScriptUrl) {
      // 비동기 fetch 동기화 시도
      setTimeout(async () => {
        const success = await db.fetchFromGoogleSheets();
        if (success) {
          appState.updateUI();
        }
      }, 300);
    }
  } else {
    urlInputContainer.style.display = "none";
    if (syncPulse) syncPulse.style.backgroundColor = "var(--color-secondary)";
    if (syncStatusLabel) syncStatusLabel.innerText = "Google Sheets: Simulator Mode";
  }

  // 토글 이벤트 바인딩
  liveModeCheckbox.addEventListener("change", async (e) => {
    const isChecked = e.target.checked;
    db.liveMode = isChecked;
    localStorage.setItem("PMS_Live_Mode", isChecked ? "true" : "false");

    if (isChecked) {
      urlInputContainer.style.display = "flex";
      if (db.appsScriptUrl) {
        const success = await db.fetchFromGoogleSheets();
        if (success) appState.updateUI();
      }
    } else {
      urlInputContainer.style.display = "none";
      if (syncPulse) {
        syncPulse.style.backgroundColor = "var(--color-secondary)";
        syncPulse.style.boxShadow = "none";
      }
      if (syncStatusLabel) syncStatusLabel.innerText = "Google Sheets: Simulator Mode";
      
      // 로컬 디폴트 데이터로 복원 후 UI 갱신
      db.initDatabase();
      appState.updateUI();
    }
  });

  // 연결 버튼 이벤트 바인딩
  btnConnectSheets.addEventListener("click", async () => {
    const url = appsScriptUrlInput.value.trim();
    if (!url) {
      alert("Google Apps Script 웹 앱 URL을 입력해 주세요.");
      return;
    }
    
    db.appsScriptUrl = url;
    localStorage.setItem("PMS_Apps_Script_URL", url);
    
    // 데이터 페칭 시도
    const success = await db.fetchFromGoogleSheets();
    if (success) {
      alert("실시간 구글 시트 연결 및 연동이 완료되었습니다! 🚀\n이제 대시보드 상태가 실제 구글 시트와 100% 실시간 동동기화됩니다.");
      appState.updateUI();
    } else {
      alert("구글 시트 연결에 실패했습니다.\n입력하신 Apps Script 웹 앱 URL이 올바른지, 배포 설정(액세스 권한: 모든 사람)이 제대로 되어 있는지 확인해 주세요.");
    }
  });

  // 최초 로딩 UI 렌더링
  appState.updateUI();
  
  // 디폴트로 시트 모니터 접기
  dbMonitorPanel.classList.add("collapsed");
});

// 5. [인턴 대시보드] 렌더링 로직
function renderInternDashboard() {
  const activeProj = appState.currentProject;
  
  // 1) 텍스트 업데이트
  const users = db.getTable("Master_Users") || [];
  const user = users.find(u => u.UserID === appState.currentUser);
  const displayName = user ? user.Name : appState.currentUser;
  
  const nameSpan = document.getElementById("intern-user-name");
  if (nameSpan) nameSpan.innerText = displayName;
  
  let projTitle = "인턴십 지원 및 매칭 프로그램";
  if (activeProj === "Academy") projTitle = "취창업 아카데미 교육 코스";
  if (activeProj === "Mice") projTitle = "관광 MICE 아이디어 공모전";
  document.getElementById("intern-active-project-name").innerText = projTitle;

  // 2) 구글 시트(Application_Status)에서 현재 선택한 사업 신청 여부 및 승인 상태 파악
  const applications = db.getTable("Application_Status") || [];
  const myApplication = applications.find(a => a.UserID === appState.currentUser && a.ProjectType === activeProj);
  const hasApplied = !!myApplication;
  const approvalStatus = myApplication ? String(myApplication.Approval || "").trim().toUpperCase() : "";
  
  // 락 오버레이 및 콘텐츠 블러 분기 조건 처리
  const applyOverlay = document.getElementById("intern-apply-overlay");
  const gridContent = document.getElementById("intern-grid-content");
  const applyRejectMsg = document.getElementById("apply-reject-msg");

  let projTitleShort = activeProj === "Internship" ? "인턴십 매칭 프로그램" : (activeProj === "Academy" ? "취창업 아카데미" : "관광 MICE 공모전");
  document.getElementById("locked-service-name").innerText = projTitleShort;
  
  if (hasApplied && approvalStatus === "Y") {
    // ✅ 승인 완료 → 오버레이 해제, 상세 페이지 표시
    applyOverlay.style.display = "none";
    gridContent.classList.remove("blurred");
  } else if (hasApplied && approvalStatus === "N") {
    // ❌ 거절됨 → 탈락 메시지 표시
    applyOverlay.style.display = "flex";
    gridContent.classList.add("blurred");
    document.getElementById("apply-btn-container").style.display = "none";
    document.getElementById("apply-complete-msg").style.display = "none";
    if (applyRejectMsg) applyRejectMsg.style.display = "block";
    document.getElementById("apply-icon").innerText = "😢";
    document.getElementById("apply-overlay-title").innerText = "심사 결과 안내";
  } else if (hasApplied) {
    // ⏳ 신청 완료, 승인 대기 중
    applyOverlay.style.display = "flex";
    gridContent.classList.add("blurred");
    document.getElementById("apply-btn-container").style.display = "none";
    document.getElementById("apply-complete-msg").style.display = "block";
    if (applyRejectMsg) applyRejectMsg.style.display = "none";
    document.getElementById("apply-icon").innerText = "✅";
    document.getElementById("apply-overlay-title").innerText = "사업 신청 안내";
  } else {
    // 📝 미신청 상태
    applyOverlay.style.display = "flex";
    gridContent.classList.add("blurred");
    
    const applyBtnContainer = document.getElementById("apply-btn-container");
    applyBtnContainer.style.display = "block";
    
    const today = new Date();
    const miceStartDate = new Date("2026-09-20T00:00:00+09:00");
    
    if (activeProj === "Mice" && today < miceStartDate) {
      applyBtnContainer.innerHTML = `
        <button class="btn-sm" style="background-color: transparent; color: #fff; cursor: not-allowed; border: 1px solid #000; padding: 10px 20px; border-radius: 4px;" disabled>[신청 오픈 대기]</button>
        <p style="color: var(--color-warning); font-size: 13px; margin-top: 10px;">⚠️ 관광 MICE 공모전 신청은 <strong>2026년 9월 20일</strong>부터 가능합니다.</p>
      `;
    } else {
      applyBtnContainer.innerHTML = `
        <button class="btn-sm btn-primary-sm" style="width: auto; padding: 10px 20px;" onclick="applyForCurrentProject()">신청하기 ➔</button>
      `;
    }

    document.getElementById("apply-complete-msg").style.display = "none";
    if (applyRejectMsg) applyRejectMsg.style.display = "none";
    document.getElementById("apply-icon").innerText = "📝";
    document.getElementById("apply-overlay-title").innerText = "사업 신청 안내";
  }


  // 현재 출석율 시각화 (기존 코드 유지)
  const projStatusList = db.getTable("Project_Status");
  const academyStatus = projStatusList.find(p => p.UserID === appState.currentUser && p.ProjectType === "Academy") || {
    Stage: "수강중", MatchingStatus: "진행중", ProgressPercent: "80"
  };
  const isAcademyCompleted = academyStatus.Stage === "최종수료" && academyStatus.ProgressPercent === "100";
  
  // 대시보드 내용 렌더링
  const currentStatus = projStatusList.find(p => p.UserID === appState.currentUser && p.ProjectType === activeProj) || {
    Stage: "참가신청", MatchingStatus: "지원 가능", ProgressPercent: "10", RegistrationNo: "N/A"
  };

  // 4) 단계별 프로세스 바 동적 생성
  const pipeline = document.getElementById("intern-process-pipeline");
  pipeline.innerHTML = "";
  
  let stages = [];
  if (activeProj === "Internship") {
    stages = ["참가신청", "서류제출", "면접전형", "최종매칭"];
  } else if (activeProj === "Academy") {
    stages = ["신청대기", "수강중", "프로젝트수행", "최종수료"];
  } else { // Mice
    stages = ["모집공고", "접수완료", "예선심사", "최종결선"];
  }

  let currentStageIdx = stages.indexOf(currentStatus.Stage);
  if (currentStageIdx === -1) currentStageIdx = 0;

  stages.forEach((stage, idx) => {
    const stepEl = document.createElement("div");
    stepEl.className = "process-step";
    if (idx === currentStageIdx) {
      stepEl.classList.add("active");
    } else if (idx < currentStageIdx) {
      stepEl.classList.add("completed");
    }

    stepEl.innerHTML = `
      <div class="step-dot">${idx + 1}</div>
      <div class="step-label">${stage}</div>
    `;
    pipeline.appendChild(stepEl);
  });

  // 상단 진행 배지
  const processBadge = document.getElementById("intern-process-badge");
  processBadge.innerText = `${currentStatus.Stage} (${currentStatus.MatchingStatus})`;
  processBadge.className = "status-badge";
  if (currentStatus.MatchingStatus.includes("완료") || currentStatus.MatchingStatus.includes("수료")) {
    processBadge.classList.add("approved");
  } else if (currentStatus.MatchingStatus.includes("반려") || currentStatus.MatchingStatus.includes("탈락")) {
    processBadge.classList.add("rejected");
  } else {
    processBadge.classList.add("pending");
  }

  // 5) 원형 차트 게이지 및 세부 기술 위젯
  const progressVal = document.getElementById("intern-progress-value");
  const progressCircle = document.getElementById("intern-progress-circle");
  
  const pct = parseInt(currentStatus.ProgressPercent);
  if (progressVal) progressVal.innerText = `${pct}%`;
  
  // SVG stroke-dasharray 계산
  if (progressCircle) progressCircle.setAttribute("stroke-dasharray", `${pct}, 100`);

  const specsContainer = document.getElementById("intern-project-specs");
  const companyListCard = document.getElementById("intern-company-list-card");
  const applicationFormCard = document.getElementById("intern-application-form-card");
  const pipelineCard = document.getElementById("intern-pipeline-card");
  const academyAttendanceCard = document.getElementById("intern-academy-attendance-card");
  
  if (specsContainer) specsContainer.innerHTML = "";

  if (activeProj === "Internship") {
    if (pipelineCard) pipelineCard.style.display = "block";
    if (academyAttendanceCard) academyAttendanceCard.style.display = "none";
    if (companyListCard) companyListCard.style.display = "block";
    if (applicationFormCard) applicationFormCard.style.display = "block";
    if (specsContainer) {
      specsContainer.innerHTML = `
        <div class="widget-row">
          <span class="widget-label">지정 이력서 파일</span>
          <span class="widget-val">[이력서]${displayName}_관광MICE_2026.pdf</span>
        </div>
        <div class="widget-row">
          <span class="widget-label">출석부 인증 상태</span>
          <span class="widget-val" style="color: var(--status-warning)">제출 대기 (배정 후 활성화)</span>
        </div>
      `;
    }

    // 기업 리스트 렌더링
    const companyListEl = document.getElementById("intern-company-list");
    if (companyListEl) {
      companyListEl.innerHTML = "";
      const companies = users.filter(u => u.Role === "Company");
      
      // 현재 사용자가 지원한 기업 내역 파악
      const myApplications = projStatusList.filter(p => p.UserID === appState.currentUser && p.ProjectType === "Internship" && p.CompanyID);
      
      // 지원 현황 뱃지 업데이트
      const applyCountBadge = document.getElementById("intern-apply-count-badge");
      if (applyCountBadge) {
        applyCountBadge.innerText = `지원 현황: ${myApplications.length} / 3`;
      }

      // 날짜 체크 (2026.06.24 이전 비활성화)
      const today = new Date();
      const applyStartDate = new Date("2026-06-24T00:00:00+09:00");
      const isApplyEnabled = today >= applyStartDate;

      companies.forEach(comp => {
        const hasAppliedToThis = myApplications.find(p => p.CompanyID === comp.UserID);
        const canApply = myApplications.length < 3;
        
        let applyBtnHtml = "";
        if (hasAppliedToThis) {
          applyBtnHtml = `<span style="color: var(--status-success); font-weight: 700; font-size: 12px;">지원완료 ✅</span>`;
        } else {
          if (!isApplyEnabled) {
            applyBtnHtml = `<button class="btn-sm" style="background-color: transparent; color: #fff; cursor: not-allowed; border: 1px solid #000; padding: 4px 8px; border-radius: 4px;" disabled>[오픈 대기]</button>`;
          } else if (canApply) {
            applyBtnHtml = `<button class="btn-sm btn-primary-sm" onclick="applyToCompany('${comp.UserID}')">[희망]</button>`;
          } else {
            applyBtnHtml = `<span style="color: var(--text-muted); font-size: 12px;">지원 마감</span>`;
          }
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${comp.Name}</td>
          <td>${comp.ManagerName || '담당자'}</td>
          <td>${comp.Email}</td>
          <td style="text-align: right;">${applyBtnHtml}</td>
        `;
        companyListEl.appendChild(tr);
      });
    }
  } else if (activeProj === "Academy") {
    // 아카데미 출석 수 및 참여율 계산
    const allAttendance = db.getTable("Academy_Attendance") || [];
    const myAttendance = allAttendance.find(a => a.UserID === appState.currentUser) || { Session1:0, Session2:0, Session3:0, Session4:0, Session5:0 };
    
    const sessions = [
      { session: 1, name: "1회차 (오리엔테이션)", status: myAttendance.Session1 == 1 ? "attended" : "pending" },
      { session: 2, name: "2회차 (실무 기획 세션)", status: myAttendance.Session2 == 1 ? "attended" : "pending" },
      { session: 3, name: "3회차 (Figma 실습)", status: myAttendance.Session3 == 1 ? "attended" : "pending" },
      { session: 4, name: "4회차 (UI/UX 멘토링)", status: myAttendance.Session4 == 1 ? "attended" : "pending" },
      { session: 5, name: "5회차 (최종 프로젝트)", status: myAttendance.Session5 == 1 ? "attended" : "pending" }
    ];
    
    const attendedCount = sessions.filter(s => s.status === "attended").length;
    const rate = (attendedCount / 5 * 100).toFixed(0);
    
    // 원형 차트도 rate에 맞춤
    if (progressVal) progressVal.innerText = `${rate}%`;
    if (progressCircle) progressCircle.setAttribute("stroke-dasharray", `${rate}, 100`);

    // 5회차 출석 현황 상세 UI 렌더링
    let sessionsHTML = `<div class="academy-sessions-grid">`;
    sessions.forEach(s => {
      const isAttended = s.status === "attended";
      sessionsHTML += `
        <div class="session-block ${isAttended ? 'attended' : 'pending'}">
          <span>${s.name.split(' ')[0]}</span>
          <span class="session-status-badge ${isAttended ? 'attended' : 'pending'}">${isAttended ? '출석완료' : '대기/결석'}</span>
        </div>
      `;
    });
    sessionsHTML += `</div>`;

    if (specsContainer) {
      specsContainer.innerHTML = `
      <div class="widget-row">
        <span class="widget-label">아카데미 코스</span>
        <span class="widget-val">관광 MICE 실무 및 로컬 콘텐츠 기획 과정 (총 5회)</span>
      </div>
      <div class="widget-row">
        <span class="widget-label">현재 나의 참여율</span>
        <span class="widget-val" style="color:var(--color-primary); font-weight:800;">${rate}% (${attendedCount} / 5회차 완료)</span>
      </div>
      <div class="widget-row" style="border-top:1px dashed var(--border-card); margin-top:8px; padding-top:8px;">
        <span class="widget-label" style="font-weight:700;">아카데미 회차별 출석부 현황:</span>
      </div>
      ${sessionsHTML}
      
      ${!isAcademyCompleted && attendedCount === 5 ? `
        <div style="margin-top:12px;">
          <button class="btn-sm btn-primary-sm" style="width:100%; padding:10px;" onclick="completeAcademy()">🎓 아카데미 최종 수료 완료 및 연계 활성화</button>
        </div>
      ` : ''}

      ${isAcademyCompleted ? `
        <div class="widget-row" style="background:var(--status-success-bg); border: 1px solid var(--status-success); border-radius:6px; padding:10px; margin-top:10px; justify-content:center;">
          <span style="color:var(--status-success); font-weight:700;">🎓 아카데미 공식 수료증 발급 완료 (인턴십 & 공모전 해제됨)</span>
        </div>
      ` : ''}
    `;
    }
    
    // Render the intern attendance table row
    const tbody = document.getElementById("intern-academy-attendance-tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td style="font-weight: 600;">${appState.currentUser}</td>
          <td>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
              ${sessions.map(s => `
                <span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: ${s.status === 'attended' ? 'var(--status-success-bg)' : 'var(--border-card)'}; color: ${s.status === 'attended' ? 'var(--status-success)' : '#fff'}; border: 1px solid ${s.status === 'attended' ? 'var(--status-success)' : 'transparent'};">
                  ${s.session}회차 ${s.status === 'attended' ? '완료' : '대기'}
                </span>
              `).join('')}
            </div>
          </td>
          <td>
            <span style="font-weight: bold; color: var(--color-warning); border: 1px solid var(--color-warning); padding: 4px 10px; border-radius: 12px; font-size: 12px;">${rate}%</span>
          </td>
        </tr>
      `;
    }

    if (pipelineCard) pipelineCard.style.display = "none";
    if (academyAttendanceCard) academyAttendanceCard.style.display = "block";
    if (companyListCard) companyListCard.style.display = "none";
    if (applicationFormCard) applicationFormCard.style.display = "none";
  } else { // Mice
    if (specsContainer) {
      specsContainer.innerHTML = `
        <div class="widget-row">
          <span class="widget-label">공모전 접수 번호</span>
          <span class="widget-val" style="color: var(--color-primary); font-family: monospace;">${currentStatus.RegistrationNo}</span>
        </div>
        <div class="widget-row">
          <span class="widget-label">팀 이름 / 참가 규모</span>
          <span class="widget-val">안티그래비티 (4명)</span>
        </div>
        <div class="widget-row">
          <span class="widget-label">제출 기획안</span>
          <span class="widget-val">[MICE]관광_혁신_아이디어_기획서_vFinal.pdf</span>
        </div>
      `;
    }
    
    if (pipelineCard) pipelineCard.style.display = "block";
    if (academyAttendanceCard) academyAttendanceCard.style.display = "none";
    if (companyListCard) companyListCard.style.display = "none";
    if (applicationFormCard) applicationFormCard.style.display = "none";
  }

  // 6) 공지사항 로딩 (현재 프로젝트 타입 및 전체 공지만 필터링)
  const notices = db.getTable("Notices") || [];
  const noticeBoard = document.getElementById("intern-notice-board");
  noticeBoard.innerHTML = "";
  
  const filteredNotices = notices.filter(n => n.ProjectType === activeProj || n.ProjectType === "All");
  
  if (filteredNotices.length === 0) {
    noticeBoard.innerHTML = `<div class="notice-item"><div class="notice-content" style="text-align:center;">등록된 공지사항이 없습니다.</div></div>`;
  } else {
    // 최신순 정렬
    filteredNotices.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    filteredNotices.forEach(notice => {
      const item = document.createElement("div");
      item.className = "notice-item";
      item.style.cursor = "pointer";
      item.style.transition = "background-color 0.2s ease";
      item.onmouseover = () => item.style.backgroundColor = "rgba(0, 255, 170, 0.05)";
      item.onmouseout = () => item.style.backgroundColor = "transparent";
      item.onclick = () => openNoticeModal(notice);
      item.innerHTML = `
        <div class="notice-title">
          <span>${notice.Title}</span>
          <span class="notice-date">${notice.Date.split(' ')[0]}</span>
        </div>
      `;
      noticeBoard.appendChild(item);
    });
  }

  // 7) 아카데미 특화 커리큘럼 표시/숨김
  const curriculumCard = document.getElementById("academy-curriculum-card");
  if (curriculumCard) {
    curriculumCard.style.display = (activeProj === "Academy") ? "flex" : "none";
  }
}

// 락 오버레이에서 아카데미 탭으로 유도하는 스위칭 헬퍼
window.switchTabToAcademy = function() {
  const academyTab = document.querySelector(".project-tab[data-project='Academy']");
  if (academyTab) {
    academyTab.click();
  }
};

// 회차별 출석 도장 찍기 로직
window.attendSession = async function(sessionNum) {
  const sessions = db.getTable("Academy_Sessions");
  const target = sessions.find(s => s.session === sessionNum);
  if (target) {
    target.status = "attended";
    db.saveTable("Academy_Sessions", sessions);

    // 참여율 기반으로 Project_Status 내의 progressPercent 갱신
    const attendedCount = sessions.filter(s => s.status === "attended").length;
    const rate = Math.floor(attendedCount / 5 * 100);

    const projects = db.getTable("Project_Status");
    const academyProj = projects.find(p => p.UserID === appState.currentUser && p.ProjectType === "Academy");
    if (academyProj) {
      academyProj.ProgressPercent = String(rate);
      academyProj.UpdateTime = getNowDateString();
      db.saveTable("Project_Status", projects);
      
      // 실시간 구글 시트 쓰기 연계
      if (db.liveMode) {
        await db.writeToGoogleSheets({
          action: "updateProject",
          ProjectType: "Academy",
          UserID: appState.currentUser,
          Stage: academyProj.Stage,
          MatchingStatus: academyProj.MatchingStatus,
          ProgressPercent: String(rate),
          RegistrationNo: "N/A"
        });
      }
    }

    renderInternDashboard();
    
    // 시트 시뮬레이터 갱신 후 하이라이트 효과
    appState.currentSheet = "Project_Status";
    renderSheetsEmulator(appState.currentUser);
  }
};

// --- [운영사 공지사항 등록 액션] ---
window.submitNotice = async function(event) {
  event.preventDefault();
  const typeSelect = document.getElementById("notice-type-select");
  const titleInput = document.getElementById("notice-title-input");
  const contentInput = document.getElementById("notice-content-input");
  
  const projectType = typeSelect.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  
  if (!title || !content) {
    alert("제목과 내용을 모두 입력해 주세요.");
    return;
  }
  
  const notices = db.getTable("Notices") || [];
  const nowStr = getNowDateString();
  const noticeId = "NOTICE-LOCAL-" + Date.now();
  
  const postData = {
    action: "addNotice",
    ProjectType: projectType,
    Title: title,
    Content: content
  };
  
  notices.push({
    NoticeID: noticeId,
    ProjectType: projectType,
    Title: title,
    Content: content,
    Date: nowStr
  });
  
  db.saveTable("Notices", notices);
  
  if (db.liveMode) {
    await db.writeToGoogleSheets(postData);
  }
  
  alert("공지사항이 성공적으로 등록되었습니다.");
  titleInput.value = "";
  contentInput.value = "";
  
  appState.currentSheet = "Notices";
  renderSheetsEmulator(appState.currentUser);
};

// --- [사업 신청 액션] ---
window.applyForCurrentProject = async function() {
  const activeProj = appState.currentProject;
  const applications = db.getTable("Application_Status") || [];
  
  // 중복 신청 방지 검사
  const alreadyApplied = applications.find(a => a.UserID === appState.currentUser && a.ProjectType === activeProj);
  if (alreadyApplied) {
    alert("이미 신청이 접수되었습니다. (중복 신청 불가)");
    return;
  }
  
  const postData = {
    action: "applyProgram",
    UserID: appState.currentUser,
    ProjectType: activeProj
  };
  
  try {
    const btnContainer = document.getElementById("apply-btn-container");
    if (btnContainer) {
      const btn = btnContainer.querySelector("button");
      if (btn) {
        btn.disabled = true;
        btn.innerText = "신청 처리 중...";
      }
    }
    
    // 로컬 스토리지에 즉시 반영
    applications.push({
      ApplyID: "APP-LOCAL-" + Date.now(),
      UserID: appState.currentUser,
      ProjectType: activeProj,
      ApplyTime: getNowDateString(),
      Approval: ""
    });
    db.saveTable("Application_Status", applications);
    
    // 실시간 구글 시트 쓰기 연계
    if (db.liveMode) {
      await db.writeToGoogleSheets(postData);
    }
  } catch (err) {
    console.error("신청 중 오류:", err);
    alert("신청 처리 중 오류가 발생했습니다.");
  } finally {
    // UI 리렌더링
    renderInternDashboard();
  }
};
// --- [사업 신청 액션 끝] ---

// 아카데미 최종 수료완료 액션 (인턴십, 공모전 락 해제 트리거)
window.completeAcademy = async function() {
  const projects = db.getTable("Project_Status");
  const academyProj = projects.find(p => p.UserID === appState.currentUser && p.ProjectType === "Academy");
  
  if (academyProj) {
    academyProj.Stage = "최종수료";
    academyProj.MatchingStatus = "수료완료";
    academyProj.ProgressPercent = "100";
    academyProj.UpdateTime = getNowDateString();
    
    db.saveTable("Project_Status", projects);
    
    // 실시간 구글 시트 쓰기 연계
    if (db.liveMode) {
      await db.writeToGoogleSheets({
        action: "updateProject",
        ProjectType: "Academy",
        UserID: appState.currentUser,
        Stage: "최종수료",
        MatchingStatus: "수료완료",
        ProgressPercent: "100",
        RegistrationNo: "N/A"
      });
    }
    
    // 락 해제 애니메이션 효과를 위해 리렌더링
    renderInternDashboard();
    
    // 알림 메시지 출력
    alert("축하합니다! 취창업 아카데미(총 5회) 과정을 공식 수료하셨습니다. 이제 인턴 매칭 지원 및 관광 MICE 공모전 참여가 전면 허용됩니다!");
    
    // 시트 갱신 하이라이트
    appState.currentSheet = "Project_Status";
    renderSheetsEmulator(appState.currentUser);
  }
};

// 6. [기업 대시보드] 렌더링 로직
function renderCompanyDashboard() {
  // 0) 양식 다운로드 렌더링
  renderCompanyTemplates();
  
  // 1) 제출된 서류 리스트 렌더링
  renderCompanyDocs();
  
  // 2) 매칭 신청 인턴 리스트 렌더링
  renderCompanyCandidates();
}

function renderCompanyTemplates() {
  const container = document.getElementById("company-templates-container");
  if (!container) return;
  
  const templates = db.getTable("Document_Templates") || [];
  container.innerHTML = "";
  
  if (templates.length === 0) {
    container.innerHTML = `<div style="font-size: 12px; color: var(--text-muted); padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; width: 100%; text-align: center;">등록된 양식이 없습니다.</div>`;
    return;
  }
  
  templates.forEach(tpl => {
    const btn = document.createElement("a");
    btn.href = tpl.DriveURL || "#";
    btn.target = "_blank";
    btn.className = "btn-sm btn-outline-sm";
    btn.style.textDecoration = "none";
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.gap = "4px";
    btn.style.padding = "6px 12px";
    btn.style.fontSize = "12px";
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      ${tpl.FileName || tpl.DocType} 다운로드
    `;
    container.appendChild(btn);
  });
}

function renderCompanyDocs() {
  const docs = db.getTable("Documents_Log").filter(d => d.UserID === appState.currentUser);
  const container = document.getElementById("company-docs-container");
  container.innerHTML = "";
  
  if (docs.length === 0) {
    container.innerHTML = `<p class="upload-limit">현재 제출된 문서가 없습니다.</p>`;
    return;
  }
  
  docs.forEach(doc => {
    const el = document.createElement("div");
    el.className = "doc-item";
    
    let statusClass = "pending";
    let statusTxt = "대기";
    if (doc.Status === "Approved") {
      statusClass = "approved";
      statusTxt = "승인 완료";
    } else if (doc.Status === "Rejected") {
      statusClass = "rejected";
      statusTxt = "반려 - 재업로드";
    }

    el.innerHTML = `
      <div class="doc-info">
        <span class="doc-name">${doc.DocType} <small style="color:var(--text-muted)">(${doc.OriginalName})</small></span>
        <span class="doc-meta" style="font-family: monospace;">파일명: ${doc.SavedName}</span>
      </div>
      <span class="status-badge ${statusClass}">${statusTxt}</span>
    `;
    container.appendChild(el);
  });
}

function renderCompanyCandidates() {
  const container = document.getElementById("company-intern-cards");
  container.innerHTML = "";

  // Project_Status 중 인턴십 트랙에 해당하는 인턴들 수집
  const projects = db.getTable("Project_Status").filter(p => p.ProjectType === "Internship" && p.CompanyID === appState.currentUser);
  const users = db.getTable("Master_Users");
  
  // 기업에 매칭 가능한 목록을 Project_Status에서 동적으로 생성
  const candidates = projects.map(p => {
    // 이력서 정보가 있으면 해당 정보 사용, 없으면 기본값
    const resume = CANDIDATE_RESUMES[p.UserID];
    return {
      id: p.UserID,
      track: resume ? resume.track : "관광 분야 일반 트랙",
      score: resume ? resume.score : "대기중",
      status: p
    };
  });

  candidates.forEach(cand => {
    const u = users.find(user => user.UserID === cand.id);
    if (!u) return;

    const el = document.createElement("div");
    el.className = "intern-card";

    let stateColor = "var(--text-muted)";
    let matchText = "미정";
    if (cand.status) {
      matchText = cand.status.MatchingStatus;
      if (matchText === "매칭 완료") stateColor = "var(--status-success)";
      if (matchText === "면접 대기") stateColor = "var(--status-warning)";
    }

    el.innerHTML = `
      <div class="intern-profile" style="margin-bottom: 16px;">
        <div class="intern-meta">
          <h4>${u.Name} <span style="font-size: 12px; font-weight: normal; color: var(--text-muted);">/ ${u.School || '학교 미기재'}</span></h4>
        </div>
      </div>
      
      <!-- 6단계 현황 트래커 -->
      <div class="company-pipeline-container" style="background: rgba(0,0,0,0.2); padding: 20px 12px; border-radius: 8px; margin-bottom: 12px; font-size: 14px;">
        <div class="pipeline-header" style="font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 16px;">진행 현황 (관리자 확인 완료 상태)</div>
        <div class="pipeline-steps" style="display: flex; justify-content: space-between; align-items: flex-start; position: relative;">
          <!-- 진행선 -->
          <div style="position: absolute; top: 16px; left: 10px; right: 10px; height: 3px; background: rgba(255,255,255,0.1); z-index: 1;"></div>
          
          ${renderPipelineStepUI(cand.id, cand.status ? cand.status.PipelineStage : 0, true)}
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  // 상단 매칭 뱃지 업데이트
  const matchedCount = projects.filter(p => p.PipelineStage >= 5).length; // 5단계 이상 완료
  document.getElementById("company-matching-badge").innerText = `배정 완료: ${matchedCount}명 / 대기: ${projects.length - matchedCount}명`;
}

// 6단계 파이프라인 렌더링 헬퍼 함수
function renderPipelineStepUI(internId, currentStep, isReadOnly = false) {
  const steps = [
    { label: "신청" },
    { label: "청년 현황" },
    { label: "매칭 현황" },
    { label: "청년 고용" },
    { label: "서류 제출" }, // 4번 인덱스
    { label: "사업 완료" }
  ];
  
  let html = "";
  steps.forEach((step, index) => {
    const isCompleted = currentStep >= index;
    const isActive = currentStep === index;
    
    let color = isCompleted ? "var(--color-primary)" : "var(--text-muted)";
    let bg = isCompleted ? "var(--color-primary)" : "var(--bg-app)";
    let border = isCompleted ? "var(--color-primary)" : "var(--border-card)";
    let textStyle = isActive ? "color: var(--color-primary); font-weight: 800; font-size: 12px;" : (isCompleted ? "color: var(--text-main); font-size: 11px;" : "color: var(--text-muted); font-size: 11px;");
    let glow = isActive ? "box-shadow: 0 0 15px var(--color-primary-glow);" : "";
    let onClickStr = isReadOnly ? "" : `onclick="updatePipelineStatus('${internId}', ${index})"`;
    let cursorStyle = isReadOnly ? "cursor: default;" : "cursor: pointer;";

    html += `
      <div class="pipe-step" style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; ${cursorStyle}" ${onClickStr}>
        <div class="pipe-dot" style="width: 32px; height: 32px; border-radius: 50%; background: ${bg}; border: 3px solid ${border}; display: flex; align-items: center; justify-content: center; transition: all 0.2s; ${glow}">
          ${isCompleted ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
        </div>
        <div style="text-align: center; line-height: 1.3; ${textStyle}">${step.label}</div>
      </div>
    `;
  });
  return html;
}

// 파이프라인 상태 업데이트 함수
async function updatePipelineStatus(internId, newStepIndex) {
  const projects = db.getTable("Project_Status");
  const pIndex = projects.findIndex(p => p.UserID === internId && p.ProjectType === "Internship");
  
  if (pIndex !== -1) {
    projects[pIndex].PipelineStage = newStepIndex;
    
    // UI 로직 매핑용 호환성 필드 업데이트 (기존 시스템 호환)
    if (newStepIndex >= 5) {
      projects[pIndex].MatchingStatus = "매칭 완료";
    } else {
      projects[pIndex].MatchingStatus = "심사 중";
    }
    
    db.saveTable("Project_Status", projects);
    
    // 구글 시트 반영
    if (db.liveMode) {
      await db.writeToGoogleSheets({
        action: "updatePipelineStage",
        UserID: internId,
        PipelineStage: newStepIndex
      });
    }
    
    renderCompanyCandidates();
    
    // 시트 에뮬레이터 리렌더링
    appState.currentSheet = "Project_Status";
    renderSheetsEmulator(appState.currentUser);
  }
}



// 7. 이력서 모달 팝업 함수
window.viewResumeModal = function(internID) {
  const resume = CANDIDATE_RESUMES[internID];
  if (!resume) return;

  const modal = document.getElementById("pms-modal");
  const modalContent = document.getElementById("modal-body-content");

  modalContent.innerHTML = `
    <div class="modal-detail-header">
      <h3>${resume.name} 님의 매칭 이력서</h3>
      <p>${resume.track} | 포트폴리오 적합도: <strong style="color: var(--color-primary)">${resume.portfolioScore}</strong></p>
    </div>
    <div class="resume-body">
      <div class="resume-section">
        <h4>자기소개 및 포부</h4>
        <p>${resume.intro}</p>
      </div>
      <div class="resume-section">
        <h4>핵심 보유 기술 (Tech Skills)</h4>
        <p style="font-family: monospace;">${resume.skills}</p>
      </div>
      <div class="resume-section">
        <h4>이수 교육 및 대외활동 내역</h4>
        <p>${resume.experience}</p>
      </div>
    </div>
    <div style="margin-top: 24px; display: flex; gap: 8px;">
      <button class="btn-sm btn-primary-sm" style="flex:1" onclick="closeModal(); updateCandidateMatch('${internID}', '면접합격/완료')">즉시 면접 합격</button>
      <button class="btn-sm" style="flex:1" onclick="closeModal()">닫기</button>
    </div>
  `;

  modal.classList.add("active");
};

window.closeModal = function() {
  document.getElementById("pms-modal").classList.remove("active");
};

// 후보 인턴 매칭 상태 업데이트
window.updateCandidateMatch = async function(internID, newStatus) {
  const projects = db.getTable("Project_Status");
  const targetProj = projects.find(p => p.UserID === internID && p.ProjectType === "Internship");
  
  if (targetProj) {
    targetProj.MatchingStatus = newStatus;
    if (newStatus.includes("합격") || newStatus.includes("완료")) {
      targetProj.Stage = "최종매칭";
      targetProj.ProgressPercent = "100";
    } else {
      targetProj.Stage = "면접전형";
      targetProj.ProgressPercent = "50";
    }
    targetProj.UpdateTime = getNowDateString();
    
    db.saveTable("Project_Status", projects);
    
    // 실시간 구글 시트 쓰기 연계
    if (db.liveMode) {
      await db.writeToGoogleSheets({
        action: "updateProject",
        ProjectType: "Internship",
        UserID: internID,
        Stage: targetProj.Stage,
        MatchingStatus: targetProj.MatchingStatus,
        ProgressPercent: targetProj.ProgressPercent,
        RegistrationNo: "N/A"
      });
    }

    renderCompanyDashboard();
    
    // 시트 에뮬레이터도 즉시 갱신하고 강조
    appState.currentSheet = "Project_Status";
    renderSheetsEmulator(internID);
  }
};

// 8. [파일 업로드 및 네이밍 정규화] 로직
function initDragAndDrop() {
  const dragZone = document.getElementById("file-drag-zone");
  const fileInput = document.getElementById("real-file-input");
  
  dragZone.addEventListener("click", () => fileInput.click());
  
  dragZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragZone.classList.add("dragover");
  });
  
  dragZone.addEventListener("dragleave", () => {
    dragZone.classList.remove("dragover");
  });
  
  dragZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dragZone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processFileUpload(e.target.files[0]);
    }
  });
}

async function processFileUpload(file) {
  // UI Loading (Upload Progress)
  const dragZone = document.getElementById("file-drag-zone");
  const uploadPrompt = dragZone.querySelector(".upload-prompt");
  const originalPrompt = uploadPrompt ? uploadPrompt.innerHTML : "";
  if (uploadPrompt) uploadPrompt.innerHTML = "파일 업로드 중... 잠시만 기다려주세요.";
  dragZone.style.pointerEvents = "none";
  dragZone.style.opacity = "0.7";

  const docTypeInput = document.getElementById("doc-type-select");
  const docType = docTypeInput ? docTypeInput.value : "제출서류";
  const projectType = appState.currentProject; // Internship, Academy, Mice
  
  let projectCode = "인턴십";
  if (projectType === "Academy") projectCode = "아카데미";
  if (projectType === "Mice") projectCode = "MICE";

  const users = db.getTable("Master_Users") || [];
  const currentUserObj = users.find(u => u.UserID === appState.currentUser);
  const companyName = currentUserObj ? currentUserObj.Name : "알수없음";
  const dateStr = getNowDateCompact(); // YYYYMMDD 형태
  
  // 파일 확장자 분리
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  
  // 1) 자동화 네이밍 변환 규칙 적용: [사업구분]_[기업명]_[서류종류]_날짜.확장자
  const normalizedName = `[${projectCode}]_[${companyName}]_[${docType}]_${dateStr}${ext}`;
  
  const documents = db.getTable("Documents_Log");
  const newDocId = `DOC-${String(documents.length + 1).padStart(3, '0')}`;

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;
    
    let finalDriveUrl = "";
    
    // 실시간 구글 시트 쓰기 연계 (업로드 및 로깅 동시 처리)
    if (db.liveMode) {
      try {
        fetch(db.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify({
            action: "uploadRealFile",
            folderId: "1GJ6IpmD2MVyG0aAWBTFK_xVkoEVSzzcu",
            fileData: base64Data,
            fileName: normalizedName,
            mimeType: file.type || "application/octet-stream",
            DocID: newDocId,
            UserID: appState.currentUser,
            CompanyName: companyName,
            DocType: docType,
            OriginalName: file.name
          })
        });
        // no-cors 모드에서는 응답을 읽을 수 없으므로(opaque), 시뮬레이션 URL로 진행 후
        // 차후 fetchFromGoogleSheets()가 호출될 때 실제 DriveURL로 덮어씌워짐.
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    if (!finalDriveUrl) {
      finalDriveUrl = `https://drive.google.com/open?id=1DriveSim_${Math.random().toString(36).substring(2, 10)}`;
    }

    const newDocRow = {
      DocID: newDocId,
      UserID: appState.currentUser,
      CompanyName: companyName,
      DocType: docType,
      OriginalName: file.name,
      SavedName: normalizedName,
      DriveURL: finalDriveUrl,
      Status: "Approved", // 대기 대신 완료로 즉시 반영
      UploadedTime: getNowDateString()
    };

    documents.push(newDocRow);
    db.saveTable("Documents_Log", documents);
    
    // UI 복구
    if (uploadPrompt) uploadPrompt.innerHTML = originalPrompt;
    dragZone.style.pointerEvents = "auto";
    dragZone.style.opacity = "1";

    // 리렌더링
    renderCompanyDocs();
    
    // 시트 패널을 Documents_Log로 이동하고 방금 추가된 행 반짝이게 설정
    appState.currentSheet = "Documents_Log";
    renderSheetsEmulator(newDocId);
  };
  
  reader.readAsDataURL(file);
}

async function processInternFileUpload(file, btn) {
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span style="margin-right: 8px; font-size: 18px;">⏳</span> 업로드 중...`;
  btn.style.pointerEvents = "none";
  btn.style.opacity = "0.7";

  const users = db.getTable("Master_Users") || [];
  const currentUserObj = users.find(u => u.UserID === appState.currentUser);
  const userName = currentUserObj ? currentUserObj.Name : "알수없음";
  const dateStr = getNowDateCompact(); 
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  const normalizedName = `[인턴십]_[${userName}]_[참여신청서]_${dateStr}${ext}`;

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;
    
    if (db.liveMode && db.appsScriptUrl) {
      try {
        fetch(db.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify({
            action: "uploadRealFile",
            folderId: "1GJ6IpmD2MVyG0aAWBTFK_xVkoEVSzzcu",
            fileData: base64Data,
            fileName: normalizedName,
            mimeType: file.type || "application/octet-stream",
            DocID: "DOC-INTERN-" + Date.now(),
            UserID: appState.currentUser,
            CompanyName: userName,
            DocType: "인턴십_참여신청서",
            OriginalName: file.name
          })
        });
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setTimeout(() => {
      btn.innerHTML = `<span style="margin-right: 8px; font-size: 18px;">✅</span> 업로드 완료`;
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
      alert("신청서가 구글 드라이브에 성공적으로 업로드되었습니다.");
    }, 1500);
  };
  
  reader.readAsDataURL(file);
}

// 9. [운영사 관리자 대시보드] 렌더링 로직
function renderOperatorDashboard() {
  // 1) 구글 시트 Admin_Dashboard 탭에서 예산 데이터 읽기
  const adminData = db.getTable("Admin_Dashboard");
  const budget = (adminData && adminData.length > 0) ? adminData[0] : DEFAULT_ADMIN_DASHBOARD[0];
  
  const totalBudget = Number(budget.TotalBudget) || 0;
  const executedBudget = Number(budget.ExecutedBudget) || 0;
  const remainingBudget = totalBudget - executedBudget;
  const internGoal = Number(budget.InternGoal) || 30;
  const budgetPercent = totalBudget > 0 ? ((executedBudget / totalBudget) * 100).toFixed(1) : 0;
  
  // 2) Project_Status에서 인턴쉽 매칭 데이터 자동 계산
  const projects = db.getTable("Project_Status") || [];
  const internProjects = projects.filter(p => p.ProjectType === "Internship");
  const matchedCount = internProjects.filter(p => p.MatchingStatus === "매칭 완료" || p.MatchingStatus === "면접합격/완료").length;
  const matchRate = internGoal > 0 ? Math.round((matchedCount / internGoal) * 100) : 0;
  
  // 3) Application_Status에서 MICE 공모전 접수 팀 자동 계산
  const applications = db.getTable("Application_Status") || [];
  const miceTeamCount = applications.filter(a => a.ProjectType === "Mice").length;
  
  // --- DOM 업데이트: 집행 예산 카드 ---
  animateValue("op-executed-budget", executedBudget);
  document.getElementById("op-budget-sub").innerText = `전체 예산 ${formatKoreanCurrency(totalBudget)} 대비 ${budgetPercent}%`;
  document.getElementById("op-budget-bar-fill").style.width = `${Math.min(budgetPercent, 100)}%`;
  document.getElementById("op-total-budget").innerText = formatKoreanCurrency(totalBudget);
  document.getElementById("op-remaining-budget").innerText = formatKoreanCurrency(remainingBudget);
  
  // --- DOM 업데이트: 인턴쉽 매칭 달성률 카드 ---
  animateValue("op-match-rate", matchRate);
  document.getElementById("op-match-sub").innerText = `목표 ${internGoal}명 / 매칭 완료 ${matchedCount}명`;
  document.getElementById("op-match-bar-fill").style.width = `${Math.min(matchRate, 100)}%`;
  
  // --- DOM 업데이트: MICE 공모전 접수 팀 카드 ---
  animateValue("op-mice-teams", miceTeamCount);
  const totalMiceParticipants = miceTeamCount * 4; // 팀당 평균 4명 추정
  document.getElementById("op-mice-sub").innerText = `참가 인원 총 ${totalMiceParticipants}명 접수 완료`;
  const miceBarPercent = Math.min(miceTeamCount * 2, 100); // 50팀 기준 100%
  document.getElementById("op-mice-bar-fill").style.width = `${miceBarPercent}%`;
  
  // 전체 서류 목록 테이블 렌더링
  renderOperatorDocsTable();
  
  // 전체 사업 신청 내역 관리 테이블 렌더링
  renderOperatorApplicationsTable();
  
  // 아카데미 출석 관리 테이블 렌더링
  renderOperatorAcademyAttendance();
}

// 숫자 카운팅 애니메이션 헬퍼
function animateValue(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  const isLargeNum = target > 1000;
  let count = 0;
  const steps = 40;
  const speed = target / steps;
  
  const updateCount = () => {
    count += speed;
    if (count < target) {
      el.innerText = isLargeNum ? Math.floor(count).toLocaleString() : Math.floor(count);
      setTimeout(updateCount, 15);
    } else {
      el.innerText = isLargeNum ? target.toLocaleString() : target;
    }
  };
  updateCount();
}

// 한국 통화 포맷 헬퍼 (예: 2.5억원, 1억5,200만원 등)
function formatKoreanCurrency(amount) {
  if (amount >= 100000000) {
    const eok = Math.floor(amount / 100000000);
    const remainder = amount % 100000000;
    if (remainder === 0) return `${eok}억원`;
    const man = Math.floor(remainder / 10000);
    return `${eok}억${man.toLocaleString()}만원`;
  } else if (amount >= 10000) {
    return `${Math.floor(amount / 10000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

function renderOperatorDocsTable() {
  const docs = db.getTable("Documents_Log");
  const tbody = document.querySelector("#operator-docs-table tbody");
  tbody.innerHTML = "";
  
  if (docs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">제출된 문서가 존재하지 않습니다.</td></tr>`;
    return;
  }

  docs.forEach(doc => {
    const tr = document.createElement("tr");
    tr.id = `op-row-${doc.DocID}`;

    let statusClass = "pending";
    let statusTxt = "검토대기";
    if (doc.Status === "Approved") {
      statusClass = "approved";
      statusTxt = "승인완료";
    } else if (doc.Status === "Rejected") {
      statusClass = "rejected";
      statusTxt = "반려됨";
    }

    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700;">${doc.DocID}</td>
      <td>${doc.CompanyName}</td>
      <td>${doc.DocType}</td>
      <td style="font-weight: 600; color: var(--color-primary);">${doc.SavedName}</td>
      <td>
        <a href="${doc.DriveURL}" target="_blank" class="drive-url-link">
          💾 G-Drive Link
        </a>
      </td>
      <td><span class="status-badge ${statusClass}">${statusTxt}</span></td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn-sm btn-primary-sm" style="padding: 4px 8px;" onclick="approveDocument('${doc.DocID}', 'Approved')">승인</button>
          <button class="btn-sm" style="padding: 4px 8px; color:var(--status-error); border-color:var(--status-error-bg);" onclick="approveDocument('${doc.DocID}', 'Rejected')">반려</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 운영사의 서류 승인/반려 처리
window.approveDocument = async function(docID, newStatus) {
  const docs = db.getTable("Documents_Log");
  const targetDoc = docs.find(d => d.DocID === docID);
  
  if (targetDoc) {
    targetDoc.Status = newStatus;
    db.saveTable("Documents_Log", docs);
    
    // 실시간 구글 시트 쓰기 연계
    if (db.liveMode) {
      await db.writeToGoogleSheets({
        action: "updateDocumentStatus",
        DocID: docID,
        Status: newStatus
      });
    }

    // 리렌더
    renderOperatorDocsTable();
    
    // [추가] 서류 승인 시 Project_Status 업데이트
    if (newStatus === "승인" || newStatus === "Approved") {
      const projects = db.getTable("Project_Status") || [];
      const proj = projects.find(p => p.UserID === targetDoc.UserID && p.ProjectType === "Internship");
      if (proj) {
        proj.Stage = "면접전형";
        proj.MatchingStatus = "서류통과";
        proj.ProgressPercent = "50";
      } else {
        projects.push({
          ProjectType: "Internship",
          UserID: targetDoc.UserID,
          Stage: "면접전형",
          MatchingStatus: "서류통과",
          ProgressPercent: "50",
          RegistrationNo: "N/A",
          UpdateTime: getNowDateString()
        });
      }
      db.saveTable("Project_Status", projects);
    }

    // 시트 모니터 포커싱 및 갱신 효과
    appState.currentSheet = "Documents_Log";
    renderSheetsEmulator(docID);
  }
};

function renderOperatorApplicationsTable() {
  const tbody = document.querySelector("#operator-applications-table tbody");
  if (!tbody) return;
  
  const applications = db.getTable("Application_Status") || [];
  const users = db.getTable("Master_Users") || [];
  
  tbody.innerHTML = "";
  
  if (applications.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">신청 내역이 없습니다.</td></tr>`;
    return;
  }
  
  // 최신 신청이 위로 오도록 역순 정렬
  const sortedApps = [...applications].reverse();
  
  sortedApps.forEach(app => {
    const user = users.find(u => u.UserID === app.UserID) || { Name: "알수없음" };
    const el = document.createElement("tr");
    
    let statusClass = "pending";
    let statusTxt = "대기";
    if (app.Approval === "Y") {
      statusClass = "approved";
      statusTxt = "승인 완료";
    } else if (app.Approval === "N") {
      statusClass = "rejected";
      statusTxt = "반려됨";
    }
    
    let projName = "인턴십";
    if (app.ProjectType === "Academy") projName = "아카데미";
    if (app.ProjectType === "Mice") projName = "MICE 공모전";

    el.innerHTML = `
      <td>${projName}</td>
      <td><strong>${user.Name}</strong><br><small style="color:var(--text-muted)">(${app.UserID || "알수없음"})</small></td>
      <td>${app.ApplyTime}</td>
      <td><span class="status-badge ${statusClass}">${statusTxt}</span></td>
      <td>
        <div style="display:flex; gap:5px;">
          <button class="btn-sm btn-outline-sm" onclick="window.updateApplicationApproval('${app.ApplyID}', 'Y')" ${app.Approval === 'Y' ? 'disabled' : ''}>승인</button>
          <button class="btn-sm btn-outline-sm" onclick="window.updateApplicationApproval('${app.ApplyID}', 'N')" ${app.Approval === 'N' ? 'disabled' : ''}>거절</button>
        </div>
      </td>
    `;
    tbody.appendChild(el);
  });
}

window.updateApplicationApproval = async function(applyId, newStatus) {
  const applications = db.getTable("Application_Status") || [];
  const targetApp = applications.find(a => a.ApplyID === applyId);
  
  if (targetApp) {
    targetApp.Approval = newStatus;
    db.saveTable("Application_Status", applications);
    
    // 승인 시 Project_Status 로컬 연계 (프론트엔드 임시 시뮬레이션)
    if (newStatus === "Y") {
      const projects = db.getTable("Project_Status") || [];
      const proj = projects.find(p => p.ProjectType === targetApp.ProjectType && p.UserID === targetApp.UserID);
      if (proj) {
        if (targetApp.ProjectType === "Internship") {
          proj.Stage = "서류제출";
          proj.MatchingStatus = "승인완료";
          proj.ProgressPercent = "25";
        } else if (targetApp.ProjectType === "Mice") {
          proj.Stage = "서류합격";
          proj.MatchingStatus = "진행중";
          proj.ProgressPercent = "50";
        }
      } else {
        let newStage = "승인완료";
        let newMatch = "진행중";
        let newProg = "0";
        if (targetApp.ProjectType === "Internship") {
          newStage = "서류제출";
          newMatch = "승인완료";
          newProg = "25";
        } else if (targetApp.ProjectType === "Mice") {
          newStage = "서류합격";
          newMatch = "진행중";
          newProg = "50";
        }
        projects.push({
          ProjectType: targetApp.ProjectType,
          UserID: targetApp.UserID,
          Stage: newStage,
          MatchingStatus: newMatch,
          ProgressPercent: newProg,
          RegistrationNo: "N/A",
          UpdateTime: getNowDateString()
        });
      }
      db.saveTable("Project_Status", projects);
    }
    
    // 실시간 구글 시트 쓰기 연계
    if (db.liveMode) {
      await db.writeToGoogleSheets({
        action: "updateApplicationApproval",
        ApplyID: applyId,
        Approval: newStatus
      });
    }

    // 리렌더
    renderOperatorApplicationsTable();
    
    appState.currentSheet = "Application_Status";
    renderSheetsEmulator(applyId);
  }
};

function renderOperatorAcademyAttendance() {
  const tbody = document.querySelector("#operator-academy-attendance-table tbody");
  if (!tbody) return;
  
  const applications = db.getTable("Application_Status") || [];
  const users = db.getTable("Master_Users") || [];
  const attendance = db.getTable("Academy_Attendance") || [];
  
  // 아카데미에 실제 신청한 유저만 필터링 (중복 제거)
  const academyYouths = applications.filter(a => a.ProjectType === "Academy");
  const uniqueYouths = [];
  academyYouths.forEach(app => {
    if (!uniqueYouths.find(u => u.UserID === app.UserID)) {
      uniqueYouths.push(app);
    }
  });
  
  tbody.innerHTML = "";
  
  if (uniqueYouths.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">아카데미 수강생이 없습니다.</td></tr>`;
    return;
  }
  
  uniqueYouths.forEach(proj => {
    const user = users.find(u => u.UserID === proj.UserID) || { Name: "알수없음" };
    const myAtt = attendance.find(a => a.UserID === proj.UserID) || { Session1:0, Session2:0, Session3:0, Session4:0, Session5:0 };
    
    const tr = document.createElement("tr");
    
    let btnHtml = "";
    for(let i=1; i<=5; i++) {
      const isAttended = myAtt[`Session${i}`] == 1;
      const btnClass = isAttended ? "btn-primary-sm" : "btn-outline-sm";
      const btnText = isAttended ? "출석" : "대기";
      const bgStyle = isAttended ? "" : "background:rgba(255,255,255,0.1); border-color:var(--border-card);";
      btnHtml += `<button class="btn-sm ${btnClass}" style="padding:4px; font-size:11px; margin-right:4px; ${bgStyle}" onclick="toggleOperatorAttendance('${proj.UserID}', ${i}, ${isAttended ? 0 : 1})">${i}회차 ${btnText}</button>`;
    }
    
    const attendedCount = [myAtt.Session1, myAtt.Session2, myAtt.Session3, myAtt.Session4, myAtt.Session5].filter(v => v == 1).length;
    const progress = (attendedCount / 5) * 100;
    
    tr.innerHTML = `
      <td style="font-weight: 700;">${user.Name} (${proj.UserID})</td>
      <td>${btnHtml}</td>
      <td><span class="status-badge ${progress === 100 ? 'approved' : 'pending'}">${progress}%</span></td>
    `;
    tbody.appendChild(tr);
  });
}

window.toggleOperatorAttendance = async function(userId, sessionNum, newVal) {
  let attendance = db.getTable("Academy_Attendance") || [];
  let myAtt = attendance.find(a => a.UserID === userId);
  
  if (!myAtt) {
    const user = db.getTable("Master_Users").find(u => u.UserID === userId);
    myAtt = { UserID: userId, Name: user ? user.Name : "", Session1:0, Session2:0, Session3:0, Session4:0, Session5:0 };
    attendance.push(myAtt);
  }
  
  myAtt[`Session${sessionNum}`] = newVal;
  db.saveTable("Academy_Attendance", attendance);
  
  // Update Project Progress locally
  const projects = db.getTable("Project_Status");
  const academyProj = projects.find(p => p.UserID === userId && p.ProjectType === "Academy");
  if (academyProj) {
    const attendedCount = [myAtt.Session1, myAtt.Session2, myAtt.Session3, myAtt.Session4, myAtt.Session5].filter(v => v == 1).length;
    academyProj.ProgressPercent = String(attendedCount * 20);
    db.saveTable("Project_Status", projects);
  }
  
  if (db.liveMode) {
    await db.writeToGoogleSheets({
      action: "updateAttendance",
      UserID: userId,
      Name: myAtt.Name,
      Session1: myAtt.Session1,
      Session2: myAtt.Session2,
      Session3: myAtt.Session3,
      Session4: myAtt.Session4,
      Session5: myAtt.Session5
    });
  }
  
  renderOperatorAcademyAttendance();
  appState.currentSheet = "Academy_Attendance";
  renderSheetsEmulator(appState.currentUser);
};

// 10. [실시간 구글 시트 에뮬레이터] 렌더링 로직
function renderSheetsEmulator(highlightKey = null) {
  const sheetType = appState.currentSheet;
  const data = db.getTable(sheetType);
  
  const thead = document.querySelector("#sheets-emulator-table thead");
  const tbody = document.querySelector("#sheets-emulator-table tbody");
  
  thead.innerHTML = "";
  tbody.innerHTML = "";
  
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="100%">No record found.</td></tr>`;
    return;
  }

  // 1) 헤더 생성 (첫 행 오브젝트의 키값 추출)
  const headers = Object.keys(data[0]);
  const headerTr = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.innerText = h;
    headerTr.appendChild(th);
  });
  thead.appendChild(headerTr);

  // 2) 바디 셀 채우기
  data.forEach((row, rowIdx) => {
    const tr = document.createElement("tr");
    
    // 특정 키값 매칭 강조 필터링
    let isHighlight = false;
    if (sheetType === "Documents_Log" && highlightKey && row.DocID === highlightKey) {
      isHighlight = true;
    }
    if (sheetType === "Project_Status" && highlightKey && row.UserID === highlightKey) {
      isHighlight = true;
    }

    if (isHighlight) {
      tr.className = "flash-row";
      // 에뮬레이터 패널을 자동으로 열어 보여줍니다.
      document.querySelector(".db-monitor-panel").classList.remove("collapsed");
    }

    headers.forEach(h => {
      const td = document.createElement("td");
      
      // 상태값 및 가상 링크 꾸미기
      if (h === "Status" || h === "MatchingStatus") {
        let val = row[h];
        if (val === "Approved" || val === "매칭 완료" || val === "수료완료") {
          td.innerHTML = `<span style="color:var(--status-success); font-weight:700;">${val}</span>`;
        } else if (val === "Rejected" || val === "불합격/재배정") {
          td.innerHTML = `<span style="color:var(--status-error); font-weight:700;">${val}</span>`;
        } else {
          td.innerHTML = `<span style="color:var(--status-warning); font-weight:700;">${val}</span>`;
        }
      } else {
        td.innerText = row[h];
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// 11. 유틸리티 함수
function getNowDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function getNowDateCompact() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
}

// 12. 팝업(모달) 관련 기능 (window 전역 객체에 명시적 할당)
window.openInquiryModal = function() {
  const modal = document.getElementById("inquiry-modal");
  if (modal) {
    modal.style.display = "flex";
    setTimeout(() => { modal.style.opacity = "1"; }, 10);
  }
};

window.closeInquiryModal = function() {
  const modal = document.getElementById("inquiry-modal");
  if (modal) {
    modal.style.opacity = "0";
    setTimeout(() => { modal.style.display = "none"; }, 300);
  }
};

window.submitInquiry = async function() {
  const title = document.getElementById("inquiry-title").value.trim();
  const content = document.getElementById("inquiry-content").value.trim();
  
  if (!title || !content) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }
  
  const postData = {
    action: "submitInquiry",
    UserID: appState.currentUser,
    Role: appState.currentRole,
    Title: title,
    Content: content
  };
  
  try {
    const btn = document.querySelector("#inquiry-modal .btn-primary-sm");
    btn.disabled = true;
    btn.innerText = "전송중...";
    
    if (db.liveMode && db.appsScriptUrl) {
      const response = await fetch(db.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(postData)
      });
      const res = await response.json();
      if (res.success) {
        alert("관리자에게 문의가 전송되었습니다.");
        document.getElementById("inquiry-title").value = "";
        document.getElementById("inquiry-content").value = "";
        window.closeInquiryModal();
      } else {
        alert("문의 전송 중 오류가 발생했습니다: " + res.error);
      }
    } else {
      alert("현재 로컬 모드입니다. Live 연동을 켜주세요.");
    }
  } catch (err) {
    console.error(err);
    alert("네트워크 오류가 발생했습니다.");
  } finally {
    const btn = document.querySelector("#inquiry-modal .btn-primary-sm");
    btn.disabled = false;
    btn.innerText = "보내기";
  }
};

// --- [기업 희망 지원 액션] ---
window.applyToCompany = async function(companyId) {
  const applications = db.getTable("Project_Status") || [];
  const myApplications = applications.filter(a => a.UserID === appState.currentUser && a.ProjectType === "Internship" && a.CompanyID);
  
  if (myApplications.length >= 3) {
    alert("최대 3개의 기업까지만 지원 가능합니다.");
    return;
  }
  
  const alreadyApplied = myApplications.find(a => a.CompanyID === companyId);
  if (alreadyApplied) {
    alert("이미 지원한 기업입니다.");
    return;
  }
  
  const postData = {
    action: "applyToCompany",
    UserID: appState.currentUser,
    ProjectType: "Internship",
    CompanyID: companyId
  };
  
  // Optimistic UI Update
  const newApp = {
    ProjectType: "Internship",
    UserID: appState.currentUser,
    CompanyID: companyId,
    Stage: "지원완료",
    MatchingStatus: "지원 접수",
    PipelineStage: 0,
    ProgressPercent: "0",
    RegistrationNo: "N/A",
    UpdateTime: getNowDateString()
  };
  applications.push(newApp);
  db.saveTable("Project_Status", applications);
  
  appState.updateUI();
  
  if (db.liveMode) {
    await db.writeToGoogleSheets(postData);
  }
  
  alert("해당 기업에 성공적으로 지원했습니다!");
};

window.openNoticeModal = function(arg1, content, date) {
  const modal = document.getElementById("notice-modal");
  if (modal) {
    if (typeof arg1 === "object") {
      document.getElementById("notice-modal-title").innerText = arg1.Title;
      document.getElementById("notice-modal-content").innerHTML = arg1.Content.replace(/\n/g, '<br>');
      document.getElementById("notice-modal-date").innerText = arg1.Date;
    } else {
      document.getElementById("notice-modal-title").innerText = arg1;
      document.getElementById("notice-modal-content").innerHTML = content.replace(/\n/g, '<br>');
      document.getElementById("notice-modal-date").innerText = date;
    }
    modal.style.display = "flex";
    setTimeout(() => { modal.style.opacity = "1"; }, 10);
  }
};

window.closeNoticeModal = function() {
  const modal = document.getElementById("notice-modal");
  if (modal) {
    modal.style.opacity = "0";
    setTimeout(() => { modal.style.display = "none"; }, 300);
  }
};
