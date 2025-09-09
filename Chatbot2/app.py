from flask import Flask, render_template, request, jsonify

# Flask 애플리케이션 생성
# static_folder / template_folder는 기본값(static, templates) 사용
app = Flask(__name__)

# ---------------------------
# 라우트: 메인 페이지
# ---------------------------
@app.route("/", methods=["GET"])
def index():
    """
    - 역할: 채팅 UI가 있는 HTML 페이지 반환
    - 동작: templates/index.html 렌더링
    """
    return render_template("index.html")


# ---------------------------
# 라우트: 챗봇 API
# ---------------------------
@app.route("/chat", methods=["POST"])
def chat():
    """
    - 역할: 프론트엔드에서 보낸 사용자 메시지(JSON)를 받아 응답(JSON)으로 반환
    - 요청 형식: { "message": "사용자 입력 문자열" }
    - 응답 형식: { "reply": "봇의 응답 문자열" }
    """
    data = request.get_json(silent=True)  # JSON 파싱 (오류시 None)
    if not data or "message" not in data:
        # 프론트엔드에서 형식이 잘못 온 경우 방어적 처리
        return jsonify({"reply": "요청 형식이 올바르지 않아요.(message 키 누락)"}), 400

    user_message = str(data["message"]).strip()

    # --- 최소 기능: 아주 단순한 규칙 기반 응답 (나중에 LLM API로 교체 예정)
    if not user_message:
        bot_reply = "내용이 비어 있어요. 뭔가 입력해 주세요!"
    elif "안녕" in user_message or "hello" in user_message.lower():
        bot_reply = "안녕하세요! 1단계 데모봇입니다. 😊"
    elif "이름" in user_message:
        bot_reply = "저는 Flask로 만든 간단한 챗봇이에요."
    elif "도움" in user_message or "help" in user_message.lower():
        bot_reply = "지금은 간단한 규칙 기반이에요. 곧 OpenAI/Gemini로 진짜 대화형으로 업그레이드될 거예요!"
    else:
        # 규칙에 걸리지 않으면 기본 응답
        bot_reply = "아직 그건 잘 몰라요. (1단계 데모 응답)"

    # JSON 응답 반환
    return jsonify({"reply": bot_reply})


# ---------------------------
# 앱 실행 (개발용)
# ---------------------------
if __name__ == "__main__":
    # debug=True: 코드 변경 시 자동 리로드, 에러 페이지 표시
    # host="0.0.0.0": 같은 네트워크의 다른 기기에서 접속 가능(선택)
    app.run(debug=True, host="127.0.0.1", port=5000)