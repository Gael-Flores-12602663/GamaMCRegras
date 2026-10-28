const searchInput = document.getElementById("searchInput");
const sections = [...document.querySelectorAll(".searchable")];
const navLinks = [...document.querySelectorAll(".rule-nav a")];
const searchInfo = document.getElementById("searchInfo");
const emptyState = document.getElementById("emptyState");
const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");

const sidebarBackdrop=document.getElementById('sidebarBackdrop');
function setMenu(open){
 sidebar.classList.toggle('open',open);
 menuButton.setAttribute('aria-expanded',String(open));
 menuButton.setAttribute('aria-label',open?'Fechar menu de regras':'Abrir menu de regras');
 if(sidebarBackdrop)sidebarBackdrop.hidden=!open;
 document.body.classList.toggle('rules-menu-open',open);
}
sidebarBackdrop?.addEventListener('click',()=>setMenu(false));

function normalize(text){
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function clearHighlights() {
  document.querySelectorAll("mark.highlight").forEach(mark => {
    const text = document.createTextNode(mark.textContent);
    mark.replaceWith(text);
  });
}

function highlightText(root, term) {
  if (!term || term.length < 2) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "MARK"].includes(node.parentElement.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return normalize(node.nodeValue).includes(normalize(term))
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const original = node.nodeValue;
    const normalizedOriginal = normalize(original);
    const normalizedTerm = normalize(term);
    const index = normalizedOriginal.indexOf(normalizedTerm);
    if (index < 0) return;

    const before = original.slice(0, index);
    const match = original.slice(index, index + term.length);
    const after = original.slice(index + term.length);

    const frag = document.createDocumentFragment();
    if (before) frag.append(before);
    const mark = document.createElement("mark");
    mark.className = "highlight";
    mark.textContent = match;
    frag.append(mark);
    if (after) frag.append(after);

    node.replaceWith(frag);
  });
}

function applySearch() {
  clearHighlights();

  const raw = searchInput.value.trim();
  const term = normalize(raw);
  let visible = 0;

  sections.forEach(section => {
    const content = normalize(section.innerText);
    const match = !term || content.includes(term);
    section.hidden = !match;

    if (match) {
      visible++;
      if (term) highlightText(section, raw);
    }
  });

  if (term) {
    searchInfo.hidden = false;
    searchInfo.textContent = `${visible} seção(ões) encontrada(s) para "${raw}".`;
    emptyState.hidden = visible !== 0;
  } else {
    searchInfo.hidden = true;
    emptyState.hidden = true;
  }
}

searchInput.addEventListener("input", applySearch);

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape") {
    searchInput.value = "";
    applySearch();
    searchInput.blur();
    setMenu(false);
  }
});

menuButton.addEventListener("click", () => {
  setMenu(!sidebar.classList.contains("open"));
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
});

const observer = new IntersectionObserver((entries) => {
  const visibleEntries = entries.filter(entry => entry.isIntersecting);
  if (!visibleEntries.length) return;

  visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  const activeId = visibleEntries[0].target.id;

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.section === activeId);
  });
}, {
  rootMargin: "-18% 0px -68% 0px",
  threshold: [0.05, 0.25, 0.5]
});

sections.forEach(section => observer.observe(section));
