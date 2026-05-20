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
  { ProjectType: "Internship", UserID: "intern_01", Stage: "서류심사", MatchingStatus: "심사 중", ProgressPercent: "25", RegistrationNo: "N/A", UpdateTime: "2026-05-20 10:00:00" },
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

const DEFAULT_NOTICES = [
  { id: 1, title: "[일반] 3개 통합 PMS 대시보드 오픈 안내 🚀", date: "2026-05-20", content: "부산관광공사 x 밍글무드 통합 PMS 플랫폼이 정식 런칭되었습니다. 현재 보시는 화면은 실시간 구글 시트 ID 1izKpNWL9SYATmVTvVygakzZIaCxmb7BoD9XKDY0nsus 와 연동 시뮬레이션 중이며, 데이터의 모든 가상 변경 사항이 실시간 동기화됩니다." },
  { id: 2, title: "[인턴십] 기업 평가 및 면접 결과 입력 가이드 💼", date: "2026-05-19", content: "기업 담당자님께서는 '참여 기업 대시보드'로 전환하신 후 배정 인턴 리스트에서 이력서를 확인하고 면접 결과(합격/불합격)를 입력해 주세요. 데이터는 구글 시트에 즉시 반영됩니다." },
  { id: 3, title: "[공모전] 관광 MICE 공모전 기획안 서류 심사 개시 ✈️", date: "2026-05-18", content: "MICE 공모전에 등록한 팀들의 서류 검증이 시작되었습니다. 운영사 권한을 통해 접수된 팀 수 및 관련 제출 증빙 자료들의 통계를 실시간으로 확인하실 수 있습니다." }
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
    this.appsScriptUrl = "https://script.google.com/macros/s/AKfycbzG049iRQSReR4dBka-KH0_R1InG8MPD5QEHpqROU5RohCECZ4ey9UeRh1PwI3Tp6PQ/exec";
  }

  initDatabase() {
    // 기존 LocalStorage에 이전 기관명(더휴랩, 부산 로컬투어) 등 이전 데이터가 남아있을 경우 자동 동기화 갱신 처리
    const masterUsersRaw = localStorage.getItem("PMS_Master_Users");
    if (masterUsersRaw && (masterUsersRaw.includes("더휴랩") || masterUsersRaw.includes("부산 로컬투어") || !masterUsersRaw.includes("밍글무드") || masterUsersRaw.includes("contact@busantour.com"))) {
      localStorage.removeItem("PMS_Master_Users");
      localStorage.removeItem("PMS_Project_Status");
      localStorage.removeItem("PMS_Documents_Log");
      localStorage.removeItem("PMS_Notices");
      localStorage.removeItem("PMS_Academy_Sessions");
    }

    if (!localStorage.getItem("PMS_Master_Users")) {
      localStorage.setItem("PMS_Master_Users", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Project_Status")) {
      localStorage.setItem("PMS_Project_Status", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Documents_Log")) {
      localStorage.setItem("PMS_Documents_Log", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Notices")) {
      localStorage.setItem("PMS_Notices", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Academy_Sessions")) {
      localStorage.setItem("PMS_Academy_Sessions", JSON.stringify([]));
    }
    if (!localStorage.getItem("PMS_Registered_Users")) {
      localStorage.setItem("PMS_Registered_Users", JSON.stringify([]));
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

  login(userId, role) {
    this.currentUser = userId;
    this.currentRole = role;
    document.getElementById("auth-view").classList.remove("active");
    document.getElementById("app-main-content").style.display = "block";
    
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
    
    this.updateUI();
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
      // 본 데모에서는 일반 유저의 비밀번호 엄격한 검증을 생략하거나 추후 연동 가능
      // (현 단계에서는 아이디가 존재하면 접속 허용 처리)
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
    } else if (role === "Company") {
      postData.CompanyName = document.getElementById("signup-comp-name").value;
      postData.ContactPerson = document.getElementById("signup-comp-manager").value;
      postData.Phone = document.getElementById("signup-comp-phone").value;
      postData.Email = document.getElementById("signup-comp-email").value;
    }

    // Local Storage 즉시 반영
    users.push({ UserID: userId, Name: postData.Name || postData.CompanyName, Role: role, Email: postData.Email, ActiveState: "Active" });
    db.saveTable("Master_Users", users);
    
    const registered = db.getTable("Registered_Users");
    registered.push(postData);
    db.saveTable("Registered_Users", registered);
    
    // Live 연동 시 Google Sheets 에 전송
    if (db.liveMode && db.appsScriptUrl) {
      db.writeToGoogleSheets(postData);
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
  document.getElementById("intern-user-name").innerText = "홍길동";
  
  let projTitle = "인턴십 지원 및 매칭 프로그램";
  if (activeProj === "Academy") projTitle = "취창업 아카데미 교육 코스";
  if (activeProj === "Mice") projTitle = "관광 MICE 아이디어 공모전";
  document.getElementById("intern-active-project-name").innerText = projTitle;

  // 2) 구글 시트(Project_Status)에서 현재 아카데미 수료 여부 파악 (연계 락 로직)
  const projStatusList = db.getTable("Project_Status");
  const academyStatus = projStatusList.find(p => p.UserID === appState.currentUser && p.ProjectType === "Academy") || {
    Stage: "수강중", MatchingStatus: "진행중", ProgressPercent: "80"
  };

  const isAcademyCompleted = academyStatus.Stage === "최종수료" && academyStatus.ProgressPercent === "100";
  
  // 락 오버레이 및 콘텐츠 블러 분기 조건 처리
  const lockOverlay = document.getElementById("intern-lock-overlay");
  const gridContent = document.getElementById("intern-grid-content");

  if (activeProj !== "Academy" && !isAcademyCompleted) {
    // 🔒 아카데미 미수료인 상태에서 인턴십/공모전 접근 시 락 처리!
    lockOverlay.style.display = "flex";
    gridContent.classList.add("blurred");
    document.getElementById("locked-service-name").innerText = activeProj === "Internship" ? "인턴십 매칭 프로그램" : "관광 MICE 공모전";
    
    // 현재 출석율 시각화
    const sessions = db.getTable("Academy_Sessions");
    const attendedCount = sessions.filter(s => s.status === "attended").length;
    document.getElementById("lock-attendance-rate").innerText = `${(attendedCount / 5 * 100).toFixed(0)}% (총 5회 중 ${attendedCount}회차 완료)`;
  } else {
    // 잠금 해제
    lockOverlay.style.display = "none";
    gridContent.classList.remove("blurred");
  }

  // 3) 구글 시트(Project_Status)에서 현재 인턴 상태 조회
  const currentStatus = projStatusList.find(p => p.UserID === appState.currentUser && p.ProjectType === activeProj) || {
    Stage: "모집중", MatchingStatus: "지원 가능", ProgressPercent: "10", RegistrationNo: "N/A"
  };

  // 4) 단계별 프로세스 바 동적 생성
  const pipeline = document.getElementById("intern-process-pipeline");
  pipeline.innerHTML = "";
  
  let stages = [];
  if (activeProj === "Internship") {
    stages = ["모집중", "서류심사", "면접전형", "최종매칭"];
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
  progressVal.innerText = `${pct}%`;
  
  // SVG stroke-dasharray 계산
  progressCircle.setAttribute("stroke-dasharray", `${pct}, 100`);

  const indicatorTitle = document.getElementById("intern-indicator-title");
  const indicatorDesc = document.getElementById("intern-indicator-desc");
  const specsContainer = document.getElementById("intern-project-specs");
  
  specsContainer.innerHTML = "";

  if (activeProj === "Internship") {
    indicatorTitle.innerText = "서류 평가 지수";
    indicatorDesc.innerText = "이력서 평점 우수(포트폴리오 우수자 가산 적용)";
    
    specsContainer.innerHTML = `
      <div class="widget-row">
        <span class="widget-label">매칭 희망 기업</span>
        <span class="widget-val">밍글무드 (관광 MICE 기획 직무)</span>
      </div>
      <div class="widget-row">
        <span class="widget-label">지정 이력서 파일</span>
        <span class="widget-val">[이력서]홍길동_관광MICE_2026.pdf</span>
      </div>
      <div class="widget-row">
        <span class="widget-label">출석부 인증 상태</span>
        <span class="widget-val" style="color: var(--status-warning)">제출 대기 (배정 후 활성화)</span>
      </div>
    `;
  } else if (activeProj === "Academy") {
    // 아카데미 출석 수 및 참여율 계산
    const sessions = db.getTable("Academy_Sessions");
    const attendedCount = sessions.filter(s => s.status === "attended").length;
    const rate = (attendedCount / 5 * 100).toFixed(0);

    indicatorTitle.innerText = "아카데미 수료 진척도";
    indicatorDesc.innerText = `총 5회차 중 ${attendedCount}회 출석 (${rate}% 참여율)`;

    // 5회차 출석 현황 상세 UI 렌더링
    let sessionsHTML = `<div class="academy-sessions-grid">`;
    sessions.forEach(s => {
      const isAttended = s.status === "attended";
      sessionsHTML += `
        <div class="session-block ${isAttended ? 'attended' : 'pending'}">
          <span>${s.name.split(' ')[0]}</span>
          <span class="session-status-badge ${isAttended ? 'attended' : 'pending'}">${isAttended ? '출석' : '출석체크'}</span>
          ${!isAttended ? `<button class="btn-sm btn-primary-sm" style="padding:2px 4px; font-size:9px;" onclick="attendSession(${s.session})">출석</button>` : ''}
        </div>
      `;
    });
    sessionsHTML += `</div>`;

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
  } else { // Mice
    indicatorTitle.innerText = "공모전 서류 접수 통과";
    indicatorDesc.innerText = "기획서 파일 무결성 및 인원 구성 검증 완료";

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

  // 6) 공지사항 로딩
  const notices = db.getTable("Notices");
  const noticeBoard = document.getElementById("intern-notice-board");
  noticeBoard.innerHTML = "";
  
  notices.forEach(notice => {
    const item = document.createElement("div");
    item.className = "notice-item";
    item.innerHTML = `
      <div class="notice-title">
        <span>${notice.title}</span>
        <span class="notice-date">${notice.date}</span>
      </div>
      <div class="notice-content">${notice.content}</div>
    `;
    noticeBoard.appendChild(item);
  });
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
  // 1) 제출된 서류 리스트 렌더링 (밍글무드 기준)
  renderCompanyDocs();
  
  // 2) 매칭 신청 인턴 리스트 렌더링
  renderCompanyCandidates();
}

function renderCompanyDocs() {
  const docs = db.getTable("Documents_Log").filter(d => d.UserID === "company_01");
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
  const projects = db.getTable("Project_Status").filter(p => p.ProjectType === "Internship");
  const users = db.getTable("Master_Users");
  
  // 기업에 매칭 가능한 목록 생성
  const candidates = [
    { id: "intern_01", track: "관광 MICE 기획 트랙", score: "95점", status: projects.find(p => p.UserID === "intern_01") },
    { id: "intern_03", track: "관광 콘텐츠 개발 트랙", score: "88점", status: projects.find(p => p.UserID === "intern_03") }
  ];

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
      <div class="intern-profile">
        <div class="intern-meta">
          <h4>${u.Name} <span style="font-size: 11px; font-weight: normal; color: var(--text-muted);">(${u.Email})</span></h4>
          <p>${cand.track}</p>
        </div>
        <div class="score-badge">${cand.score}</div>
      </div>
      <div class="widget-row" style="border-top: 1px solid var(--border-card); padding-top: 10px;">
        <span class="widget-label">현재 매칭 상태</span>
        <span class="widget-val" style="color: ${stateColor}">${matchText}</span>
      </div>
      <div class="intern-actions">
        <button class="btn-sm" onclick="viewResumeModal('${cand.id}')">이력서 열람</button>
        <button class="btn-sm btn-primary-sm" onclick="updateCandidateMatch('${cand.id}', '면접합격/완료')">면접 결과 합격</button>
        <button class="btn-sm" style="color:var(--status-error); border-color:var(--status-error-bg)" onclick="updateCandidateMatch('${cand.id}', '불합격/재배정')">불합격</button>
      </div>
    `;
    container.appendChild(el);
  });

  // 상단 매칭 뱃지 업데이트
  const matchedCount = projects.filter(p => p.MatchingStatus === "매칭 완료").length;
  document.getElementById("company-matching-badge").innerText = `배정 완료: ${matchedCount}명 / 대기: ${projects.length - matchedCount}명`;
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
  const docType = document.getElementById("doc-type-select").value;
  const projectType = appState.currentProject; // Internship, Academy, Mice
  
  let projectCode = "인턴십";
  if (projectType === "Academy") projectCode = "아카데미";
  if (projectType === "Mice") projectCode = "MICE";

  const companyName = "밍글무드";
  const dateStr = getNowDateCompact(); // YYYYMMDD 형태
  
  // 파일 확장자 분리
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  
  // 1) 자동화 네이밍 변환 규칙 적용: [사업구분]_[기업명]_[서류종류]_날짜.확장자
  const normalizedName = `[${projectCode}]_[${companyName}]_[${docType}]_${dateStr}${ext}`;
  
  const documents = db.getTable("Documents_Log");
  const newDocId = `DOC-${String(documents.length + 1).padStart(3, '0')}`;
  const secureDriveUrl = `https://drive.google.com/open?id=1DriveSim_${Math.random().toString(36).substring(2, 10)}`;

  const newDocRow = {
    DocID: newDocId,
    UserID: "company_01",
    CompanyName: companyName,
    DocType: docType,
    OriginalName: file.name,
    SavedName: normalizedName,
    DriveURL: secureDriveUrl,
    Status: "Pending",
    UploadedTime: getNowDateString()
  };

  documents.push(newDocRow);
  db.saveTable("Documents_Log", documents);
  
  // 실시간 구글 시트 쓰기 연계
  if (db.liveMode) {
    await db.writeToGoogleSheets({
      action: "uploadDocument",
      DocID: newDocId,
      UserID: "company_01",
      CompanyName: companyName,
      DocType: docType,
      OriginalName: file.name,
      SavedName: normalizedName,
      DriveURL: secureDriveUrl,
      Status: "Pending"
    });
  }

  // 리렌더링
  renderCompanyDocs();
  
  // 시트 패널을 Documents_Log로 이동하고 방금 추가된 행 반짝이게 설정
  appState.currentSheet = "Documents_Log";
  renderSheetsEmulator(newDocId);
}

// 9. [운영사 관리자 대시보드] 렌더링 로직
function renderOperatorDashboard() {
  // 지표 카드 수치 카운팅 애니메이션 실행
  animateCounters();
  
  // 전체 서류 목록 테이블 렌더링
  renderOperatorDocsTable();
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const speed = target / 40; // 40스텝에 완료
    
    const updateCount = () => {
      count += speed;
      if (count < target) {
        counter.innerText = Math.floor(count).toLocaleString();
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    updateCount();
  });
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
    
    // 시트 모니터 포커싱 및 갱신 효과
    appState.currentSheet = "Documents_Log";
    renderSheetsEmulator(docID);
  }
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
