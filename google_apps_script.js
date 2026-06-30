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
  if (sheetUsers.getLastRow() === 0) {
    sheetUsers.appendRow(["UserID", "Name", "Role", "Email", "Password", "ActiveState", "School", "EnrollmentStatus", "Major", "Grade", "Residence"]);
  } else {
    // 기존 데이터가 있을 때: School 헤더가 없으면 5개 헤더 추가
    var headers = sheetUsers.getRange(1, 1, 1, sheetUsers.getLastColumn()).getValues()[0];
    if (headers.indexOf("School") === -1) {
      var newCol = sheetUsers.getLastColumn() + 1;
      sheetUsers.getRange(1, newCol, 1, 5).setValues([["School", "EnrollmentStatus", "Major", "Grade", "Residence"]]);
    }
  }
  
  // 2) Project_Status 탭 초기화
  var sheetProjects = ss.getSheetByName("Project_Status") || ss.insertSheet("Project_Status");
  if (sheetProjects.getLastRow() === 0) {
    sheetProjects.appendRow(["ProjectType", "UserID", "Stage", "MatchingStatus", "ProgressPercent", "RegistrationNo", "UpdateTime"]);
  }
  
  // 3) Documents_Log 탭 초기화
  var sheetDocs = ss.getSheetByName("Documents_Log") || ss.insertSheet("Documents_Log");
  if (sheetDocs.getLastRow() === 0) {
    sheetDocs.appendRow(["DocID", "UserID", "CompanyName", "DocType", "OriginalName", "SavedName", "DriveURL", "Status", "UploadedTime"]);
  }

  // 4) Registered_Users 탭 초기화 (신규 가입자 저장용)
  var sheetReg = ss.getSheetByName("Registered_Users") || ss.insertSheet("Registered_Users");
  if (sheetReg.getLastRow() === 0) {
    sheetReg.appendRow(["UserID", "Role", "Name", "Phone", "Birthdate", "Email", "CompanyName", "ContactPerson", "Password", "RegisteredTime", "School", "EnrollmentStatus", "Major", "Grade", "Residence"]);
  } else {
    // 기존 데이터가 있을 때: School 헤더가 없으면 5개 헤더 추가
    var headersReg = sheetReg.getRange(1, 1, 1, sheetReg.getLastColumn()).getValues()[0];
    if (headersReg.indexOf("School") === -1) {
      var newColReg = sheetReg.getLastColumn() + 1;
      sheetReg.getRange(1, newColReg, 1, 5).setValues([["School", "EnrollmentStatus", "Major", "Grade", "Residence"]]);
    }
  }

  // 5) Application_Status 탭 초기화 (사업 신청 현황 + 승인 필드)
  var sheetApply = ss.getSheetByName("Application_Status") || ss.insertSheet("Application_Status");
  if (sheetApply.getLastRow() === 0) {
    sheetApply.appendRow(["ApplyID", "UserID", "ProjectType", "ApplyTime", "Approval"]);
  } else {
    // 기존 데이터가 있을 때: Approval 헤더가 없으면 추가
    var headers = sheetApply.getRange(1, 1, 1, sheetApply.getLastColumn()).getValues()[0];
    if (headers.indexOf("Approval") === -1) {
      var newCol = sheetApply.getLastColumn() + 1;
      sheetApply.getRange(1, newCol).setValue("Approval");
    }
  }

  // 6) Admin_Dashboard 탭 초기화 (관리자 예산 및 목표 인원 관리)
  var sheetAdmin = ss.getSheetByName("Admin_Dashboard") || ss.insertSheet("Admin_Dashboard");
  if (sheetAdmin.getLastRow() === 0) {
    sheetAdmin.appendRow(["TotalBudget", "ExecutedBudget", "RemainingBudget", "InternGoal", "LastUpdated"]);
    var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
    sheetAdmin.appendRow([0, 0, 0, 30, nowStr]);
  }

  // 7) Notices 탭 초기화 (공지사항 관리용)
  var sheetNotices = ss.getSheetByName("Notices") || ss.insertSheet("Notices");
  if (sheetNotices.getLastRow() === 0) {
    sheetNotices.appendRow(["NoticeID", "ProjectType", "Title", "Content", "Date"]);
  }

  // 8) Academy_Attendance 탭 초기화 (아카데미 출석부)
  var sheetAttendance = ss.getSheetByName("Academy_Attendance") || ss.insertSheet("Academy_Attendance");
  if (sheetAttendance.getLastRow() === 0) {
    sheetAttendance.appendRow(["UserID", "Name", "Session1", "Session2", "Session3", "Session4", "Session5"]);
  }

  // 9) Inquiries 탭 초기화 (관리자 문의하기)
  var sheetInquiries = ss.getSheetByName("Inquiries") || ss.insertSheet("Inquiries");
  if (sheetInquiries.getLastRow() === 0) {
    sheetInquiries.appendRow(["InquiryID", "UserID", "Role", "Title", "Content", "Date", "Status"]);
  }

  // 10) Document_Templates 탭 초기화 (제출 서류 양식 다운로드용)
  var sheetTemplates = ss.getSheetByName("Document_Templates") || ss.insertSheet("Document_Templates");
  if (sheetTemplates.getLastRow() === 0) {
    sheetTemplates.appendRow(["TemplateID", "DocType", "FileName", "DriveURL"]);
  }

  // 11) 기본 '시트1' 또는 'Sheet1'이 있으면 삭제
  var defaultSheet1 = ss.getSheetByName("시트1");
  var defaultSheet2 = ss.getSheetByName("Sheet1");
  if (defaultSheet1 && ss.getSheets().length > 1) ss.deleteSheet(defaultSheet1);
  if (defaultSheet2 && ss.getSheets().length > 1) ss.deleteSheet(defaultSheet2);

  Logger.log("Antigravity PMS Sheets initialized successfully!");
}

