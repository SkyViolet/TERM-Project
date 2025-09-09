from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    if "안녕" in user_message:
        bot_reply = "안녕하세요! 저는 간단한 챗봇입니다."
    elif "이름" in user_message:
        bot_reply = "저는 Flask로 만든 챗봇이에요."
    else:
        bot_reply = "그건 아직 잘 모르겠어요."

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)