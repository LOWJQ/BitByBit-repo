document.addEventListener("DOMContentLoaded", () => {
  const aiFaceEnabled =
    sessionStorage.getItem("aiFaceEnabled") === "true";

  if (aiFaceEnabled) {
    alert("AI Face is active. Your privacy is protected.");
    // 在视频中展示虚拟头像逻辑（可以在这里添加具体实现）
  } else {
    alert("AI Face is not enabled. Your real face will be visible.");
  }
});

let currentAction = "";
let isMeetingLocked = false;

// List of inappropriate words to filter
const inappropriateWords = ["fuck", "shit", "damn", "bitch"]; // You can add more words here

// Chat-related variables
let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const messageHistory = document.getElementById("message-history");
const lockButton = document.getElementById("lock-button");

// Function to toggle chat box visibility
function toggleChat() {
  chatBox.style.display =
    chatBox.style.display === "none" ? "block" : "none";
  renderMessages();
}

// Function to render the chat messages
function renderMessages() {
  messageHistory.innerHTML = "";
  chatMessages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageHistory.appendChild(messageElement);
  });
}

// Function to check for inappropriate words in the input
function checkMessage(event) {
  const message = event.target.value;
  for (let word of inappropriateWords) {
    if (message.includes(word)) {
      event.target.value = message.replace(word, "[Inappropriate Word]");
      return;
    }
  }
}

// Function to send the message on pressing Enter key
function sendMessageOnEnter(event) {
  if (event.key === "Enter") {
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
    }
  }
}

// Function to send a message
function sendMessage(message) {
  for (let word of inappropriateWords) {
    if (message.includes(word)) {
      alert(
        "Message contains inappropriate content and will not be sent."
      );
      return;
    }
  }
  chatMessages.push(message);
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
  renderMessages();
  chatInput.value = ""; // Clear the input field
}

// Function to lock or unlock the meeting
function lockMeeting() {
  isMeetingLocked = !isMeetingLocked;

  // Toggle the button text between "Lock Meeting" and "Unlock Meeting"
  if (isMeetingLocked) {
    lockButton.textContent = "🔓 Unlock Meeting"; // Change button text when locked
    alert("Meeting is now locked. No new participants can join.");
  } else {
    lockButton.textContent = "🔒 Lock Meeting"; // Change button text when unlocked
    alert("Meeting is now unlocked. New participants can join.");
  }
}

const urlParams = new URLSearchParams(window.location.search);
const meetingID = urlParams.get("meetingID");

if (meetingID) {
  // Store the meeting ID in localStorage
  localStorage.setItem("meetingID", meetingID);
}

// Call the function to display the Meeting ID on the page
meetingIdDisplay();

// Function to display the Meeting ID
function meetingIdDisplay() {
  const meetingID = localStorage.getItem("meetingID");
  const meetingIdDisplayElement =
    document.getElementById("meeting-id-display");

  if (meetingIdDisplayElement) {
    meetingIdDisplayElement.textContent = meetingID
      ? `Meeting ID: ${meetingID}`
      : "No Meeting ID provided.";
  } else {
    console.error("Meeting ID element not found.");
  }
}

// Function to show the confirmation modal
function confirmAction(action) {
  currentAction = action;
  const modalText = document.getElementById("modal-text");
  modalText.textContent =
    action === "microphone"
      ? "Are you sure you want to enable the microphone?"
      : "Are you sure you want to enable the camera?";
  document.getElementById("confirmation-modal").style.display = "flex";
}

// Function to perform the action
function performAction() {
  alert(`You have enabled the ${currentAction}.`);
  closeModal();
}

// Function to close the modal
function closeModal() {
  document.getElementById("confirmation-modal").style.display = "none";
}

//Function to leave the meeting
function leave() {
  alert("You have leave the meeting");
  window.location.href = `dashboard.html`;
}

function goToPrivateInterview() {
  window.location.href = "private_interview.html";
}

// Function to start screen share
function startScreenShare() {
  const screenShareContainer = document.getElementById("screen-share-container");
  const screenShareVideo = document.getElementById("screen-share-video");

  // Display the screen share container
  screenShareContainer.style.display = "block";

  // Get the screen share stream
  navigator.mediaDevices.getDisplayMedia({ video: true })
    .then((stream) => {
      // Attach the screen share stream to the video element
      screenShareVideo.srcObject = stream;

      // Listen for when the screen share ends
      stream.getVideoTracks()[0].onended = function () {
        screenShareContainer.style.display = "none"; // Hide the screen share container when the stream ends
      };
    })
    .catch((error) => {
      console.error("Error sharing screen: ", error);
      alert("Unable to share screen.");
    });
}
