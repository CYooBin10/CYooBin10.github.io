document.addEventListener("DOMContentLoaded", () => {

/*

* Small interaction layer.
* No libraries, no heavy animations.
  */

const projectLinks = document.querySelectorAll(".project");

projectLinks.forEach((project) => {

```
project.addEventListener("mouseenter", () => {
  project.style.setProperty("--project-active", "1");
});

project.addEventListener("mouseleave", () => {
  project.style.setProperty("--project-active", "0");
});
```

});

/*

* Smooth navigation fallback.
  */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

```
link.addEventListener("click", (event) => {

  const targetId = link.getAttribute("href");

  if (!targetId || targetId === "#") {
    return;
  }

  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

});
```

});

});
