/**
 * ==========================================================================
 * BUSAN TOURISM PMS - GOOGLE APPS SCRIPT API GATEWAY (google_apps_script.js)
 * ==========================================================================
 * [사용 방법]
 * 1. 구글 시트(1izKpNWL9SYATmVTvVygakzZIaCxmb7BoD9XKDY0nsus)의 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭.
 * 2. 기존 코드를 모두 지우고 이 스크립트 전체를 복사하여 붙여넣습니다.
 * 3. 상단 디스크 모양 아이콘(저장)을 클릭합니다.
 * 4. 실행할 함수를 'initializeSheets'로 선택하고 [실행 (▶)] 버튼을 누릅니다.
 *    (권한 검토 요청 시, 계정 선택 -> 고급 -> 이동(안전하지 않음) -> 허용 클릭)
 * 5. 웹앱 연동(선택): 우측 상단 [배포] -> [새 배포] -> 유형 [웹 앱] -> 액세스 권한 [모든 사람] 설정 후 배포하여 나온 URL을 복사합니다.
 */

// 1. 구글 시트 탭 및 초기 데이터 세팅 함수 (단 한 번 실행)
function initializeSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1) Master_Users 탭 초기화
  var sheetUsers = ss.getSheetByName("Master_Users") || ss.insertSheet("Master_Users");
  sheetUsers.clear();
  sheetUsers.appendRow(["UserID", "Name", "Role", "Email", "ActiveState"]);
  var initialUsers = [
    ["intern_01", "홍길동", "Intern", "hong@gmail.com", "Active"],
    ["intern_02", "김영희", "Intern", "young@gmail.com", "Active"],
    ["intern_03", "이철수", "Intern", "chul@gmail.com", "Active"],
    ["company_01", "밍글무드", "Company", "contact@minglemood.com", "Active"],
    ["operator_01", "부산관광공사 & 밍글무드", "Operator", "pms@visitbusan.or.kr", "Active"]
  ];
  initialUsers.forEach(function(row) {
    sheetUsers.appendRow(row);
  });
  
  // 2) Project_Status 탭 초기화
  var sheetProjects = ss.getSheetByName("Project_Status") || ss.insertSheet("Project_Status");
  sheetProjects.clear();
  sheetProjects.appendRow(["ProjectType", "UserID", "Stage", "MatchingStatus", "ProgressPercent", "RegistrationNo", "UpdateTime"]);
  var initialProjects = [
    ["Internship", "intern_01", "서류심사", "심사 중", "25", "N/A", "2026-05-20 10:00:00"],
    ["Academy", "intern_01", "수강중", "진행중", "80", "N/A", "2026-05-19 14:00:00"],
    ["Mice", "intern_01", "모집공고", "신청 대기", "10", "MICE-2026-0042", "2026-05-20 09:30:00"],
    ["Internship", "intern_02", "최종매칭", "매칭 완료", "100", "N/A", "2026-05-18 11:20:00"],
    ["Internship", "intern_03", "면접전형", "면접 대기", "50", "N/A", "2026-05-20 08:15:00"]
  ];
  initialProjects.forEach(function(row) {
    sheetProjects.appendRow(row);
  });
  
  // 3) Documents_Log 탭 초기화
  var sheetDocs = ss.getSheetByName("Documents_Log") || ss.insertSheet("Documents_Log");
  sheetDocs.clear();
  sheetDocs.appendRow(["DocID", "UserID", "CompanyName", "DocType", "OriginalName", "SavedName", "DriveURL", "Status", "UploadedTime"]);
  var initialDocs = [
    ["DOC-001", "company_01", "밍글무드", "사업자등록증", "biz_license_2026.pdf", "[인턴십]_[밍글무드]_[사업자등록증]_20260518.pdf", "https://drive.google.com/open?id=1A_B_C_Drive_Biz", "Approved", "2026-05-18 10:15:00"],
    ["DOC-002", "company_01", "밍글무드", "참여신청서", "apply_form_minglemood.docx", "[인턴십]_[밍글무드]_[참여신청서]_20260519.pdf", "https://drive.google.com/open?id=1X_Y_Z_Drive_Apply", "Pending", "2026-05-19 14:30:00"],
    ["DOC-003", "company_01", "밍글무드", "매칭협약서", "agreement_draft.pdf", "[인턴십]_[밍글무드]_[매칭협약서]_20260520.pdf", "https://drive.google.com/open?id=1K_L_M_Drive_Agreement", "Rejected", "2026-05-20 09:12:00"]
  ];
  initialDocs.forEach(function(row) {
    sheetDocs.appendRow(row);
  });

  // 4) 기본 '시트1' 또는 'Sheet1'이 있으면 삭제
  var defaultSheet1 = ss.getSheetByName("시트1");
  var defaultSheet2 = ss.getSheetByName("Sheet1");
  if (defaultSheet1 && ss.getSheets().length > 1) ss.deleteSheet(defaultSheet1);
  if (defaultSheet2 && ss.getSheets().length > 1) ss.deleteSheet(defaultSheet2);

  Logger.log("Antigravity PMS Sheets initialized successfully!");
}

