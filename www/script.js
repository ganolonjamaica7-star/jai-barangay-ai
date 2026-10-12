const messages = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");

function normalize(text) {
  return String(text || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function addMessage(text, who = "bot") {
  const article = document.createElement("div");
  article.className = `message ${who === "user" ? "user-message" : "bot-message"}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";

  if (who === "user") {
    avatar.textContent = "YOU";
  } else {
    const img = document.createElement("img");
    img.src = "assets/jai-logo.png";
    img.alt = "JAI";
    avatar.appendChild(img);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";

 const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);

  parts.forEach(part => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const bold = document.createElement("strong");
      bold.textContent = part.slice(2, -2);
      bubble.appendChild(bold);
    } else {
      bubble.appendChild(document.createTextNode(part));
    }
  });

  article.append(avatar, bubble);
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
}

function offlineAnswer(question) {
  const q = normalize(question);
  if (/^(hi|hello|hey|hoy|kumusta|musta|good morning|good afternoon|good evening)\b/.test(q)) return "Hello! Kumusta? Ako si JAI, imong Barangay AI Assistant. Pwede ko motabang sa common barangay services, documents, ug request letters.";
  if (q.includes("thank")) return "You're welcome! Nalipay ko nga makatabang. Para sa official details, palihog confirm sa inyong barangay office.";
  if (q.includes("indigency") || q.includes("certificate of indigency") || q.includes("poor certificate")) return "To request a Certificate of Indigency, visit your Barangay Hall and ask about the requirements and eligibility. Bring a valid ID and any supporting documents the barangay asks for. Requirements and approval depend on your barangay. You may download the sample template in the Sample Document Templates section, but only the authorized barangay office can issue the official certificate.";
  if (q.includes("clearance")) return "For a Barangay Clearance, ask your Barangay Hall for the current requirements. They may ask for a valid ID, proof of residence, and an application form. Requirements and fees depend on your barangay and the purpose. You can download the sample template above, but the barangay office must issue the official clearance.";
  if (q.includes("residency") || q.includes("certificate of residence") || q.includes("proof of residence")) return "To request a Certificate of Residency, visit your Barangay Hall and ask about the required proof of identity and residence. Requirements and fees vary. You can download the sample template above, but the authorized barangay office issues the official certificate.";
  if (q.includes("request letter") || q.includes("letter") || q.includes("write a letter") || q.includes("himo og letter")) return "You can download the Barangay Request Letter sample in the Sample Document Templates section. Edit the date, your name, address, contact details, and purpose before printing or submitting it.";
  if (q.includes("template") || q.includes("sample file") || q.includes("download") || q.includes("sample document")) return "Scroll to the Sample Document Templates section. You can download sample templates for Barangay Clearance, Certificate of Indigency, Certificate of Residency, and a Barangay Request Letter. Edit the sample before bringing it to the Barangay Hall.";
  if (q.includes("office hour") || q.includes("open") || q.includes("oras") || q.includes("schedule")) return "I don't have your specific barangay's verified office schedule saved. Please check its official page or contact the Barangay Hall to confirm office hours.";
  if (q.includes("fee") || q.includes("bayad") || q.includes("how much") || q.includes("price")) return "Fees depend on the document and your barangay's rules. Please ask the Barangay Hall for the current official fee before applying.";
  if (q.includes("dry seal") || q.includes("seal") || q.includes("pirma") || q.includes("sign")) return "Please bring your completed application or supporting documents to the Barangay Hall. Only authorized barangay personnel can approve, sign, and apply the official dry seal when required.";
  if (q.includes("report") || q.includes("complaint") || q.includes("reklamo") || q.includes("concern")) return "You can usually report a concern at the Barangay Hall or to an authorized barangay official. Prepare a clear description, location, date/time, and relevant details. For emergencies, contact the appropriate emergency service.";
  if (q.includes("services") || q.includes("service") || q.includes("serbisyo")) return "Common barangay services may include clearances, certificates, community announcements, mediation or referral for disputes, and community programs. Available services vary by barangay, so please confirm locally.";
  if (q.includes("captain") || q.includes("official") || q.includes("contact number") || q.includes("contact")) return "I don't have verified names or contact details for your specific barangay saved yet. Please check the official barangay notice board, official page, or Barangay Hall.";
  if (q.includes("requirements") || q.includes("requirement") || q.includes("kinahanglan")) return "Requirements depend on the document or service. Tell me whether you need a Barangay Clearance, Certificate of Indigency, Certificate of Residency, or another service. Confirm the exact list with your Barangay Hall.";
  if (q.includes("pharmacy") || q.includes("medicine") || q.includes("tambal")) return "I am a barangay information assistant, not a medical professional. For medicine advice, ask a pharmacist or healthcare professional.";
  return "Sorry, wala pa nako na-save ang tubag ana nga pangutana. I can help with barangay clearance, certificate of indigency, residency, sample document templates, office hours, fees, barangay services, and request letters. For exact local information, please confirm with your Barangay Hall.";
}

async function answer(question) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.reply || `HTTP ${response.status}`);
    }

    if (!data.reply) {
      throw new Error("No reply received from Gemini.");
    }

    addMessage(data.reply, "bot");

  } catch (error) {
    console.error("Online AI error:", error);
    addMessage(
      "Online AI is unavailable: " + error.message +
      "\n\nHere is a saved FAQ answer instead:\n" +
      offlineAnswer(question),
      "bot"
    );
  }
}

chatForm.addEventListener("submit", async event => {
  event.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";
  userInput.focus();

  await answer(question);
});

document.querySelectorAll("[data-question]").forEach(button => {
  button.addEventListener("click", async () => {
    const question = button.dataset.question;
    if (!question) return;

    addMessage(question, "user");
    await answer(question);
  });
});

clearChat.addEventListener("click", () => {
  messages.replaceChildren();
  addMessage(
    "Chat cleared. Hello again! What barangay information do you need?",
    "bot"
  );
});

window.addEventListener("offline", () => {
  console.info("JAI is offline. Saved FAQs remain available.");
});
