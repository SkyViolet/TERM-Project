async function sendMessage() {
  let input = document.getElementById("userInput");
  let message = input.value.trim();
  if (!message) return;

  // 사용자 메시지 표시
  let chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<div style="color:blue">사용자: ${message}</div>`;

  // 서버에 메시지 전송
  let response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message })
  });

  let data = await response.json();

  // 챗봇 답변 표시
  chatbox.innerHTML += `<div style="color:green">챗봇: ${data.reply}</div>`;

  // 입력창 초기화
  input.value = "";
}