// 2. CORS 헤더 지원을 위한 응답 래퍼 함수
function makeJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// 3. API - GET 요청 처리 (데이터 일괄 조회)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 3개 탭에서 데이터를 읽어와 JSON으로 반환
    var sheets = ["Master_Users", "Project_Status", "Documents_Log"];
    var result = {};
    
    sheets.forEach(function(sheetName) {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        result[sheetName] = [];
        return;
      }
      var values = sheet.getDataRange().getValues();
      var headers = values[0];
      var rows = [];
      
      for (var i = 1; i < values.length; i++) {
        var rowData = {};
        for (var j = 0; j < headers.length; j++) {
          rowData[headers[j]] = values[i][j];
        }
        rows.push(rowData);
      }
      result[sheetName] = rows;
    });
    
    return makeJsonResponse({ success: true, data: result });
  } catch (error) {
    return makeJsonResponse({ success: false, error: error.toString() });
  }
}

// 4. API - POST 요청 처리 (데이터 수정 및 추가)
function doPost(e) {
  try {
    var postData;
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      // 폼 파라미터 백업 지원
      postData = e.parameter;
    }
    
    var action = postData.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "updateProject") {
      // 프로젝트 상태 업데이트 (또는 없으면 추가)
      var sheet = ss.getSheetByName("Project_Status");
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      // 기존에 동일 ProjectType과 UserID가 매칭되는 행이 있는지 탐색
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === postData.ProjectType && values[i][1] === postData.UserID) {
          foundRow = i + 1; // 1-indexed
          break;
        }
      }
      
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      
      if (foundRow !== -1) {
        // 기존 행 업데이트
        sheet.getRange(foundRow, 3).setValue(postData.Stage); // Stage
        sheet.getRange(foundRow, 4).setValue(postData.MatchingStatus); // MatchingStatus
        sheet.getRange(foundRow, 5).setValue(postData.ProgressPercent); // ProgressPercent
        sheet.getRange(foundRow, 6).setValue(postData.RegistrationNo || "N/A"); // RegistrationNo
        sheet.getRange(foundRow, 7).setValue(nowStr); // UpdateTime
      } else {
        // 새 행 삽입
        sheet.appendRow([
          postData.ProjectType,
          postData.UserID,
          postData.Stage,
          postData.MatchingStatus,
          postData.ProgressPercent,
          postData.RegistrationNo || "N/A",
          nowStr
        ]);
      }
      return makeJsonResponse({ success: true, message: "Project updated successfully" });
      
    } else if (action === "updateDocumentStatus") {
      // 서류 승인/반려 처리
      var sheet = ss.getSheetByName("Documents_Log");
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === postData.DocID) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow !== -1) {
        sheet.getRange(foundRow, 8).setValue(postData.Status); // Status 필드 업데이트
        return makeJsonResponse({ success: true, message: "Document status updated" });
      } else {
        return makeJsonResponse({ success: false, error: "Document ID not found: " + postData.DocID });
      }
      
    } else if (action === "uploadDocument") {
      // 신규 서류 정보 업로드 기록
      var sheet = ss.getSheetByName("Documents_Log");
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      
      sheet.appendRow([
        postData.DocID,
        postData.UserID,
        postData.CompanyName,
        postData.DocType,
        postData.OriginalName,
        postData.SavedName,
        postData.DriveURL,
        postData.Status,
        nowStr
      ]);
      return makeJsonResponse({ success: true, message: "Document logged successfully" });
    }
    
    return makeJsonResponse({ success: false, error: "Unknown action: " + action });
  } catch (error) {
    return makeJsonResponse({ success: false, error: error.toString() });
  }
}
