document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS with faster animations
  AOS.init({
    duration: 800, // Reduced from 1000ms to 800ms
    once: true,
  });

  // Detect Browser Theme Preference and set theme accordingly
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  // Animate Skills Progress Bars with Colors
  const progressBars = document.querySelectorAll(".progress");

  progressBars.forEach((progress) => {
    const progressBar = progress.querySelector(".progress-bar");
    const color = progress.getAttribute("data-color");
    progressBar.style.backgroundColor = color;
    // Trigger the animation
    setTimeout(() => {
      progressBar.style.width = progressBar.style.width;
    }, 300);
  });

  // Fetch GitHub Repositories
  fetchGitHubRepos();

  async function fetchGitHubRepos() {
    const username = "rlefkowitz"; // Your GitHub username
    const repoContainer = document.getElementById("projects-container");
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const repos = await response.json();

      repos.forEach((repo) => {
        // Determine project color based on primary language
        let projectColor = "#007acc"; // Default color
        if (repo.language) {
          projectColor = getColorForLanguage(repo.language);
        }

        // Determine up to 3 icons for frameworks/languages used
        const icons = getIconsForRepo(repo);

        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");
        projectCard.setAttribute("data-aos", "zoom-in");
        projectCard.style.borderLeft = `5px solid ${projectColor}`;
        projectCard.innerHTML = `
                  <h3><i class="${icons[0]}"></i> ${repo.name}</h3>
                  <p>${repo.description || "No description provided."}</p>
                  <div class="project-tags">
                      ${icons
                        .slice(1, 4)
                        .map((icon) => `<i class="${icon}"></i>`)
                        .join("")}
                  </div>
              `;
        projectCard.addEventListener("click", () => openModal(repo));
        repoContainer.appendChild(projectCard);
      });
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Unable to load projects at this time.";
      repoContainer.appendChild(errorMessage);
    }
  }

  // Function to get color based on programming language
  function getColorForLanguage(language) {
    const colors = {
      Python: "#3776AB",
      JavaScript: "#f1e05a",
      TypeScript: "#3178C6",
      "C++": "#f34b7d",
      Java: "#b07219",
      Bash: "#4EAA25",
      C: "#00599C",
      HTML: "#e34c26",
      CSS: "#563d7c",
      SQL: "#e38c00",
      OCaml: "#3be133",
      Ruby: "#701516",
      // Add more languages and their colors as needed
    };
    return colors[language] || "#007acc"; // Default color
  }

  // Function to get icons based on repository topics or languages
  function getIconsForRepo(repo) {
    const icons = [];
    // Use primary language
    if (repo.language) {
      icons.push(getIconClass(repo.language));
    }
    // Add icons based on topics
    if (repo.topics && repo.topics.length > 0) {
      repo.topics.slice(0, 2).forEach((topic) => {
        const topicIcon = getIconClass(topic);
        if (topicIcon && !icons.includes(topicIcon)) {
          icons.push(topicIcon);
        }
      });
    }
    // Add a generic code icon if no specific icons found
    if (icons.length === 0) {
      icons.push("fas fa-code");
    }

    return icons.slice(0, 3); // Limit to 3 icons
  }

  // Function to map language or topic to Font Awesome or Devicons icon classes
  function getIconClass(name) {
    const mapping = {
      // Languages
      Python: "devicon-python-plain colored",
      JavaScript: "devicon-javascript-plain colored",
      TypeScript: "devicon-typescript-plain colored",
      "C++": "devicon-cplusplus-plain colored",
      Java: "devicon-java-plain colored",
      Bash: "devicon-bash-plain colored",
      C: "devicon-c-plain colored",
      HTML: "devicon-html5-plain colored",
      CSS: "devicon-css3-plain colored",
      SQL: "devicon-sql-plain colored",
      OCaml: "devicon-ocaml-plain colored",
      Ruby: "devicon-ruby-plain colored",
      // Frameworks/Tools
      React: "devicon-react-original colored",
      Vite: "devicon-vite-plain colored",
      FastAPI: "devicon-fastapi-plain colored",
      Docker: "devicon-docker-plain colored",
      Uvicorn: "fas fa-server", // No specific Devicon, using Font Awesome
      Alembic: "fas fa-code", // No specific Devicon, using Font Awesome
      Nginx: "devicon-nginx-plain colored",
      Git: "devicon-git-plain colored",
      GitHub: "devicon-github-original colored",
      "Azure Portal": "devicon-azure-original colored",
      DataDog: "fas fa-database", // Using Font Awesome for DataDog
      // Technologies
      "OpenAI API": "fab fa-openai", // Font Awesome brand icon
      TFLite: "fas fa-robot", // Using Font Awesome
      "Jira API": "fas fa-project-diagram", // Using Font Awesome
      // Add more mappings as needed
    };
    return mapping[name] || "fas fa-code"; // Default to code icon
  }

  // Modal Functionality
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalLink = document.getElementById("modal-link");
  const modalClose = document.getElementById("modal-close");
  const modalIcons = document.getElementById("modal-icons");

  function openModal(repo) {
    modalTitle.textContent = repo.name;
    modalDescription.textContent =
      repo.description || "No description provided.";
    modalLink.href = repo.html_url;

    // Clear previous icons
    modalIcons.innerHTML = "";

    // Get icons for the repo
    const icons = getIconsForRepo(repo);
    icons.forEach((iconClass) => {
      const iconElement = document.createElement("i");
      iconElement.className = iconClass;
      modalIcons.appendChild(iconElement);
    });

    modal.style.display = "block";
  }

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Dynamic WebGL Background
  function initWebGLBackground() {
    try {
      const canvas = document.getElementById("webgl-background");
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Add particles
      const particlesCount = 300;
      const geometry = new THREE.BufferGeometry();
      const positions = [];

      for (let i = 0; i < particlesCount; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        positions.push(x, y, z);
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      const material = new THREE.PointsMaterial({
        color: 0x007acc,
        size: 0.1,
        transparent: true,
        opacity: 0.7,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
      }

      animate();

      // Handle window resize
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (error) {
      console.warn("WebGL not supported. Skipping dynamic background.");
      document.getElementById("webgl-background").style.display = "none";
    }
  }

  initWebGLBackground();
});
