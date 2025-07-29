document.getElementById("addProject").addEventListener("click", () => {
  const container = document.createElement("div");
  container.className = "project";
  container.innerHTML = `
    <input type="text" class="project-title" placeholder="Project Title" required />
    <input type="url" class="project-link" placeholder="Project Link" required />
  `;
  document.getElementById("projects").appendChild(container);
});

document.getElementById("portfolioForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const title = document.getElementById("title").value.trim();
  const about = document.getElementById("about").value.trim();
  const skills = document.getElementById("skills").value.trim().split(",").map(s => s.trim());
  const email = document.getElementById("email").value.trim();
  const socials = document.getElementById("socials").value.trim().split(",").map(s => s.trim());

  const projectTitles = document.querySelectorAll(".project-title");
  const projectLinks = document.querySelectorAll(".project-link");
  const projects = [];
  for (let i = 0; i < projectTitles.length; i++) {
    const title = projectTitles[i].value.trim();
    const link = projectLinks[i].value.trim();
    if (title && link) {
      projects.push({ title, link });
    }
  }

  const payload = {
    name,
    title,
    about,
    skills,
    email,
    socials,
    projects
  };

  // First: live portfolio generation
  const response = await fetch("/generate-portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (data.success && data.page) {
    window.location.href = `/portfolio/${data.page}`;
  } else {
    alert("Failed to generate portfolio. Try again.");
  }
});