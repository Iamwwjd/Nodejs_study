// 인증 관련 함수들
module.exports = {
    isOwner: function (request, response) { // isOwner : 사용자가 로그인 한 상태인지 확인하는 함수
      if (request.session.is_logined) { // 로그인 여부 판단 
        return true;
      } else {
        return false; // 로그인 한 상태면 true, 아니면 false
      }
    },
    statusUI: function (request, response) { // 로그인 상태에 따라 인터페이스 반환, exports를 이용해 다른 파일에서 사용
      var authStatusUI = '로그인후 사용 가능합니다'
      if (this.isOwner(request, response)) {
        authStatusUI = `${request.session.nickname}님 환영합니다 | <a href="/auth/logout">로그아웃</a>`; // 로그인 되어있을 경우
      } else {
      return authStatusUI; // 로그인 되어 있지 않은 경우 
      }
    }
  }