// 2. 이메일 발송 관련 헬퍼 함수
function getUserEmail(userId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName("Master_Users");
  if (!masterSheet) return null;
  var data = masterSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return data[i][3]; // Email is column 4 (index 3)
    }
  }
  return null;
}

function sendNotificationEmail(email, status) {
  if (!email) return;
  var subject = "[부산관광공사] 인재양성 일자리 사업 신청 결과 안내";
  var resultText = "결과";
  if (status === "Y" || status === "Approved") {
    resultText = "합격";
  } else if (status === "N" || status === "Rejected") {
    resultText = "불합격";
  }
  
  var body = "안녕하세요. 2026 인재양성 일자리 사업에 신청해 주셔서 감사합니다.\n신청 결과 [" + resultText + "] 하셨습니다.";
  
  try {
    MailApp.sendEmail(email, subject, body);
  } catch(e) {
    // Ignore error
  }
}

function sendAdminNotificationEmail(subject, body) {
  var admins = ["jijeongin53@gmail.com", "wjddjs9919@gmail.com"];
  for (var i = 0; i < admins.length; i++) {
    try {
      MailApp.sendEmail(admins[i], subject, body);
    } catch(e) {
      // Ignore error
    }
  }
}

// 3. CORS 헤더 지원을 위한 응답 래퍼 함수
function makeJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// 4. API - GET 요청 처리 (데이터 일괄 조회)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 10개 탭에서 데이터를 읽어와 JSON으로 반환
    var sheets = ["Master_Users", "Project_Status", "Documents_Log", "Registered_Users", "Application_Status", "Admin_Dashboard", "Notices", "Academy_Attendance", "Inquiries", "Document_Templates"];
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
        // 하위 호환성: 헤더에 Password가 없다면 강제로 세팅
        if (headers.indexOf("Password") === -1) {
          if (sheetName === "Master_Users" && values[i].length >= 5) {
            rowData["Password"] = values[i][4];
          } else if (sheetName === "Registered_Users" && values[i].length >= 10) {
            rowData["Password"] = values[i][8];
          }
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

// 5. API - POST 요청 처리 (데이터 수정 및 추가)
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
    
    if (action === "addNotice") {
      var sheet = ss.getSheetByName("Notices");
      if (!sheet) {
        sheet = ss.insertSheet("Notices");
        sheet.appendRow(["NoticeID", "ProjectType", "Title", "Content", "Date"]);
      }
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      var noticeId = "NOTICE-" + Date.now();
      
      sheet.appendRow([
        noticeId,
        postData.ProjectType || "All",
        postData.Title || "",
        postData.Content || "",
        nowStr
      ]);
      
      return makeJsonResponse({ success: true, message: "Notice added successfully" });
      
    } else if (action === "updateAttendance") {
      // 아카데미 출석 상태 업데이트
      var sheet = ss.getSheetByName("Academy_Attendance");
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === postData.UserID) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow !== -1) {
        // 기존 행 업데이트
        sheet.getRange(foundRow, 3).setValue(postData.Session1 || 0);
        sheet.getRange(foundRow, 4).setValue(postData.Session2 || 0);
        sheet.getRange(foundRow, 5).setValue(postData.Session3 || 0);
        sheet.getRange(foundRow, 6).setValue(postData.Session4 || 0);
        sheet.getRange(foundRow, 7).setValue(postData.Session5 || 0);
      } else {
        // 새 행 삽입
        sheet.appendRow([
          postData.UserID,
          postData.Name || "",
          postData.Session1 || 0,
          postData.Session2 || 0,
          postData.Session3 || 0,
          postData.Session4 || 0,
          postData.Session5 || 0
        ]);
      }
      
      // Project_Status의 ProgressPercent 도 동기화
      var projSheet = ss.getSheetByName("Project_Status");
      var projValues = projSheet.getDataRange().getValues();
      var projRow = -1;
      for (var j = 1; j < projValues.length; j++) {
        if (projValues[j][0] === "Academy" && projValues[j][1] === postData.UserID) {
          projRow = j + 1;
          break;
        }
      }
      
      var attendedCount = (parseInt(postData.Session1)||0) + (parseInt(postData.Session2)||0) + (parseInt(postData.Session3)||0) + (parseInt(postData.Session4)||0) + (parseInt(postData.Session5)||0);
      var progressStr = (attendedCount * 20).toString();
      
      if (projRow !== -1) {
        projSheet.getRange(projRow, 5).setValue(progressStr); // ProgressPercent 업데이트
        projSheet.getRange(projRow, 7).setValue(Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss")); // UpdateTime
      }
      
      return makeJsonResponse({ success: true, message: "Attendance updated successfully" });
      
    } else if (action === "updateProject") {
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
        
        // [추가] 서류 승인 시 Project_Status 업데이트
        if (postData.Status === "승인" || postData.Status === "Approved") {
          var docType = values[foundRow - 1][3]; // DocType
          var docUserId = values[foundRow - 1][1]; // UserID
          if (docType === "인턴십_참여신청서") {
            var projSheet = ss.getSheetByName("Project_Status");
            if (projSheet) {
              var pData = projSheet.getDataRange().getValues();
              var projFound = false;
              for (var k = 1; k < pData.length; k++) {
                if (pData[k][0] === "Internship" && pData[k][1] === docUserId) {
                  projSheet.getRange(k + 1, 3).setValue("면접전형");
                  projSheet.getRange(k + 1, 4).setValue("서류통과");
                  projSheet.getRange(k + 1, 5).setValue("50");
                  projFound = true;
                  break;
                }
              }
              if (!projFound) {
                var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
                projSheet.appendRow(["Internship", docUserId, "면접전형", "서류통과", "50", "N/A", nowStr]);
              }
            }
          }
        }
        
        // 이메일 발송 연동
        var targetUserId = values[foundRow - 1][1];
        var email = getUserEmail(targetUserId);
        if (email) {
          sendNotificationEmail(email, postData.Status);
        }
        
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
      
      var subject = "[알림] 서류 제출 완료";
      var body = "기업이 서류를 제출했습니다.\n- 기업명: " + postData.CompanyName + "\n- 서류 종류: " + postData.DocType;
      sendAdminNotificationEmail(subject, body);
      
      return makeJsonResponse({ success: true, message: "Document logged successfully" });
      
    } else if (action === "registerUser") {
      // 신규 회원가입 기록
      var sheet = ss.getSheetByName("Registered_Users");
      if (!sheet) {
        sheet = ss.insertSheet("Registered_Users");
        sheet.appendRow(["UserID", "Role", "Name", "Phone", "Birthdate", "Email", "CompanyName", "ContactPerson", "Password", "RegisteredTime"]);
      }
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      
      sheet.appendRow([
        postData.UserID,
        postData.Role,
        postData.Name || "",
        postData.Phone || "",
        postData.Birthdate || "",
        postData.Email || "",
        postData.CompanyName || "",
        postData.ContactPerson || "",
        postData.Password || "",
        nowStr,
        postData.School || "",
        postData.EnrollmentStatus || "",
        postData.Major || "",
        postData.Grade || "",
        postData.Residence || ""
      ]);
      
      // 즉시 로그인을 위해 Master_Users 에도 등록
      var masterSheet = ss.getSheetByName("Master_Users");
      if (!masterSheet) {
        masterSheet = ss.insertSheet("Master_Users");
        masterSheet.appendRow(["UserID", "Name", "Role", "Email", "Password", "ActiveState"]);
      }
      var displayName = postData.Role === "Company" ? postData.CompanyName : postData.Name;
      masterSheet.appendRow([
        postData.UserID,
        displayName,
        postData.Role,
        postData.Email || "",
        postData.Password || "",
        "Active",
        postData.School || "",
        postData.EnrollmentStatus || "",
        postData.Major || "",
        postData.Grade || "",
        postData.Residence || ""
      ]);
      
      // 인턴 가입 시 기본 프로젝트 현황 및 아카데미 출석부 자동 생성
      if (postData.Role === "Intern") {
        var projSheet = ss.getSheetByName("Project_Status");
        if (projSheet) {
          projSheet.appendRow(["Internship", postData.UserID, "참가신청", "신청 대기", "0", "N/A", nowStr]);
          projSheet.appendRow(["Academy", postData.UserID, "모집 마감", "모집 마감", "0", "N/A", nowStr]);
          projSheet.appendRow(["Mice", postData.UserID, "모집공고", "신청 대기", "0", "N/A", nowStr]);
        }
        
        var attSheet = ss.getSheetByName("Academy_Attendance");
        if (attSheet) {
          attSheet.appendRow([postData.UserID, displayName, 0, 0, 0, 0, 0]);
        }
      }
      
      var subject = "[알림] 신규 회원 가입";
      var body = "새로운 회원이 가입했습니다.\n- 아이디: " + postData.UserID + "\n- 역할: " + postData.Role + "\n- 이름/기업명: " + (postData.Name || postData.CompanyName);
      sendAdminNotificationEmail(subject, body);
      
      return makeJsonResponse({ success: true, message: "User registered successfully" });
      
    } else if (action === "uploadRealFile") {
      var folderId = postData.folderId;
      var fileData = postData.fileData; // base64 string
      var fileName = postData.fileName;
      var mimeType = postData.mimeType;
      
      // base64 prefix 제거 (e.g. "data:application/pdf;base64,JVBER...")
      var base64Str = fileData;
      if (fileData.indexOf("base64,") !== -1) {
        base64Str = fileData.split("base64,")[1];
      }
      
      var blob = Utilities.newBlob(Utilities.base64Decode(base64Str), mimeType, fileName);
      var folder = DriveApp.getFolderById(folderId);
      var file = folder.createFile(blob);
      var driveUrl = file.getUrl();
      
      // 구글 시트에도 로깅
      var sheet = ss.getSheetByName("Documents_Log");
      if (!sheet) {
        sheet = ss.insertSheet("Documents_Log");
        sheet.appendRow(["DocID", "UserID", "CompanyName", "DocType", "OriginalName", "SavedName", "DriveURL", "Status", "UploadedTime"]);
      }
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      
      sheet.appendRow([
        postData.DocID,
        postData.UserID,
        postData.CompanyName,
        postData.DocType,
        postData.OriginalName,
        fileName,
        driveUrl,
        "Approved",
        nowStr
      ]);
      
      var subject = "[알림] 서류 제출 완료";
      var body = "기업이 서류를 제출했습니다.\n- 기업명: " + postData.CompanyName + "\n- 서류 종류: " + postData.DocType + "\n- 파일명: " + fileName;
      sendAdminNotificationEmail(subject, body);
      
      return makeJsonResponse({ success: true, url: driveUrl });
      
    } else if (action === "updatePipelineStage") {
      var sheet = ss.getSheetByName("Project_Status");
      if (sheet) {
        var values = sheet.getDataRange().getValues();
        var headers = values[0];
        
        // PipelineStage 컬럼 찾기 (없으면 끝에 추가)
        var pipelineColIdx = headers.indexOf("PipelineStage");
        if (pipelineColIdx === -1) {
          pipelineColIdx = headers.length;
          sheet.getRange(1, pipelineColIdx + 1).setValue("PipelineStage");
        }
        
        for (var i = 1; i < values.length; i++) {
          if (values[i][1] === postData.UserID && values[i][0] === "Internship") {
            sheet.getRange(i + 1, pipelineColIdx + 1).setValue(postData.PipelineStage);
            
            // 5단계 이상(사업 완료)일 경우 호환성을 위해 매칭 완료 처리
            if (postData.PipelineStage >= 5) {
              sheet.getRange(i + 1, 4).setValue("매칭 완료"); // MatchingStatus (4번째 열)
            }
            break;
          }
        }
      }
      return makeJsonResponse({ success: true, message: "Pipeline updated" });

    } else if (action === "applyToCompany") {
      var sheet = ss.getSheetByName("Project_Status");
      if (!sheet) {
        sheet = ss.insertSheet("Project_Status");
        sheet.appendRow(["ProjectType", "UserID", "Stage", "MatchingStatus", "ProgressPercent", "RegistrationNo", "UpdateTime", "CompanyID", "PipelineStage"]);
      }
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      
      // Ensure CompanyID column exists
      var headers = sheet.getDataRange().getValues()[0];
      if (headers.indexOf("CompanyID") === -1) {
        sheet.getRange(1, headers.length + 1).setValue("CompanyID");
        sheet.getRange(1, headers.length + 2).setValue("PipelineStage");
      }
      
      sheet.appendRow([
        postData.ProjectType,
        postData.UserID,
        "지원완료",
        "지원 접수",
        "0",
        "N/A",
        nowStr,
        postData.CompanyID,
        0
      ]);
      return makeJsonResponse({ success: true, message: "Applied to company successfully" });

    } else if (action === "cancelCompanyApplication") {
      var sheet = ss.getSheetByName("Project_Status");
      if (!sheet) return makeJsonResponse({ success: false, error: "Sheet not found" });
      
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var projTypeIdx = headers.indexOf("ProjectType");
      var userIdIdx = headers.indexOf("UserID");
      var companyIdIdx = headers.indexOf("CompanyID");
      
      var found = false;
      if (projTypeIdx !== -1 && userIdIdx !== -1 && companyIdIdx !== -1) {
        for (var i = 1; i < data.length; i++) {
          if (data[i][projTypeIdx] === postData.ProjectType && data[i][userIdIdx] === postData.UserID && data[i][companyIdIdx] === postData.CompanyID) {
            sheet.deleteRow(i + 1);
            found = true;
            break;
          }
        }
      }
      
      if (found) {
        return makeJsonResponse({ success: true, message: "Application canceled successfully" });
      } else {
        return makeJsonResponse({ success: false, error: "Application not found" });
      }

    } else if (action === "applyProgram") {
      // 신규 사업 신청 기록
      var sheet = ss.getSheetByName("Application_Status");
      if (!sheet) {
        sheet = ss.insertSheet("Application_Status");
        sheet.appendRow(["ApplyID", "UserID", "ProjectType", "ApplyTime", "Approval"]);
      }
      
      // 중복 방지 (Backend 검증)
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][1] === postData.UserID && values[i][2] === postData.ProjectType) {
          return makeJsonResponse({ success: false, error: "Already applied" });
        }
      }
      
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      var applyId = "APP-" + Date.now();
      
      sheet.appendRow([
        applyId,
        postData.UserID,
        postData.ProjectType,
        nowStr,
        ""
      ]);
      
      var subject = "[알림] 프로그램 신청 접수";
      var body = "청년 회원이 프로그램을 신청했습니다.\n- 아이디: " + postData.UserID + "\n- 신청 프로그램: " + postData.ProjectType;
      sendAdminNotificationEmail(subject, body);
      
      return makeJsonResponse({ success: true, message: "Application submitted successfully" });
      
    } else if (action === "updateApplicationApproval") {
      // 관리자 - 사업 신청 승인 상태 업데이트
      var sheet = ss.getSheetByName("Application_Status");
      if (!sheet) return makeJsonResponse({ success: false, error: "Sheet not found" });
      
      var applyId = postData.ApplyID;
      var newStatus = postData.Approval;
      
      var data = sheet.getDataRange().getValues();
      var found = false;
      var targetUserId = null;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === applyId) {
          sheet.getRange(i + 1, 5).setValue(newStatus);
          
          // 승인 시 Project_Status 업데이트
          var projType = data[i][2];
          var userId = data[i][1];
          targetUserId = userId;
          if (newStatus === "Y") {
            var projSheet = ss.getSheetByName("Project_Status");
            if (projSheet) {
              var pData = projSheet.getDataRange().getValues();
              var pFound = false;
              for (var j = 1; j < pData.length; j++) {
                if (pData[j][0] === projType && pData[j][1] === userId) {
                  if (projType === "Internship") {
                    projSheet.getRange(j + 1, 3).setValue("서류제출");
                    projSheet.getRange(j + 1, 4).setValue("승인완료");
                    projSheet.getRange(j + 1, 5).setValue("25");
                  } else if (projType === "Mice") {
                    projSheet.getRange(j + 1, 3).setValue("서류합격");
                    projSheet.getRange(j + 1, 4).setValue("진행중");
                    projSheet.getRange(j + 1, 5).setValue("50");
                  }
                  pFound = true;
                  break;
                }
              }
              if (!pFound) {
                var pNowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
                if (projType === "Internship") {
                  projSheet.appendRow(["Internship", userId, "서류제출", "승인완료", "25", "N/A", pNowStr]);
                } else if (projType === "Mice") {
                  projSheet.appendRow(["Mice", userId, "서류합격", "진행중", "50", "N/A", pNowStr]);
                } else {
                  projSheet.appendRow([projType, userId, "승인됨", "진행중", "0", "N/A", pNowStr]);
                }
              }
            }
          }
          found = true;
          break;
        }
      }
      
      if (found) {
        // 이메일 발송 연동
        var email = getUserEmail(targetUserId);
        if (email) {
          sendNotificationEmail(email, newStatus);
        }
        return makeJsonResponse({ success: true, message: "Application approval updated successfully" });
      } else {
        return makeJsonResponse({ success: false, error: "Application not found" });
      }
      
    } else if (action === "updateBudget") {
      // 관리자 예산 업데이트
      var sheet = ss.getSheetByName("Admin_Dashboard");
      if (!sheet) {
        sheet = ss.insertSheet("Admin_Dashboard");
        sheet.appendRow(["TotalBudget", "ExecutedBudget", "RemainingBudget", "InternGoal", "LastUpdated"]);
        sheet.appendRow([0, 0, 0, 30, ""]);
      }
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      var totalBudget = Number(postData.TotalBudget) || 0;
      var executedBudget = Number(postData.ExecutedBudget) || 0;
      var remainingBudget = totalBudget - executedBudget;
      var internGoal = Number(postData.InternGoal) || 30;
      
      sheet.getRange(2, 1).setValue(totalBudget);
      sheet.getRange(2, 2).setValue(executedBudget);
      sheet.getRange(2, 3).setValue(remainingBudget);
      sheet.getRange(2, 4).setValue(internGoal);
      sheet.getRange(2, 5).setValue(nowStr);
      
      return makeJsonResponse({ success: true, message: "Budget updated successfully" });
      
    } else if (action === "submitInquiry") {
      // 관리자 문의하기 제출
      var sheet = ss.getSheetByName("Inquiries");
      if (!sheet) {
        sheet = ss.insertSheet("Inquiries");
        sheet.appendRow(["InquiryID", "UserID", "Role", "Title", "Content", "Date", "Status"]);
      }
      var nowStr = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
      var inquiryId = "INQ-" + Date.now();
      
      sheet.appendRow([
        inquiryId,
        postData.UserID,
        postData.Role,
        postData.Title,
        postData.Content,
        nowStr,
        "Pending"
      ]);
      
      return makeJsonResponse({ success: true, message: "Inquiry submitted successfully" });
    }
    
    return makeJsonResponse({ success: false, error: "Unknown action: " + action });
  } catch (error) {
    return makeJsonResponse({ success: false, error: error.toString() });
  }
}
