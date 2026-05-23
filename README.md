# 🚀 Portfolio Sandbox & Feature Playground

Welcome to my portfolio experimentation repository! This is a dedicated, local-first testing ground where I prototype new features, experiment with animations, and break things without affecting my live, production portfolio. 

> ⚠️ **Note:** The code in this repository is purely for experimentation and will **not** be deployed directly from here. Successful features and polished code will be manually migrated to my main portfolio repository.

---

## 🎯 Purpose of this Repo

*   **Risk-Free Testing:** A safe environment to try out heavy libraries, complex CSS, or new frameworks.
*   **Proof of Concept (PoC):** Building and refining isolated components (e.g., specific UI widgets, interactive graphics) before integration.
*   **Performance Benchmarking:** Testing how heavy features impact load times before making them official.

---

## 🧪 Current Experiments

| Feature / Branch | Description | Status | Migration Plan |
| :--- | :--- | :--- | :--- |
| `feat/dark-mode` | Testing Tailwind CSS system-level dark mode switching. | 🟡 In Progress | Move to main repo if smooth. |
| `experiment/3d-canvas` | Messing around with Three.js for a hero background. | 🔴 Paused (Heavy) | Scraping; too resource-heavy. |
| `feat/smooth-scroll` | Implementing Lenis smooth scrolling. | 🟢 Completed | Ready to copy to production. |

---

## 🛠️ Tech Stack & Tools In Use

This sandbox mirrors my main tech stack but includes experimental packages:
*   **Core:** React / Next.js / Tailwind CSS *(Change this to your actual stack)*
*   **Experimental Libs:** *[e.g., Framer Motion, Three.js, GSAP]*

---

## 🔄 Workflow / How I Move Code

1.  **Draft:** Create a new branch or component file in this repo.
2.  **Test:** Break it, fix it, and optimize it until it works perfectly.
3.  **Review:** Decide if the feature actually adds value to the user experience.
4.  **Extract:** Manually replicate or copy the clean version of the code over to the main portfolio repository.

---

## 🏃‍♂️ Local Development

To spin up this playground locally:

```bash
# Clone the repository
git clone [https://github.com/your-username/portfolio-sandbox.git](https://github.com/your-username/portfolio-sandbox.git)

# Install dependencies
npm install

# Run the development server
npm run dev
