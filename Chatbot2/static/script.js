// DOM 요소 참조
const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const toast = document.getElementById("toast");

// 키보드 Enter로도 전송
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// 버튼 클릭 전송
sendBtn.addEventListener("click", () => {
  sendMessage();
});

// 메시지 전송 함수 (핵심)
async function sendMessage() {
  const message = input.value.trim();
  if (!message) {
    showToast("메시지를 입력해 주세요.");
    return;
  }

  // UI: 사용자 말풍선 추가
  appendMessage("user", message);

  // UI: 입력창 초기화 + 버튼 잠금
  input.value = "";
  setSending(true);

  // UI: "입력 중..." 타이핑 인디케이터 표시
  const typingId = appendTyping();

  try {
    // 서버에 POST /chat
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    // 응답 JSON 파싱
    const data = await res.json();

    // 타이핑 인디케이터 제거
    removeTyping(typingId);

    if (!res.ok) {
      // 서버에서 4xx/5xx로 온 경우 방어 처리
      appendMessage("bot", data?.reply ?? "서버 오류가 발생했어요.");
    } else {
      appendMessage("bot", data.reply);
    }
  } catch (err) {
    // 네트워크 에러 등
    removeTyping(typingId);
    appendMessage("bot", "네트워크 오류가 발생했어요. 다시 시도해 주세요.");
  } finally {
    // 버튼 잠금 해제
    setSending(false);
    // 스크롤 최하단 고정
    scrollToBottom();
  }
}

// 사용자/봇 말풍선 DOM 추가
function appendMessage(who, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg msg--${who}`;

  const avatar = document.createElement("div");
  avatar.className = "msg__avatar";
  avatar.textContent = who === "user" ? "🧑" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  bubble.textContent = text;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatbox.appendChild(wrap);
  scrollToBottom();
}

// "입력 중..." 인디케이터 추가
function appendTyping() {
  const id = `typing-${Date.now()}`;
  const wrap = document.createElement("div");
  wrap.className = "msg msg--bot";
  wrap.id = id;

  const avatar = document.createElement("div");
  avatar.className = "msg__avatar";
  avatar.textContent = "🤖";

  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  bubble.innerHTML = `<span class="typing">
      <i></i><i></i><i></i>
    </span>`;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatbox.appendChild(wrap);
  scrollToBottom();
  return id;
}

// 타이핑 인디케이터 제거
function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// 전송 중 버튼/입력 상태 제어
function setSending(sending) {
  sendBtn.disabled = sending;
  input.disabled = sending;
}

// 스크롤을 최하단으로
function scrollToBottom() {
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 간단 토스트(상단 알림)
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 1800);
}