// Dark mode is permanently enabled

// Table of Contents Scrollspy
document.addEventListener("DOMContentLoaded", () => {
  const toc = document.querySelector("#TableOfContents");
  if (!toc) return;

  const headers = document.querySelectorAll(".prose h2, .prose h3, .prose h4");
  const tocLinks = toc.querySelectorAll("a");

  // Map headers to their TOC links
  const headerMap = new Map();
  headers.forEach((header) => {
    const id = header.id;
    const link = toc.querySelector(`a[href="#${id}"]`);
    if (link) headerMap.set(header, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Remove active class from all
          tocLinks.forEach((link) => link.classList.remove("active-toc-item"));

          // Add to current
          const link = headerMap.get(entry.target);
          if (link) link.classList.add("active-toc-item");
        }
      });
    },
    {
      rootMargin: "-10% 0px -80% 0px", // Trigger near top
      threshold: 0,
    }
  );

  headers.forEach((header) => observer.observe(header));
});

// Copy Code Logic
document.querySelectorAll("pre > code").forEach((codeBlock) => {
  const pre = codeBlock.parentNode;
  pre.classList.add("relative", "group"); // Make sure parent is relative for absolute positioning

  // Create button
  const copyBtn = document.createElement("button");
  copyBtn.className =
    "absolute top-2 right-2 bg-white text-black text-[10px] font-mono uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-gray-300 hover:bg-black hover:text-white";
  copyBtn.innerText = "Copy";

  // Logic
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      copyBtn.innerText = "Copied!";
      setTimeout(() => {
        copyBtn.innerText = "Copy";
      }, 2000);
    });
  });

  pre.appendChild(copyBtn);

  // Language Label
  const langMatch = codeBlock.className.match(/language-(\w+)/);
  if (langMatch) {
    const langLabel = document.createElement("div");
    langLabel.className =
      "absolute top-2 left-2 text-[10px] font-mono text-gray-400 uppercase pointer-events-none";
    langLabel.innerText = langMatch[1];
    pre.appendChild(langLabel);

    // Add padding to code to avoid overlap
    codeBlock.classList.add("pt-8");
  }
});

// Client-side Filtering
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".filter-checkbox");
  const posts = document.querySelectorAll(".post-item");

  if (!checkboxes.length || !posts.length) return;

  function filterPosts() {
    const activeTags = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value.toLowerCase());

    posts.forEach((post) => {
      if (activeTags.length === 0) {
        // Show all if no filter
        post.style.display = "block";
        return;
      }

      const postTags = (post.getAttribute("data-tags") || "").split(",");
      // Check if post has any of the active tags
      const matches = activeTags.some((tag) => postTags.includes(tag));

      post.style.display = matches ? "block" : "none";
    });
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", filterPosts);
  });
});
